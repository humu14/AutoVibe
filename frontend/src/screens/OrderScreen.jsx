import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import {
  useGetOrderByIdQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useMarkAsDeliveredMutation,
  useCancelOrderMutation,
  useCreateOrderMutation,
} from '../slices/ordersApiSlice';
import { FaBox, FaCreditCard, FaMapMarkerAlt, FaTruck, FaCheckCircle, FaTimes, FaRedo, FaEye, FaDollarSign, FaCalendar, FaUser } from 'react-icons/fa';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useMarkAsDeliveredMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const deliverHandler = async () => {
    await deliverOrder({ orderId });
    refetch();
  };

  const imageBaseUrl = 'http://localhost:5000/uploads/';
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${imageBaseUrl}${imagePath}`;
  };

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  useEffect(() => {
    if (orderId) {
      refetch();
    }
  }, [orderId, refetch]);

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order?.totalPrice || 0 },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  const [reOrder, { ReorderIsLoading, ReorderError }] = useCreateOrderMutation();
  const [cancelOrder, { cancelOrderIsLoading, cancelOrderError }] = useCancelOrderMutation();
  const navigate = useNavigate();
  const reOrderHandler = async (order) => {
    try {
      const res = await reOrder({
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        totalPrice: order.totalPrice,
      }).unwrap();
      toast.success('Reorder Successful!');
      // Navigate to the new order - this will trigger a new API call for the new order
      navigate(`/order/${res._id}`);
      // Don't call refetch here as we're navigating to a new page
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const cancelOrderHandler = async () => {
    try {
      await cancelOrder({ orderId });
      toast.success('Order cancelled successfully');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Helper function to get order status
  const getOrderStatus = (order) => {
    if (order?.isCancelled) return { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <FaTimes className="w-4 h-4" /> };
    if (order?.isDelivered) return { text: 'Delivered', color: 'bg-blue-100 text-blue-800', icon: <FaTruck className="w-4 h-4" /> };
    if (order?.isPaid) return { text: 'Shipped', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="w-4 h-4" /> };
    return { text: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800', icon: <FaTimes className="w-4 h-4" /> };
  };

  const orderStatus = getOrderStatus(order);

  // Safety check - if order is not available, show not found
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <div className="text-yellow-800">
              <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
              <p>This order could not be found or is no longer available.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <FaBox className="text-blue-600" />
            Order Details
          </h1>
          <p className="text-xl text-gray-600">
            Track your order status and manage your purchase
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <Message variant='danger'>{error?.data?.message || error?.error || 'An error occurred while loading the order'}</Message>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Order Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{orderId}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="w-4 h-4" />
                      <span>{new Date(order?.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      <span>{order?.user?.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 ${orderStatus.color} rounded-full text-sm font-medium`}>
                    {orderStatus.icon}
                    {orderStatus.text}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {!order?.isCancelled && (
                  <Button
                    onClick={reOrderHandler}
                    disabled={ReorderIsLoading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 border-0 rounded-xl font-semibold transition-colors duration-200"
                  >
                    <FaRedo className="w-4 h-4" />
                    {ReorderIsLoading ? 'Processing...' : 'Reorder'}
                  </Button>
                )}
                
                {!order?.isPaid && !order?.isCancelled && (
                  <Button
                    onClick={cancelOrderHandler}
                    disabled={cancelOrderIsLoading}
                    variant="outline"
                    className="inline-flex items-center gap-2 px-6 py-3 border-red-300 text-red-700 hover:bg-red-50 rounded-xl font-semibold transition-colors duration-200"
                  >
                    <FaTimes className="w-4 h-4" />
                    {cancelOrderIsLoading ? 'Cancelling...' : 'Cancel Order'}
                  </Button>
                )}

                {order?.isCancelled && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                    <FaTimes className="w-4 h-4" />
                    Order Cancelled
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaBox className="w-5 h-5 text-blue-600" />
                    Order Items
                  </h3>
                  
                  <ListGroup variant='flush' className="space-y-4">
                    {order?.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index} className="border-0 p-0">
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <Image
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              fluid
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <Link to={`/product/${item.product}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                                {item.name}
                              </Link>
                              <p className="text-gray-600">Qty: {item.qty}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">${item.price}</p>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FaBox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>No order items found</p>
                      </div>
                    )}
                  </ListGroup>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                    Shipping Address
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>{order?.shippingAddress?.address}</p>
                    <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}</p>
                    <p>{order?.shippingAddress?.country}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCreditCard className="w-5 h-5 text-blue-600" />
                    Payment Method
                  </h3>
                  <p className="text-gray-600">{order?.paymentMethod}</p>
                  
                  {!order?.isPaid && paypal?.clientId && (
                    <div className="mt-4">
                      <PayPalScriptProvider options={{ 'client-id': paypal.clientId }}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaDollarSign className="w-5 h-5 text-blue-600" />
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items Price:</span>
                      <span className="font-semibold">${order?.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold">${order?.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-semibold">${order?.taxPrice}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-green-600">${order?.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderScreen;