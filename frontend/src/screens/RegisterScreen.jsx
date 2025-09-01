import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, FormCheck } from "react-bootstrap";
import Formcontainer from "../components/Formcontainer";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation, useGoogleRegMutation } from '../slices/userApiSlice';
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import Message from "../components/Message";
import Grid from '@mui/material/Grid';
import Image from 'react-bootstrap/Image';
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from 'reactjs-social-login';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaUserCheck, FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAgeVerified, setIsAgeVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector(state => state.auth);
    const [register, { isLoading }] = useRegisterMutation();
    const [googleReg, { googleRegIsLoading }] = useGoogleRegMutation();

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else if (!isAgeVerified) {
            toast.error('Please acknowledge that you are 18 years or older.');
        } else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate('/login');
            } catch (err) {
                toast.error(err?.data?.message || err?.error);
            }
        }
    };

    const handleGoogleReg = async (response) => {
        if (response && response.provider === 'google') {
            const { email, name } = response.data;
            try {
                const res = await googleReg({ email, name }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate('/');
            } catch (err) {
                <Message variant='error'>{toast.error(err?.data?.message || err?.error)}</Message>
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Image */}
                    <div className="hidden lg:block">
                        <div className="text-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-3xl transform -rotate-3 opacity-20"></div>
                                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                                    <Image
                                        src='https://cdn-icons-png.flaticon.com/512/8521/8521787.png'
                                        alt='register image'
                                        fluid
                                        rounded
                                        className="w-64 h-64 mx-auto"
                                    />
                                    <div className="mt-6">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Join Our Community!</h3>
                                        <p className="text-gray-600">Create your account and start shopping for car accessories</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Registration Form */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUserPlus className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                            <p className="text-gray-600">Join us and discover amazing car accessories</p>
                        </div>

                        <Form onSubmit={submitHandler} className="space-y-6">
                            <Form.Group controlId='name'>
                                <Form.Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <FaUser className="w-4 h-4 text-purple-500" />
                                    Full Name
                                </Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Enter your full name' 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId='email'>
                                <Form.Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <FaEnvelope className="w-4 h-4 text-purple-500" />
                                    Email Address
                                </Form.Label>
                                <Form.Control 
                                    type='email' 
                                    placeholder='Enter your email address' 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId='password'>
                                <Form.Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <FaLock className="w-4 h-4 text-purple-500" />
                                    Password
                                </Form.Label>
                                <div className="relative">
                                    <Form.Control 
                                        type={showPassword ? 'text' : 'password'} 
                                        placeholder='Create a strong password' 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 h-12 text-base pr-12"
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

                            <Form.Group controlId='cPassword'>
                                <Form.Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <FaLock className="w-4 h-4 text-purple-500" />
                                    Confirm Password
                                </Form.Label>
                                <div className="relative">
                                    <Form.Control 
                                        type={showConfirmPassword ? 'text' : 'password'} 
                                        placeholder='Confirm your password' 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 h-12 text-base pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </Form.Group>

                            <Form.Group controlId='ageVerification'>
                                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <FormCheck
                                        type="checkbox"
                                        checked={isAgeVerified}
                                        onChange={(e) => setIsAgeVerified(e.target.checked)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <label className="text-sm font-medium text-purple-900 flex items-center gap-2">
                                            <FaUserCheck className="w-4 h-4" />
                                            Age Verification
                                        </label>
                                        <p className="text-xs text-purple-700 mt-1">
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
                                className='w-full h-12 bg-gradient-to-r from-purple-500 to-blue-600 border-0 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>

                            {/* Google Registration */}
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
                                    Already have an account?{' '}
                                    <Link 
                                        to='/login' 
                                        className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
                                    >
                                        Sign in here
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

export default RegisterScreen;
