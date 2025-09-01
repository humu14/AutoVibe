import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaShoppingCart, FaCreditCard, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-12 left-0 w-full h-3 bg-gray-200 rounded-full"></div>
        
        {/* Progress Bar Fill */}
        <div className="absolute top-12 left-0 h-3 bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
             style={{ 
               width: step4 ? '100%' : step3 ? '75%' : step2 ? '50%' : step1 ? '25%' : '0%' 
             }}>
        </div>
        
        {/* Steps Container - Now in different rows with better spacing */}
        <div className="relative z-10 grid grid-cols-4 gap-12">
          {/* Step 1: Cart */}
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl transition-all duration-500 ${
              step1 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-110 ring-4 ring-green-200' : 'bg-gray-200 text-gray-500'
            }`}>
              {step1 ? <FaCheckCircle className="w-10 h-10" /> : '1'}
            </div>
            <span className={`text-lg mt-6 font-semibold text-center max-w-32 leading-tight ${
              step1 ? 'text-green-600' : 'text-gray-500'
            }`}>
              Shopping Cart
            </span>
            {step1 && (
              <div className="mt-4 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Step 2: Shipping */}
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl transition-all duration-500 ${
              step2 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-110 ring-4 ring-green-200' : 'bg-gray-200 text-gray-500'
            }`}>
              {step2 ? <FaCheckCircle className="w-10 h-10" /> : '2'}
            </div>
            <span className={`text-lg mt-6 font-semibold text-center max-w-32 leading-tight ${
              step2 ? 'text-green-600' : 'text-gray-500'
            }`}>
              Shipping Address
            </span>
            {step2 && (
              <div className="mt-4 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Step 3: Payment */}
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl transition-all duration-500 ${
              step3 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-110 ring-4 ring-green-200' : 'bg-gray-200 text-gray-500'
            }`}>
              {step3 ? <FaCheckCircle className="w-10 h-10" /> : '3'}
            </div>
            <span className={`text-lg mt-6 font-semibold text-center max-w-32 leading-tight ${
              step3 ? 'text-green-600' : 'text-gray-500'
            }`}>
              Payment Method
            </span>
            {step3 && (
              <div className="mt-4 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Step 4: Confirmation */}
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl transition-all duration-500 ${
              step4 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-110 ring-4 ring-green-200' : 'bg-gray-200 text-gray-500'
            }`}>
              {step4 ? <FaCheckCircle className="w-10 h-10" /> : '4'}
            </div>
            <span className={`text-lg mt-6 font-semibold text-center max-w-32 leading-tight ${
              step4 ? 'text-green-600' : 'text-gray-500'
            }`}>
              Order Review
            </span>
            {step4 && (
              <div className="mt-4 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Step Status Text */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-full shadow-lg">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold text-gray-800">
              {step4 ? 'Ready to place order' : 
               step3 ? 'Review your order details' : 
               step2 ? 'Choose payment method' : 
               step1 ? 'Add shipping address' : 
               'Start shopping'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;