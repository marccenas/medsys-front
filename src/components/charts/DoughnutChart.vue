<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
});

const palette = [
  "#2d76d6", // MedSystem blue
  "#1e5fb7", // deep blue
  "#22c55e", // green
  "#f59e0b", // orange
  "#ef4444", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: props.labels.map((_, i) => palette[i % palette.length]),
      borderColor: "#ffffff",
      borderWidth: 2,
      hoverOffset: 6,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "right" },
    tooltip: { enabled: true },
  },
  cutout: "70%",
}));
</script>

<style scoped>
:deep(canvas) {
  max-height: 240px;
}
</style>
