import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SpecificationInput = ({ onSpecificationsChange, existingSpecs = [] }) => {
  const [specifications, setSpecifications] = useState(
    existingSpecs.length > 0 ? existingSpecs : [{ name: '', value: '' }]
  );

  const addSpecification = () => {
    const newSpecs = [...specifications, { name: '', value: '' }];
    setSpecifications(newSpecs);
    onSpecificationsChange(newSpecs);
  };

  const removeSpecification = (index) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
    onSpecificationsChange(newSpecs);
  };

  const updateSpecification = (index, field, value) => {
    const newSpecs = specifications.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    );
    setSpecifications(newSpecs);
    onSpecificationsChange(newSpecs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Product Specifications
        </label>
        <button
          type="button"
          onClick={addSpecification}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Specification</span>
        </button>
      </div>

      <div className="space-y-3">
        {specifications.map((spec, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Specification name (e.g., Color, Weight)"
                value={spec.name}
                onChange={(e) => updateSpecification(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Specification value (e.g., Black, 1.5kg)"
                value={spec.value}
                onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            {specifications.length > 1 && (
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {specifications.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No specifications added yet.</p>
          <button
            type="button"
            onClick={addSpecification}
            className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Add your first specification
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Common specifications: Color, Weight, Dimensions, Material, Warranty, etc.</p>
      </div>
    </div>
  );
};

export default SpecificationInput;