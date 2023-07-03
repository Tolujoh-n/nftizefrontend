import React from 'react'
import hero from '../../assets/hero.png'
// import nftLogo from '../../assets/nftize-logo.png'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div
      className="flex  h-[550px] w-[100vw] flex-col-reverse items-center justify-center 
      gap-10 bg-[#131313] sm:h-[620px] 
    sm:flex-row sm:space-x-36"
    >
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-6xl text-primary">NFTizeMarket</h1>
        <p className="text-2xl text-gray-300">The safest Place to Buy</p>
        <Link
          to="/allproducts"
          className="rounded-md bg-primary p-2 
          px-7 text-gray-100 transition-all hover:scale-105"
        >
          Shop Now
        </Link>
      </div>
      <div className="rounded-full border border-white bg-primary p-2">
        <img
          src={hero}
          alt="cartLogo"
          className="w-[200px] object-contain sm:w-[310px] xl:w-[380px]"
        />
      </div>
    </div>
  )
}

export default Hero
