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
      borderColor: "rgba(255,255,255,0.9)",
      borderWidth: 3,
      spacing: 2, 
      hoverOffset: 6,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        pointStyle: "rectRounded",
        padding: 14,
        color: "#6b7a90",
        font: { weight: "700" },
      },
    },
    tooltip: { enabled: true },
  },
}));
</script>

<style scoped>
:deep(canvas) {
  max-height: 240px;
}
</style>
