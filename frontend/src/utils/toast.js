import { toast } from 'sonner';

// Success toast with modern styling
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    },
    icon: '✅',
    ...options,
  });
};

// Error toast with modern styling
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    },
    icon: '❌',
    ...options,
  });
};

// Warning toast with modern styling
export const showWarning = (message, options = {}) => {
  return toast.warning(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
    },
    icon: '⚠️',
    ...options,
  });
};

// Info toast with modern styling
export const showInfo = (message, options = {}) => {
  return toast.info(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    },
    icon: 'ℹ️',
    ...options,
  });
};

// Loading toast with modern styling
export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
    },
    icon: '⏳',
    ...options,
  });
};

// Custom toast with modern styling
export const showCustom = (message, type = 'default', options = {}) => {
  const baseStyle = {
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  };

  const typeStyles = {
    success: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    },
    error: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    },
    warning: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
    },
    info: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    },
    default: {
      background: 'linear-gradient(135deg, #6b7280, #4b5563)',
      color: 'white',
      boxShadow: '0 10px 25px rgba(107, 114, 128, 0.3)',
    },
  };

  return toast(message, {
    duration: 4000,
    position: 'top-right',
    style: { ...baseStyle, ...typeStyles[type] },
    ...options,
  });
};

// Promise toast for async operations
export const showPromise = (promise, messages = {}) => {
  const {
    loading = 'Loading...',
    success = 'Success!',
    error = 'Something went wrong',
  } = messages;

  return toast.promise(promise, {
    loading: {
      message: loading,
      style: {
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
      },
      icon: '⏳',
    },
    success: {
      message: success,
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
      },
      icon: '✅',
    },
    error: {
      message: error,
      style: {
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
      },
      icon: '❌',
    },
  });
};

// Dismiss all toasts
export const dismissAll = () => toast.dismiss();

// Dismiss specific toast
export const dismiss = (toastId) => toast.dismiss(toastId);

// Export the base toast function for backward compatibility
export { toast };
