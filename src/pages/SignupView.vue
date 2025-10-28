<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"
  >
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800">
          Create Your Account
        </h2>
        <p class="text-center text-gray-500 mt-2 mb-8">
          Join us and start managing your tickets!
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="full-name" class="sr-only">Full name</label>
              <input
                id="full-name"
                v-model="form.name"
                name="full-name"
                type="text"
                autocomplete="name"
                required
                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                {{ errors.name }}
              </p>
            </div>
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input
                id="email-address"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
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
import { notifyError, notifySuccess } from "@/utils/notify";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: "",
  email: "",
  password: "",
});
const errors = ref({});
const isSubmitting = ref(false);

async function handleSubmit() {
  try {
    isSubmitting.value = true;
    errors.value = validate();
    if (Object.keys(errors.value).length) return;

    const result = await authStore.signup(form.value);
    if (result?.user) {
      notifySuccess("Account created successfully");
      router.replace("/dashboard");
    } else {
      notifyError("Something went wrong. Please try again.");
    }
  } catch (err) {
    notifyError(err.message || "Signup failed");
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
