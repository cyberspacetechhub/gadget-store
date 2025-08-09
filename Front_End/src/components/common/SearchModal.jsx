import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-start justify-center p-4 pt-20">
        <Dialog.Panel className="w-full max-w-2xl bg-white dark:bg-secondary-800 rounded-lg shadow-xl">
          <div className="flex items-center p-4 border-b border-secondary-200 dark:border-secondary-700">
            <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400 mr-3" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-secondary-900 dark:text-white placeholder-secondary-500"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 text-secondary-400 hover:text-secondary-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4">
            <p className="text-secondary-500 text-sm">
              Start typing to search for products...
            </p>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SearchModal;