// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Marketplace.sol";

contract Escrow {
    enum OrderState {
        FundsLocked,
        FundsReleased,
        FundsRefunded
    }

    struct Order {
        address seller;
        address buyer;
        uint256 itemId;
        uint256 price;
        uint256 quantity;
        uint256 reward;
        OrderState state;
    }

    IERC20 private token;
    mapping(uint256 => Order) private orders;
    Marketplace private parentContract;

    event OrderSent(
        address indexed seller,
        address indexed buyer,
        uint256 indexed order,
        uint256 itemId,
        uint256 price,
        uint256 quantity,
        uint256 rewards,
        OrderState state
    );
    event FundsLocked(uint256 orderId, address buyer, uint256 amount);
    event FundsReleased(uint256 orderId, address seller, uint256 amount);
    event FundsRefunded(uint256 orderId, address buyer, uint256 amount);

    modifier onlyMarketplace() {
        require(msg.sender == address(parentContract), "Only the parent contract can call this method");
        _;
    }

    constructor(address _marketplace) {
        parentContract = Marketplace(_marketplace);
        token = IERC20(parentContract.getTokenAddress());
    }

    function lockFunds(address seller, address buyer, uint256 itemId, uint256 price, uint256 quantity, uint256 rewards)
        external
        onlyMarketplace
        returns (uint256)
    {
        uint256 orderId = uint256(keccak256(abi.encodePacked(msg.sender, seller, block.timestamp, itemId)));
        orders[orderId] = Order({
            seller: seller,
            buyer: buyer,
            itemId: itemId,
            price: price,
            quantity: quantity,
            reward: rewards,
            state: OrderState.FundsLocked
        });

        token.transferFrom(buyer, address(this), price);

        emit OrderSent(seller, buyer, orderId, itemId, price, quantity, rewards, OrderState.FundsLocked);

        return orderId;
    }

    function releaseFunds(uint256 orderId, address buyer) external onlyMarketplace {
        Order storage order = orders[orderId];
        require(buyer == order.buyer, "Sender must be the buyer of this item");
        require(order.state == OrderState.FundsLocked, "Funds are not locked");

        order.state = OrderState.FundsReleased;

        token.transfer(order.seller, order.price);

        emit FundsReleased(orderId, order.seller, order.price);
    }

    function refundFunds(uint256 orderId, address buyer) external onlyMarketplace {
        Order storage order = orders[orderId];
        require(buyer == order.buyer, "Sender must be the buyer of this item");
        require(order.state == OrderState.FundsLocked, "Funds are not locked");

        order.state = OrderState.FundsRefunded;

        token.transfer(order.buyer, order.price);

        emit FundsRefunded(orderId, order.buyer, order.price);
    }

    function getOrder(uint256 orderId)
        public
        view
        returns (address, address, uint256, uint256, uint256, uint256, OrderState)
    {
        return (
            orders[orderId].seller,
            orders[orderId].buyer,
            orders[orderId].itemId,
            orders[orderId].price,
            orders[orderId].quantity,
            orders[orderId].reward,
            orders[orderId].state
        );
    }
}
