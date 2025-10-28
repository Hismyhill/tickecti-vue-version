<script setup>
import { ref } from "vue";

const toasts = ref([]);

// Create a symbol to use as a key for the event bus
const toastSymbol = Symbol();

// Provide the toasts functionality to the app
const addToast = (message, type = "info") => {
  const id = Date.now();
  const toast = {
    id,
    message,
    type,
  };

  toasts.value.push(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    removeToast(id);
  }, 3000);
};

const removeToast = (id) => {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

// Make the addToast function available globally
provide(toastSymbol, {
  addToast,
  removeToast,
});

// Export the symbol and composable for use in other components
export const useToast = () => {
  return inject(toastSymbol);
};
</script>

<template>
  <div
    aria-live="polite"
    aria-atomic="true"
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'rounded-lg shadow-lg p-4 min-w-[300px] animate-slide-in',
          {
            'bg-green-50 text-green-800 border border-green-200':
              toast.type === 'success',
            'bg-red-50 text-red-800 border border-red-200':
              toast.type === 'error',
            'bg-blue-50 text-blue-800 border border-blue-200':
              toast.type === 'info',
            'bg-yellow-50 text-yellow-800 border border-yellow-200':
              toast.type === 'warning',
          },
        ]"
        role="alert"
      >
        <div class="flex justify-between items-start">
          <p class="text-sm font-medium">{{ toast.message }}</p>
          <button
            @click="removeToast(toast.id)"
            class="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Close notification"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
