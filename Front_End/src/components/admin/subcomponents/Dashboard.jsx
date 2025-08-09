import { useAdminDashboard } from '../../../hooks/useAdmin';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
const Dashboard = () => {
  const { data: response = {}, isLoading, error } = useAdminDashboard();
  const stats = response || {};

  console.log('Dashboard response:', response);
  console.log('Dashboard stats:', stats);
  console.log('Dashboard loading:', isLoading);
  console.log('Dashboard error:', error);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />
      <RecentActivity
        recentOrders={stats?.recentOrders} 
        topProducts={stats?.topProducts} 
      />
    </div>
  );
};

export default Dashboard;