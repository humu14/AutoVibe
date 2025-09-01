import { useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@material-ui/core';
import { useGetAllReviewsQuery, useDeleteReviewMutation } from '../../slices/reviewApiSlice.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { useNavigate } from 'react-router-dom';
import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaTrash, FaUser, FaBox, FaExclamationTriangle } from 'react-icons/fa';

const AllReviewScreen = () => {
  const { data: reviews, refetch, isLoading, error } = useGetAllReviewsQuery();

  useEffect(() => {
    refetch();
  }, []);

  const [deleteReview, { isLoading: loadingDelete }] = useDeleteReviewMutation();

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await deleteReview(reviewId);
      if (response) {
        toast.success('Review deleted successfully');
        refetch();
      } else {
        toast.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Failed to delete review', error);
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <>
      <AdminPanelScreen />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
              <FaStar className="text-yellow-500" />
              All Reviews
            </h1>
            <p className="text-xl text-gray-600">
              Manage and monitor customer reviews across all products
            </p>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <Message severity="error">{error}</Message>
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
                <FaStar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No reviews found</h3>
                <p className="text-gray-600">There are no customer reviews to display at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Rating
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <tr key={review._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {review._id?.slice(-8) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.user ? (
                            <div className="flex items-center gap-2">
                              <FaUser className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-900">
                                {review.user.name || 'Unknown User'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                              <FaExclamationTriangle className="w-4 h-4" />
                              <span className="text-sm">User not found</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.product ? (
                            <Link 
                              to={`/product/${review.product._id}`}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              <FaBox className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {review.product.name || 'Unknown Product'}
                              </span>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                              <FaExclamationTriangle className="w-4 h-4" />
                              <span className="text-sm">Product not found</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating || 0)}
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {review.rating || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={review.comment || 'No comment'}>
                            {review.comment || 'No comment provided'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.product ? (
                            <div className="flex items-center gap-1">
                              {renderStars(review.product.rating || 0)}
                              <span className="ml-2 text-sm font-medium text-gray-900">
                                {review.product.rating || 0}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            disabled={loadingDelete}
                            className="inline-flex items-center gap-2 px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <FaTrash className="w-4 h-4" />
                            Delete
                          </button>
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

export default AllReviewScreen;
