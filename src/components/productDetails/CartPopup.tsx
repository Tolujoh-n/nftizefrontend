import React, { FunctionComponent } from "react";
import closeIcon from "../../assets/logos/cart-modal-close.svg";
import itemRmIcon from "../../assets/logos/item-rm.svg";
import thumbImg from "../../assets/logos/tire.png";
import { useOrderItem } from "../Hooks/useOrderItem"; // Import the useOrderItem hook
import { useLocation } from 'react-router-dom';

export interface Props {
  handleClose: () => void;
  isShow: boolean;
}

const ShoppingCartModal: FunctionComponent<Props> = ({
  handleClose,
  isShow,
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const item_id = queryParams.get('item_id') ;
  const quantity = queryParams.get('quantity');

  const parsed_item_id = item_id ? parseInt(item_id) : 0;
  const parsed_quantity = quantity ? parseInt(quantity) : 0; 
  const { approveAndOrderItem, state, chainId, transactionHash } = useOrderItem(parsed_item_id, parsed_quantity); // Call the useOrderItem hook and provide the itemId and quantity values

  const showHideClassName = isShow ? "cart-modal block" : "cart-modal hidden";
  console.log(showHideClassName);
  return (
    <div className={showHideClassName}>
      {/* ... */}
      <div className="modal-footer flex justify-between border-t border-gray-300 py-4">
        {/* ... */}
        <div className="btn-box flex gap-8">
          <div className="view-cart flex h-8 w-32 items-center justify-center rounded-full border border-black">
            <label htmlFor="" className="text-sm font-medium text-black">
              View Cart
            </label>
          </div>
          <div className="checkout flex h-8 w-32 items-center justify-center rounded-full border border-black">
            <button
              type="button"
              className="text-sm font-medium text-black"
              onClick={approveAndOrderItem} // Call the approveAndOrderItem function when the button is clicked
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartModal;
