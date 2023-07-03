import React, { FC } from 'react';
import { Button } from '@material-ui/core';

interface CancelOrderButtonProps {
  order_id: number;
}

const CancelOrderButton: FC<CancelOrderButtonProps> = ({ order_id }) => {
  const handleCancelOrder = () => {
    // Implement the cancel order functionality here
    console.log('Cancel order:', order_id);
  };

  return (
    <Button onClick={handleCancelOrder} >
      Cancel
    </Button>
  );
};