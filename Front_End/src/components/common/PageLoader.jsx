import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white dark:bg-secondary-900 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-secondary-600 dark:text-secondary-400"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default PageLoader;