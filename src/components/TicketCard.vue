<template>
  <article
    class="card"
    role="article"
    :aria-labelledby="`ticket-${ticket.id}-title`"
  >
    <div class="flex items-start justify-between">
      <div>
        <h3 :id="`ticket-${ticket.id}-title`" class="font-semibold">
          {{ ticket.title }}
        </h3>
        <p class="mt-2 text-sm text-slate-600" aria-label="Ticket description">
          {{ truncatedDescription }}
        </p>
      </div>

      <div class="text-right flex flex-col items-end gap-2">
        <span
          :class="['status-tag', statusClasses[ticket.status]]"
          role="status"
          :aria-label="`Ticket status: ${ticket.status.replace('-', ' ')}`"
        >
          {{ ticket.status.replace("-", " ") }}
        </span>

        <div class="flex gap-2" role="group" aria-label="Ticket actions">
          <button
            @click="onEdit(ticket)"
            class="cursor-pointer p-2 hover:bg-gray-100 rounded"
          >
            <span class="sr-only">Edit</span>
            <Pencil class="w-4 h-4" />
          </button>
          <button
            @click="onDelete(ticket.id)"
            class="cursor-pointer p-2 hover:bg-gray-100 rounded"
          >
            <span class="sr-only">Delete</span>
            <Trash2 class="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
    validator: (t) =>
      "id" in t &&
      "title" in t &&
      "status" in t &&
      ["open", "in-progress", "closed"].includes(t.status),
  },
  onEdit: { type: Function, required: true },
  onDelete: { type: Function, required: true },
});

const statusClasses = {
  open: "bg-open/10 text-open",
  "in-progress": "bg-in_progress/10 text-in_progress",
  closed: "bg-closed/10 text-closed",
};

const truncatedDescription = computed(() => {
  const desc = props.ticket.description || "";
  return desc.length > 200 ? desc.slice(0, 200) + "..." : desc;
});
</script>
