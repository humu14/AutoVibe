import { useState } from "react";
import { FaShieldAlt, FaPhone, FaKey, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const OtpScreen = () => {
    const [otp, setOtp] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [user, setUser] = useState(null);

    const handleSendOTP = () => {
        if (!phone || phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }
        
        setLoading(true);
        // Simulate OTP sending
        setTimeout(() => {
            setLoading(false);
            setShowOTP(true);
            toast.success("OTP sent successfully!");
        }, 2000);
    };

    const handleVerifyOTP = () => {
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        
        setLoading(true);
        // Simulate OTP verification
        setTimeout(() => {
            setLoading(false);
            setUser({ phone });
            toast.success("OTP verified successfully!");
        }, 2000);
    };

    const handleResendOTP = () => {
        setOtp("");
        setShowOTP(false);
        toast.success("OTP resent successfully!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <Toaster 
                toastOptions={{ 
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }} 
            />
            
            <div className="w-full max-w-md">
                {user ? (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your phone number has been verified successfully.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-semibold text-gray-900">{user.phone}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaShieldAlt className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {showOTP ? 'Enter OTP' : 'Phone Verification'}
                            </h1>
                            <p className="text-gray-600">
                                {showOTP 
                                    ? 'We\'ve sent a 6-digit code to your phone'
                                    : 'Enter your phone number to receive a verification code'
                                }
                            </p>
                        </div>

                        {!showOTP ? (
                            /* Phone Input Section */
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaPhone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSendOTP}
                                    disabled={loading || !phone}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <FaSpinner className="w-5 h-5 animate-spin" />
                                            Sending OTP...
                                        </div>
                                    ) : (
                                        'Send OTP'
                                    )}
                                </button>
                            </div>
                        ) : (
                            /* OTP Input Section */
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter 6-digit OTP
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaKey className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            maxLength={6}
                                            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base text-center tracking-widest font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={loading || otp.length !== 6}
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <FaSpinner className="w-5 h-5 animate-spin" />
                                                Verifying...
                                            </div>
                                        ) : (
                                            'Verify OTP'
                                        )}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Didn't receive? Resend OTP
                                    </button>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => setShowOTP(false)}
                                        disabled={loading}
                                        className="text-gray-500 hover:text-gray-700 font-medium text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ← Back to phone input
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-xs text-gray-500">
                                By continuing, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OtpScreen;
