import { useState, useEffect } from 'react'
import { useEthers, useContractFunction, useCall, Falsy } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import Marketplace from '../../chain-info/out/Marketplace.sol/Marketplace.json'
import ERC20 from '../../chain-info/out/ERC20.sol/ERC20.json'
import { getContractAddress } from '../helpers/ContractAddress'

export const useClaimRewards = (userAddress: string | Falsy) => {
  const { chainId, account, library } = useEthers()

  const chain_Id = chainId ? chainId : 0

  const contractAddress = getContractAddress(
    chain_Id.toString(),
    'marketplace_Address'
  )
  const contractABI = Marketplace.abi
  const marketplaceInterface = new utils.Interface(contractABI)

  const contract = new Contract(contractAddress, marketplaceInterface)

  const faucetAddress = getContractAddress(
    chain_Id.toString(),
    'faucet_token_address'
  )
  const erc20ABI = ERC20.abi
  const erc20Interface = new utils.Interface(erc20ABI)
  const erc20Contract = new Contract(faucetAddress, erc20Interface)

  const { value, error } =
    useCall(
      contractAddress && {
        contract: contract,
        method: 'getSpentAmount',
        args: [userAddress],
      }
    ) ?? {}

  const { send: ClaimRewardsSend, state: ClaimRewardsState } =
    useContractFunction(contract, 'claimRewards', {
      transactionName: 'Claim Rewards',
    })
  const Claim = () => {
    return ClaimRewardsSend()
  }

  const transactionHash = ''

  useEffect(() => {
    if (
      ClaimRewardsState.status === 'Mining' &&
      ClaimRewardsState.transaction
    ) {
      const transactionHash = ClaimRewardsState.transaction.hash
      if (transactionHash) {
        console.log('Transaction Hash:', transactionHash)
      }
    }
  }, [ClaimRewardsState])

  return { Claim, ClaimRewardsState, chainId, transactionHash, value }
}
