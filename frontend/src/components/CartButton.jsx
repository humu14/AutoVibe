import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './CartButton.css';
import { useSelector, useDispatch } from 'react-redux';
import { cartAdd } from '../slices/cartSlice';
import { showSuccess, showError, showWarning } from '../utils/toast';
import { useStockSync } from '../hooks/useStockSync';

const CartButton = ({ product }) => {
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();
  const { isInStock } = useStockSync();
  
  const buttonAnimation = useSpring({
    transform: clicked ? 'scale(1.2)' : 'scale(1)',
  });
  
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  const addToCartHandler = () => {
    try {
      // Check if product is in stock
      if (!isInStock(product._id, 1)) {
        showError(`${product.name} is out of stock!`);
        return;
      }
      
      // Check if adding would exceed stock
      const existingItem = cartItems.find((item) => item._id === product._id);
      const currentQty = existingItem ? existingItem.qty : 0;
      const newQty = currentQty + 1;
      
      if (!isInStock(product._id, newQty)) {
        showWarning(`Cannot add more. Only ${product.countInStock} available in stock.`);
        return;
      }
      
      dispatch(cartAdd({ ...product, qty: 1 }));
      setClicked(true);
      setTimeout(() => {
        setClicked(false);
      }, 1000);
      
      showSuccess(`${product.name} added to cart!`);
    } catch (error) {
      showError(error.message || 'Failed to add to cart');
    }
  };

  const isAvailable = isInStock(product._id, 1);

  return (
    <animated.button
      size="small"
      color="primary"
      className={`cart-button ${clicked ? 'clicked' : ''} ${!isAvailable ? 'disabled' : ''}`}
      style={buttonAnimation}
      onClick={addToCartHandler}
      disabled={!isAvailable}
    >
      {clicked ? <ShoppingCartIcon /> : isAvailable ? 'Add to Cart' : 'Out of Stock'}
    </animated.button>
  );
};

export default CartButton;
