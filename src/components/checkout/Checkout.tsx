import React from 'react'
import InputField from '../helpers/InputField'
import DeliveryRibbon from '../layouts/DeliveryRibbon'
import Footer from '../layouts/Footer'

type props = {
  productName: string
  subtotal: number
  productPrice: number
  total: number
}

const Checkout = (props: props) => {
  return (
    <section className="flex flex-col">
      <h2 className="p-10 text-center text-3xl font-bold text-black">
        Checkout
      </h2>
      <main className="mx-auto flex max-w-[1170px] items-start justify-between p-10">
        {/* billings details */}
        <div className="flex flex-col gap-6">
          <h2 className="text-left text-2xl font-semibold text-black">
            Billing details
          </h2>
          {/* name field */}
          <div className="flex space-x-4">
            <InputField dropDown={false} field="First Name" />
            <InputField dropDown={false} field="Second Name" />
          </div>
          <InputField dropDown={false} field="Company Name(Optional)" />
          <InputField dropDown={true} field="Country/Region" />
          <InputField dropDown={false} field="Street address" />
          <InputField dropDown={false} field="Town/City" />
          <InputField dropDown={false} field="Zip Code" />
          <InputField dropDown={false} field="Phone" />
          <InputField dropDown={false} field="Wallet address" />
        </div>
        {/* product price details */}
        <div className="ml-8 flex max-w-[400px] flex-1 flex-col gap-4">
          <div className="flex items-center justify-between text-xl font-semibold">
            <h2>Product</h2>
            <h2>Subtotal</h2>
          </div>
          <div className="text-md flex items-center justify-between text-xl text-gray-700">
            <h5>{props.productName}</h5>
            <h5>{props.productPrice}</h5>
          </div>
          <div className="text-md flex items-center justify-between text-xl text-gray-700">
            <h5 className="text-gray-800">Subtotal</h5>
            <h5>{props.subtotal}</h5>
          </div>
          <div className="text-md flex items-center justify-between text-xl text-gray-800">
            <h5>Subtotal</h5>
            <h5 className="text-2xl text-orange-500">$ {props.subtotal}</h5>
          </div>

          <p className="text-left text-sm text-gray-500">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our{' '}
            <span className="text-black">privacy policy.</span>
          </p>

          {/* place order button */}
          <div>
            <button
              className="mt-6 rounded-md border border-gray-600 p-2 px-9 
            text-black transition-colors hover:border-gray-200 hover:bg-primary hover:text-gray-100"
            >
              Place order
            </button>
          </div>
        </div>
      </main>
      {/* deliveryRibbon */}
      <DeliveryRibbon />
    </section>
  )
}

export default Checkout
