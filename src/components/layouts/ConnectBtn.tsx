import React, { useState, useEffect } from 'react'
import { useEthers, useCall } from '@usedapp/core'
import { Button, makeStyles } from '@material-ui/core'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useRegisterUser } from '../Hooks/useRegisterUser'
import { getContractAddress } from '../helpers/ContractAddress'
import Marketplace from '../../chain-info/out/Marketplace.sol/Marketplace.json'


const useStyles = makeStyles((theme) => ({
  div: {
    display: 'flex',
    alignItems: 'center',
  },
  address: {
    textTransform: 'initial',
  },
  connection: {
    color: '#fff',
    backgroundColor: '#8789FE',
  },
}))

export const RegisterAndConnect = () => {
  const classes = useStyles()
  const { account, activateBrowserWallet, deactivate, chainId } = useEthers()
  const { Register, RegisterState } = useRegisterUser()

  const isConnected = !!account
  const isMining = RegisterState.status === 'Mining'

  const chain_Id = chainId ? chainId : 0

  const contractAddress = getContractAddress(
    chain_Id.toString(),
    'marketplace_Address'
  )

  const contractABI = Marketplace.abi
  const marketplaceInterface = new utils.Interface(contractABI)
  const contract = new Contract(contractAddress, marketplaceInterface)

  const { value, error } =
    useCall(
      contractAddress && {
        contract: contract,
        method: 'isRegistered',
        args: [account],
      }
    ) ?? {}

  const [hasRegistered, setHasRegistered] = useState(false)
  const [currentChainId, setCurrentChainId] = useState(chainId)

  useEffect(() => {
    const registerUser = async () => {
      if (account && !hasRegistered) {
        try {
          await Register()
          setHasRegistered(true)
        } catch (error) {
          console.error('Registration failed:', error)
        }
      }
    }

    registerUser()
  }, [account])

  useEffect(() => {
    if (chainId !== currentChainId) {
      setHasRegistered(false)
      setCurrentChainId(chainId)
    }
  }, [chainId])

  const handleConnect = () => {
    if (!isConnected) {
      activateBrowserWallet()
    }
  }

  return (
    <div>
      {isConnected ? (
        <>
          <span className="mr-2 text-gray-300">
            {`${account?.slice(0, 6)}...${account?.slice(-4)}`}
          </span>
          <Button
            variant="contained"
            onClick={deactivate}
            className={classes.connection}
          >
            Disconnect
          </Button>
        </>
      ) : (
        <div className={classes.div}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleConnect}
            className={classes.connection}
            disabled={isMining}
          >
            {isMining ? 'Registering...' : 'Register & Connect'}
          </Button>
        </div>
      )}
    </div>
  )
}
