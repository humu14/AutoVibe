import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { 
  FaCar, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaShieldAlt, 
  FaTruck, 
  FaHeadset,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube
} from 'react-icons/fa';

const Footer = () => {
  const { userInfo } = useSelector(state => state.auth);

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <FaCar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  CarAccessories
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">
                Your premier destination for high-quality car accessories and automotive products. 
                We provide the best selection of premium car care and enhancement solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FaTruck className="w-4 h-4 text-white" />
                </div>
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <LinkContainer to="/allProducts">
                    <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                      All Products
                    </span>
                  </LinkContainer>
                </li>
                <li>
                  <LinkContainer to="/filter/featured">
                    <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                      Featured Products
                    </span>
                  </LinkContainer>
                </li>
                <li>
                  <LinkContainer to="/filter/ratingHigh">
                    <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                      Top Rated
                    </span>
                  </LinkContainer>
                </li>
                <li>
                  <LinkContainer to="/filter/stock">
                    <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                      In Stock
                    </span>
                  </LinkContainer>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <FaHeadset className="w-4 h-4 text-white" />
                </div>
                Support
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300 group">
                  <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                    <FaPhone className="w-4 h-4 text-blue-400 group-hover:text-white" />
                  </div>
                  <span className="group-hover:text-white transition-colors duration-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 group">
                  <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                    <FaEnvelope className="w-4 h-4 text-blue-400 group-hover:text-white" />
                  </div>
                  <span className="group-hover:text-white transition-colors duration-300">support@caraccessories.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 group">
                  <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                    <FaMapMarkerAlt className="w-4 h-4 text-blue-400 group-hover:text-white" />
                  </div>
                  <span className="group-hover:text-white transition-colors duration-300">123 Auto Street, Car City, CC 12345</span>
                </div>
              </div>
            </div>

            {/* Account & Admin */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <FaShieldAlt className="w-4 h-4 text-white" />
                </div>
                Account
              </h4>
              <ul className="space-y-3">
                {userInfo ? (
                  <>
                    <li>
                      <LinkContainer to="/profile">
                        <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                          <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                          My Profile
                        </span>
                      </LinkContainer>
                    </li>
                    <li>
                      <LinkContainer to={`/myorder/${userInfo._id}`}>
                        <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                          <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                          My Orders
                        </span>
                      </LinkContainer>
                    </li>
                    <li>
                      <LinkContainer to={`/favorites/${userInfo._id}`}>
                        <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                          <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                          My Favorites
                        </span>
                      </LinkContainer>
                    </li>
                    {userInfo.isAdmin && (
                      <li>
                        <LinkContainer to="/admin">
                          <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                            <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                            Admin Panel
                          </span>
                        </LinkContainer>
                      </li>
                    )}
                  </>
                ) : (
                  <>
                    <li>
                      <LinkContainer to="/login">
                        <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                          <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                          Login
                        </span>
                      </LinkContainer>
                    </li>
                    <li>
                      <LinkContainer to="/register">
                        <span className="text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                          <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                          Register
                        </span>
                      </LinkContainer>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Payment Methods */}
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FaCreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-300 font-medium">Secure Payment Methods</span>
              </div>
              
              {/* Policy Links */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 hover:underline">Privacy Policy</a>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 hover:underline">Terms of Service</a>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 hover:underline">Shipping Info</a>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 hover:underline">Returns</a>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="text-center mt-6 pt-6 border-t border-gray-700/30">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} CarAccessories. All rights reserved. 
                Premium car accessories for automotive enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
