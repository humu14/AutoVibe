import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { toast } from 'react-toastify';
import { saveShippingAddress, saveUser } from '../slices/cartSlice';
import { FaMapMarkerAlt, FaCity, FaGlobe, FaMailBulk, FaArrowRight, FaTruck } from 'react-icons/fa';

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(saveUser({ userInfo }));
    toast.success('Shipping Address Saved');
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <FaMapMarkerAlt className="text-blue-600" />
            Shipping Address
          </h1>
          <p className="text-xl text-gray-600">
            Enter your delivery address to continue with checkout
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Checkout Steps */}
        <div className="mb-12">
          <CheckoutSteps step1 step2 />
        </div>

        {/* Shipping Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Address</h2>
            <p className="text-gray-600">
              Please enter your complete shipping address for accurate delivery
            </p>
          </div>

          <Form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Group controlId="address">
                <Form.Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaMapMarkerAlt className="text-blue-500" />
                  Street Address
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your street address"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                  className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 py-3"
                />
              </Form.Group>

              <Form.Group controlId="city">
                <Form.Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaCity className="text-blue-500" />
                  City
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your city"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                  className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 py-3"
                />
              </Form.Group>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Group controlId="postalCode">
                <Form.Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaMailBulk className="text-blue-500" />
                  Postal Code
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter postal code"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 py-3"
                />
              </Form.Group>

              <Form.Group controlId="country">
                <Form.Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaGlobe className="text-blue-500" />
                  Country
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your country"
                  value={country}
                  required
                  onChange={(e) => setCountry(e.target.value)}
                  className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 py-3"
                />
              </Form.Group>
            </div>

            {/* Shipping Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaTruck className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Shipping Information</h4>
                  <p className="text-blue-700 text-sm">
                    Standard shipping takes 3-5 business days. Express shipping available for additional cost.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Continue to Payment
                <FaArrowRight className="ml-2" />
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => navigate('/cart')}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300 py-3 px-6 rounded-xl"
              >
                Back to Cart
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ShippingScreen;
