import { ref } from 'vue';

export const toasts = ref([]);

export const addToast = (message, type = 'info') => {
  const id = Date.now();
  toasts.value.push({ id, message, type });

  setTimeout(() => removeToast(id), 5000);
};

export const removeToast = (id) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

export const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
}