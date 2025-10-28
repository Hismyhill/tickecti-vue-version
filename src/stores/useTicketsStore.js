// src/stores/useTicketsStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/config/supabase";

export const useTicketsStore = defineStore("tickets", () => {
  // --- State ---
  const tickets = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // --- Getters ---
  const openTickets = computed(() =>
    tickets.value.filter((t) => t.status === "open")
  );
  const inProgressTickets = computed(() =>
    tickets.value.filter((t) => t.status === "in-progress")
  );
  const closedTickets = computed(() =>
    tickets.value.filter((t) => t.status === "closed")
  );

  // --- Actions ---

  async function fetchTickets() {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      tickets.value = data || [];
    } catch (err) {
      console.error("Error fetching tickets:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function createTicket(ticketData) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from("tickets")
        .insert([ticketData])
        .select()
        .single();
      if (err) throw err;
      tickets.value.unshift(data);
      return data;
    } catch (err) {
      console.error("Error creating ticket:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function updateTicket(id, updates) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from("tickets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (err) throw err;
      const index = tickets.value.findIndex((t) => t.id === id);
      if (index !== -1) tickets.value[index] = data;
      return data;
    } catch (err) {
      console.error("Error updating ticket:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTicket(id) {
    loading.value = true;
    error.value = null;
    try {
      const { error: err } = await supabase
        .from("tickets")
        .delete()
        .eq("id", id);
      if (err) throw err;
      tickets.value = tickets.value.filter((t) => t.id !== id);
    } catch (err) {
      console.error("Error deleting ticket:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // --- Realtime Sync (Optional) ---
  async function subscribeToChanges() {
    const channel = supabase
      .channel("tickets-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tickets" },
        async () => await fetchTickets()
      )
      .subscribe();
    return channel;
  }

  return {
    // state
    tickets,
    loading,
    error,

    // getters
    openTickets,
    inProgressTickets,
    closedTickets,

    // actions
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    subscribeToChanges,
  };
});
