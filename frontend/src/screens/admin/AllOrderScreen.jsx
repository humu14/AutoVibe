import { useEffect, useState } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import { useGetAllOrdersQuery } from '../../slices/ordersApiSlice.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { useMarkAsDeliveredMutation } from '../../slices/ordersApiSlice.js';
import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaFilter, FaEye, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaDollarSign, FaCalendar, FaTimes } from 'react-icons/fa';

const AllOrderScreen = () => {
  const { data: orders, refetch, isLoading, error } = useGetAllOrdersQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [deliverOrder, { isLoading: loadingDeliver }] = useMarkAsDeliveredMutation();

  const deliverHandler = async (orderId) => {
    await deliverOrder({ orderId });
    refetch();
  };

  const navigate = useNavigate();

  const handleChange = (event) => {
    if (event.target.value != 'default') {
      navigate(`/admin/orders/filter/${event.target.value}`)
    }
  };

  const getOrderStats = () => {
    if (!orders) return { total: 0, paid: 0, delivered: 0, pending: 0, cancelled: 0 };
    const total = orders.length;
    const cancelled = orders.filter(order => order.isCancelled).length;
    const paid = orders.filter(order => order.isPaid && !order.isCancelled).length;
    const delivered = orders.filter(order => order.isDelivered && !order.isCancelled).length;
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

  return (
    <>
      <AdminPanelScreen />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
              <FaBox className="text-blue-600" />
              Manage Orders
            </h1>
            <p className="text-xl text-gray-600">
              Monitor and manage all customer orders and delivery status
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
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
                  <FaDollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaTruck className="w-6 h-6 text-purple-600" />
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

          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <FaFilter className="w-6 h-6 text-gray-600" />
                <span className="text-lg font-semibold text-gray-800">Order Management</span>
              </div>
              
              <FormControl style={{ minWidth: '300px' }}>
                <InputLabel id="demo-simple-select-label">Filter Orders</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Filter"
                  onChange={handleChange}
                  variant="outlined"
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'default'}>All Orders</MenuItem>
                  <MenuItem value={'paid'}>Paid Orders</MenuItem>
                  <MenuItem value={'notPaid'}>Unpaid Orders</MenuItem>
                  <MenuItem value={'delivered'}>Delivered Orders</MenuItem>
                  <MenuItem value={'notDelivered'}>Pending Delivery</MenuItem>
                  <MenuItem value={'cancelled'}>Cancelled Orders</MenuItem>
                  <MenuItem value={'notCancelled'}>Active Orders</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Orders Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <Message>{error.message}</Message>
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
                <FaBox className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No orders found</h3>
                <p className="text-gray-600">There are no orders to display at the moment.</p>
              </div>
            </div>
          ) : (
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
                        Total Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders && orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <LinkContainer to={`/order/${order._id}`}>
                            <div className="cursor-pointer">
                              <div className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                                Order #{order._id.slice(-8)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </LinkContainer>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaUser className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {order.user && order.user.name ? order.user.name : "User not found"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-green-600">
                            ${order.totalPrice?.toFixed(2) || '0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.isPaid 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
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
                              <button className="inline-flex items-center gap-2 px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                                <FaEye className="w-4 h-4" />
                                View
                              </button>
                            </LinkContainer>
                            
                            {!order.isDelivered && order.isPaid && (
                              <button
                                onClick={() => deliverHandler(order._id)}
                                disabled={loadingDeliver}
                                className="inline-flex items-center gap-2 px-3 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              >
                                <FaCheckCircle className="w-4 h-4" />
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllOrderScreen;