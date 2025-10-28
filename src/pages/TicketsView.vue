<template>
  <div>
    <Sidebar
      :onCreateTicket="() => (isCreateModalOpen = true)"
      :isCollapsed="isSidebarCollapsed"
      :onCollapse="(v) => (isSidebarCollapsed = v)"
    />
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Tickets</h1>
      <button @click="openCreateModal" class="btn-primary">New Ticket</button>
    </div>

    <div v-if="loading" class="mt-8">Loading tickets...</div>
    <div v-if="error" class="mt-8 text-red-500">{{ error.message }}</div>

    <div
      v-if="tickets.length"
      class="grid gap-6 mt-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <TicketCard
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
        @edit="openEditModal(ticket)"
        @delete="handleDelete(ticket.id)"
      />
    </div>
    <div v-else-if="!loading" class="mt-8 text-center text-gray-500">
      <p>No tickets found. Create one to get started!</p>
    </div>

    <TicketModal
      :is-open="isModalOpen"
      :ticket="selectedTicket"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { tickets as ticketsApi } from "../shared-assets/supabase";
import TicketCard from "../components/TicketCard.vue";
import TicketModal from "../components/TicketModal.vue";

const tickets = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);
const selectedTicket = ref(null);

const fetchTickets = async () => {
  loading.value = true;
  const { data, error: fetchError } = await ticketsApi.getAll();
  if (fetchError) {
    error.value = fetchError;
  } else {
    tickets.value = data;
  }
  loading.value = false;
};

onMounted(fetchTickets);

const openCreateModal = () => {
  selectedTicket.value = null;
  isModalOpen.value = true;
};

const openEditModal = (ticket) => {
  selectedTicket.value = { ...ticket };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedTicket.value = null;
};

const handleSave = async (ticketData) => {
  if (ticketData.id) {
    // Update
    const { data, error } = await ticketsApi.update(ticketData.id, ticketData);
    if (error) {
      alert(error.message);
    } else {
      const index = tickets.value.findIndex((t) => t.id === data.id);
      if (index !== -1) tickets.value[index] = data;
    }
  } else {
    // Create
    const { data, error } = await ticketsApi.create(ticketData);
    if (error) {
      alert(error.message);
    } else {
      tickets.value.unshift(data);
    }
  }
  closeModal();
};

const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this ticket?")) {
    const { error } = await ticketsApi.delete(id);
    if (error) {
      alert(error.message);
    } else {
      tickets.value = tickets.value.filter((t) => t.id !== id);
    }
  }
};
</script>
