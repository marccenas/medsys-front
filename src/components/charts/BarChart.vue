<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
});

const barColors = [
  "#2d76d6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: "Count",
      data: props.values,
      backgroundColor: props.labels.map((_, i) => barColors[i % barColors.length]),
      borderRadius: 10,
      borderSkipped: false,
      barThickness: 28, // ✅ similar thickness to sample
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "rgba(34,50,74,0.08)" }, // softer
      ticks: { color: "#6b7a90", font: { weight: "700" } },
    },
    x: {
      grid: { display: false },
      ticks: { color: "#6b7a90", font: { weight: "700" } },
    },
  },
}));
</script>

<style scoped>
:deep(canvas) {
  max-height: 240px;
}
</style>
