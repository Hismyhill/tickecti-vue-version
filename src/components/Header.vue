<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { MenuIcon } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isAuth = computed(() => !!authStore.user);

async function handleLogout() {
  try {
    await authStore.logout();
    await authStore.clearSession();
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
</script>

<template>
  <header class="bg-white shadow-sm rounded-md mb-10 px-8 w-full">
    <div class="flex items-center justify-between py-4">
      <div class="flex items-center gap-4">
        <router-link to="/" class="flex items-center gap-3">
          <div class="flex items-center gap-3 px-6 py-2">
            <div
              class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-xl font-bold text-white">T</span>
            </div>
            <h1 class="font-bold text-xl hidden md:block md:opacity-100">
              Ticketi
            </h1>
          </div>
        </router-link>
      </div>

      <nav class="hidden md:flex items-center gap-4">
        <router-link
          to="/dashboard"
          class="text-sm hover:text-gray-800 hover:text-xl"
          :class="{ 'text-blue-600': route.path === '/dashboard' }"
        >
          Dashboard
        </router-link>
        <router-link
          to="/tickets"
          class="text-sm hover:text-gray-800 hover:text-xl"
          :class="{ 'text-blue-600': route.path === '/tickets' }"
        >
          Tickets
        </router-link>
        <template v-if="!isAuth">
          <button
            @click="router.push('/auth/signup')"
            class="px-4 py-2 border-[1.5px] border-gray-900 rounded-md text-sm cursor-pointer hover:bg-gray-500 hover:border-gray-500 hover:text-white"
          >
            Login
          </button>
        </template>
        <template v-else>
          <button @click="handleLogout" class="btn btn-outline text-sm">
            Logout
          </button>
        </template>
      </nav>

      <!-- Mobile Menu -->
      <div class="md:hidden">
        <details>
          <summary class="btn btn-outline cursor-pointer">
            <MenuIcon class="w-6 h-6" />
          </summary>
          <div class="mt-2 bg-white p-3 shadow card absolute right-0 w-48 z-50">
            <router-link to="/dashboard" class="block py-2">
              Dashboard
            </router-link>
            <router-link to="/tickets" class="block py-2">
              Tickets
            </router-link>
            <template v-if="!isAuth">
              <router-link to="/auth/login" class="block py-2">
                Login
              </router-link>
            </template>
            <template v-else>
              <button
                @click="handleLogout"
                class="block py-2 text-left w-full hover:bg-gray-50"
              >
                Logout
              </button>
            </template>
          </div>
        </details>
      </div>
    </div>
  </header>
</template>
