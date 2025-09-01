import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { FaCreditCard, FaPaypal, FaLock, FaShieldAlt, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, shippingAddress, shippingPrice, taxPrice } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  const paymentMethods = [
    {
      id: 'PayPal',
      name: 'PayPal or Credit Card',
      description: 'Pay securely with PayPal or any major credit card',
      icon: <FaPaypal className="w-6 h-6 text-blue-600" />,
      benefits: ['Secure payment processing', 'Buyer protection', 'Multiple card types accepted'],
    },
  ];

  const totalPrice = (
    cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) +
    (shippingPrice || 0) +
    (taxPrice || 0)
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <FaCreditCard className="text-blue-600" />
            Payment Method
          </h1>
          <p className="text-xl text-gray-600">
            Choose your preferred payment method to complete your order
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Checkout Steps */}
        <div className="mb-12">
          <CheckoutSteps step1 step2 step3 />
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Payment Method</h2>
            <p className="text-gray-600">
              Choose how you'd like to pay for your order
            </p>
          </div>

          <Form onSubmit={submitHandler} className="space-y-6">
            <Form.Group>
              <Form.Label as="legend" className="text-lg font-semibold text-gray-800 mb-4">
                Available Payment Options
              </Form.Label>
              <Col>
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`mb-6 p-4 border rounded-xl cursor-pointer transition-colors duration-300
                      ${paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{method.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1"
                          />
                          <label className="text-lg font-semibold text-gray-900 cursor-pointer">
                            {method.name}
                          </label>
                        </div>
                        <p className="text-gray-600 mb-3">{method.description}</p>
                        <div className="space-y-1">
                          {method.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <FaShieldAlt className="w-4 h-4 text-green-500" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Col>
            </Form.Group>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaLock className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Secure Payment</h4>
                  <p className="text-green-700 text-sm">
                    Your payment information is encrypted and secure. We never store your credit card details.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{cartItems?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ${cartItems?.reduce((acc, item) => acc + item.qty * item.price, 0)?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">${(shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${(taxPrice || 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">${totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Continue to Review
                <FaArrowRight className="ml-2" />
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => navigate('/shipping')}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300 py-3 px-6 rounded-xl"
              >
                <FaArrowLeft className="mr-2" />
                Back to Shipping
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
