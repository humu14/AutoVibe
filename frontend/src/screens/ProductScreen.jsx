import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Paper, Button, Box } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import { useGetProductByIdQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import { Row, Col, Form } from 'react-bootstrap';
import { cartAdd } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LinkContainer } from 'react-router-bootstrap';
import Rating from '@mui/material/Rating';
import { useCreateReviewMutation, useGetReviewQuery } from '../slices/reviewApiSlice';
import Message from '../components/Message';
import Footer from '../components/Footer';
import { useGetFavoriteQuery } from '../slices/userApiSlice';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';



const ProductScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { id: productId } = useParams();
  const { userInfo } = useSelector(state => state.auth);
  const { data, isLoading, refetch: refetchProduct, error } = useGetProductByIdQuery(productId);
  const [cartItems, setCartItems] = useState([]);
  const [quan, setQuan] = useState();

  const imageBaseUrl = 'http://localhost:5000/uploads/';

  useEffect(() => {
    const prevQuan = cartItems.find((item) => item._id === productId)?.qty || 1;
    setQuan(prevQuan);
  }, [cartItems, productId]);

  const fadeInProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const dispatch = useDispatch();
  const addToCartHandler = async (product, qty) => {
    dispatch(cartAdd({ ...product, qty }));
    toast.success(`${product.name} added to cart`);
  };

  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${imageBaseUrl}${imagePath}`;
  };


  const [createReview, { isLoading: reviewSubmitLoading }] = useCreateReviewMutation();
  const { data: reviewData, isLoading: reviewSuccess, refetch: refetchReviews } = useGetReviewQuery(productId);
  const [hasReviewed, setHasReviewed] = useState(false);


  const [isFavorite, setIsFavorite] = useState(false);
  const { data: favProducts, FavIsLoading, refetch, favError } = useGetFavoriteQuery();

  useEffect(() => {
    if (userInfo && reviewData) {
      const hasReviewed = reviewData.some(review => review.user && review.user._id === userInfo._id);
      setHasReviewed(hasReviewed);
    }
  }, [userInfo, reviewData]);



  useEffect(() => {
    if (favProducts && userInfo && !FavIsLoading && !favError) {
      const index = favProducts && data ? favProducts.findIndex((item) => item._id === data._id) : -1;
      if (index !== -1) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  }, [favProducts, data]);



  const submitHandler = async (e) => {
    e.preventDefault();
    if (rating == 0 || comment === '') {
      toast.error('Please fill all the fields');
      return;
    }
    try {
      const res = await createReview({ rating, comment, productId }).unwrap();
      if (res) {
        if (res.data.flag) {
          setHasReviewed(true);
          toast.error('You have already reviewed the product');
          refetchReviews();
          refetchProduct();
        } else {
          toast.success('Review added successfully');
          setRating(0);
          setComment('');
          setHasReviewed(true);
          refetchReviews();
        }
      } else {
        toast.error('Something went wrong');
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error?.data?.message || error?.error || 'Failed to submit review');
      setRating(0);
      setComment('');
      refetchReviews();
      refetchProduct();
    }
  };
  //   useEffect(() => {
  //     refetchReviews();
  // });


  function calculateTimeAgo(createdAt) {
    const commentDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - commentDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
  }

  // if(reviewData && reviewData.length > 0){
  //   setInterval(() => {
  //   const createdAt = reviewData.createdAt;
  //   const timeAgo = calculateTimeAgo(createdAt);
  // }, 10000);
  // }

  return (
    <div>

      <Box paddingTop="100px">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">
            {error?.data?.message || error?.error || 'An error occurred while loading the product'}
          </Message>
        ) : (
          <animated.div style={fadeInProps}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <img
                  src={getImageUrl(data.image)}
                  alt={data.name}
                  style={{ width: '100%', height: 'auto', maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper style={{ height: '100%', padding: '20px' }}>
                  <Grid item style={{ paddingBottom: '10px' }}>
                    {data.countInStock > 0 ? (
                      <Typography variant="body2" style={{ color: 'green' }}>
                        <b>In Stock</b>
                      </Typography>
                    ) : (
                      <Typography variant="body2" style={{ color: 'red' }}>
                        <b>Out of Stock</b>
                      </Typography>
                    )}
                    {/* {data.verifiedProduct ? (
                      <>
                        <DoneAllIcon sx={{ fontSize: 14, color: 'green', fontWeight: 'bold' }} />
                        <span style={{ marginLeft: 5, color: 'green', fontSize: 12 }}>Verified</span>
                      </>
                    ) : (
                      <>
                        <GppMaybeIcon sx={{ fontSize: 14, color: 'red', fontWeight: 'bold' }} />
                        <span style={{ marginLeft: 5, color: 'red', fontSize: 12 }}>Not Verified</span>
                      </>
                    )} */}
                    <Typography>
                      <div style={{ marginTop: '10px' }}>
                        <LinkContainer to={`/${data.category}`} style={{ cursor: 'pointer', color: "blue" }}>
                          <b>{data.category.toUpperCase()}</b>
                        </LinkContainer>
                      </div>
                    </Typography>
                  </Grid>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Typography variant="h6">
                        {data.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">
                        <h6>{data.description}</h6>
                      </Typography>
                    </Grid>
                    {/* <Box
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '10px',
                        backgroundColor: '#c0c0c0', // Replace with your desired background color
                      }}
                    >
                      <Grid item container>
                        {data.style && (
                          <Grid item sx={{ marginRight: '10px' }}>
                            <Typography variant="subtitle1" sx={{ fontSize: 'small', fontWeight: 'bold', color: 'primary.main' }}>
                              Style: {data.style.toUpperCase()}
                            </Typography>
                          </Grid>
                        )}
                        {data.subject && (
                          <Grid item sx={{ marginRight: '10px' }}>
                            <Typography variant="subtitle1" sx={{ fontSize: 'small', fontWeight: 'bold', color: 'secondary.main' }}>
                              Subject: {data.subject.toUpperCase()}
                            </Typography>
                          </Grid>
                        )}
                        {data.medium && (
                          <Grid item>
                            <Typography variant="subtitle1" sx={{ fontSize: 'small', fontWeight: 'bold', color: 'text.secondary' }}>
                              Medium: {data.medium.toUpperCase()}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box> */}

                    {isFavorite && userInfo &&
                      <>
                        <Grid item>
                          <div>
                            <Message variant='info'>
                              <b>
                                This product is in your
                                <LinkContainer to={`/favorites/${userInfo._id}`}
                                  style={{ color: 'blue', cursor: 'pointer', }}>
                                  <span> Favorites list </span>
                                </LinkContainer>
                                <FaHeart className="text-red-500 ml-1" />
                              </b>
                            </Message>
                          </div>
                        </Grid>
                      </>
                    }
                    <Grid item>
                      <Row>
                        <Col sm={2}>
                          <Typography variant="body1">Rating: </Typography>
                        </Col>
                        <Col>
                          <Rating value={data.rating} precision={0.5} readOnly />
                        </Col>
                      </Row>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">Price: <b>${data.price}</b></Typography>
                    </Grid>
                    {data.countInStock > 0 && (
                      <Grid item>
                        <Row>
                          <Col>
                            <h6>Quantity:</h6>
                          </Col>
                          <Col>
                            <Form.Control
                              as="select"
                              value={quan}
                              onChange={(e) => setQuan(Number(e.target.value))}
                              style={{ width: '100px' }}
                            >
                              {[...Array(data.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </Form.Control>
                          </Col>
                        </Row>
                      </Grid>
                    )}

                    <Grid item>
                      <Col>
                        {data.countInStock > 0 && (
                          <h6>Total: ${(quan * data.price).toFixed(2)}</h6>
                        )}
                      </Col>
                    </Grid>
                    {data.countInStock > 0 && (
                      <Grid item style={{ marginLeft: '-10px' }}>
                        <Button onClick={() => addToCartHandler(data, quan)} style={{ backgroundColor: '#0d6efd', color: 'white' }}>Add to Cart</Button>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </animated.div>
        )}
      </Box>
      
      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Customer Reviews */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Customer Reviews</h3>
            
            {reviewSuccess && <Loader />}
            
            {reviewData && reviewData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No reviews yet</div>
                <p className="text-gray-400 mt-2">Be the first to review this product!</p>
              </div>
            )}
            
            {reviewData && reviewData.map((review) => (
              <div key={review._id} className="border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {review.user && review.user.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {review.user && review.user.name ? review.user.name.toUpperCase() : "User not found"}
                      </div>
                      <div className="text-sm text-gray-500">{calculateTimeAgo(review.createdAt)}</div>
                    </div>
                  </div>
                  <Rating value={review.rating} readOnly size="small" className="text-yellow-400" />
                </div>
                
                <div className="text-gray-700 leading-relaxed">
                  {review.comment}
                </div>
              </div>
            ))}
          </div>
          
          {/* Write Review */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">Write a Review</h3>
            <p className="text-gray-600 text-center mb-8">Share your thoughts with other customers</p>
            
            {reviewSubmitLoading && <Loader />}
            
            {hasReviewed ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-green-800 font-medium">✓ You have already reviewed this product</div>
              </div>
            ) : userInfo ? (
              <Form onSubmit={submitHandler} className="space-y-6">
                <Form.Group controlId="rating">
                  <Form.Label className="block text-gray-700 font-medium mb-3">Rating</Form.Label>
                  <div className="flex justify-center">
                    <Rating
                      name="simple-controlled"
                      value={rating}
                      precision={0.5}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      disabled={hasReviewed}
                      size="large"
                      className="text-yellow-400"
                    />
                  </div>
                </Form.Group>
                
                <Form.Group controlId="comment">
                  <Form.Label className="block text-gray-700 font-medium mb-3">Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 resize-none"
                    placeholder="Share your experience with this product..."
                  />
                </Form.Group>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Submit Review
                </Button>
              </Form>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
                <div className="text-blue-800 font-medium mb-4">Please login to submit a review</div>
                <LinkContainer to="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl">
                    Login
                  </Button>
                </LinkContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
