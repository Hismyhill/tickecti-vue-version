<template>
  <div class="flex h-screen bg-gray-50">
    <div class="container py-8 px-4 md:px-8">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Tickets</h1>
          <p class="text-gray-600 mt-1">Manage and track your tickets</p>
        </div>
        <div class="mt-4 sm:mt-0 flex gap-4">
          <button
            @click="isCreateModalOpen = true"
            class="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <PlusCircle class="w-5 h-5" />
            Create New Ticket
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
      >
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1">
            <div class="flex gap-2">
              <button
                v-for="status in ['all', 'open', 'in_progress', 'closed']"
                :key="status"
                @click="filter = status"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  filter === status
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                {{
                  status.charAt(0).toUpperCase() +
                  status.slice(1).replace("_", " ")
                }}
              </button>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <select
              v-model="sort"
              class="form-select rounded-lg border-gray-300 text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tickets Grid -->
      <div
        v-if="ticketStore.loading"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div v-for="n in 3" :key="n" class="card animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="!filteredTickets.length" class="text-center py-12">
        <div
          class="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4"
        >
          <Ticket class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
        <p class="text-gray-500 mb-6">Create a new ticket to get started</p>
        <button
          @click="isCreateModalOpen = true"
          class="btn bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2"
        >
          Create New Ticket
        </button>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TicketCard
          v-for="t in filteredTickets.slice(0, 6)"
          :key="t.id"
          :ticket="t"
          :onEdit="() => (editing = t)"
          :onDelete="handleDelete"
        />
      </div>

      <!-- Create Modal -->
      <Modal
        :isOpen="isCreateModalOpen"
        title="Create New Ticket"
        @close="isCreateModalOpen = false"
      >
        <TicketForm
          @submit="createTicket"
          @cancel="() => (isCreateModalOpen = false)"
          submitLabel="Create Ticket"
        />
      </Modal>

      <!-- Edit Modal -->
      <Modal :isOpen="!!editing" title="Edit Ticket" @close="editing = null">
        <TicketForm
          v-if="editing"
          :initial="editing"
          submitLabel="Update Ticket"
          @submit="updateTicket"
          @cancel="() => (editing = null)"
        />
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTicketsStore } from "../stores/useTicketsStore";
import TicketForm from "@/components/TicketForm.vue";
import TicketCard from "@/components/TicketCard.vue";
import Modal from "@/components/Modal.vue";
import { supabase } from "@/config/supabase";
import { PlusCircle, Ticket } from "lucide-vue-next";

const ticketStore = useTicketsStore();
const filter = ref("all");
const sort = ref("newest");
const isCreateModalOpen = ref(false);
const editing = ref(null);

onMounted(async () => {
  await ticketStore.fetchTickets();
});

const filteredTickets = computed(() => {
  let tickets = [...ticketStore.tickets];
  if (filter.value !== "all") {
    tickets = tickets.filter((t) => t.status === filter.value);
  }
  if (sort.value === "oldest") {
    tickets = tickets.reverse();
  }
  return tickets;
});

async function createTicket(data) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Login required");

    await ticketStore.createTicket({
      ...data,
      user_id: user.id,
      created_at: new Date().toISOString(),
    });
    notifySuccess("Ticket created successfully");
    isCreateModalOpen.value = false;
  } catch (err) {
    notifyError(err.message || "Failed to create ticket");
  }
}

async function updateTicket(data) {
  try {
    await ticketStore.updateTicket(editing.value.id, data);
    editing.value = null;
    toast.success("Ticket updated");
  } catch (err) {
    toast.error(err.message || "Failed to update ticket");
  }
}

async function deleteTicket(id) {
  if (!confirm("Delete this ticket?")) return;
  try {
    await ticketStore.deleteTicket(id);
    toast.success("Ticket deleted");
  } catch {
    toast.error("Failed to delete ticket");
  }
}
</script>
