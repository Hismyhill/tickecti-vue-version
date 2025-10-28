<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Modal from "./Modal.vue";
import TicketForm from "./TicketForm.vue";
import { auth } from "@shared/supabase";
import { MenuIcon, PlusCircleIcon, PlusIcon } from "lucide-vue-next";

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle"]);

const router = useRouter();
const route = useRoute();

const isMobileOpen = ref(false);
const isCreateModalOpen = ref(false);

const user = ref(null);

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>`,
  },
  {
    path: "/tickets",
    label: "Tickets",
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>`,
  },
];

// Close mobile menu when route changes
watch(
  () => route.path,
  () => {
    isMobileOpen.value = false;
  }
);

// Get user data on component mount
onMounted(async () => {
  const { data } = await auth.getUser();
  user.value = data?.user;
});

const handleLogout = async () => {
  try {
    await auth.signOut();
    router.push("/login");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

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
</script>

<template>
  <!-- Mobile Overlay -->
  <div
    v-if="isMobileOpen"
    class="sidebar-overlay md:hidden"
    @click="isMobileOpen = false"
  ></div>

  <!-- Mobile Toggle Button -->
  <button
    @click="isMobileOpen = true"
    class="fixed top-4 left-4 z-40 md:hidden cursor-pointer p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
  >
    <MenuIcon class="w-6 h-6 text-gray-600" />
  </button>

  <aside
    :class="[
      'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-20' : 'w-64',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0',
      'bg-white border-r border-gray-200 shadow-sm',
    ]"
  >
    <!-- Toggle Button -->
    <button
      @click="emit('toggle')"
      class="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-shadow"
      :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <svg
        :class="[
          'w-4 h-4 text-gray-600 transform transition-transform duration-300',
          isCollapsed ? 'rotate-180' : '',
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <!-- Logo Section -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
      <div
        class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"
      >
        <span class="text-xl font-bold text-white">T</span>
      </div>
      <h1
        :class="[
          'font-bold text-xl transition-opacity duration-300',
          isCollapsed ? 'opacity-0 hidden' : 'opacity-100',
        ]"
      >
        Ticketi
      </h1>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
          route.path === item.path
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50',
        ]"
      >
        <span v-html="item.icon"></span>
        <span
          :class="[
            'font-medium transition-opacity duration-300',
            isCollapsed ? 'opacity-0 hidden' : 'opacity-100',
          ]"
        >
          {{ item.label }}
        </span>
      </router-link>

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

      <!-- Create Ticket Button -->
      <button
        @click="isCreateModalOpen = true"
        :class="[
          'w-full mt-6 inline-flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200',
          isCollapsed ? 'justify-center' : 'justify-start',
        ]"
      >
        <PlusCircleIcon class="w-5 h-5" />
        <span
          :class="[
            'font-medium cursor-pointer transition-opacity duration-300',
            isCollapsed ? 'opacity-0 hidden' : 'opacity-100',
          ]"
        >
          Add Ticket
        </span>
      </button>
    </nav>

    <!-- User Section -->
    <div
      :class="[
        'absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200',
        isCollapsed ? 'px-2' : 'px-4',
      ]"
    >
      <div
        :class="[
          'flex items-center gap-3',
          isCollapsed ? 'justify-center' : '',
        ]"
      >
        <div
          class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div
          :class="[
            'transition-opacity duration-300',
            isCollapsed ? 'opacity-0 hidden' : 'opacity-100',
          ]"
        >
          <div class="flex flex-col gap-1">
            <p class="font-medium text-gray-700">
              {{ user?.user_metadata?.full_name || user?.email }}
            </p>
            <p class="text-sm text-gray-500">{{ user?.email }}</p>
            <button
              @click="handleLogout"
              class="text-sm text-red-600 hover:text-red-700 mt-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<!-- <style scoped>
.sidebar-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-30;
}
</style> -->
