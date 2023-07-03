import React, { FC } from 'react';
import { useState, useEffect } from "react";
import { useCancelOrder } from '../Hooks/useCancelOrder'; // Import the custom hooks
import {useConfirmDelivery} from '../Hooks/useConfirmDelivery';
import { BigNumber } from 'ethers';
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import {
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import axios from 'axios';

interface CancelOrderButtonProps {
  order_id: BigNumber;
}


const CancelOrderButton: FC<CancelOrderButtonProps> = ({ order_id }) => {
  const { account } = useEthers()
  const { notifications } = useNotifications()
  console.log(order_id)
  const { Cancel, CancelState } = useCancelOrder(order_id);

  const handleCancelOrder = () => {
    Cancel(); // Trigger the cancel order function
  };

  const isMining = CancelState.status === "Mining"
    const [showCancelSuccess, setCancelSuccess] = useState(false)
    const handleCloseSnack = () => {
      setCancelSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Cancel Delivery").length > 0
        ) {
          setCancelSuccess(true)
        }
    }, [notifications, showCancelSuccess])

    const [apiCallTriggered, setApiCallTriggered] = useState(false);

    useEffect(() => {

      if (notifications.filter(
        (notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Cancel Delivery").length > 0 &&
            apiCallTriggered
    ) {
      setApiCallTriggered(false);

      const formData = new FormData();
      formData.append('state', "Cancelled");
  
      axios
        .put(`http://127.0.0.1:8000/api/orders/update/${order_id.toString()}/`, formData)
        .then((response) => {
          // Handle the response
          if (response.status === 201 || response.status === 200) {
            // Item created successfully
            console.log("Cancelling confirmed successfully");
          } else {
            // Handle error
            console.log("Failed to cancel delivery");
          }
        })
        .catch((error) => {
          // Handle error
          console.log("Error cancelling delivery", error);
        });
    }
  }, [notifications]);

  return (      <>
                <div>
                <Button
                    onClick={() => {
                      handleCancelOrder()
                      setApiCallTriggered(true);
                    }}
                    color="primary"
                    size="small"
                    variant="contained"
                    disabled={isMining}>
                    {isMining ? <CircularProgress size={26} /> : `Cancel order`}
                </Button>
                </div>
    
            <Snackbar
                open={showCancelSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Order cancelled !
                </Alert>
            </Snackbar>
            </>
  );
};

interface ConfirmDeliveryButtonProps {
  order_id: BigNumber;
}

const ConfirmDeliveryButton: FC<ConfirmDeliveryButtonProps> = ({ order_id }) => {
  const { account } = useEthers()
  const { notifications } = useNotifications()
  const { Confirm, ConfirmState } = useConfirmDelivery(order_id);

  const handleConfirmDelivery = () => {
    Confirm(); // Trigger the confirm delivery function
  };

  const isMining = ConfirmState.status === "Mining"
    const [showConfirmSuccess, setConfirmSuccess] = useState(false)
    const handleCloseSnack = () => {
      setConfirmSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Confirm Delivery").length > 0
        ) {
          setConfirmSuccess(true)
        }
    }, [notifications, showConfirmSuccess])

    const [apiCallTriggered, setApiCallTriggered] = useState(false);

    useEffect(() => {

      if (notifications.filter(
        (notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Confirm Delivery").length > 0 &&
            apiCallTriggered
    ) {
      setApiCallTriggered(false);

      const formData = new FormData();
      formData.append('state', "Confirmed");
  
      axios
        .put(`http://127.0.0.1:8000/api/orders/update/${order_id.toString()}/`, formData)
        .then((response) => {
          // Handle the response
          if (response.status === 201 || response.status === 200) {
            // Item created successfully
            console.log("Delivery confirmed successfully");
          } else {
            // Handle error
            console.log("Failed to confirm delivery");
          }
        })
        .catch((error) => {
          // Handle error
          console.log("Error confirming delivery", error);
        });
    }
  }, [notifications]);

    return (      <>
      <div>
      <Button
          onClick={() => {
            handleConfirmDelivery()
            setApiCallTriggered(true);
          }}
          color="primary"
          size="small"
          variant="contained"
          disabled={isMining}>
          {isMining ? <CircularProgress size={26} /> : `Confirm delivery`}
      </Button>
      </div>

  <Snackbar
      open={showConfirmSuccess}
      autoHideDuration={5000}
      onClose={handleCloseSnack}>
      <Alert onClose={handleCloseSnack} severity="success">
          Delivery confirmed !
      </Alert>
  </Snackbar>
  </>
);
};

export { CancelOrderButton, ConfirmDeliveryButton };
