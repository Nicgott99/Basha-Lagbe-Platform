import { useContext } from 'react';
import { ToastContext } from '../components/Toast';

export const useToast = () => {
  const toastContext = useContext(ToastContext);
  
  if (!toastContext) {
    throw new Error('useToast must be used within ToastProvider');
  }
  
  // Create a wrapper function that matches the interface components expect
  const showToast = (message, type = 'info') => {
    if (type === 'success') toastContext.success(message);
    else if (type === 'error') toastContext.error(message);
    else if (type === 'warning') toastContext.warning(message);
    else toastContext.info(message);
  };

  return { 
    showToast,
    // Also expose the original context methods
    success: toastContext.success,
    error: toastContext.error,
    warning: toastContext.warning,
    info: toastContext.info,
    // Return the full context for compatibility
    ...toastContext
  };
};

export default useToast;