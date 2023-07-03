import React from 'react'
import { RiShieldStarFill } from 'react-icons/ri'
import { BiDollar } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'

type props = {
  name: string
  img: string
  description: string
  price: number
  reward: boolean
}

const HomeProduct = (props: props) => {
  const navigation = useNavigate()
  return (
    <div
      onClick={() => navigation('/product-detail')}
      className="relative flex h-[260px] min-w-[270px] cursor-default flex-col items-center
     justify-between border-l border-gray-100 p-2 transition-all ease-linear hover:shadow-md"
    >
      <Link to="/rewards">
        <RiShieldStarFill
          className={`cursor-pointer text-3xl font-bold
       text-yellow-700 hover:text-yellow-500 ${
         props.reward ? 'visible' : 'invisible'
       } absolute left-2 top-1`}
        />
      </Link>
      <img src={props.img} className="h-[140px] w-[140px]" alt={props.name} />
      <div className="flex flex-col items-start gap-1">
        <strong className="text-left text-xl text-gray-900">
          {props.name}
        </strong>
        <p className="text-left text-sm text-gray-600">
          {props.description.slice(0, 30)}
        </p>
        <h2 className="flex items-center text-lg text-black">
          <BiDollar />
          {props.price}
        </h2>
      </div>
    </div>
  )
}

export default HomeProduct
