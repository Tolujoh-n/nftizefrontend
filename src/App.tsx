import React, { useEffect, FC } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/home/Home'
import Navbar from './components/layouts/Navbar'
import tire from './assets/products/tire1.png'
import { DAppProvider } from '@usedapp/core'
import { config } from './SupportedChains'

import Checkout from './components/checkout/Checkout'
import ProductDetails from './components/productDetails/ProductDetails'
import CartPopup from './components/productDetails/CartPopup'
import Footer from './components/layouts/Footer'
import AllProducts from './components/allProducts/AllProducts'
import SellProduct from './components/sellProduct/SellProduct'
import Cart from './components/cart/Cart'
import Rewards from './components/rewards/Rewards'
import { BuyTomForm } from './components/functionalities/BuyTomAndDisplayBalance'

// sampleOrderedProducts

const orderProducts = [
  {
    img: tire,
    name: 'MIRAGE MR-AT172 285/65',
    quantity: 1,
    price: 500,
    subtotal: 60262,
    rewards: 2,
    status: 'Processing',
  },
  {
    name: 'MIRAGE MR',
    price: 60000,
    quantity: 2,
    subtotal: 60262,
    rewards: 2,
    status: 'Processing',
    img: tire,
  },
  {
    name: 'MIRAGE MR',
    price: 60000,
    quantity: 1,
    subtotal: 30131,
    rewards: 1,
    status: 'Dispatched',
    img: tire,
  },
  {
    name: 'MIRAGE MR',
    price: 60000,
    quantity: 4,
    subtotal: 120524,
    rewards: 4,
    status: 'Paid',
    img: tire,
  },
  {
    name: 'MIRAGE MR',
    price: 60000,
    quantity: 2,
    subtotal: 60262,
    rewards: 2,
    status: 'Processing',
    img: tire,
  },
  {
    name: 'MIRAGE MR',
    price: 60000,
    quantity: 1,
    subtotal: 30131,
    rewards: 1,
    status: 'Dispatched',
    img: tire,
  },
]

const App: FC = () => {
  useEffect(() => {
    fetch('http://localhost:8000/api/endpoint') // Replace `endpoint` with the actual API endpoint in your Django app
      .then((response) => response.json())
      .then((data) => {
        // Handle the received data
        console.log('data : ', data)
      })
      .catch((error) => {
        // Handle errors
        console.error(error)
      })
  })

  return (
    <DAppProvider config={config}>
      <div className="App h-[100vh]">
        <Router>
          <Navbar connected={true} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/checkout"
              element={
                <Checkout
                  productName="product1"
                  productPrice={40}
                  subtotal={20}
                  total={60}
                />
              }
            />
            <Route
              path="/product-detail/:item_id"
              element={<ProductDetails />}
            />
            <Route path="/allproducts" element={<AllProducts />} />
            <Route path="/sell" element={<SellProduct />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/buytom" element={<BuyTomForm />} />
            <Route
              path="/cart"
              element={<Cart />}
            />
            <Route
              path="/cartmodal"
              element={
                <CartPopup
                  handleClose={() => false}
                  // handleClose="sdfsdf"
                  isShow={true}
                  // goodsCount={12}
                />
              }
            />
          </Routes>
          <Footer />
        </Router>
      </div>
    </DAppProvider>
  )
}

export default App
