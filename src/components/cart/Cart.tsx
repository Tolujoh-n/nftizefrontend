import React, { FC, useEffect, useState } from 'react';
import OrderedBlock from './OrderedBlock';
import DeliveryRibbon from '../layouts/DeliveryRibbon';
import { useNavigate } from 'react-router-dom';
import { useOrderItem } from '../Hooks/useOrderItem';
import { useLocation } from 'react-router-dom';
import { formatUnits } from '@ethersproject/units'
import { useEthers, useTokenBalance, useNotifications, useCall } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import Marketplace from '../../chain-info/out/Marketplace.sol/Marketplace.json'
import {
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
  TextField,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { utils, BigNumber } from 'ethers'
import {  ethers } from 'ethers';
import axios from "axios";
import { CancelOrderButton, ConfirmDeliveryButton } from '../functionalities/OrderButtons';
import { getContractAddress } from '../helpers/ContractAddress'


interface OrderProduct {
  name: string;
  price: number;
  quantity: number;
  rewards: number;
  status: string;
  img: string;
  order_id: string;
}

interface CartProps {
  ordered: OrderProduct[];
  listed: OrderProduct[];
}

const Cart = ({  }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const item_id = queryParams.get('item_id');
  const quantity = queryParams.get('quantity');


  const parsed_item_id = item_id ? parseInt(item_id) : 0;
  const parsed_quantity = quantity ? parseInt(quantity) : 0;
  const { notifications } = useNotifications()
  const { account } = useEthers()

  const { approveAndOrderItem, state, chainId, transactionHash } = useOrderItem(
    parsed_item_id,
    parsed_quantity
  );

  const handleCheckout = () => {
    approveAndOrderItem();
  };

  const chain_Id = chainId ? chainId : 0

  const contractAddress = getContractAddress(
    chain_Id.toString(),
    'marketplace_Address'
  )
  const contractABI = Marketplace.abi
  const marketplaceInterface = new utils.Interface(contractABI)

  const contract = new Contract(contractAddress, marketplaceInterface)

  const useValue = (): number | undefined => {
    const { value, error } = useCall(
      contractAddress && {
        contract: contract,
        method: 'getItem',
        args: [parsed_item_id],
      }
    ) ?? {};
  
    return value ? Number(ethers.utils.formatEther(value[3])) : undefined;
  }

  const value = useValue() ;
  const formattedValue = value ? value:0
  

  const isMining = state.status === 'Mining'
  // const hasZeroBalance = formattedTokenBalance === 0
  // const hasZeroAmountSelected = parseFloat(amount.toString()) === 0

  const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] =
    useState(false)
  const [showOrderItemSuccess, setOrderItemSuccess] = useState(false)
  const handleCloseSnack = () => {
    setShowErc20ApprovalSuccess(false)
    setOrderItemSuccess(false)
  }

  const [apiCallTriggered, setApiCallTriggered] = useState(false);

  useEffect(() => {
    if (notifications.filter(
      (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Order Item").length > 0 &&
          apiCallTriggered
  ) {
    setApiCallTriggered(false);
      // Second transaction "List Item" is in "Mining" status
      // Create a FormData object to send the form data
      const formData = new FormData();
      formData.append("contract_name", "Escrow");
      formData.append("chain_id", chain_Id.toString());
      formData.append("transaction_hash", transactionHash.toString());
      formData.append("event_name", "OrderSent");

      console.log("Escrow", chain_Id.toString(), transactionHash.toString(), "OrderSent")
  
      // Make the API request to create the item
      axios
        .post("http://127.0.0.1:8000/api/orders/create/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // Handle the response
          if (response.status === 201 || response.status === 200) {
            // Item created successfully
            console.log("Order created successfully");
          } else {
            // Handle error
            console.log("Failed to create Order");
          }
        })
        .catch((error) => {
          // Handle error
          console.log("Error creating item", error);
        });
    }
  }, [notifications]);

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Approve ERC20 transfer'
      ).length > 0
    ) {
      setShowErc20ApprovalSuccess(true)
      setOrderItemSuccess(false)
    }
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Order Item'
      ).length > 0
    ) {
      setShowErc20ApprovalSuccess(false)
      setOrderItemSuccess(true)
    }
  }, [notifications, showErc20ApprovalSuccess, showOrderItemSuccess])

  const [orders, setOrders] = useState<OrderProduct[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("we here")
      try {
        const response = await axios.get<OrderProduct[]>("http://127.0.0.1:8000/api/orders/user/");
        console.log(response)
        setOrders(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="overflow-x-auto p-4 px-2">
      <main className="flex flex-col items-center gap-6">
        <h1 className="mt-10 text-center text-4xl font-bold">Cart</h1>
        <section className="mx-auto flex w-[1000px] items-start justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-left text-2xl font-semibold">Ordered Products</h2>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center justify-end space-x-6 rounded-md bg-yellow-100 py-1 pl-20 pr-6">
                <strong>Product</strong>
                <strong>Price</strong>
                <strong>Quantity</strong>
                <strong>Rewards</strong>
                <strong>Status</strong>
              </div>
              <div className="my-4 flex flex-col gap-6">
                {orders.map((p, i) => (
                  <div className="flex items-center justify-end space-x-7" key={i}>
                    <OrderedBlock
                      name={p.name}
                      img={p.img}
                      price={parseFloat(formatUnits(((p.price).toString())))}
                      quantity={p.quantity}
                      status={p.status}
                      rewards={parseFloat(parseFloat(formatUnits(p.rewards.toString())).toFixed(1))}
                    />
                    <div>
                      <CancelOrderButton order_id={BigNumber.from(p.order_id)} />
                      <ConfirmDeliveryButton order_id={BigNumber.from(p.order_id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <article className="flex flex-col gap-2 bg-yellow-100 px-16 py-2">
            <h2 className="text-xl font-semibold">Cart Totals</h2>
            <div className="flex w-[180px] flex-col gap-3">
              <div className="flex justify-between">
                <h2>Total</h2>
                <h3 className="text-orange-400">${value}</h3>
              </div>
              <div className="flex justify-between">
                <h2>Rewards</h2>
                <h3 className="text-orange-400">{formattedValue * 0.7} TOM</h3>
              </div>
            </div>
            <Button
              onClick={() => {
                handleCheckout();
                setApiCallTriggered(true)
              }}
              className="mt-4 rounded-md border border-black p-1 px-4"
              color="primary"
              variant="contained"
              disabled={isMining}
            >
              {isMining ? <CircularProgress size={26} /> : 'Checkout'}
            </Button>
            <Snackbar
              open={showErc20ApprovalSuccess}
              autoHideDuration={5000}
              onClose={handleCloseSnack}
            >
              <Alert onClose={handleCloseSnack} severity="success">
                ERC-20 token transfer Approved! Now approve the 2nd transaction.
              </Alert>
            </Snackbar>
            <Snackbar
              open={showOrderItemSuccess}
              autoHideDuration={5000}
              onClose={handleCloseSnack}
            >
              <Alert onClose={handleCloseSnack} severity="success">
                Item Ordered!
              </Alert>
            </Snackbar>
          </article>
        </section>
      </main>
      <DeliveryRibbon />
    </div>
  );
};

export default Cart;
