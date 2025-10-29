<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"
  >
    <div class="w-full max-w-md my-auto">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800">
          Create Your Account
        </h2>
        <p class="text-center text-gray-500 mt-2 mb-8">
          Join us and start managing your tickets!
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <User2 class="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="full-name"
              v-model="form.name"
              name="full-name"
              type="text"
              autocomplete="name"
              required
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <MailIcon class="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="email-address"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <LockIcon class="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <div
            v-if="errorMsg"
            class="p-4 text-sm text-red-700 bg-red-100 rounded-lg"
          >
            {{ errorMsg }}
          </div>
          <div
            v-if="successMsg"
            class="p-4 text-sm text-green-700 bg-green-100 rounded-lg"
          >
            {{ successMsg }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            >
              {{ isSubmitting ? "Creating Account..." : "Create Account" }}
            </button>
          </div>

          <p class="text-center text-sm text-gray-500">
            Already have an account?
            <router-link
              to="/auth/login"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { LockIcon, MailIcon, User2 } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: "",
  email: "",
  password: "",
});
const errors = ref({});
const isSubmitting = ref(false);
const successMsg = ref("");
const errorMsg = ref("");

async function handleSubmit() {
  try {
    isSubmitting.value = true;
    errors.value = validate();
    if (Object.keys(errors.value).length) {
      isSubmitting.value = false;
      return;
    }

    const result = await authStore.signup(form.value);
    if (result?.user) {
      successMsg.value = "Account created successfully! Redirecting...";
      errorMsg.value = "";
      setTimeout(() => {
        router.replace("/dashboard");
      }, 2000);
    } else {
      errorMsg.value = "Something went wrong. Please try again.";
      successMsg.value = "";
    }
  } catch (err) {
    errorMsg.value = err.message || "Signup failed";
    successMsg.value = "";
  } finally {
    isSubmitting.value = false;
  }
}

function validate() {
  const errors = {};
  if (!form.value.name) errors.name = "Name is required";
  if (!form.value.email) errors.email = "Email is required";
  if (!form.value.password) {
    errors.password = "Password is required";
  } else if (form.value.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  return errors;
}
</script>
