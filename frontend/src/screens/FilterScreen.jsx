import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByFilterQuery } from '../slices/productsApiSlice';
import Message from '../components/Message';
import { FaFilter, FaSort, FaBox, FaStar, FaDollarSign, FaCheckCircle, FaSortAmountUp, FaSortAmountDown, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

const FilterScreen = () => {
  const { filter: fil } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetProductByFilterQuery(fil);

  const handleChange = (event) => {
    const filter = event.target.value;
    navigate(`/filter/${filter}`);
  };

  const getFilterInfo = (filter) => {
    const filterInfo = {
      stock: { title: 'In Stock Products', icon: FaCheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', description: 'Products currently available for purchase' },
      pLow: { title: 'Price: Low to High', icon: FaSortAmountUp, color: 'text-blue-600', bgColor: 'bg-blue-50', description: 'Products sorted by price in ascending order' },
      pHigh: { title: 'Price: High to Low', icon: FaSortAmountDown, color: 'text-purple-600', bgColor: 'bg-purple-50', description: 'Products sorted by price in descending order' },
      alphaA: { title: 'Name: A to Z', icon: FaSortAlphaDown, color: 'text-indigo-600', bgColor: 'bg-indigo-50', description: 'Products sorted alphabetically from A to Z' },
      alphaZ: { title: 'Name: Z to A', icon: FaSortAlphaUp, color: 'text-pink-600', bgColor: 'bg-pink-50', description: 'Products sorted alphabetically from Z to A' },
      ratingHigh: { title: 'Highest Rated', icon: FaStar, color: 'text-yellow-600', bgColor: 'bg-yellow-50', description: 'Products sorted by highest customer ratings' },
      ratingLow: { title: 'Lowest Rated', icon: FaStar, color: 'text-orange-600', bgColor: 'bg-orange-50', description: 'Products sorted by lowest customer ratings' },
      featured: { title: 'Featured Products', icon: FaStar, color: 'text-red-600', bgColor: 'bg-red-50', description: 'Our specially selected featured products' }
    };
    return filterInfo[filter] || { title: 'Filtered Products', icon: FaFilter, color: 'text-gray-600', bgColor: 'bg-gray-50', description: 'Products filtered by your selection' };
  };

  const filterInfo = getFilterInfo(fil);
  const IconComponent = filterInfo.icon;

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
          <Message variant='error' />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${filterInfo.bgColor} rounded-full mb-6`}>
            <IconComponent className={`w-10 h-10 ${filterInfo.color}`} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {filterInfo.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {filterInfo.description}
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaFilter className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Sort & Filter</h2>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                onChange={handleChange}
                value={fil}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 min-w-[250px] shadow-sm"
              >
                <option value="stock">In Stock</option>
                <option value="pLow">Price: Low to High</option>
                <option value="pHigh">Price: High to Low</option>
                <option value="alphaA">Name: A to Z</option>
                <option value="alphaZ">Name: Z to A</option>
                <option value="ratingHigh">Rating: Highest</option>
                <option value="ratingLow">Rating: Lowest</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBox className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium text-gray-900">
                {products?.length || 0} Products Found
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Showing results for: <span className="font-medium text-gray-900">{filterInfo.title}</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="transform transition-all duration-300 hover:scale-105">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <FaBox className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600 mb-6">
                No products match your current filter criteria. Try adjusting your selection.
              </p>
              <button
                onClick={() => navigate('/allProducts')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FaFilter className="w-4 h-4" />
                View All Products
              </button>
            </div>
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default FilterScreen;
