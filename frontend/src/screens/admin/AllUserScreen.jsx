import { useEffect, useState } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import {
  useGetAllUsersQuery, useMakeAdminMutation, useRemoveAdminMutation,
  useUpdateUserMutation, useRemoveUserMutation
} from '../../slices/userApiSlice.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Modal, Form } from 'react-bootstrap';
import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaUsers, FaUserShield, FaUserEdit, FaTrash, FaCrown, FaUser, FaEnvelope, FaCalendar, FaEdit, FaBan } from 'react-icons/fa';

const AllUserScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [show, setShow] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  
  const { userInfo } = useSelector((state) => state.auth);
  const { data: users, refetch, isLoading, error } = useGetAllUsersQuery();
  const [makeAdmin, { isLoading: adminIsLoading }] = useMakeAdminMutation();
  const [removeAdmin, { isLoading: removeAdminLoading }] = useRemoveAdminMutation();
  const [updateUser, { isLoading: updateUserLoading }] = useUpdateUserMutation();
  const [removeUser, { isLoading: removeUserLoading }] = useRemoveUserMutation();

  const handleClose = () => {
    setShow(false);
    setUserId('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleShow = (user) => {
    setShow(true);
    setUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setConfirmPassword('');
  };

  const handleShowRemoveModal = (user) => {
    setUserToRemove(user);
    setShowRemoveModal(true);
  };

  const handleCloseRemoveModal = () => {
    setShowRemoveModal(false);
    setUserToRemove(null);
  };

  useEffect(() => {
    refetch();
  }, []);

  const handleMakeAdmin = async (userId, name) => {
    if (userInfo._id === userId) {
      toast.error('You cannot make yourself admin');
      return;
    }
    try {
      const res = await makeAdmin({ userId }).unwrap();
      refetch();
      toast.success(`${name} is now an admin`);
    } catch (error) {
      toast.error(error?.data?.message || error?.error || 'Failed to make user admin');
    }
  };

  const handleRemoveFromAdmin = async (userId, name) => {
    if (userInfo._id === userId) {
      toast.error('You cannot remove yourself from admin');
      return;
    }
    try {
      const res = await removeAdmin({ userId }).unwrap();
      refetch();
      toast.success(`${name} removed from admin`);
    } catch (error) {
      toast.error(error?.data?.message || error?.error || 'Failed to remove admin status');
    }
  };

  const handleRemoveUser = async () => {
    if (userInfo._id === userToRemove._id) {
      toast.error('You cannot remove yourself');
      return;
    }
    try {
      const res = await removeUser({ userId: userToRemove._id }).unwrap();
      refetch();
      handleCloseRemoveModal();
      toast.success(`${userToRemove.name} removed successfully`);
    } catch (error) {
      toast.error(error?.data?.message || error?.error || 'Failed to remove user');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      const updateData = { userId, name, email };
      if (password.trim()) {
        updateData.password = password;
      }
      
      const res = await updateUser(updateData).unwrap();
      refetch();
      handleClose();
      toast.success('User updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || error?.error || 'Failed to update user');
    }
  };

  const getStats = () => {
    if (!users) return { total: 0, admins: 0, customers: 0 };
    const total = users.length;
    const admins = users.filter(user => user.isAdmin).length;
    const customers = total - admins;
    return { total, admins, customers };
  };

  const stats = getStats();

  return (
    <>
      <AdminPanelScreen />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
              <FaUsers className="text-blue-600" />
              Manage Customers
            </h1>
            <p className="text-xl text-gray-600">
              View and manage all user accounts and permissions
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaUserShield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Administrators</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaUser className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.customers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <Message severity="error">{error}</Message>
            </div>
          ) : !users || users.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
                <FaUsers className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No users found</h3>
                <p className="text-gray-600">There are no users to display at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              user.isAdmin ? 'bg-purple-100' : 'bg-blue-100'
                            }`}>
                              {user.isAdmin ? (
                                <FaCrown className="w-5 h-5 text-purple-600" />
                              ) : (
                                <FaUser className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">ID: {user._id.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isAdmin 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.isAdmin ? 'Administrator' : 'Customer'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaCalendar className="w-4 h-4" />
                            <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleShow(user)}
                              className="inline-flex items-center gap-2 px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                              <FaEdit className="w-4 h-4" />
                              Edit
                            </button>
                            
                            {user.isAdmin ? (
                              <button
                                onClick={() => handleRemoveFromAdmin(user._id, user.name)}
                                disabled={removeAdminLoading || user._id === userInfo._id}
                                className="inline-flex items-center gap-2 px-3 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              >
                                <FaBan className="w-4 h-4" />
                                Remove Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMakeAdmin(user._id, user.name)}
                                disabled={adminIsLoading || user._id === userInfo._id}
                                className="inline-flex items-center gap-2 px-3 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              >
                                <FaCrown className="w-4 h-4" />
                                Make Admin
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleShowRemoveModal(user)}
                              disabled={user._id === userInfo._id}
                              className="inline-flex items-center gap-2 px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <FaTrash className="w-4 h-4" />
                              Delete
                            </button>
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

      {/* Edit User Modal */}
      <Modal 
        show={show} 
        onHide={handleClose} 
        size="lg"
        className="modal-centered"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="bg-gray-50">
          <Modal.Title className="flex items-center gap-2">
            <FaUserEdit className="text-blue-600" />
            Edit User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler} className="space-y-4">
            <Form.Group controlId="name">
              <Form.Label className="font-medium">Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Group>
            
            <Form.Group controlId="email">
              <Form.Label className="font-medium">Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Group>
            
            <Form.Group controlId="password">
              <Form.Label className="font-medium">New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Group>
            
            <Form.Group controlId="confirmPassword">
              <Form.Label className="font-medium">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-gray-50">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={submitHandler}
            disabled={updateUserLoading}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
          >
            {updateUserLoading ? 'Updating...' : 'Update User'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Remove User Confirmation Modal */}
      <Modal 
        show={showRemoveModal} 
        onHide={handleCloseRemoveModal} 
        size="md"
        className="modal-centered"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="bg-red-50 border-red-200">
          <Modal.Title className="flex items-center gap-2 text-red-800">
            <FaTrash className="text-red-600" />
            Delete User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure you want to delete this user?
            </h3>
            <p className="text-gray-600">
              This action cannot be undone. The user <strong>{userToRemove?.name}</strong> will be permanently removed from the system.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-red-50 border-red-200">
          <Button variant="secondary" onClick={handleCloseRemoveModal}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleRemoveUser}
            disabled={removeUserLoading}
            className="bg-red-600 hover:bg-red-700 border-red-600"
          >
            {removeUserLoading ? 'Deleting...' : 'Delete User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllUserScreen;
