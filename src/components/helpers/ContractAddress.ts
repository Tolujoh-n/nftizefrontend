import faucets from '../../faucets.json'
import { constants, utils } from 'ethers'

export function getContractAddress(
  chainId: string,
  contractName: string
): string {
  console.log(
    'Searching for Chain ID:',
    chainId,
    'Contract Name:',
    contractName
  ) // Log the inputs

  const network = faucets.networks.find(
    (network: { chainId: string }) => network.chainId === chainId
  )

  console.log('Found network:', network) // Log the found network

  if (network) {
    const address = (network as any)[contractName].toString()
    console.log('Found address:', address) // Log the found address
    return address
  }

  return constants.AddressZero
}
