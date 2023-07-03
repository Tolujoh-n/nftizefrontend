import { useState, useEffect } from 'react'
import { useEthers, useContractFunction } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import Marketplace from '../../chain-info/out/Marketplace.sol/Marketplace.json'
import ERC20 from '../../chain-info/out/ERC20.sol/ERC20.json'
import { BigNumber } from 'ethers';
import { getContractAddress } from '../helpers/ContractAddress'

export const useConfirmDelivery = (orderId: BigNumber) => {
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

  const { send: ConfirmSend, state: ConfirmState } = useContractFunction(
    contract,
    'confirmDelivery',
    {
      transactionName: 'Confirm Delivery',
    }
  )
  const Confirm = () => {
    return ConfirmSend(orderId)
  }

  const transactionHash = ''

  useEffect(() => {
    if (ConfirmState.status === 'Mining' && ConfirmState.transaction) {
      const transactionHash = ConfirmState.transaction.hash
      if (transactionHash) {
        console.log('Transaction Hash:', transactionHash)
      }
    }
  }, [ConfirmState])

  return { Confirm, ConfirmState, chainId, transactionHash }
}
