import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import { useDeleteOrder, useBulkDeleteOrders } from '../../../hooks/useOrders';
import LoadingSpinner from '../../common/LoadingSpinner';
import OrderStatusModal from './OrderStatusModal';
import PaymentStatusModal from './PaymentStatusModal';
import DeleteOrderModal from './DeleteOrderModal';
import BulkDeleteModal from './BulkDeleteModal';
import toast from 'react-hot-toast';

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  
  const { auth } = useAuth();
  const fetch = useFetch();
  const deleteOrder = useDeleteOrder();
  const bulkDeleteOrders = useBulkDeleteOrders();

  const { data, isLoading, refetch } = useQuery(
    ['admin-orders', currentPage, searchTerm, statusFilter],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });
      
      return await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders/admin?${params}`,
        auth.accessToken
      );
    },
    { enabled: !!auth.accessToken }
  );
  console.log(data)

  const orders = data?.data?.data?.orders || [];
  console.log(orders)
  const totalPages = data?.data?.totalPages || 1;

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'processing': 'bg-purple-100 text-purple-800 border-purple-200',
      'shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePaymentUpdate = (order) => {
    setSelectedOrder(order);
    setPaymentModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    refetch();
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const confirmDeleteOrder = async () => {
    try {
      await deleteOrder.mutateAsync(orderToDelete._id);
      toast.success('Order deleted successfully');
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete order');
    }
  };

  const handleBulkDelete = () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to delete');
      return;
    }
    setBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteOrders.mutateAsync(selectedOrders);
      toast.success(`${selectedOrders.length} orders deleted successfully`);
      setSelectedOrders([]);
      setSelectAll(false);
      setBulkDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete orders');
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedOrders.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleteOrders.isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete ({selectedOrders.length})</span>
            </button>
          )}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 pr-8 bg-white border border-gray-300 appearance-none dark:bg-gray-700 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDownIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none right-2 top-1/2" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full dark:bg-gray-700">
              <FunnelIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Total
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {orders.map((order) => (
                  <tr key={order._id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelectOrder(order._id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items?.length || 0} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {`${order.user?.firstName} ${order.user?.lastName}` || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.user?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.orderStatus?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₦{order.totalAmount?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="p-2 text-blue-600 transition-colors rounded-lg hover:text-blue-800 hover:bg-blue-50"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleStatusUpdate(order)}
                          className="p-2 text-green-600 transition-colors rounded-lg hover:text-green-800 hover:bg-green-50"
                          title="Update Status"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        {order.paymentMethod === 'cash_on_delivery' && (
                          <button
                            onClick={() => handlePaymentUpdate(order)}
                            className="p-2 text-orange-600 transition-colors rounded-lg hover:text-orange-800 hover:bg-orange-50"
                            title="Update Payment"
                          >
                            <span className="text-xs font-bold">₦</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          disabled={deleteOrder.isLoading}
                          className="p-2 text-red-600 transition-colors rounded-lg hover:text-red-800 hover:bg-red-50 disabled:opacity-50"
                          title="Delete Order"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {isModalOpen && selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}

      {/* Payment Status Modal */}
      {paymentModalOpen && selectedOrder && (
        <PaymentStatusModal
          order={selectedOrder}
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedOrder(null);
            refetch();
          }}
          onUpdate={refetch}
        />
      )}

      {/* Delete Order Modal */}
      <DeleteOrderModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={confirmDeleteOrder}
        order={orderToDelete}
        isLoading={deleteOrder.isLoading}
      />

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        selectedCount={selectedOrders.length}
        isLoading={bulkDeleteOrders.isLoading}
      />
    </div>
  );
};

export default OrderList;