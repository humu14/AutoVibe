import { useEffect, useState } from 'react';
import { useGetMyOrdersQuery, useCreateOrderMutation, useCancelOrderMutation } from '../slices/ordersApiSlice.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBox, FaEye, FaRedo, FaBan, FaDollarSign, FaCalendar, FaTruck, FaCheckCircle, FaTimes, FaFilter, FaClock, FaUser, FaArrowLeft } from 'react-icons/fa';

const MyOrderScreen = () => {
  const { userInfo } = useSelector(state => state.auth);
  const userId = userInfo?._id;
  
  // Guard clause - if userId is not available, show loading or redirect
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <div className="text-yellow-800">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p>Please log in to view your orders.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data: orders, refetch, isLoading, error } = useGetMyOrdersQuery({ userId });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const navigate = useNavigate();
  
  const [createOrder, { isLoading: reorderIsLoading }] = useCreateOrderMutation();
  const placeOrderHandler = async (order) => {
    try {
      const res = await createOrder({
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        totalPrice: order.totalPrice,
      }).unwrap();
      toast.success('Reorder Successful!');
      navigate(`/order/${res._id}`);
      refetch();
    } catch (err) {
      console.error('Reorder error:', err);
      toast.error(err?.data?.message || err?.error || 'Failed to reorder. Please try again.');
    }
  };

  const [cancelOrder, { isLoading: cancelOrderIsLoading }] = useCancelOrderMutation();
  const cancelOrderHandler = async (orderId) => {
    try {
      const res = await cancelOrder({ orderId: orderId }).unwrap();
      toast.success('Order Cancelled Successfully!');
      refetch(); // This will refresh the orders and show updated status
    } catch (err) {
      console.error('Cancel order error:', err);
      toast.error(err?.data?.message || err?.error || 'Failed to cancel order. Please try again.');
    }
  };

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    if (selectedFilter !== 'default') {
      navigate(`/myorder/${userId}/filter/${selectedFilter}`);
    }
  };

  const getOrderStats = () => {
    if (!orders) return { total: 0, paid: 0, delivered: 0, pending: 0, cancelled: 0 };
    const total = orders.length;
    const paid = orders.filter(order => order.isPaid && !order.isCancelled).length;
    const delivered = orders.filter(order => order.isDelivered && !order.isCancelled).length;
    const cancelled = orders.filter(order => order.isCancelled).length;
    const pending = total - delivered - cancelled;
    return { total, paid, delivered, pending, cancelled };
  };

  const getStatusIcon = (order) => {
    // Check if order is cancelled first
    if (order.isCancelled) return <FaTimes className="w-5 h-5 text-red-500" />;
    if (order.isDelivered) return <FaCheckCircle className="w-5 h-5 text-green-500" />;
    if (order.isPaid) return <FaTruck className="w-5 h-5 text-blue-500" />;
    return <FaClock className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusColor = (order) => {
    // Check if order is cancelled first
    if (order.isCancelled) return 'bg-red-100 text-red-800';
    if (order.isDelivered) return 'bg-green-100 text-green-800';
    if (order.isPaid) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (order) => {
    // Check if order is cancelled first
    if (order.isCancelled) return 'Cancelled';
    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Shipped';
    return 'Pending';
  };

  const stats = getOrderStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Message variant='error'>{error?.data?.message || error?.error || 'An error occurred while loading orders'}</Message>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
            <FaBox className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Orders
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your order history and manage your purchases
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaFilter className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Filter Orders</h2>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
              <select
                onChange={handleFilterChange}
                defaultValue="default"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 min-w-[350px] shadow-sm"
              >
                <option value="default">All Orders</option>
                <option value="paid">Paid</option>
                <option value="notPaid">Not Paid</option>
                <option value="delivered">Delivered</option>
                <option value="notDelivered">Not Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="notCancelled">Not Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaBox className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaTruck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FaClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaTimes className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {orders && orders.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaBox className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              <LinkContainer to={`/order/${order._id}`} style={{ cursor: 'pointer', color: 'blue' }}>
                                <span className="hover:underline">#{order._id.slice(-8)}</span>
                              </LinkContainer>
                            </div>
                            <div className="text-sm text-gray-500">
                              <FaCalendar className="w-4 h-4 inline mr-1" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaUser className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{order.user?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaDollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-900">${order.totalPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order)}`}>
                            {getStatusText(order)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="inline-flex items-center gap-2"
                            >
                              <FaEye className="w-3 h-3" />
                              View
                            </Button>
                          </LinkContainer>
                          
                          {!order.isDelivered && order.isPaid && !order.isCancelled && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => placeOrderHandler(order)}
                              disabled={reorderIsLoading}
                              className="inline-flex items-center gap-2"
                            >
                              <FaRedo className="w-3 h-3" />
                              {reorderIsLoading ? 'Processing...' : 'Reorder'}
                            </Button>
                          )}
                          
                          {!order.isDelivered && !order.isPaid && !order.isCancelled && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => cancelOrderHandler(order._id)}
                              disabled={cancelOrderIsLoading}
                              className="inline-flex items-center gap-2"
                            >
                              <FaBan className="w-3 h-3" />
                              {cancelOrderIsLoading ? 'Cancelling...' : 'Cancel'}
                            </Button>
                          )}
                          
                          {order.isCancelled && (
                            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md">
                              <FaTimes className="w-4 h-4 mr-2" />
                              Order Cancelled
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <FaBox className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No orders found</h3>
              <p className="text-gray-600 mb-6">
                Start shopping to see your order history here.
              </p>
              <LinkContainer to="/allProducts">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                  Browse Products
                </Button>
              </LinkContainer>
            </div>
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default MyOrderScreen;
