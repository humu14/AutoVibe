import Carousel from 'react-bootstrap/Carousel';
import { useGetProductByFilterQuery } from '../slices/productsApiSlice';
import Message from './Message';
import Loader from './Loader';
import Rating from '@mui/material/Rating';
import { LinkContainer } from 'react-router-bootstrap';
import { useEffect } from 'react';

function ProductCarousel() {
  const { data: products, isLoading, error, refetch } = useGetProductByFilterQuery('ratingHigh');
  const imageBaseUrl = 'http://localhost:5000/uploads/';
  
  useEffect(() => {
    refetch();
  }, [products]);

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${imageBaseUrl}${imagePath}`;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant='error'>{error?.data?.message || error.error}</Message>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Top Rated Products</h1>
        <p className="text-lg text-gray-600">Discover our most loved car accessories</p>
      </div>
      
      <Carousel 
        fade 
        interval={5000}
        className="rounded-2xl overflow-hidden shadow-2xl"
        indicators={false}
        controls={true}
      >
        {products?.slice(0, 3).map((product) => (
          <Carousel.Item key={product._id}>
            <LinkContainer to={`/product/${product._id}`}>
              <div className="relative cursor-pointer group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                    {/* Product Image */}
                    <div className="flex-1 flex justify-center">
                      <div className="relative">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-80 h-80 object-contain rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                          }}
                        />
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ Top Rated
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 text-center lg:text-left">
                      <div className="space-y-4">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                          {product.name}
                        </h2>
                        
                        <p className="text-lg text-gray-600 max-w-md">
                          {product.description?.substring(0, 120)}...
                        </p>
                        
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <Rating 
                            value={product.rating} 
                            readOnly 
                            size="large"
                            className="text-yellow-400"
                          />
                          <span className="text-gray-600 font-medium">
                            ({product.rating} stars)
                          </span>
                        </div>
                        
                        <div className="text-3xl font-bold text-green-600">
                          ${product.price}
                        </div>
                        
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            product.countInStock > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                          
                          {product.isFeatured && (
                            <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-300 transform hover:scale-105">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </LinkContainer>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default ProductCarousel;
