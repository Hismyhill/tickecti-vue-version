<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Title -->
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Title <span aria-hidden class="text-red-500">*</span>
      </label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <input
          v-model="form.title"
          type="text"
          placeholder="Enter ticket title"
          :aria-invalid="errors.title ? 'true' : 'false'"
          :class="[
            'block w-full px-4 py-3 rounded-lg border transition-colors duration-200',
            errors.title
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
          ]"
        />
        <div
          v-if="errors.title"
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
      <p v-if="errors.title" class="mt-2 text-sm text-red-600" role="alert">
        {{ errors.title }}
      </p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Description <span class="ml-1 text-sm text-gray-500">(optional)</span>
      </label>
      <div class="mt-1">
        <textarea
          v-model="form.description"
          rows="5"
          placeholder="Provide detailed information about the ticket..."
          class="block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
        <p
          v-if="errors.description"
          class="mt-2 text-sm text-red-600"
          role="alert"
        >
          {{ errors.description }}
        </p>
      </div>
    </div>

    <!-- Status and Priority -->
    <div class="grid grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Status <span aria-hidden class="text-red-500">*</span>
        </label>
        <div class="mt-1">
          <select
            v-model="form.status"
            :class="[
              'block w-full px-4 py-3 rounded-lg border transition-colors duration-200',
              errors.status
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
            ]"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <p
            v-if="errors.status"
            class="mt-2 text-sm text-red-600"
            role="alert"
          >
            {{ errors.status }}
          </p>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Priority</label>
        <div class="mt-1">
          <select
            v-model="form.priority"
            class="block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div
      class="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200"
    >
      <button
        v-if="onCancel"
        type="button"
        @click="onCancel"
        class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Cancel
      </button>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <template v-if="isSubmitting">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </template>
        <template v-else>
          <svg
            class="-ml-1 mr-2 h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          {{ submitLabel }}
        </template>
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from "vue";

const props = defineProps({
  initial: { type: Object, default: () => ({}) },
  onSubmit: { type: Function, required: true },
  submitLabel: { type: String, default: "Save" },
  onCancel: { type: Function },
});

const form = reactive({
  title: props.initial.title || "",
  description: props.initial.description || "",
  status: props.initial.status || "open",
  priority: props.initial.priority || "low",
});

const errors = reactive({});
const isSubmitting = ref(false);

// Basic validation rules
function validate() {
  errors.title = !form.title
    ? "Title is required"
    : form.title.length < 3
    ? "Minimum 3 characters"
    : "";
  errors.status = !["open", "in-progress", "closed"].includes(form.status)
    ? "Invalid status"
    : "";
  errors.description =
    form.description.length > 2000 ? "Max 2000 characters" : "";
  return !errors.title && !errors.status && !errors.description;
}

async function handleSubmit() {
  if (!validate()) return;
  isSubmitting.value = true;
  try {
    await props.onSubmit({ ...form });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
