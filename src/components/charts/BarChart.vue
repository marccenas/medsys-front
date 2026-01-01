<template>
  <div class="chart-card chart-anim">
    <canvas ref="el"></canvas>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  colors: { type: Array, default: () => [] },
});

const el = ref(null);
let chart;

function makeChart() {
  if (!el.value) return;
  if (chart) chart.destroy();

  const ctx = el.value.getContext("2d");

  const defaultColors = ["#2D76D6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: props.labels,
      datasets: [
        {
          label: "",
          data: props.values,
          backgroundColor: props.colors.length ? props.colors : defaultColors.slice(0, props.values.length),
          borderRadius: 10,
          borderSkipped: false,
          barThickness: 26,
        },
      ],
    },
options: {
  responsive: true,
  maintainAspectRatio: false,

  animation: {
    duration: 900,
    easing: "easeOutQuart",
  },

  animations: {
    y: {
      from: 0,
    }
  },

  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(15,23,42,0.92)",
      padding: 12,
      cornerRadius: 10,
      titleColor: "#fff",
      bodyColor: "#fff",
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#52637a", font: { weight: 800 } },
    },
    y: {
      beginAtZero: true,     // IMPORTANT
      grid: { color: "rgba(226,232,244,0.9)" },
      ticks: { color: "#52637a", font: { weight: 800 } },
    },
  },
}
  });
}

onMounted(makeChart);

watch(
  () => [props.labels, props.values, props.colors],
  () => makeChart(),
  { deep: true }
);

onBeforeUnmount(() => chart?.destroy());
</script>

<style scoped>
.chart-card{
  position: relative;
  height: 240px;
  border-radius: 16px;
  border: 1px solid rgba(226,232,244,0.9);
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,249,255,0.65));
  box-shadow:
    0 16px 30px rgba(34,50,74,0.12),
    inset 0 1px 0 rgba(255,255,255,0.9);
  padding: 14px;
  overflow: hidden;
}
.chart-card::before{
  content:"";
  position:absolute;
  inset:-40%;
  background: radial-gradient(circle at 30% 20%, rgba(34,197,94,0.18), transparent 55%);
  pointer-events:none;
}
.chart-card:hover{
  transform: translateY(-1px);
  box-shadow:
    0 22px 42px rgba(34,50,74,0.16),
    inset 0 1px 0 rgba(255,255,255,0.9);
}
.chart-anim{
  animation: chartIn .55s ease-out both;
}
@keyframes chartIn{
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
canvas{ position: relative; z-index: 1; }
</style>
