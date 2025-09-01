import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col, FormCheck } from "react-bootstrap";
import Formcontainer from "../components/Formcontainer";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useGoogleLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from "../slices/authSlice";
import { setOtpVerified, clearOtpVerified } from "../slices/otpSlice";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import Message from "../components/Message";
import Grid from '@mui/material/Grid';
import Image from 'react-bootstrap/Image';
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from 'reactjs-social-login';
import { FaSignInAlt, FaEnvelope, FaLock, FaUserCheck, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [result, setResult] = useState(null);

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { googleLoginIsLoading }] = useGoogleLoginMutation();

  const { userInfo } = useSelector(state => state.auth);
  const { otpInfo } = useSelector(state => state.otpInfo);

  useEffect(() => {
    if (otpInfo && !userInfo) {
      dispatch(setCredentials({ ...otpInfo }));
      dispatch(setOtpVerified(null));
      navigate(location.state?.from || '/');
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, []);

  const navigateToPort3001 = () => {
    window.location.href = 'https://thlab.techavens.com/';
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isAgeVerified) {
      toast.error('Please acknowledge that you are 18 years or older.');
      return;
    }
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(location.state?.from || '/');
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="hidden lg:block">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl transform rotate-3 opacity-20"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <Image
                    src='https://cdn-icons-png.flaticon.com/512/2250/2250207.png'
                    alt='login image'
                    fluid
                    rounded
                    className="w-64 h-64 mx-auto"
                  />
                  <div className="mt-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h3>
                    <p className="text-gray-600">Sign in to access your car accessories account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSignInAlt className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
              <p className="text-gray-600">Access your account to continue shopping</p>
            </div>

            <Form onSubmit={submitHandler} className="space-y-6">
              <Form.Group controlId='email'>
                <Form.Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4 text-blue-500" />
                  Email Address
                </Form.Label>
                <Form.Control 
                  type='email' 
                  placeholder='Enter your email address' 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                  required
                />
              </Form.Group>

              <Form.Group controlId='password'>
                <Form.Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaLock className="w-4 h-4 text-blue-500" />
                  Password
                </Form.Label>
                <div className="relative">
                  <Form.Control 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder='Enter your password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 h-12 text-base pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
              </Form.Group>

              <Form.Group controlId='ageVerification'>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <FormCheck
                    type="checkbox"
                    checked={isAgeVerified}
                    onChange={(e) => setIsAgeVerified(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <label className="text-sm font-medium text-blue-900 flex items-center gap-2">
                      <FaUserCheck className="w-4 h-4" />
                      Age Verification
                    </label>
                    <p className="text-xs text-blue-700 mt-1">
                      I confirm that I am 18 years or older and agree to the terms of service
                    </p>
                  </div>
                </div>
              </Form.Group>

              {isLoading && (
                <div className="flex justify-center">
                  <Loader />
                </div>
              )}

              <Button 
                type='submit' 
                variant='primary' 
                className='w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg'
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Google Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLoginButton
                  className="w-full h-12 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                />
              </div>

              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to='/register' 
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
