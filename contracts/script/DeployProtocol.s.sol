// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import 'forge-std/Script.sol';
import 'forge-std/Test.sol';
import '../src/Marketplace.sol';

contract DeployMarketplace is Script {
  uint256 deployerPrivateKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
  address deployerAddress = vm.envAddress('DEPLOYER_ADDRESS');

  address LINK = 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F; //For testnet
  address USDT = 0x049d68029688eAbF473097a2fC38ef61633A3C7A; // For mainnet

  Marketplace private marketplace;
  TOM private tom;
  Escrow private escrow;

  function run() public {
    IERC20 usdt = IERC20(USDT);

    vm.startBroadcast(deployerPrivateKey);

    marketplace = new Marketplace(address(usdt), 18);
    tom = new TOM(address(marketplace));
    escrow = new Escrow(address(marketplace));

    marketplace.activate(address(tom), address(escrow));

    // link.approve(address(marketplace), 100 * 10 ** 18);
    // link.approve(address(escrow), 100 * 10 ** 18);
    // tom.approve(address(marketplace), 100 * 10 ** 18);

    vm.stopBroadcast();
  }
}
