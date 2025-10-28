<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Ticket,
  Clock,
  Zap,
  CheckCircle2,
  PlusCircleIcon,
} from "lucide-vue-next";
import { supabase } from "@/config/supabase";
import { useTicketsStore } from "@/stores/useTicketsStore";
import Sidebar from "../components/Sidebar.vue";
import StatsCard from "@/components/StatsCard.vue";
import TicketCard from "@/components/TicketCard.vue";
import TicketForm from "@/components/TicketForm.vue";
import Modal from "@/components/Modal.vue";
import { notifySuccess, notifyError } from "@/utils/notify";

const ticketsStore = useTicketsStore();
const user = ref(null);
const selectedFilter = ref("all");
const isSidebarCollapsed = ref(false);
const isCreateModalOpen = ref(false);
const editing = ref(null);
const filters = ["all", "open", "in-progress", "closed"];

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data?.user;
  await ticketsStore.fetchTickets();
});

const openCount = computed(
  () => ticketsStore.tickets.filter((t) => t.status === "open").length
);
const inProgressCount = computed(
  () => ticketsStore.tickets.filter((t) => t.status === "in-progress").length
);
const closedCount = computed(
  () => ticketsStore.tickets.filter((t) => t.status === "closed").length
);
const progressPercent = computed(() => {
  const total = ticketsStore.tickets.length;
  return total === 0 ? 0 : Math.round((closedCount.value / total) * 100);
});
const filteredTickets = computed(() =>
  selectedFilter.value === "all"
    ? ticketsStore.tickets
    : ticketsStore.tickets.filter((t) => t.status === selectedFilter.value)
);

async function handleCreate(data) {
  try {
    const status = data.status === "in_progress" ? "in-progress" : data.status;
    const payload = {
      ...data,
      status,
      user_id: user.value.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await ticketsStore.createTicket(payload);
    notifySuccess("Ticket created successfully");
    isCreateModalOpen.value = false;
  } catch (err) {
    notifyError(err.message || "Failed to create ticket");
  }
}

async function handleUpdate(data) {
  try {
    await ticketsStore.updateTicket(editing.value.id, data);
    notifySuccess("Ticket updated successfully");
    editing.value = null;
  } catch (err) {
    notifyError(err.message || "Failed to update ticket");
  }
}

async function handleDelete(id) {
  if (!confirm("Delete ticket? This action cannot be undone.")) return;
  try {
    await ticketsStore.deleteTicket(id);
    notifySuccess("Ticket deleted");
  } catch {
    notifyError("Failed to delete ticket");
  }
}
</script>

<template>
  <div class="h-screen bg-gray-50">
    <!-- Main Content -->

    <div class="container px-2 md:px-8 overflow-y-hidden">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p class="text-gray-600 mt-1 flex gap-4">
            <span class="text-base font-semibold">
              Welcome, {{ user?.user_metadata?.full_name?.split(" ")[0] }}
            </span>
            — Track and manage your support tickets
          </p>
        </div>

        <div class="mt-4 md:mt-0">
          <button
            @click="isCreateModalOpen = true"
            class="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <PlusCircleIcon class="w-5 h-5" />

            Create New Ticket
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Tickets"
          color="blue"
          :value="ticketsStore.tickets.length"
          :percentage="progressPercent"
          subtitle="resolved"
        >
          <template #icon>
            <Ticket class="w-6 h-6 text-blue-600" />
          </template>
        </StatsCard>

        <StatsCard
          title="Open Tickets"
          color="green"
          :value="openCount"
          subtitle="Needs attention"
        >
          <template #icon>
            <Clock class="w-6 h-6 text-green-600" />
          </template>
        </StatsCard>

        <StatsCard
          title="In Progress"
          color="yellow"
          :value="inProgressCount"
          subtitle="Being handled"
        >
          <template #icon>
            <Zap class="w-6 h-6 text-yellow-600" />
          </template>
        </StatsCard>

        <StatsCard
          title="Closed Tickets"
          color="gray"
          :value="closedCount"
          subtitle="Successfully resolved"
        >
          <template #icon>
            <CheckCircle2 class="w-6 h-6 text-gray-600" />
          </template>
        </StatsCard>
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-4 mb-6 border-b border-gray-200">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="selectedFilter = filter"
          :class="[
            'px-4 py-2 font-medium',
            selectedFilter === filter
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
        </button>
      </div>

      <!-- Recent Tickets -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Recent Tickets</h3>
          <RouterLink
            to="/tickets"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all tickets →
          </RouterLink>
        </div>

        <!-- Loading -->
        <div v-if="ticketsStore.loading" class="grid md:grid-cols-3 gap-6">
          <div v-for="n in 3" :key="n" class="card animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-else-if="ticketsStore.tickets.length === 0"
          class="card text-center py-12"
        >
          <div
            class="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4"
          >
            <Ticket class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            No tickets found
          </h3>
          <p class="text-gray-500 mb-6">
            Get started by creating your first support ticket
          </p>
          <button
            @click="isCreateModalOpen = true"
            class="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2"
          >
            Create New Ticket
          </button>
        </div>

        <!-- Tickets Grid -->
        <div v-else class="grid md:grid-cols-3 gap-6">
          <TicketCard
            v-for="t in filteredTickets.slice(0, 6)"
            :key="t.id"
            :ticket="t"
            :onEdit="() => (editing = t)"
            :onDelete="handleDelete"
          />
        </div>
      </section>

      <!-- Create Ticket Modal -->
      <Modal
        :isOpen="isCreateModalOpen"
        title="Create New Ticket"
        :onClose="() => (isCreateModalOpen = false)"
      >
        <TicketForm
          :onSubmit="handleCreate"
          :onCancel="() => (isCreateModalOpen = false)"
          submitLabel="Create Ticket"
        />
      </Modal>

      <!-- Edit Ticket Modal -->
      <Modal
        :isOpen="!!editing"
        title="Edit Ticket"
        :onClose="() => (editing = null)"
      >
        <TicketForm
          v-if="editing"
          :initial="editing"
          submitLabel="Update Ticket"
          :onCancel="() => (editing = null)"
          :onSubmit="handleUpdate"
        />
      </Modal>
    </div>
  </div>
</template>
