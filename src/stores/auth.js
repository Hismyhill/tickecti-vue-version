import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/config/supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  async function initialize() {
    try {
      const session = JSON.parse(sessionStorage.getItem("session"));
      if (session) {
        user.value = session.user;
      } else {
        const { data } = await supabase.auth.getSession();
        user.value = data.session?.user || null;
        if (data.session) {
          sessionStorage.setItem("session", JSON.stringify(data.session));
        }
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user || null;
        if (session) {
          sessionStorage.setItem("session", JSON.stringify(session));
        } else {
          sessionStorage.removeItem("session");
        }
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
    sessionStorage.setItem("session", JSON.stringify(data.session));
    return data;
  }

  async function signup({ name, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
    user.value = data.user;
    sessionStorage.setItem("session", JSON.stringify(data.session));
    return data;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
    sessionStorage.removeItem("session");
  }

  return {
    user,
    loading,
    initialize,
    login,
    signup,
    logout,
  };
});
