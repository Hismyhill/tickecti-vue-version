<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Modal from "./Modal.vue";
import TicketForm from "./TicketForm.vue";
import { auth, supabase } from "../shared-assets/supabase";
import {
  MenuIcon,
  PlusCircleIcon,
  LayoutGrid,
  Ticket,
  ChevronLeft,
  User,
} from "lucide-vue-next";

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
  },
  {
    path: "/tickets",
    label: "Tickets",
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
  const { data } = await supabase.auth.getUser();
  user.value = data?.user;
});
console.log(user);
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
    class="sidebar-overlay md:hidden cursor-pointer"
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
      <ChevronLeft
        :class="[
          'w-4 h-4 text-gray-600 transform transition-transform duration-300',
          isCollapsed ? 'rotate-180' : '',
        ]"
      />
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
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer',
          route.path === item.path
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50',
        ]"
      >
        <LayoutGrid v-if="item.path === '/dashboard'" class="w-6 h-6" />
        <Ticket v-if="item.path === '/tickets'" class="w-6 h-6" />
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
          <User class="w-6 h-6 text-gray-500" />
        </div>
        <div
          :class="[
            'transition-opacity duration-300',
            isCollapsed ? 'opacity-0 hidden' : 'opacity-100',
          ]"
        >
          <div class="flex flex-col gap-1">
            <p class="text-sm text-gray-500">
              {{ user?.email.substring(0, 20) + "..." }}
            </p>
          </div>
          <div>
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
