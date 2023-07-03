import React from 'react'
import { SiTether } from 'react-icons/si'
import nft from '../../assets/Coin-No-BG.png'

interface Product {
  img: any
  name: any
  price: any
  quantity: number
  rewards: number
  status: string
}
const OrderedBlock = (props: Product) => {
  return (
    <div
      className="flex items-center justify-start
     space-x-12"
    >
      {/* image */}
      <img
        src={props.img}
        alt="product"
        className="w-[50px]
      bg-gray-300"
      />
      {/* productName */}
      <h3 className="text-center text-gray-800">{props.name}</h3>
      {/* price */}
      <span className="flex items-center space-x-1 text-[1.1rem]">
        <SiTether className="text-green-600" />
        <p>{props.price}</p>
      </span>
      {/* quantity */}
      <h4 className="rounded-md border p-1">{props.quantity}</h4>
      {/* rewards */}
      <span className="flex items-center space-x-1 text-[1.1rem]">
        <img src={nft} alt="nft" className="w-[50px]" />
        <p>{props.rewards}</p>
      </span>
      {/* paid */}
      <h3
        className="rounded-md bg-purple-400 px-3 text-[1rem] font-semibold 
      text-gray-800"
      >
        {props.status}
      </h3>
    </div>
  )
}

export default OrderedBlock
