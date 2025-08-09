import { useForm } from 'react-hook-form';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useUpdateOrderStatus } from '../../../hooks/useOrders';
import toast from 'react-hot-toast';

const OrderStatusModal = ({ order, isOpen, onClose }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      status: order.status,
      notes: ''
    }
  });
  
  const selectedStatus = watch('status');
  const updateStatusMutation = useUpdateOrderStatus();

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'confirmed', label: 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: 'processing', label: 'Processing', color: 'text-purple-600', bg: 'bg-purple-50' },
    { value: 'shipped', label: 'Shipped', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { value: 'delivered', label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' }
  ];

  const onSubmit = async (data) => {
    try {
      await updateStatusMutation.mutateAsync({
        orderId: order._id,
        status: data.status,
        notes: data.notes
      });
      toast.success('Order status updated successfully');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Update Order Status
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Order #{order.orderNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Status */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Status
              </div>
              <div className="text-lg font-semibold text-gray-900 capitalize dark:text-white">
                {order.orderStatus}
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                New Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((status) => (
                  <label
                    key={status.value}
                    className={`relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedStatus === status.value
                        ? `border-blue-500 ${status.bg} ring-2 ring-blue-200`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      {...register('status', { required: 'Status is required' })}
                      type="radio"
                      value={status.value}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedStatus === status.value ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        selectedStatus === status.value ? status.color : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {status.label}
                      </span>
                    </div>
                    {selectedStatus === status.value && (
                      <CheckIcon className="absolute w-4 h-4 text-blue-500 top-2 right-2" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 resize-none dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Add any notes about this status update..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-4 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 font-medium text-gray-700 transition-colors bg-gray-100 dark:text-gray-300 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateStatusMutation.isLoading || selectedStatus === order.status}
                className="px-6 py-2 font-medium text-white transition-all transform bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {updateStatusMutation.isLoading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;