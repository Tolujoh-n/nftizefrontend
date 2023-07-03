// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @title The governance token
 * @notice The TOM token will be used for governance and fees/reward purposes
 * @dev The governance utilities are not utilized yet
 */

contract TOM is ERC20Votes {
    uint256 public s_maxSupply = 1000000000000000000000000000;

    constructor(address marketplace) ERC20("TokenMarket", "TOM") ERC20Permit("TokenMarket") {
        _mint(marketplace, s_maxSupply);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /**
     * @dev Mints for authenticated position contracts.
     */

    function mint(address _receiver, uint256 _moreDebt) external {
        _mint(_receiver, _moreDebt);
    }

    function burn(address owner, uint256 _stablecoinAmount) external {
        require(_stablecoinAmount > 0, "Invalid stablecoin amount");

        _burn(owner, _stablecoinAmount);
    }

    // The functions below are overrides required by Solidity.
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}
