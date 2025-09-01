import React, { useState, useEffect, useRef } from 'react';
import { useGetCategoryQuery } from '../slices/productsApiSlice';
import Loader from './Loader';
import { LinkContainer } from 'react-router-bootstrap';
import Logo from '../../../uploads/logo.webp';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import UserAvatar from './UseAvatar';
import { 
  FaUser, 
  FaHeart, 
  FaBox, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaShoppingCart,
  FaUserShield,
  FaHome
} from 'react-icons/fa';


const HeaderBar = () => {
    const navigate = useNavigate();
    const { data: categories, isLoading, isError, error } = useGetCategoryQuery();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { userInfo } = useSelector(state => state.auth);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const [logoutApiCall] = useLogoutMutation();
    const dispatch = useDispatch();
    
    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/');
            closeSidebar();
        } catch (err) {
            toast.error(err?.data?.message || err?.error);
        }
    };

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        setCartCount(cartItems.length);
    }, [cartItems]);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef2 = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen && !event.target.closest('#sidebar') && !event.target.closest('#sidebar-toggle')) {
                closeSidebar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className="relative">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="px-4 py-3 lg:px-6">
                    <div className="flex items-center justify-between">
                        {/* Left Section - Logo and Menu Button */}
                        <div className="flex items-center space-x-4">
                            <button
                                id="sidebar-toggle"
                                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                onClick={toggleSidebar}
                            >
                                <FaBars className="w-5 h-5" />
                            </button>
                            
                            <LinkContainer to="/">
                                <div className="flex items-center space-x-3 cursor-pointer">
                                    <img src={Logo} className="h-8 w-8" alt="BASHPO" />
                                    <span className="text-xl font-bold text-gray-900 hidden sm:block">BASHPO</span>
                                </div>
                            </LinkContainer>
                        </div>

                        {/* Center Section - Search Bar (hidden on mobile) */}
                        <div className="hidden lg:block flex-1 max-w-xl mx-8">
                            <SearchBar />
                        </div>

                        {/* Right Section - User Menu and Cart */}
                        <div className="flex items-center space-x-3">
                            {/* Cart Icon */}
                            <Link to="/cart" className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                                <FaShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {userInfo ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        className="flex items-center space-x-2 p-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
                                        onClick={handleToggleDropdown}
                                    >
                                        <UserAvatar name={userInfo.name} />
                                        <span className="hidden sm:block text-sm font-medium text-gray-700">
                                            {userInfo.name}
                                        </span>
                                    </button>
                                    
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-900">{userInfo.name}</p>
                                                <p className="text-sm text-gray-500">{userInfo.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <LinkContainer to={`/favorites/${userInfo._id}`}>
                                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                                        <FaHeart className="w-4 h-4" />
                                                        <span>My Favorites</span>
                                                    </button>
                                                </LinkContainer>
                                                <LinkContainer to={`/myorder/${userInfo._id}`}>
                                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                                        <FaBox className="w-4 h-4" />
                                                        <span>My Orders</span>
                                                    </button>
                                                </LinkContainer>
                                                <LinkContainer to="/profile">
                                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                                        <FaUser className="w-4 h-4" />
                                                        <span>Update Profile</span>
                                                    </button>
                                                </LinkContainer>
                                                <div className="border-t border-gray-100 my-1"></div>
                                                <button 
                                                    onClick={logoutHandler}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                                >
                                                    <FaSignOutAlt className="w-4 h-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <LinkContainer to="/login">
                                        <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                            Login
                                        </button>
                                    </LinkContainer>
                                    <LinkContainer to="/register">
                                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200">
                                            Register
                                        </button>
                                    </LinkContainer>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Search Bar */}
            <div className="lg:hidden fixed top-16 z-40 w-full bg-white border-b border-gray-200 px-4 py-3">
                <SearchBar />
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                id="sidebar"
                className={`fixed top-0 left-0 z-50 h-screen w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Sidebar Header */}
                <LinkContainer to="/" style={{cursor: 'pointer'}}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                            <img src={Logo} className="h-6 w-6" alt="AutoVibe" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">AutoVibe</span>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>
                </LinkContainer>
                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Admin Panel */}
                        {userInfo && userInfo.admin && (
                            <LinkContainer to="/admin/userslist" style={{cursor: 'pointer'}}>
                            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
                                <LinkContainer to="/admin/userslist" style={{cursor: 'pointer'}}>
                                    <button className="w-full flex items-center space-x-3 text-left">
                                        <FaUserShield className="w-5 h-5" />
                                        <span className="font-semibold">Admin Panel</span>
                                    </button>
                                </LinkContainer>
                            </div>
                            </LinkContainer>
                        )}

                        {/* Categories */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
                            {isLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader />
                                </div>
                            ) : error ? (
                                <div className="text-center py-4 text-gray-500">Failed to load categories</div>
                            ) : (
                                <div className="space-y-1">
                                    {Array.isArray(categories) && categories.map((category) => (
                                        <LinkContainer key={category} to={`/${category}`}>
                                            <button 
                                                onClick={closeSidebar}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 flex items-center space-x-3 group"
                                            >
                                                <span className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                                                <span className="font-medium">{category}</span>
                                            </button>
                                        </LinkContainer>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Links</h3>
                            <div className="space-y-1">
                                <Link to="/" onClick={closeSidebar} style={{cursor: 'pointer'}} className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200">
                                    <FaHome className="w-4 h-4 text-blue-500" />
                                    <span>Home</span>
                                </Link>
                                {userInfo && (
                                    <>
                                        <LinkContainer to={`/favorites/${userInfo._id}`} style={{cursor: 'pointer'}}>
                                            <button 
                                                onClick={closeSidebar}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center space-x-2"
                                            >
                                                <FaHeart className="w-4 h-4 text-red-500" />
                                                <span>Favorites</span>
                                            </button>
                                        </LinkContainer>
                                        <LinkContainer to={`/myorder/${userInfo._id}`} style={{cursor: 'pointer'}}>
                                            <button 
                                                onClick={closeSidebar}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center space-x-2"
                                            >
                                                <FaBox className="w-4 h-4 text-blue-500" />
                                                <span>My Orders</span>
                                            </button>
                                        </LinkContainer>
                                        <LinkContainer to="/profile" style={{cursor: 'pointer'}}>
                                            <button 
                                                onClick={closeSidebar}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center space-x-2"
                                            >
                                                <FaUser className="w-4 h-4 text-green-500" />
                                                <span>Profile</span>
                                            </button>
                                        </LinkContainer>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default HeaderBar;
