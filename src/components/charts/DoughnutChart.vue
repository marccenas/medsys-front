<template>
  <div class="chart-card">
    <canvas ref="el"></canvas>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  colors: { type: Array, default: () => [] },
});

const el = ref(null);
let chart;

function getColors() {
  return props.colors.length
    ? props.colors
    : ["#2D76D6", "#1E5FB7", "#22C55E", "#F59E0B", "#EF4444"];
}

function destroyChart() {
  if (chart) {
    chart.destroy();
    chart = null;
  }
}

/**
 * Force animation:
 * 1) Create chart with all-zero dataset
 * 2) Next frame: set real dataset values and call chart.update()
 */
async function makeChart() {
  if (!el.value) return;

  destroyChart();

  const ctx = el.value.getContext("2d");

  // Step 1: initial data (all zero)
  const zeroData = props.values.map(() => 0);

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: props.labels,
      datasets: [
        {
          data: zeroData,
          backgroundColor: getColors(),
          borderColor: "rgba(255,255,255,0.9)",
          borderWidth: 3,
          hoverOffset: 10,
          spacing: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      rotation: -90,
      circumference: 360,

      // ✅ animation ON
      animation: {
        duration: 900,
        easing: "easeOutQuart",
      },

      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: "rectRounded",
            padding: 16,
            color: "#52637a",
            font: { weight: 800 },
          },
        },
        tooltip: {
          backgroundColor: "rgba(15,23,42,0.92)",
          padding: 12,
          cornerRadius: 10,
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
    },
  });

  // Step 2: next frame, set real values and animate fill
  await nextTick();
  requestAnimationFrame(() => {
    if (!chart) return;
    chart.data.datasets[0].data = [...props.values];
    chart.update(); // triggers fill-up animation
  });
}

onMounted(makeChart);

watch(
  () => [props.labels, props.values, props.colors],
  () => makeChart(),
  { deep: true }
);

onBeforeUnmount(() => destroyChart());
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
  background: radial-gradient(circle at 30% 20%, rgba(45,118,214,0.18), transparent 55%);
  pointer-events:none;
}
.chart-card:hover{
  transform: translateY(-1px);
  box-shadow:
    0 22px 42px rgba(34,50,74,0.16),
    inset 0 1px 0 rgba(255,255,255,0.9);
}
canvas{ position: relative; z-index: 1; }
</style>
