<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"
  >
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800">
          Welcome Back!
        </h2>
        <p class="text-center text-gray-500 mt-2 mb-8">
          Sign in to continue to your account
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <MailIcon class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="form.email"
              id="email"
              type="email"
              placeholder="Enter your email"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <LockIcon class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="form.password"
              id="password"
              type="password"
              placeholder="Enter your password"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <div class="text-right">
            <a
              href="#"
              class="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full btn btn-primary cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? "Logging in..." : "Login" }}
          </button>

          <p class="text-center text-sm text-gray-500">
            Don't have an account?
            <RouterLink
              to="/auth/signup"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { notifyInfo, notifySuccess } from "@/utils/notify";
import { LockIcon, MailIcon, User2 } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = ref({
  email: "",
  password: "",
});
const errors = ref({});
const isSubmitting = ref(false);
const from = "/dashboard";

function validate() {
  const newErrors = {};
  if (!form.value.email) newErrors.email = "Email is required";
  if (!form.value.password) newErrors.password = "Password is required";
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!validate()) return;

  try {
    isSubmitting.value = true;
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
    });
    notifySuccess("Logged in successfully");
    router.replace(route.query.redirect || "/dashboard");
  } catch (err) {
    notifyInfo(err.message || "Invalid credentials");
  } finally {
    isSubmitting.value = false;
  }
}
</script>
