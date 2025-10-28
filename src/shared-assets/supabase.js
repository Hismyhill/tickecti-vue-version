import { createClient } from "@supabase/supabase-js";

// These environment variables should be set in each implementation's .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  signUp: async ({ email, password, ...metadata }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },
};

// Tickets helper functions
export const tickets = {
  create: async (ticket) => {
    const { data, error } = await supabase
      .from("tickets")
      .insert(ticket)
      .select()
      .single();
    return { data, error };
  },

  update: async (id, ticket) => {
    const { data, error } = await supabase
      .from("tickets")
      .update(ticket)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase.from("tickets").delete().eq("id", id);
    return { error };
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });
    return { data, error };
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },
};

// Constants
export const TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
};

// Utility functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const validateTicket = (ticket) => {
  const errors = {};

  if (!ticket.title?.trim()) {
    errors.title = "Title is required";
  }

  if (!ticket.description?.trim()) {
    errors.description = "Description is required";
  }

  if (!Object.values(TICKET_STATUS).includes(ticket.status)) {
    errors.status = "Invalid status";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
