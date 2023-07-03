import React, { FC, useEffect, useState } from 'react';
import bigThumbImg from '../../assets/logos/big-thumb.png';
import miniThumbImg from '../../assets/logos/mini-thumb.png';
import linkedInIcon from '../../assets/logos/linked-in.svg';
import twitterIcon from '../../assets/logos/twitter.svg';
import faceBookIcon from '../../assets/logos/face-book.svg';
import ShoppingCartModal from './ProductDetails';
import './DetailInfo.css';
import { Link, useParams } from 'react-router-dom';

interface Product {
  imageLink: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  postingFee: number;
  id_item: number;
}

const DetailInfo: FC = () => {
  const { item_id } = useParams<{ item_id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/items/${item_id}/`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [item_id]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-info">
      <div className="detail-content-box">
        <div className="detail-img-box">
          {/* Mini Thumbs */}
          <div className="flex flex-col gap-8">
            <div className="detail-img-thumb">
              <img src={product.imageLink} alt="mini-thumb" />
            </div>
            <div className="detail-img-thumb">
              <img src={product.imageLink} alt="mini-thumb" />
            </div>
            <div className="detail-img-thumb">
              <img src={product.imageLink} alt="mini-thumb" />
            </div>
          </div>
          {/* Big Thumb */}
          <div className="detail-big-thumb">
            <img src={product.imageLink} alt="big-thumb" />
          </div>
        </div>

        <div className="dettail-info-box">
          <div className="detail-info-content">
            <div className="detail-info-title text-2xl font-medium">{product.name}</div>
            <div className="detail-info-price text-lg font-semibold text-gray-600">
              ${parseFloat((product.price / 10 ** 18).toFixed(2))}
            </div>

            <div className="detail-info-description">{product.description}</div>
            {/* Sizes */}
            <label>Color</label>
            <div className="detail-info-color bg-black"></div>
            <div className="count-container flex justify-center items-center">
              <div className="count-box flex h-16 w-32 items-center justify-between rounded border border-gray-400">
                <div className="count-minus mx-2" onClick={decreaseQuantity}>-</div>
                <div className="detail-info-count">{quantity}</div>
                <div className="count-plus mx-2" onClick={increaseQuantity}>+</div>
              </div>
              <Link to={`/cart?item_id=${product.id_item}&quantity=${quantity}`}>
                <button type="button" className="cursor-pointer text-lg font-medium">
                  Add To Cart
                </button>
              </Link>
            </div>
          </div>
          <div className="detail-info-footer flex gap-4">
            <div className="footer-column">
              <div className="detail-info-footer-cell flex gap-2">
                <img src={faceBookIcon} alt="face-book-icon" />
                <img src={linkedInIcon} alt="face-book-icon" />
                <img src={twitterIcon} alt="face-book-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-description-box">
        <div className="title-box">
          <div className="title">Description</div>
          <div className="title">Additional Information</div>
          <div className="title">Review [5]</div>
        </div>
        <div className="detail-description">
          <div className="description">{product.description}</div>
        </div>
        <div className="thumb-box">
          <div className="thumb">
            <img src={product.imageLink} alt="big-thumb" />
          </div>
          <div className="thumb">
            <img src={product.imageLink} alt="big-thumb" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailInfo;
