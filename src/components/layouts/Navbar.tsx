import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Link as ScrollLink } from 'react-scroll'
import { HiShoppingCart } from 'react-icons/hi'
import { RiAccountCircleFill } from 'react-icons/ri'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import { IoMdClose } from 'react-icons/io'
import logo from '../../assets/nftize-logo.png'
import coin from '../../assets/Coin-No-BG.png'
import { BuyTomForm } from '../functionalities/BuyTomAndDisplayBalance'
import { RegisterUserForm } from '../functionalities/RegisterUserForm'
import { ClaimRewards } from '../functionalities/ClaimRewards'
import { RegisterAndConnect } from './ConnectBtn'
import { useEthers, useTokenBalance } from '@usedapp/core'
import { formatUnits } from '@ethersproject/units'
import { getContractAddress } from '../helpers/ContractAddress'

type props = {
  connected: boolean
}

const Navbar = (props: props) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const { account, chainId } = useEthers()

  const isConnected = account !== undefined

  // const [regModal, setRegModal] = useState(false)
  // const openRegModal = () => {
  //   !userRegistered && setRegModal(true)
  // }
  // const closeRegModal = () => {
  //   setUserRegistered(true)
  //   setRegModal(false)
  // }

  // const [userRegistered, setUserRegistered] = useState(false)

  const chain_Id = chainId ? chainId : 0

  const tomAddress = getContractAddress(
    chain_Id.toString(),
    'tom_address'
  )
  const tokenBalance = useTokenBalance(tomAddress, account)
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0

  return (
    <nav
      className="bg-[#444444] px-4 py-6
    text-white lg:px-7"
    >
      <div className="flex items-center justify-between">
        {/* left */}
        <div className="flex items-center space-x-4 xl:space-x-30">
          {/* logo */}
          <div className="flex items-center space-x-1">
            <img
              src={logo}
              alt="NFtizeMarket"
              className="w-[90px] lg:h-[100px] lg:w-[100px]"
            />
            <h4 className="hidden text-3xl font-semibold text-primary xl:inline-flex">
              NFTizeMarket
            </h4>
          </div>

          {/* navlinks */}
          <div
            className="flex items-center space-x-6 text-[1.1rem] text-white
          lg:ml-4 lg:text-xl"
          >
            <Link to="/" className="cursor-pointer hover:text-gray-200">
              Home
            </Link>
            {!isConnected ? (
              <>
                <Link
                  to="/about"
                  className="cursor-pointer hover:text-gray-200"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="cursor-pointer hover:text-gray-200"
                >
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/allproducts"
                  className="cursor-pointer hover:text-gray-200"
                >
                  Buy
                </Link>
                <Link to="/sell" className="cursor-pointer hover:text-gray-200">
                  Sell
                </Link>
                <Link
                  to="/rewards"
                  className="cursor-pointer hover:text-gray-200"
                >
                  Rewards
                </Link>
              </>
            )}
          </div>
          {/* center */}
          <div>
            {isConnected && (
              <Link
                to="/rewards"
                className="relative cursor-pointer hover:text-gray-200"
                onMouseEnter={() => setShowDropdown(true)}
              >
                <div
                  className="flex items-center  space-x-1
            rounded-md py-1 pr-1 font-semibold text-orange-400 
            hover:bg-gray-900 xl:text-lg"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <img src={coin} alt="nft" className="w-[35px]" />
                  <p className="text-xl">
                    {' '}
                    {formattedTokenBalance
                      ? formattedTokenBalance.toString()
                      : '0'}
                  </p>
                </div>

                {showDropdown && (
                  <div
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                    className="absolute top-10 rounded-md bg-white pt-2
                     text-[0.9rem] text-black shadow-md"
                  >
                    <Link
                      to="/buytom"
                      className="block border-b px-6 py-1 hover:bg-gray-200
                         hover:text-primary"
                    >
                      BuyTom
                    </Link>
                    <Link
                      to="/amountspent"
                      className="block w-max px-6 py-1 hover:bg-gray-200 
                        hover:text-primary"
                    >
                      Amt Spent
                    </Link>
                  </div>
                )}
              </Link>
            )}
          </div>
        </div>
        {/* right */}
        <div className="flex xl:w-[45%]">
          {/* search bar */}
          <div className="mx-6 hidden flex-1 md:inline-block">
            <input
              type="search"
              placeholder="searchNFT"
              className="w-full rounded-sm bg-white/10 p-2 px-4
               text-white outline-none placeholder:text-gray-200"
            />
          </div>
          {/* right-right */}
          <div className="flex space-x-3">
            {/* <div onClick={openRegModal}> */}
            <RegisterAndConnect />
            {/* </div> */}
            <Link to="/cart">
              <HiShoppingCart className="text-3xl text-white hover:text-gray-200" />
            </Link>
            <Link to="/account">
              <RiAccountCircleFill className="text-3xl text-white hover:text-gray-200" />
            </Link>
          </div>
        </div>
        {/* <button
          className="block p-2 transition-all ease-linear md:hidden"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <IoMdClose size={'44'} /> : <HiOutlineMenuAlt3 size={'44'} />}
        </button> */}
      </div>
      {/* 
      <BuyTomForm />
      <ClaimRewards></ClaimRewards> */}
      {/* registration modal */}
      {/* <section
        className={`${
          regModal ? 'absolute' : 'hidden'
        } top-0 flex h-[100vh] w-[100vw] 
      items-center justify-center bg-black/30`}
      >
        <main
          className="flex w-[400px] flex-col items-center gap-4 
      rounded-md bg-slate-50 p-10"
        >
          <h1
            className="border-b border-gray-300  pb-5 text-lg
           font-bold text-red-500"
          >
            Click on register button to register yourself on NFTizeMarket!
          </h1>
          <div>
            <div className="" onClick={closeRegModal}>
              <RegisterUserForm />
            </div>
          </div>
        </main>
      </section> */}
    </nav>
  )
}

export default Navbar
