import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import MonthlySales from '../../components/MonthlySales.jsx';
import TopProductBySale from '../../components/TopProductBySale.jsx';
import TopCategoryBySale from '../../components/TopCategoryBySale.jsx';
import { FaChartLine, FaBox, FaTags, FaDollarSign, FaChartBar, FaChartPie, FaArrowUp } from 'react-icons/fa';

const SalesScreen = () => {
  return (
    <>
      <AdminPanelScreen />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
              <FaChartLine className="text-blue-600" />
              Sales Analytics & Insights
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive overview of your business performance and revenue trends
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaArrowUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$24,500</p>
                  <p className="text-xs text-green-600">+12.5% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaDollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
                  <p className="text-2xl font-bold text-gray-900">$8,200</p>
                  <p className="text-xs text-green-600">+8.3% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaBox className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-green-600">+15.2% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FaChartBar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">3.2%</p>
                  <p className="text-xs text-green-600">+0.8% from last month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-8">
            {/* Monthly Sales Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaChartLine className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Monthly Sales Trend</h3>
                    <p className="text-gray-600">Revenue performance over the last 12 months</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Revenue</span>
                </div>
              </div>
              <div className="h-96">
                <MonthlySales />
              </div>
            </div>

            {/* Top Products and Categories Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Products by Sales */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaBox className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Top Products</h3>
                    <p className="text-gray-600">Best performing products by sales volume</p>
                  </div>
                </div>
                <div className="h-80">
                  <TopProductBySale />
                </div>
              </div>

              {/* Top Categories by Sales */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FaTags className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Top Categories</h3>
                    <p className="text-gray-600">Most profitable product categories</p>
                  </div>
                </div>
                <div className="h-80">
                  <TopCategoryBySale />
                </div>
              </div>
            </div>

            {/* Additional Insights */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FaChartPie className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Business Insights</h3>
                  <p className="text-gray-600">Key metrics and performance indicators</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Peak Sales Hours</h4>
                  <p className="text-blue-700">2:00 PM - 6:00 PM</p>
                  <p className="text-sm text-blue-600 mt-1">Most active shopping period</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-2">Customer Retention</h4>
                  <p className="text-green-700">78.5%</p>
                  <p className="text-sm text-green-600 mt-1">Repeat customer rate</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-purple-900 mb-2">Average Order Value</h4>
                  <p className="text-purple-700">$157.20</p>
                  <p className="text-sm text-purple-600 mt-1">Per customer transaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesScreen;
