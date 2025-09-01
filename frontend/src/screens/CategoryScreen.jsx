import { useGetCategoryProductsQuery } from '../slices/productsApiSlice';
import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import Message from '../components/Message';
import { useParams } from 'react-router-dom';
import { FaTags, FaBox, FaFilter } from 'react-icons/fa';

const CategoryScreen = () => {
  const { category: cat } = useParams();
  const { data: products, isLoading, error } = useGetCategoryProductsQuery(cat);

  const getCategoryIcon = (category) => {
    const icons = {
      'interior': '🚗',
      'exterior': '🔧',
      'performance': '⚡',
      'electronics': '📱',
      'maintenance': '🔧',
      'accessories': '🎯'
    };
    return icons[category.toLowerCase()] || '🏷️';
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'interior': 'Enhance your car\'s interior comfort and style',
      'exterior': 'Upgrade your car\'s exterior appearance and protection',
      'performance': 'Boost your car\'s performance and efficiency',
      'electronics': 'Modern electronic upgrades for your vehicle',
      'maintenance': 'Essential maintenance and care products',
      'accessories': 'Must-have accessories for every car enthusiast'
    };
    return descriptions[category.toLowerCase()] || 'Discover amazing products in this category';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-4xl">{getCategoryIcon(cat)}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
            {cat} Accessories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {getCategoryDescription(cat)}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Category Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaTags className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Category</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{cat}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaBox className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-xl font-bold text-gray-900">
                  {products ? products.length : 0} items
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaFilter className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Filter</p>
                <p className="text-xl font-bold text-gray-900">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTags className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Products</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Available Products</h3>
              <p className="text-gray-600">Browse through our selection of {cat} accessories</p>
            </div>
            
            <Row className="g-4">
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products in the {cat} category at the moment.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Try checking back later or:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="/allProducts" className="text-blue-600 hover:text-blue-700 hover:underline text-sm">
                    Browse All Products
                  </a>
                  <a href="/search" className="text-blue-600 hover:text-blue-700 hover:underline text-sm">
                    Search Products
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryScreen;
