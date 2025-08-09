export const nigerianStates = [
  { value: 'abia', label: 'Abia', deliveryFee: 2500 },
  { value: 'adamawa', label: 'Adamawa', deliveryFee: 3500 },
  { value: 'akwa-ibom', label: 'Akwa Ibom', deliveryFee: 3000 },
  { value: 'anambra', label: 'Anambra', deliveryFee: 2500 },
  { value: 'bauchi', label: 'Bauchi', deliveryFee: 3500 },
  { value: 'bayelsa', label: 'Bayelsa', deliveryFee: 3000 },
  { value: 'benue', label: 'Benue', deliveryFee: 3000 },
  { value: 'borno', label: 'Borno', deliveryFee: 4000 },
  { value: 'cross-river', label: 'Cross River', deliveryFee: 3000 },
  { value: 'delta', label: 'Delta', deliveryFee: 2500 },
  { value: 'ebonyi', label: 'Ebonyi', deliveryFee: 2500 },
  { value: 'edo', label: 'Edo', deliveryFee: 2500 },
  { value: 'ekiti', label: 'Ekiti', deliveryFee: 2000 },
  { value: 'enugu', label: 'Enugu', deliveryFee: 2500 },
  { value: 'fct', label: 'Federal Capital Territory', deliveryFee: 2000 },
  { value: 'gombe', label: 'Gombe', deliveryFee: 3500 },
  { value: 'imo', label: 'Imo', deliveryFee: 2500 },
  { value: 'jigawa', label: 'Jigawa', deliveryFee: 3500 },
  { value: 'kaduna', label: 'Kaduna', deliveryFee: 3000 },
  { value: 'kano', label: 'Kano', deliveryFee: 3000 },
  { value: 'katsina', label: 'Katsina', deliveryFee: 3500 },
  { value: 'kebbi', label: 'Kebbi', deliveryFee: 3500 },
  { value: 'kogi', label: 'Kogi', deliveryFee: 2500 },
  { value: 'kwara', label: 'Kwara', deliveryFee: 2500 },
  { value: 'lagos', label: 'Lagos', deliveryFee: 1500 },
  { value: 'nasarawa', label: 'Nasarawa', deliveryFee: 2500 },
  { value: 'niger', label: 'Niger', deliveryFee: 3000 },
  { value: 'ogun', label: 'Ogun', deliveryFee: 2000 },
  { value: 'ondo', label: 'Ondo', deliveryFee: 2500 },
  { value: 'osun', label: 'Osun', deliveryFee: 2000 },
  { value: 'oyo', label: 'Oyo', deliveryFee: 2000 },
  { value: 'plateau', label: 'Plateau', deliveryFee: 3000 },
  { value: 'rivers', label: 'Rivers', deliveryFee: 3000 },
  { value: 'sokoto', label: 'Sokoto', deliveryFee: 3500 },
  { value: 'taraba', label: 'Taraba', deliveryFee: 3500 },
  { value: 'yobe', label: 'Yobe', deliveryFee: 4000 },
  { value: 'zamfara', label: 'Zamfara', deliveryFee: 3500 }
];

export const getStateByValue = (value) => {
  return nigerianStates.find(state => state.value === value);
};

export const getDeliveryFee = (stateValue) => {
  const state = getStateByValue(stateValue);
  return state ? state.deliveryFee : 0;
};

export const paymentMethods = {
  ebonyi: ['card', 'transfer', 'cash_on_delivery'],
  default: ['card', 'transfer']
};

export const getAvailablePaymentMethods = (stateValue) => {
  return paymentMethods[stateValue] || paymentMethods.default;
};