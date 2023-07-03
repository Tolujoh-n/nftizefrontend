import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiViewGrid } from "react-icons/hi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { MdViewDay } from "react-icons/md";
import { formatUnits } from "@ethersproject/units"
import HomeProduct from "../home/HomeProduct";
import DeliveryRibbon from "../layouts/DeliveryRibbon";
import { Link } from 'react-router-dom'; 

interface Product {
  id_item: number,
  imageLink: string;
  name: string;
  description: string;
  price: number;
  reward: boolean;
}

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          'http://127.0.0.1:8000/api/items/'
        )
        setProducts(response.data)
      } catch (error) {
        console.log('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="py-6">
      <h1 className="my-14 text-center text-4xl font-bold">Shop</h1>
      <div className="flex flex-col gap-10">
        {/* inner nav */}
        <div className="bg-[#D4D4D4] p-4 px-6">
          <div className="flex items-center justify-between">
            {/* left */}
            <div className="flex items-center space-x-3">
              <div
                className="flex items-center space-x-2 border-r-2
               border-gray-400 pr-2"
              >
                <p className="flex items-center space-x-2 ">
                  <HiOutlineAdjustmentsHorizontal />
                  <span> Filter</span>
                </p>
                <HiViewGrid />
                <MdViewDay />
              </div>
              <p>Showing 1-20 of 40 results</p>
            </div>
            {/* right */}
            <div className="flex space-x-3">
              {/* show */}
              <div className="flex items-center space-x-2">
                <h4>Show</h4>
                <input
                  type="text"
                  placeholder="16"
                  className="w-[40px] p-2 text-gray-400"
                />
              </div>
              {/* sort */}
              <div className="flex items-center space-x-2">
                <h4>Sort By</h4>
                <input
                  type="text"
                  placeholder="Default"
                  className="p-2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
        {/* products display */}
        <main className="mx-auto grid w-[1300px] grid-cols-4 gap-4">
          {products.map((product, index) => (
            <Link
            to={`/product-detail/${product.id_item}`} // Pass item_id as a parameter
            key={index}
          >
            <HomeProduct
              key={index}
              img={`http://127.0.0.1:8000/${product.imageLink}`}
              description={product.description}
              price={parseFloat((product.price / 10 ** 18).toFixed(2))}
              name={product.name}
              reward={product.reward}
            />
            </Link>
          ))}
        </main>
        <DeliveryRibbon />
      </div>
    </div>
  )
}

export default AllProducts
