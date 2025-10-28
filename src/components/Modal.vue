<!-- src/components/Modal.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-9999 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20"
      >
        <!-- Overlay -->
        <div
          class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm animate-fade-in"
          aria-hidden="true"
          @click="onClose"
        />

        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <!-- Modal panel -->
        <div
          ref="modalRef"
          tabindex="-1"
          class="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left bg-white shadow-xl rounded-2xl animate-modal-slide-in"
        >
          <!-- Header -->
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3
                id="modal-title"
                class="text-xl font-semibold leading-6 text-gray-900"
              >
                {{ title }}
              </h3>
              <button
                @click="onClose"
                class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: "" },
});
const emit = defineEmits(["close"]);

const modalRef = ref(null);

function onClose() {
  emit("close");
}

function handleEscape(event) {
  if (event.key === "Escape") onClose();
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
      setTimeout(() => modalRef.value?.focus(), 50);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  document.body.style.overflow = "unset";
  document.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
/* Optional transitions (same names as Tailwind animate classes) */
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
.animate-modal-slide-in {
  animation: slide-in 0.25s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slide-in {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
