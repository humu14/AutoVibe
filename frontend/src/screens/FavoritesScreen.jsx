import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import Grid from '@material-ui/core/Grid';
import { useParams } from 'react-router-dom';
import { useGetFavoriteQuery } from '../slices/userApiSlice';
import { useEffect, useState } from 'react';
import Message from '../components/Message';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { FaHeart, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';

const FavoritesScreen = () => {
  const [isFavorite, setIsFavorite] = useState();
  const { id: userId } = useParams();
  const { data: favProducts, refetch: refetchFavProducts, isLoading: favIsLoading, error } = useGetFavoriteQuery();

  useEffect(() => {
    refetchFavProducts();
  }, []);

  useEffect(() => {
    if (favProducts && favProducts.data) {
      const index = favProducts.data.findIndex((item) => item._id === userId);
      setIsFavorite(index !== -1);
    }
  }, [favProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <FaHeart className="text-red-500" />
            My Favorites
          </h1>
          <p className="text-xl text-gray-600">
            Your saved car accessories and automotive products
          </p>
          <div className="w-24 h-1 bg-red-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Favorites Content */}
        {favIsLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error?.error || 'An error occurred while loading favorites'}</Message>
        ) : favProducts && favProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <FaHeart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No favorites yet</h3>
              <p className="text-gray-600 mb-8">
                Start adding products to your favorites to see them here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LinkContainer to="/allProducts">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <FaShoppingBag className="mr-2" />
                    Browse Products
                  </Button>
                </LinkContainer>
                <LinkContainer to="/">
                  <Button variant="outline-secondary" className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300 py-3 px-6 rounded-xl">
                    <FaArrowLeft className="mr-2" />
                    Go Back
                  </Button>
                </LinkContainer>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Favorites Count */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    You have <span className="font-semibold text-gray-900">{favProducts?.length || 0}</span> favorite product{favProducts?.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center gap-2">
                    <FaHeart className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-500">Favorites</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favProducts &&
                favProducts.map((product) => (
                  <div key={product._id} className="transform hover:scale-105 transition-transform duration-300">
                    <ProductCard product={product} favFlag={isFavorite} />
                  </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LinkContainer to="/allProducts">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <FaShoppingBag className="mr-2" />
                    Continue Shopping
                  </Button>
                </LinkContainer>
                <LinkContainer to="/">
                  <Button variant="outline-secondary" className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300 py-3 px-6 rounded-xl">
                    <FaArrowLeft className="mr-2" />
                    Back to Home
                  </Button>
                </LinkContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesScreen;
