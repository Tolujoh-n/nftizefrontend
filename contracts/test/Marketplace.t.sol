// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "./Mocks/MockERC20.sol";
import "../src/Marketplace.sol";

contract MarketplaceTest is Test {
    MockERC20 private mockToken1;
    Marketplace private marketplace;
    TOM private tom;
    Escrow private escrow;

    function setUp() public {
        mockToken1 = new MockERC20();
        vm.startPrank(address(1));

        marketplace = new Marketplace(address(mockToken1), 18);
        tom = new TOM(address(marketplace));
        escrow = new Escrow(address(marketplace));

        marketplace.activate(address(tom), address(escrow));

        mockToken1.mint(address(1), 1000 * 10 ** 18);
        mockToken1.approve(address(marketplace), 1000 * 10 ** 18);
        mockToken1.approve(address(escrow), 1000 * 10 ** 18);
    }

    function testRegister() public {
        marketplace.registerUser(address(1));
        assertEq(marketplace.getUser(0), address(1));
        assertEq(marketplace.getSpentAmount(address(1)), 0);
    }

    function testBuyToken() public {
        marketplace.registerUser(address(1));
        marketplace.buyTOM(50 * 10 ** 18);
        assertEq(mockToken1.balanceOf(address(marketplace)), 50 * 10 ** 18);
        assertEq(tom.balanceOf(address(1)), 500 * 10 ** 18);
    }

    function testlistItem() public {
        marketplace.registerUser(address(1));
        marketplace.buyTOM(50 * 10 ** 18);
        tom.approve(address(marketplace), 1000 * 10 ** 18);
        marketplace.listItem("Item1", "Img.png", "Description", 30 * 10 ** 18, 2);
        (,,,,, uint256 postingFee,) = marketplace.getItem(0);
        assertEq(postingFee, 60 * 10 ** 18);
        assertEq(tom.balanceOf(address(1)), 440 * 10 ** 18);
    }

    function testupdateItem() public {
        marketplace.registerUser(address(1));
        marketplace.buyTOM(50 * 10 ** 18);
        tom.approve(address(marketplace), 1000 * 10 ** 18);
        marketplace.listItem("Item1", "Img.png", "Description", 30 * 10 ** 18, 2);
        uint256 tomBalanceBefore = tom.balanceOf(address(1));
        (,,,,, uint256 postingFeeBefore,) = marketplace.getItem(0);
        marketplace.updateItem(0, "Item2", "Img.png", "Description", 16 * 10 ** 18, 2);
        uint256 tomBalanceAfter = tom.balanceOf(address(1));
        (,,,,, uint256 postingFeeAfter,) = marketplace.getItem(0);
        assertEq(postingFeeAfter, 32 * 10 ** 18);
        assertEq(tomBalanceAfter, tomBalanceBefore + postingFeeBefore - postingFeeAfter);
        assertEq(tom.balanceOf(address(1)), 468 * 10 ** 18);
    }

    function testorderItem() public {
        marketplace.registerUser(address(1));
        marketplace.buyTOM(50 * 10 ** 18);
        tom.approve(address(marketplace), 1000 * 10 ** 18);
        marketplace.listItem("Item1", "Img.png", "Description", 30 * 10 ** 18, 2);
        uint256 orderId = marketplace.orderItem(0, 1);
        (,,,, uint256 quantity, uint256 postingFee,) = marketplace.getItem(0);
        assertEq(tom.balanceOf(address(1)), 440 * 10 ** 18);
        assertEq(quantity, 1);
        assertEq(mockToken1.balanceOf(address(1)), (1000 - 30 - 50) * 10 ** 18);
        marketplace.confirmDelivery(orderId);
        assertEq(marketplace.getSpentAmount(address(1)), 30 * 10 ** 18);
    }

    function testcancelOrder() public {
        marketplace.registerUser(address(1));
        marketplace.buyTOM(50 * 10 ** 18);
        tom.approve(address(marketplace), 1000 * 10 ** 18);
        marketplace.listItem("Item1", "Img.png", "Description", 30 * 10 ** 18, 2);
        uint256 orderId = marketplace.orderItem(0, 1);
        (,,,, uint256 quantity, uint256 postingFee,) = marketplace.getItem(0);
        assertEq(tom.balanceOf(address(1)), 440 * 10 ** 18);
        assertEq(quantity, 1);
        marketplace.cancelOrder(orderId);
        assertEq(mockToken1.balanceOf(address(1)), (950) * 10 ** 18);
        assertEq(marketplace.getSpentAmount(address(1)), 0);
        (,,,, uint256 quantity1,,) = marketplace.getItem(0);
        assertEq(quantity1, 2);
    }

    function testclaimRewardsWithRevert() public {
        marketplace.registerUser(address(1));
        marketplace.buyTOM(60 * 10 ** 18);
        tom.approve(address(marketplace), 1000 * 10 ** 18);
        marketplace.listItem("Item1", "Img.png", "Description", 500 * 10 ** 18, 1);
        uint256 orderId = marketplace.orderItem(0, 1);
        vm.expectRevert("Not eligible for rewards yet");
        marketplace.claimRewards();
    }

    function testclaimRewards() public {
        marketplace.registerUser(address(1));
        marketplace.buyTOM(60 * 10 ** 18);
        tom.approve(address(marketplace), 1000 * 10 ** 18);
        marketplace.listItem("Item1", "Img.png", "Description", 500 * 10 ** 18, 1);
        uint256 orderId = marketplace.orderItem(0, 1);
        marketplace.confirmDelivery(orderId);
        marketplace.claimRewards();
        assertEq(tom.balanceOf(address(1)), 450 * 10 ** 18);
    }

    function testUseReferalLink() public {
        marketplace.registerUser(address(1));
        vm.startPrank(address(2));
        marketplace.UseReferalLink(address(1));
        assertEq(tom.balanceOf(address(1)), 50 * 10 ** 18);
        assertEq(tom.balanceOf(address(2)), 50 * 10 ** 18);
    }
}
