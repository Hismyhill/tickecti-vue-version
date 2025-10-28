import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/config/supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  async function initialize() {
    try {
      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      user.value = session?.user || null;

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user || null;
      });
    } finally {
      loading.value = false;
    }
  }

  async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    user.value = data.user;
    return data;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
  }

  return {
    user,
    loading,
    initialize,
    login,
    logout,
  };
});
