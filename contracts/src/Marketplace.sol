// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './Tom.sol';
import './Escrow.sol';
import {IERC20} from '@openzeppelin/contracts/interfaces/IERC20.sol';

/**
 * @title The Marketplace contract
 * @notice the Marketplace is where the logic for reward/fee transfers are implemented
 * @dev main functionalities are implemented.
 */

contract Marketplace is Ownable, ReentrancyGuard {
  using Counters for Counters.Counter;

  struct User {
    uint256 spentAmount;
  }

  struct Item {
    string name;
    string image;
    string description;
    uint256 price;
    uint256 quantity;
    uint256 postingFee;
    address seller;
  }

  TOM private tom;
  Escrow private escrow;
  IERC20 private token;
  Counters.Counter private _itemIdCounter;
  mapping(address => User) users;
  address[] usersList;
  mapping(uint256 => Item) private items;
  uint256 private constant FEE_RATE = 10;
  uint256 private constant REWARD_RATE = 7;
  uint256 private constant TOM_USD_PRICE = 10;
  uint8 private immutable decimals;

  event TokenBought(address indexed buyer, uint256 amount);
  event userRegistered(address indexed user);
  event ItemListed(
    address indexed seller,
    uint256 indexed itemId,
    string name,
    string image,
    string description,
    uint256 price,
    uint256 quantity,
    uint256 postingFee
  );
  event ItemUpdated(
    address indexed seller,
    uint256 indexed itemId,
    string name,
    string image,
    string description,
    uint256 price,
    uint256 quantity,
    uint256 postingFee
  );
  event ItemCanceled(address indexed seller, uint256 indexed itemId);
  event RewardsClaimed(address indexed user, uint256 rewards);

  error PriceMustBeAboveZero();
  error InsufficientTomBalance();
  error InsufficientTokenBalance();
  error ItemSoldOut();
  error NotListed(uint256 itemId);
  error UserAlreadyExists(address user);
  error UserDoesNotExist(address user);

  modifier isListed(uint256 itemId) {
    Item memory item = items[itemId];
    if (item.price <= 0) {
      revert NotListed(itemId);
    }
    _;
  }

  modifier isNotUser(address user) {
    uint256 length = usersList.length;
    for (uint256 i = 0; i < length; ++i) {
      if (usersList[i] == user) {
        revert UserAlreadyExists(user);
      }
    }
    _;
  }

  modifier isUser(address user) {
    uint256 length = usersList.length;
    bool exists = false;
    for (uint256 i = 0; i < length; ++i) {
      if (usersList[i] == user) {
        exists = true;
        break;
      }
    }
    if (exists == false) {
      revert UserDoesNotExist(user);
    }
    _;
  }

  constructor(address _tokenAddress, uint8 _decimals) {
    token = IERC20(_tokenAddress);
    decimals = _decimals;
  }

  function activate(
    address _tomAddress,
    address _escrowAddress
  ) public onlyOwner {
    tom = TOM(_tomAddress);
    escrow = Escrow(_escrowAddress);
  }

  /**
   * @notice Get registered
   * @dev emits an event
   */

  function registerUser(address user) public isNotUser(user) {
    users[user] = User(0);
    usersList.push(user);
    emit userRegistered(user);
  }

  /**
   * @notice Function to purchase TOM token.
   * @dev Approve function needs to run first
   * For now 1 USDT = 10 TOM
   */

  function buyTOM(uint256 tokenAmount) public isUser(msg.sender) {
    uint256 tomAmount = calculateTOMAmount(tokenAmount);
    token.transferFrom(msg.sender, address(this), tokenAmount);
    tom.transfer(msg.sender, tomAmount);

    emit TokenBought(msg.sender, tomAmount);
  }

  /**
   * @notice List an item in the marketplace
   * @dev Approve function needs to run first
   * The Posting FEE = 10% of sell price
   */

  function listItem(
    string memory name,
    string memory image,
    string memory description,
    uint256 price,
    uint256 quantity
  ) external isUser(msg.sender) {
    uint256 postingFee = calculatePostingFee(price, quantity);
    if (tom.balanceOf(msg.sender) < postingFee) {
      revert InsufficientTomBalance();
    }

    if (price <= 0) {
      revert PriceMustBeAboveZero();
    }

    if (postingFee < 10) {
      postingFee = 10;
    }

    tom.transferFrom(msg.sender, address(this), postingFee);

    Item memory newItem = Item(
      name,
      image,
      description,
      price,
      quantity,
      postingFee,
      msg.sender
    );

    uint256 itemId = _itemIdCounter.current();

    items[itemId] = newItem;

    _itemIdCounter.increment();

    emit ItemListed(
      msg.sender,
      itemId,
      name,
      image,
      description,
      price,
      quantity,
      postingFee
    );
  }

  function updateItem(
    uint256 itemId,
    string memory name,
    string memory image,
    string memory description,
    uint256 price,
    uint256 quantity
  ) external isUser(msg.sender) isListed(itemId) {
    require(msg.sender == items[itemId].seller, 'Caller must be Seller');
    require(
      price > items[itemId].price / 2,
      'New price must be more than half of the old price'
    );
    uint256 oldPostingFee = items[itemId].postingFee;
    uint256 newPostingFee = calculatePostingFee(price, quantity);

    if (newPostingFee > oldPostingFee) {
      tom.transferFrom(
        msg.sender,
        address(this),
        newPostingFee - oldPostingFee
      );
    } else {
      tom.transfer(msg.sender, oldPostingFee - newPostingFee);
    }

    items[itemId] = Item(
      name,
      image,
      description,
      price,
      quantity,
      newPostingFee,
      msg.sender
    );

    emit ItemUpdated(
      msg.sender,
      itemId,
      name,
      image,
      description,
      price,
      quantity,
      newPostingFee
    );
  }

  /**
   * @notice Cancel a listing
   * @dev Can only be run by seller or contract Owner.
   * We also need to automate the canceling of sold out items using chainlink keepers maybe.
   */

  function cancelListing(
    uint256 itemId
  ) external isUser(msg.sender) isListed(itemId) {
    require(
      msg.sender == items[itemId].seller || msg.sender == owner(),
      'Caller must be Seller or Owner'
    );
    delete (items[itemId]);
    emit ItemCanceled(msg.sender, itemId);
  }

  /**
   * @notice Buy an item, get the reward and increase spent amount.
   * @dev Approve function needs to run first
   * For later versions, the amount paid will be locked in a third party contract until buyer confirms
   * that product has been received or times run out (chainlink keepers ?)
   * This part needs further thinking as how to further secure this process
   */

  function orderItem(
    uint256 itemId,
    uint256 quantity
  ) public isListed(itemId) isUser(msg.sender) nonReentrant returns (uint256) {
    Item storage item = items[itemId];
    if (item.quantity - quantity < 0) {
      revert ItemSoldOut();
    }
    if (token.balanceOf(msg.sender) < item.price * quantity) {
      revert InsufficientTokenBalance();
    }

    uint256 rewards = (((item.postingFee * quantity) / item.quantity) * 70) /
      100;

    uint256 orderId = escrow.lockFunds(
      item.seller,
      msg.sender,
      itemId,
      item.price * quantity,
      quantity,
      rewards
    );

    for (uint256 i = 0; i < quantity; i++) {
      item.quantity--;
    }

    // tom.transfer(msg.sender, rewards);

    emit ItemUpdated(
      item.seller,
      itemId,
      item.name,
      item.image,
      item.description,
      item.price,
      item.quantity,
      item.postingFee
    );

    return orderId;
  }

  function confirmDelivery(
    uint256 orderId
  ) external isUser(msg.sender) nonReentrant {
    escrow.releaseFunds(orderId, msg.sender);
    (, , , uint256 totalPaid, , , ) = escrow.getOrder(orderId);
    users[msg.sender].spentAmount += totalPaid;
  }

  function cancelOrder(
    uint256 orderId
  ) external isUser(msg.sender) nonReentrant {
    escrow.refundFunds(orderId, msg.sender);
    (, , uint256 itemId, , uint256 quantity, , ) = escrow.getOrder(orderId);
    Item storage item = items[itemId];
    for (uint256 i = 0; i < quantity; i++) {
      item.quantity++;
    }
  }

  /**
   * @notice Claims rewards if amount spent > 500 dollars
   * @dev after claiming, the spent amount is fixed to 0 again.
   */

  function claimRewards() public isUser(msg.sender) nonReentrant {
    User storage user = users[msg.sender];
    require(
      user.spentAmount >= 500 * 10 ** decimals,
      'Not eligible for rewards yet'
    );
    uint256 rewards = calculateTOMAmount(
      (REWARD_RATE * user.spentAmount) / 100
    );
    tom.transfer(msg.sender, rewards);
    user.spentAmount = 0;

    emit RewardsClaimed(msg.sender, rewards);
  }

  /**
   * @notice Register using a referal
   * @dev both parties get 50 TOM
   */

  function UseReferalLink(
    address referedBy
  ) public isUser(referedBy) nonReentrant {
    registerUser(msg.sender);
    tom.transfer(msg.sender, 50 * 10 ** tom.decimals());
    tom.transfer(referedBy, 50 * 10 ** tom.decimals());
  }

  function calculatePostingFee(
    uint256 price,
    uint256 quantity
  ) public view returns (uint256 postingFee) {
    postingFee = calculateTOMAmount((FEE_RATE * price * quantity) / 100);
  }

  function calculateTOMAmount(
    uint256 tokenAmount
  ) public view returns (uint256) {
    return
      (tokenAmount * TOM_USD_PRICE * 10 ** tom.decimals()) / 10 ** decimals;
  }

  function getUser(uint256 key) public view returns (address) {
    return usersList[key];
  }

  function getSpentAmount(address user) public view returns (uint256) {
    return users[user].spentAmount;
  }

  function isRegistered(address user) public view returns (bool) {
    uint256 length = usersList.length;
    for (uint256 i = 0; i < length; ++i) {
      if (usersList[i] == user) {
        return true;
      }
    }
    return false;
  }

  function getItem(
    uint256 itemId
  )
    public
    view
    returns (
      string memory,
      string memory,
      string memory,
      uint256,
      uint256,
      uint256,
      address
    )
  {
    return (
      items[itemId].name,
      items[itemId].image,
      items[itemId].description,
      items[itemId].price,
      items[itemId].quantity,
      items[itemId].postingFee,
      items[itemId].seller
    );
  }

  function getEscrowAddress() public view returns (address) {
    return address(escrow);
  }

  function getTomAddress() public view returns (address) {
    return address(tom);
  }

  function getTokenAddress() public view returns (address) {
    return address(token);
  }
}
