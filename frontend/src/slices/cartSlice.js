import {createSlice} from '@reduxjs/toolkit';
import { updateCart } from '../components/cartUtil';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : {user_id: '', cartItems: [], shippingAddress: {}, paymentMethod: ''};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      cartAdd: (state, action) => {
        const item = action.payload;
        
        // Check if item has stock information
        if (item.countInStock !== undefined && item.countInStock < item.qty) {
          throw new Error(`Insufficient stock for ${item.name}. Available: ${item.countInStock}, Requested: ${item.qty}`);
        }
        
        const existItem = state.cartItems.find((x) => x._id === item._id);
        if (existItem) {
          // Check if adding this quantity would exceed stock
          const newQty = existItem.qty + item.qty;
          if (item.countInStock !== undefined && newQty > item.countInStock) {
            throw new Error(`Cannot add ${item.qty} more. Total quantity ${newQty} would exceed available stock (${item.countInStock})`);
          }
          
          state.cartItems = state.cartItems.map((x) =>
            x._id === existItem._id ? { ...x, qty: newQty } : x
          );
        } else {
          state.cartItems = [...state.cartItems, item];
        }

        return updateCart(state, item);
      },

      removeFromCart: (state, action) => {
       state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
        return updateCart(state);
      },

      updateCartItemQuantity: (state, action) => {
        const { itemId, newQty } = action.payload;
        const item = state.cartItems.find((x) => x._id === itemId);
        
        if (item) {
          // Check if new quantity exceeds stock
          if (item.countInStock !== undefined && newQty > item.countInStock) {
            throw new Error(`Cannot set quantity to ${newQty}. Available stock: ${item.countInStock}`);
          }
          
          item.qty = newQty;
          return updateCart(state);
        }
      },

      // Update stock for cart items in real-time
      updateCartItemStock: (state, action) => {
        const { productId, newStock } = action.payload;
        const cartItem = state.cartItems.find((x) => x._id === productId);
        
        if (cartItem) {
          cartItem.countInStock = newStock;
          
          // If current quantity exceeds new stock, adjust quantity
          if (cartItem.qty > newStock) {
            cartItem.qty = newStock;
          }
          
          return updateCart(state);
        }
      },

      // Sync cart with current product stock
      syncCartWithStock: (state, action) => {
        const { products } = action.payload;
        
        state.cartItems = state.cartItems.map(cartItem => {
          const product = products.find(p => p._id === cartItem._id);
          if (product) {
            return {
              ...cartItem,
              countInStock: product.countInStock,
              price: product.price,
              name: product.name,
              image: product.image
            };
          }
          return cartItem;
        });
        
        return updateCart(state);
      },

      // Remove out-of-stock items
      removeOutOfStockItems: (state) => {
        state.cartItems = state.cartItems.filter(item => 
          item.countInStock === undefined || item.countInStock > 0
        );
        return updateCart(state);
      },

      clearCart: (state) => {
        state.cartItems = [];
        return updateCart(state);
      },
      
      saveShippingAddress: (state, action) => {
        state.shippingAddress = action.payload;
        localStorage.setItem('cart', JSON.stringify(state));
      },
      
      savePaymentMethod: (state, action) => {
        state.paymentMethod = action.payload;
        localStorage.setItem('cart', JSON.stringify(state));
      },
      
      saveUser: (state, action) => {
        state.user_id = action.payload;
        localStorage.setItem('cart', JSON.stringify(state));
      },
    },
});

export const {
  cartAdd, 
  removeFromCart, 
  clearCart, 
  saveShippingAddress, 
  savePaymentMethod, 
  saveUser,
  updateCartItemQuantity,
  updateCartItemStock,
  syncCartWithStock,
  removeOutOfStockItems
} = cartSlice.actions;

export default cartSlice.reducer;