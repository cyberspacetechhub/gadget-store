import { ArrowPathIcon } from '@heroicons/react/24/outline';

const AdminForbidden = () => {
  const handleReload = () => {
    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-red-600">403</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Access Forbidden</h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this admin page.
          </p>
          <div className="mt-6">
            <button
              onClick={handleReload}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Reload Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForbidden;