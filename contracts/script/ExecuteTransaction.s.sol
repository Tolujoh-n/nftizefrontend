// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Script.sol";
import "forge-std/Test.sol";
import "../src/Marketplace.sol";

contract ExecuteT is Script {
    uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
    address deployerAddress = vm.envAddress("DEPLOYER_ADDRESS");

    address LINK = 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F;

    Marketplace private marketplace;
    TOM private tom;
    Escrow private escrow;

    function run() public {
        IERC20 link = IERC20(LINK);

        vm.startBroadcast(deployerPrivateKey);
        address marketplaceAddress = 0xA9729e8D472345B02eB1C61DD86f692A6EA84fF8;

        marketplace = Marketplace(marketplaceAddress);
        // escrow = new Escrow(address(marketplace));
        // tom = TOM(0xf4301508F1AD133486a96aF29B401BD0bAe2FFF6);
        // marketplace.activate(address(tom), address(escrow));
        // link.approve(
        //     0xd97fd145689Ce4bFbaD40C1aF2473b5a338A329F,
        //     100 * 10 ** 18
        // );
        // tom.approve(address(marketplace), 100 * 10 ** 18);

        vm.stopBroadcast();
    }
}
