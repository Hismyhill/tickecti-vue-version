<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import Sidebar from "./components/Sidebar.vue";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.initialize();
});

const route = useRoute();
const showSidebar = computed(
  () => !["login", "signup", "landing"].includes(route.name)
);
const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar
      v-if="showSidebar"
      :is-collapsed="isSidebarCollapsed"
      @toggle="toggleSidebar"
    />

    <main
      :class="[
        'transition-all duration-300 ease-in-out',
        showSidebar ? (isSidebarCollapsed ? 'ml-20' : 'ml-64') : '',
      ]"
    >
      <div class="container mx-auto px-4 py-8">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
            enter-active-class="animate-fade-in"
            leave-active-class="animate-fade-out"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <ToastNotifications />
  </div>
</template>

<!-- <style>

@import "tailwindcss/preflight";
@tailwind utilities;

@layer utilities {
  .card {
    @apply bg-white p-6 rounded-lg shadow-sm border border-gray-200;
  }

  .btn {
    @apply px-4 py-2 rounded-lg transition-colors duration-200 font-medium;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }

  .btn-secondary {
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  }

  .status-tag {
    @apply px-3 py-1 rounded-full text-sm font-medium;
  }
}
</style> -->
