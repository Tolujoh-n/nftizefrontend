import { useState, useEffect } from 'react'
import { useEthers, useContractFunction } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import Marketplace from '../../chain-info/out/Marketplace.sol/Marketplace.json'
import ERC20 from '../../chain-info/out/ERC20.sol/ERC20.json'
import { getContractAddress } from '../helpers/ContractAddress'

export const useRegisterUser = () => {
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

  const { send: RegisterSend, state: RegisterState } = useContractFunction(
    contract,
    'registerUser',
    {
      transactionName: 'Register user',
    }
  )
  const Register = () => {
    return RegisterSend(account)
  }

  const transactionHash = ''

  useEffect(() => {
    if (RegisterState.status === 'Mining' && RegisterState.transaction) {
      const transactionHash = RegisterState.transaction.hash
      if (transactionHash) {
        console.log('Transaction Hash:', transactionHash)
      }
    }
  }, [RegisterState])

  return { Register, RegisterState, chainId, transactionHash }
}
