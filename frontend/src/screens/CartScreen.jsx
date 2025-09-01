import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Form, Button, Card } from 'react-bootstrap';
import { cartAdd, removeFromCart, clearCart } from '../slices/cartSlice';
import Message from '../components/Message';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import './CartScreen.css';
import { useEffect, useState } from 'react';
import { updateCart } from '../components/cartUtil';
import CheckoutSteps from '../components/CheckoutSteps';

const CartScreen = () => {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo } = useSelector(state => state.auth);

  const addToCartHandler = async (product, qty) => {
    dispatch(cartAdd({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  }

  const clearCartHandler = () => {
    dispatch(clearCart());
  };

  const checkoutHandler = () => {
    navigate('/shipping');
  };

  const imageBaseUrl = 'http://localhost:5000/uploads/';
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${imageBaseUrl}${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <FaShoppingCart className="text-blue-600" />
            Shopping Cart
          </h1>
          <p className="text-xl text-gray-600">
            Review your items and proceed to checkout
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Checkout Steps */}
        <div className="mb-12">
          <CheckoutSteps step1 />
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <FaShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h3>
              <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
              <Link to="/allProducts">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <FaArrowLeft className="mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart Items ({cartItems.length})</h2>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                            }}
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Brand: {item.brand}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-green-600">
                              ${item.price}
                            </span>
                            <span className="text-sm text-gray-500">
                              Stock: {item.countInStock}
                            </span>
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Form.Control
                            as="select"
                            value={item.qty}
                            onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                            className="w-20 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                          
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFromCartHandler(item._id)}
                            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Cart Actions */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline-secondary"
                    onClick={clearCartHandler}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                  >
                    Clear Cart
                  </Button>
                  
                  <Link to="/allProducts">
                    <Button variant="outline-primary" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300">
                      <FaArrowLeft className="mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):</span>
                    <span className="font-medium">${cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span className="font-medium">${(cart.shippingPrice || 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span className="font-medium">${(cart.taxPrice || 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span>${(cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0) + (cart.shippingPrice || 0) + (cart.taxPrice || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Secure checkout powered by PayPal
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
