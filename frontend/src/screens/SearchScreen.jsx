import { useGetProductBySearchQuery } from '../slices/productsApiSlice';
import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import Message from '../components/Message';
import { useParams } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchScreen = () => {
  const { keyWord } = useParams();
  const { data: products, isLoading, error } = useGetProductBySearchQuery(keyWord);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <FaSearch className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">Search Results</h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Showing results for: <span className="font-semibold text-blue-600">"{keyWord}"</span>
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Search Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto">
              <FaTimes className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching <span className="font-semibold">"{keyWord}"</span>
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Try:</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Checking your spelling</li>
                  <li>• Using more general keywords</li>
                  <li>• Using different keywords</li>
                  <li>• Browsing our categories instead</li>
                </ul>
              </div>
            </div>
          </div>
        ) : products && products.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{products.length}</span> product{products.length !== 1 ? 's' : ''} for "{keyWord}"
                  </span>
                  <div className="flex items-center gap-2">
                    <FaSearch className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-500">Search Results</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product._id} className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto">
              <FaSearch className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No results found</h3>
              <p className="text-gray-600">
                Your search for <span className="font-semibold">"{keyWord}"</span> didn't return any results.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;
