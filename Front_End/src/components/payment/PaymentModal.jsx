import { useState } from 'react';
import { useInitializePayment, useConfirmCOD } from '../../hooks/usePayment';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, orderData, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);
  
  const initializePayment = useInitializePayment();
  const confirmCOD = useConfirmCOD();

  const handlePaystackPayment = async () => {
    setLoading(true);
    try {
      const result = await initializePayment.mutateAsync({
        orderId: orderData.orderId,
        email: orderData.email,
        amount: orderData.amount,
        paymentMethod: paymentMethod
      });

      if (result.success) {
        window.location.href = result.data.authorization_url;
      } else {
        toast.error('Payment initialization failed');
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    setLoading(true);
    try {
      await confirmCOD.mutateAsync(orderData.orderId);
      toast.success('Order confirmed for cash on delivery');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to confirm order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === 'paystack' || paymentMethod === 'bank_transfer') {
      handlePaystackPayment();
    } else {
      handleCODPayment();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Choose Payment Method</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="paystack"
                checked={paymentMethod === 'paystack'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-blue-600"
              />
              <div>
                <div className="font-medium">Pay with Card</div>
                <div className="text-sm text-gray-500">Secure card payment via Paystack</div>
              </div>
            </label>
          </div>

          <div className="border rounded-lg p-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="bank_transfer"
                checked={paymentMethod === 'bank_transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-blue-600"
              />
              <div>
                <div className="font-medium">Bank Transfer</div>
                <div className="text-sm text-gray-500">Transfer to virtual account via Paystack</div>
              </div>
            </label>
          </div>

          {paymentMethod !== 'cash_on_delivery' && (
            <div className="border rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="cash_on_delivery"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when your order arrives</div>
                </div>
              </label>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;