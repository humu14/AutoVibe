import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardActions, IconButton, Tooltip } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import CartButton from './CartButton';
import { LinkContainer } from 'react-router-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useAddFavoriteMutation, useGetFavoriteQuery } from '../slices/userApiSlice';
import { showSuccess, showError, showWarning } from '../utils/toast';
import { useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Grid } from '@mui/material';
import Rating from '@mui/material/Rating';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import { useStockSync } from '../hooks/useStockSync';

import {
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

const AnimatedCard = animated(Card);

const ProductCard = ({ product }) => {
  const imageBaseUrl = 'http://localhost:5000/uploads/';
  const { userInfo } = useSelector(state => state.auth);
  const { getStockStatus, isInStock } = useStockSync();
  const stockStatus = getStockStatus(product._id);
  
  const animationProps = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(50px)' },
    config: { tension: 300, friction: 10 },
  });

  const hoverProps = useSpring({
    transform: 'scale(1)',
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.10)',
    from: { transform: 'scale(0.9)', boxShadow: 'ash' },
  });

  const [isFavorite, setIsFavorite] = useState(false);
  const [addToFav, { isLoading }] = useAddFavoriteMutation();
  const { data: favProducts, FavIsLoading, refetch, error } = useGetFavoriteQuery();

  const handleFavoriteClick = async () => {
    if (!userInfo) {
      showError('Please login to add to favorites');
      return;
    }
    try {
      const res = await addToFav({ productId: product._id });
      if (res.data.data.index !== -1) {
        showSuccess(`${product.name} Removed from Favorites`);
        setIsFavorite(false);
        refetch();
      } else {
        showSuccess(`${product.name} Added to Favorites`);
        setIsFavorite(true);
        refetch();
      }
    } catch (err) {
      showError(err?.response?.data?.message || err?.message || 'Error adding to favorites');
    }
  };

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const inCart = cartItems.find((item) => item._id === product._id);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!userInfo) {
      setIsFavorite(false);
      return;
    }
    
    if (favProducts && favProducts.data) {
      const index = favProducts.data.findIndex((item) => item._id === product._id);
      setIsFavorite(index !== -1);
    } else if (favProducts && Array.isArray(favProducts)) {
      const index = favProducts.findIndex((item) => item._id === product._id);
      setIsFavorite(index !== -1);
    }
  }, [favProducts, userInfo, product._id]);

  // Real-time stock availability
  const isAvailable = isInStock(product._id, 1);

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${imageBaseUrl}${imagePath}`;
  };

  return (
    <div className="group">
      <AnimatedCard 
        style={animationProps}
        className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
      >
        <LinkContainer to={`/product/${product._id}`}>
          <CardActionArea className="h-full">
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              
              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isFeatured && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ Featured
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                  isAvailable 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-3 right-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <CardContent className="p-6">
              <div className="space-y-3">
                {/* Product Name */}
                <Typography 
                  variant="h6" 
                  className="font-bold text-gray-800 line-clamp-2 h-14 leading-tight"
                >
                  {product.name}
                </Typography>
                
                {/* Brand */}
                <Typography variant="body2" className="text-blue-600 font-medium">
                  {product.brand}
                </Typography>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Rating 
                    value={product.rating} 
                    precision={0.5} 
                    readOnly 
                    size="small"
                    className="text-yellow-400"
                  />
                  <span className="text-sm text-gray-600">
                    ({product.rating})
                  </span>
                </div>
                
                {/* Price */}
                <Typography variant="h5" className="font-bold text-green-600">
                  ${product.price}
                </Typography>
                
                {/* Additional Info */}
                {product.subcategory && (
                  <Typography variant="body2" className="text-gray-600">
                    {product.subcategory}
                  </Typography>
                )}
              </div>
            </CardContent>
          </CardActionArea>
        </LinkContainer>

        {/* Action Buttons */}
        <CardActions className="p-6 pt-0 flex justify-between items-center">
          <div className="flex-1">
            {isAvailable && !inCart ? (
              <LinkContainer to="/cart">
                <CartButton 
                  product={product} 
                  size="small" 
                  color="primary"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Add to Cart
                </CartButton>
              </LinkContainer>
            ) : (
              <Button
                variant="secondary"
                className="w-full py-2 px-4 rounded-lg cursor-not-allowed opacity-50"
                disabled
              >
                Add to Cart
              </Button>
            )}
          </div>
          
          {/* Favorite Button */}
          {!isLoading && !FavIsLoading && (
            <Tooltip title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
              <IconButton 
                onClick={handleFavoriteClick}
                className={`ml-2 transition-all duration-300 hover:scale-110 ${
                  isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                {isFavorite ? <FaHeart size={20} style={{color: 'red'}}/> : <FaRegHeart size={20} />}
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </AnimatedCard>
    </div>
  );
};

export default ProductCard;
