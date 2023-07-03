import React from 'react'
import nft from '../../assets/Tom-cardspng.png'
import coin from '../../assets/Coin-No-BG.png'
import ftm from '../../assets/ftm.png'
import { SiTether } from 'react-icons/si'
import DeliveryRibbon from '../layouts/DeliveryRibbon'
import { ClaimRewards } from '../functionalities/ClaimRewards'

const Rewards = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="my-10 text-center text-4xl font-semibold">Rewards</h1>

      <div className="mx-auto max-w-[1100px]">
        {/* NFT price details */}
        <article className="flex flex-col gap-6">
          {/* ftm */}
          <div className="flex space-x-3">
            <span className="flex items-center space-x-1 text-[1.1rem]">
              <img src={coin} alt="nft" className="w-[35px]" />
              <p>0.3</p>
            </span>
            <p>-------------------------------------------</p>
            <span
              className="flex items-center
             space-x-1 text-[1.1rem] text-orange-500"
            >
              <img src={ftm} alt="nft" className="w-[25px]" />
              <p>1 FTM</p>
            </span>
          </div>
          <div className="flex space-x-3">
            <span className="flex items-center space-x-1 text-[1.1rem]">
              <img src={coin} alt="nft" className="w-[35px]" />
              <p>0.1</p>
            </span>
            <p>-------------------------------------------</p>
            <span
              className="flex items-center
             space-x-1 text-[1.1rem] text-orange-500"
            >
              <SiTether className="text-[28px] text-green-600" />
              <p>1 USDT</p>
            </span>
          </div>
          {/* bought and sold details */}
          <section className="flex flex-col gap-1">
            <div className="flex space-x-2 text-[1.2rem] font-semibold">
              <ClaimRewards/>
            </div>
          </section>
        </article>
        {/* nfts display */}
        <section className="mt-10 grid grid-cols-2 gap-6">
          <img src={nft} alt="TomNft" className="w-[340px] rounded-md" />
          <img src={nft} alt="TomNft" className="w-[340px] rounded-md" />
          <img src={nft} alt="TomNft" className="w-[340px] rounded-md" />
          <img src={nft} alt="TomNft" className="w-[340px] rounded-md" />
        </section>
      </div>
      <DeliveryRibbon />
    </div>
  )
}

export default Rewards
