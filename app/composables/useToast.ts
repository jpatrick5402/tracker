interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

const toasts = ref<ToastMessage[]>([]);

export const useToast = () => {
  const addToast = (message: string, type: ToastMessage['type'] = 'info', duration: number = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastMessage = {
      id,
      message,
      type,
      duration,
    };

    toasts.value.push(toast);

    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const showError = (message: string, duration?: number) => {
    return addToast(message, 'error', duration);
  };

  const showSuccess = (message: string, duration?: number) => {
    return addToast(message, 'success', duration);
  };

  const showWarning = (message: string, duration?: number) => {
    return addToast(message, 'warning', duration);
  };

  const showInfo = (message: string, duration?: number) => {
    return addToast(message, 'info', duration);
  };

  const showAuthenticationError = () => {
    return showError('Please sign in to perform this action. You can sign in using the GitHub button in the sidebar.', 6000);
  };

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    showAuthenticationError,
  };
};
