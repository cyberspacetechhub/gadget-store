import { useState } from 'react';
import { useAnalytics } from '../../../hooks/useAnalytics';
import LineChart from '../../common/charts/LineChart';
import BarChart from '../../common/charts/BarChart';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const { data: analytics = {}, isLoading } = useAnalytics(timeRange);
  console.log('Analytics data:', analytics);
  const analyticsData = analytics?.data?.data;

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const analyticsCards = [
    {
      title: 'Total Revenue',
      value: `₦${analyticsData?.revenue?.current?.toLocaleString() || '0'}`,
      change: analyticsData?.revenue?.change || '+0%',
      changeType: analyticsData?.revenue?.change?.startsWith('-') ? 'decrease' : 'increase',
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'vs previous period'
    },
    {
      title: 'Total Orders',
      value: analyticsData?.orders?.current?.toLocaleString() || '0',
      change: analyticsData?.orders?.change || '+0%',
      changeType: analyticsData?.orders?.change?.startsWith('-') ? 'decrease' : 'increase',
      icon: ShoppingBagIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'total orders'
    },
    {
      title: 'New Customers',
      value: analyticsData?.customers?.current?.toLocaleString() || '0',
      change: analyticsData?.customers?.change || '+0%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'new customers'
    },
    {
      title: 'Conversion Rate',
      value: `${analyticsData?.conversionRate || 0}%`,
      change: '-0.12%',
      changeType: 'decrease',
      icon: ArrowTrendingUpIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'visitor to customer'
    }
  ];

  const topCategories = analyticsData?.topCategories || [];

  const recentMetrics = [
    { metric: 'Bounce Rate', value: `${analyticsData?.bounceRate || 0}%`, change: '-2.3%', trend: 'down' },
    { metric: 'Conversion Rate', value: `${analyticsData?.conversionRate || 0}%`, change: '+0.5%', trend: 'up' },
    { metric: 'Avg Order Value', value: `₦${analyticsData?.avgOrderValue || 0}`, change: '+5.2%', trend: 'up' },
    { metric: 'Revenue Growth', value: analyticsData?.revenue?.change || '+0%', change: analyticsData?.revenue?.change || '+0%', trend: 'up' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative">
            <CalendarIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="py-2 pl-10 pr-4 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map((card, index) => (
          <div key={index} className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${card.bgColor} border border-gray-100`}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="mb-2 text-2xl font-bold text-gray-900">{card.value}</p>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      card.changeType === 'increase' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {card.changeType === 'increase' ? (
                        <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                      )}
                      {card.change}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">{card.description}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${card.color.replace('text-', 'bg-').replace('-600', '-500')}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Categories */}
        <div className="bg-white border border-gray-100 shadow-lg rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl">
            <h3 className="flex items-center text-lg font-semibold text-gray-900">
              <ChartBarIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Top Categories
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 transition-colors rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 text-sm font-bold text-white rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₦{category.revenue?.toLocaleString()}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {category.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white border border-gray-100 shadow-lg rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
            <h3 className="flex items-center text-lg font-semibold text-gray-900">
              <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-600" />
              Key Metrics
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 transition-colors rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.metric}</p>
                    <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      metric.trend === 'up' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {metric.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                      )}
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-gray-100 shadow-lg rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
        </div>
        <div className="p-6">
          <div className="h-64">
            <LineChart
              data={{
                labels: analyticsData?.revenueByDay?.map(item => new Date(item._id).toLocaleDateString()) || [],
                datasets: [
                  {
                    label: 'Revenue',
                    data: analyticsData?.revenueByDay?.map(item => item.revenue) || [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: function(value) {
                        return '₦' + value.toLocaleString();
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;