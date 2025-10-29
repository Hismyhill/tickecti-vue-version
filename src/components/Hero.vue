<!-- src/components/Hero.vue -->
<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { Zap, Settings, MessageSquare } from "lucide-vue-next";

const authStore = useAuthStore();
const isAuth = computed(() => !!authStore.user);
</script>

<template>
  <section
    class="relative min-h-[80vh] bg-linear-to-br from-blue-50 to-white mb-8 overflow-hidden"
  >
    <!-- Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <svg
        class="absolute w-full h-64 bottom-0 left-0"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="rgba(96, 165, 250, 0.1)"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

      <!-- Floating circles -->
      <div
        class="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
      ></div>
      <div
        class="absolute top-40 right-10 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute bottom-40 left-1/2 w-20 h-20 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
      ></div>

      <div
        class="absolute top-1/4 right-1/4 w-32 h-32 border-4 border-blue-200 rounded-full animate-spin-slow"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/4 w-24 h-24 border-4 border-purple-200 rounded-full animate-bounce-slow"
      ></div>
      <div
        class="absolute top-1/3 left-1/3 w-16 h-16 bg-linear-to-br from-blue-400 to-purple-400 rounded-full opacity-20"
      ></div>
    </div>

    <!-- Hero content -->
    <div class="relative max-w-7xl mx-auto">
      <div class="grid md:grid-cols-2 gap-12 items-center py-20 px-8">
        <div class="text-center md:text-left">
          <h1
            class="text-5xl md:text-6xl font-bold text-gray-800 leading-tight"
          >
            Support Made <span class="text-blue-600">Simple</span>
          </h1>
          <p class="mt-6 text-xl text-gray-600 leading-relaxed">
            Streamline your customer support with our powerful ticket management
            system. Focus on what matters most: delivering exceptional service
            to your customers.
          </p>

          <div
            class="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <RouterLink
              v-if="!isAuth"
              to="/auth/signup"
              class="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transform transition-transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started for Free
            </RouterLink>
            <RouterLink
              v-if="isAuth"
              to="/dashboard"
              class="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transform transition-transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
            </RouterLink>

            <RouterLink
              v-if="!isAuth"
              to="/auth/login"
              class="btn btn-outline border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg text-lg transform transition-transform hover:scale-105"
            >
              Login
            </RouterLink>
          </div>
        </div>

        <!-- Mock Dashboard Illustration -->
        <div class="relative hidden md:block">
          <div
            class="relative w-full h-[500px] bg-white rounded-lg shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300"
          >
            <div
              class="absolute inset-0 bg-linear-to-br from-blue-100 to-purple-100 rounded-lg"
            ></div>
            <div class="relative space-y-4">
              <div class="w-full h-12 bg-white rounded-lg shadow-sm"></div>
              <div class="w-3/4 h-12 bg-white rounded-lg shadow-sm"></div>
              <div class="w-5/6 h-12 bg-white rounded-lg shadow-sm"></div>
              <div class="grid grid-cols-2 gap-4 mt-6">
                <div class="h-24 bg-white rounded-lg shadow-sm"></div>
                <div class="h-24 bg-white rounded-lg shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature Boxes -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-20">
        <div
          class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300"
        >
          <div
            class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6"
          >
            <Zap class="w-8 h-8 text-blue-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-4">Lightning Fast</h3>
          <p class="text-gray-600">
            Handle support tickets with unprecedented speed and efficiency.
          </p>
        </div>

        <div
          class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300"
        >
          <div
            class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6"
          >
            <Settings class="w-8 h-8 text-purple-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-4">
            Easy to Customize
          </h3>
          <p class="text-gray-600">
            Tailor the system to match your specific workflow and requirements.
          </p>
        </div>

        <div
          class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300"
        >
          <div
            class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6"
          >
            <MessageSquare class="w-8 h-8 text-pink-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-4">
            Real-time Support
          </h3>
          <p class="text-gray-600">
            Engage with your customers in real-time for better resolution times.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
