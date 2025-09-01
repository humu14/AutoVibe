import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify'
import Loader from "../components/Loader";
import { useUpdateUserMutation } from '../slices/userApiSlice';
import Grid from '@mui/material/Grid';
import Image from 'react-bootstrap/Image';
import { FaUser, FaEnvelope, FaLock, FaSave, FaUserEdit } from 'react-icons/fa';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    const { userInfo } = useSelector(state => state.auth);
    const [updateProfile, { isLoading }] = useUpdateUserMutation();

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
    }, [userInfo.setName, userInfo.setEmail]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password != confirmPassword) {
            toast.error('Passwords do not match');
        }
        else {
            if (password.length <= 0) {
                toast.error('Please enter your password');
            } else {
                try {
                    const res = await updateProfile({
                        _id: userInfo._id,
                        name,
                        email,
                        password
                    }).unwrap();
                    dispatch(setCredentials({ ...res }))
                    toast.success('Profile Updated Successfully');
                } catch (err) {
                    toast.error(err?.data?.message || err?.error);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
                        <FaUserEdit className="text-blue-600" />
                        Update Profile
                    </h1>
                    <p className="text-xl text-gray-600">
                        Keep your account information up to date
                    </p>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Profile Image Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                            <div className="mb-6">
                                <Image
                                    src='https://cdn-icons-png.flaticon.com/512/6269/6269970.png'
                                    alt='Profile Avatar'
                                    fluid
                                    rounded
                                    className="w-32 h-32 mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold text-gray-900">{userInfo.name}</h3>
                                <p className="text-gray-600">{userInfo.email}</p>
                            </div>
                            
                            <div className="space-y-3 text-left">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <FaUser className="text-blue-500" />
                                    <span>Member since {new Date(userInfo.createdAt || Date.now()).getFullYear()}</span>
                                </div>
                                {userInfo.isAdmin && (
                                    <div className="flex items-center gap-3 text-sm text-purple-600">
                                        <FaUser className="text-purple-500" />
                                        <span>Administrator</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <FaUserEdit className="text-blue-600" />
                                Profile Information
                            </h2>

                            <Form onSubmit={submitHandler} className="space-y-6">
                                <Form.Group controlId='name'>
                                    <Form.Label className="flex items-center gap-2 text-gray-700 font-medium">
                                        <FaUser className="text-blue-500" />
                                        Full Name
                                    </Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter your full name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 py-3"
                                    />
                                </Form.Group>

                                <Form.Group controlId='email'>
                                    <Form.Label className="flex items-center gap-2 text-gray-700 font-medium">
                                        <FaEnvelope className="text-blue-500" />
                                        Email Address
                                    </Form.Label>
                                    <Form.Control
                                        type='email'
                                        placeholder='Enter your email address'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 py-3"
                                    />
                                </Form.Group>

                                <Form.Group controlId='password'>
                                    <Form.Label className="flex items-center gap-2 text-gray-700 font-medium">
                                        <FaLock className="text-blue-500" />
                                        New Password
                                    </Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder='Enter new password (or current password to keep unchanged)'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 py-3"
                                    />
                                    <Form.Text className="text-gray-500 text-sm">
                                        If you don't want to change your password, just retype your current password
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId='cPassword'>
                                    <Form.Label className="flex items-center gap-2 text-gray-700 font-medium">
                                        <FaLock className="text-blue-500" />
                                        Confirm New Password
                                    </Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder='Confirm your new password'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 py-3"
                                    />
                                </Form.Group>

                                {isLoading && (
                                    <div className="flex justify-center">
                                        <Loader />
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type='submit'
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        <FaSave className="mr-2" />
                                        Update Profile
                                    </Button>
                                    
                                    <Link to="/" className="flex-1">
                                        <Button
                                            variant="outline-secondary"
                                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-300 py-3 px-6 rounded-xl"
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
