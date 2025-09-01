import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCart } from '../slices/cartSlice';
import { FaMapMarkerAlt, FaCreditCard, FaBox, FaCheckCircle, FaArrowRight, FaShoppingCart } from 'react-icons/fa';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const imageBaseUrl = 'http://localhost:5000/uploads/';

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector(state => state.auth);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCart());
      toast.success('Order Added Successfully!!');
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${imageBaseUrl}${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <FaCheckCircle className="text-green-600" />
            Review & Place Order
          </h1>
          <p className="text-xl text-gray-600">
            Review your order details before confirming your purchase
          </p>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Checkout Steps */}
        <div className="mb-8">
          <CheckoutSteps step1 step2 step3 step4 />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-800">
                  <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                  {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCreditCard className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-800">
                  <strong>Method:</strong> {cart.paymentMethod}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaBox className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
              </div>
              
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0">
                        <Image
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          fluid
                          rounded
                          className="w-20 h-20 object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link 
                          to={`/product/${item._id}`}
                          className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300"
                        >
                          {item.name}
                        </Link>
                        {item.brand && (
                          <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${item.price} × {item.qty} = ${(item.qty * item.price).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Quantity: {item.qty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <FaShoppingCart className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-semibold text-gray-900">
                    {cart.cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    ${cart.cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold text-gray-900">
                    ${(cart.shippingPrice || 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold text-gray-900">
                    ${(cart.taxPrice || 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${(cart.cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0) + (cart.shippingPrice || 0) + (cart.taxPrice || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {error && (
                <Message variant="danger">{error?.data?.message || error?.error || 'An error occurred'}</Message>
              )}

              <div className="mt-6">
                <Button
                  type='button'
                  className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FaCheckCircle />
                      <span>Place Order</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;