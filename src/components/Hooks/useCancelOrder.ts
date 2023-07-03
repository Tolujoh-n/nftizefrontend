import { useState, useEffect } from 'react'
import { useEthers, useContractFunction } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import Marketplace from '../../chain-info/out/Marketplace.sol/Marketplace.json'
import ERC20 from '../../chain-info/out/ERC20.sol/ERC20.json'
import { BigNumber } from 'ethers'
import { getContractAddress } from '../helpers/ContractAddress'

export const useCancelOrder = (orderId: BigNumber) => {
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

  const { send: CancelSend, state: CancelState } = useContractFunction(
    contract,
    'cancelOrder',
    {
      transactionName: 'Cancel Delivery',
    }
  )
  const Cancel = () => {
    return CancelSend(orderId)
  }

  const transactionHash = ''

  useEffect(() => {
    if (CancelState.status === 'Mining' && CancelState.transaction) {
      const transactionHash = CancelState.transaction.hash
      if (transactionHash) {
        console.log('Transaction Hash:', transactionHash)
      }
    }
  }, [CancelState])

  return { Cancel, CancelState, chainId, transactionHash }
}
