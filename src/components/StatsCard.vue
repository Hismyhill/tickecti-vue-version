<template>
  <div
    :class="`card bg-linear-to-br from-${color}-50 to-${color}-100 border border-${color}-200`"
  >
    <div class="flex items-center justify-between">
      <div>
        <h4 :class="`text-${color}-600 font-semibold`">{{ title }}</h4>
        <div class="mt-2 text-3xl font-bold text-gray-800">{{ value }}</div>
      </div>
      <div
        :class="`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`"
      >
        <slot name="icon"></slot>
      </div>
    </div>

    <div
      v-if="percentage !== undefined"
      class="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden"
    >
      <div
        :class="`h-1 bg-${color}-600 rounded-full`"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>

    <p :class="`mt-2 text-sm text-${color}-600`">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  color: String,
  subtitle: String,
  percentage: Number,
});
</script>
