import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/solid';

const OrderStatusTracker = ({ currentStatus, order, size = 'lg' }) => {
  const orderSteps = [
    { key: 'pending', label: 'Pending', icon: ClockIcon },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircleIcon },
    { key: 'processing', label: 'Processing', icon: ClockIcon },
    { key: 'shipped', label: 'Shipped', icon: TruckIcon },
    { key: 'delivered', label: 'Delivered', icon: CheckCircleIcon }
  ];

  const getStepStatus = (stepKey, currentStatus) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus?.toLowerCase());
    const stepIndex = statusOrder.indexOf(stepKey);
    
    if (currentStatus?.toLowerCase() === 'cancelled') {
      return stepIndex === 0 ? 'completed' : 'cancelled';
    }
    
    if (stepIndex <= currentIndex) return 'completed';
    if (stepIndex === currentIndex + 1) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'current': return 'bg-blue-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-400';
    }
  };

  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  const containerSize = size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10';

  if (currentStatus?.toLowerCase() === 'cancelled') {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 rounded-full">
          <XCircleIcon className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-700">Order Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {orderSteps.map((step, index) => {
        const status = getStepStatus(step.key, currentStatus);
        const Icon = step.icon;
        
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`${containerSize} rounded-full flex items-center justify-center transition-all duration-300 ${getStepColor(status)}`}>
                <Icon className={iconSize} />
              </div>
              {size !== 'sm' && (
                <span className={`mt-2 text-xs font-medium ${
                  status === 'completed' || status === 'current' 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              )}
            </div>
            {index < orderSteps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                getStepStatus(orderSteps[index + 1].key, currentStatus) === 'completed' 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;