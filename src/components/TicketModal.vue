<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
      <h2 class="mb-6 text-2xl font-bold">{{ isEditing ? 'Edit Ticket' : 'Create Ticket' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="title" class="block mb-2 font-medium">Title</label>
          <input v-model="form.title" id="title" type="text" class="w-full p-2 border rounded" />
          <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
        </div>
        <div class="mb-4">
          <label for="description" class="block mb-2 font-medium">Description</label>
          <textarea v-model="form.description" id="description" rows="4" class="w-full p-2 border rounded"></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
        </div>
        <div class="mb-6">
          <label for="status" class="block mb-2 font-medium">Status</label>
          <select v-model="form.status" id="status" class="w-full p-2 border rounded">
            <option v-for="status in TICKET_STATUS" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>
        <div class="flex justify-end space-x-4">
          <button type="button" @click="$emit('close')" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { TICKET_STATUS, validateTicket } from '../../../shared-assets/supabase';

const props = defineProps({
  isOpen: Boolean,
  ticket: Object,
});

const emit = defineEmits(['close', 'save']);

const form = ref({});
const errors = ref({});

const isEditing = computed(() => !!props.ticket);

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    form.value = props.ticket ? { ...props.ticket } : { title: '', description: '', status: TICKET_STATUS.OPEN };
    errors.value = {};
  }
});

const submitForm = () => {
  const { isValid, errors: validationErrors } = validateTicket(form.value);
  if (isValid) {
    emit('save', form.value);
  } else {
    errors.value = validationErrors;
  }
};
</script>
