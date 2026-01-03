<template>
  <div class="chart-card ldc">
    <!-- donut -->
    <div class="donut-area">
      <svg
        class="donut"
        :width="size"
        :height="size"
        :viewBox="`0 0 ${size} ${size}`"
        role="img"
        aria-label="Lab results donut chart"
      >
        <defs>
          <!-- subtle grain texture -->
          <filter id="ldcNoise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 .07 0"
            />
          </filter>

          <!-- glossy highlight -->
          <radialGradient id="ldcGloss" cx="30%" cy="28%" r="70%">
            <stop offset="0%" stop-color="rgba(255,255,255,.22)" />
            <stop offset="55%" stop-color="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <!-- ring segments (rotated) - ✅ NO SHADOW -->
        <g :transform="`rotate(-90 ${cx} ${cy})`">
          <!-- subtle bg ring -->
          <circle class="ring-bg" :cx="cx" :cy="cy" :r="r" :stroke-width="stroke" />

          <!-- chart.js-like separators: white stroke behind each segment -->
          <circle
            v-for="seg in segments"
            :key="seg.key + '-sep'"
            class="ring-sep"
            :cx="cx"
            :cy="cy"
            :r="r"
            :stroke-width="stroke + sep"
            :stroke-dasharray="seg.dasharray"
            :stroke-dashoffset="seg.dashoffset"
          />

          <!-- colored slices -->
          <circle
            v-for="seg in segments"
            :key="seg.key"
            class="ring"
            :cx="cx"
            :cy="cy"
            :r="r"
            :stroke="seg.color"
            :stroke-width="stroke"
            :stroke-dasharray="seg.dasharray"
            :stroke-dashoffset="seg.dashoffset"
          />
        </g>

        <!-- inner hole -->
        <circle class="hole" :cx="cx" :cy="cy" :r="holeR" />

        <!-- grain + gloss overlay -->
        <circle class="noise" :cx="cx" :cy="cy" :r="r + stroke / 2" filter="url(#ldcNoise)" />
        <circle class="gloss" :cx="cx" :cy="cy" :r="r + stroke / 2" fill="url(#ldcGloss)" />

        <!-- % labels (NOT rotated) -->
        <g class="labels">
          <text
            v-for="lab in sliceLabels"
            :key="lab.key"
            class="pct"
            :x="lab.x"
            :y="lab.y"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ lab.pct }}%
          </text>
        </g>
      </svg>
    </div>

    <!-- legend: 2x2 grid -->
    <div class="legend">
      <div v-for="it in normalized" :key="it.key" class="leg-row">
        <span class="sw" :style="{ background: it.color }" />
        <span class="leg-name">{{ it.label }}</span>
        <span class="leg-pct">{{ it.pct }}%</span>
      </div>
    </div>

    <!-- OPTIONAL: full-width button if you want it here -->
    <!--
    <button class="view-report-btn">View Report</button>
    -->
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  items: { type: Array, default: () => [] }, // [{label,value,color}]
  size: { type: Number, default: 240 },
  stroke: { type: Number, default: 30 }, // fat like design
  centerTitle: { type: String, default: "" }, // kept for compatibility
  centerValue: { type: String, default: "" }, // kept for compatibility
});

// chart.js-like "borderWidth + spacing" feel
const sep = 4; // tweak 3–6 to match exact gap thickness

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);

// ring radius (slightly tighter for chart-card padding)
const r = computed(() => (props.size / 2) - (props.stroke / 2) - 12);

// inner hole radius closer to chart.js cutout ~68%
const holeR = computed(() => r.value - (props.stroke / 2) + 1);

const total = computed(() =>
  props.items.reduce((s, it) => s + (Number(it.value) || 0), 0) || 1
);

const normalized = computed(() => {
  return props.items.map((it, idx) => {
    const v = Number(it.value) || 0;
    const pct = Math.round((v / total.value) * 100);
    return {
      key: `${it.label}-${idx}`,
      label: it.label ?? `Item ${idx + 1}`,
      value: v,
      pct,
      color: it.color || "#2f86ff",
    };
  });
});

const C = computed(() => 2 * Math.PI * r.value);

const segments = computed(() => {
  let acc = 0;
  return normalized.value.map((it) => {
    const len = (it.value / total.value) * C.value;
    const dasharray = `${len} ${C.value - len}`;
    const dashoffset = `${-acc}`;
    acc += len;
    return { key: it.key, color: it.color, dasharray, dashoffset };
  });
});

/**
 * Label placement:
 * Use the mid-angle of each slice, and place text centered in the band.
 */
const sliceLabels = computed(() => {
  const out = [];
  let acc = 0;

  const labelRadius = r.value; // centered in stroke band
  for (const it of normalized.value) {
    if (!it.value) continue;

    const segLen = (it.value / total.value) * C.value;
    const mid = acc + segLen / 2;

    const ang = (mid / C.value) * 2 * Math.PI - Math.PI / 2;

    // hide tiny slices to prevent clutter
    if (it.pct < 7) {
      acc += segLen;
      continue;
    }

    out.push({
      key: it.key,
      pct: it.pct,
      x: cx.value + Math.cos(ang) * labelRadius,
      y: cy.value + Math.sin(ang) * labelRadius,
    });

    acc += segLen;
  }

  return out;
});
</script>

<style scoped>
/* card: copied from the chart.js design */
.chart-card{
  position: relative;
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

.ldc{
  width: 100%;
  position: relative;
  z-index: 1;
}

/* donut */
.donut-area{
  display:flex;
  justify-content:center;
  align-items:center;
  padding: 6px 0 8px;
}
.donut{
  display:block;
}

/* rings */
.ring-bg{
  fill: none;
  stroke: rgba(226,232,244,0.65);
}

.ring{
  fill:none;
  stroke-linecap: butt;
}

.ring-sep{
  fill:none;
  stroke: rgba(255,255,255,0.9);
  stroke-linecap: butt;
}

/* inner hole */
.hole{
  fill: rgba(255,255,255,0.92);
  stroke: rgba(226,232,244,0.85);
  stroke-width: 1;
}

/* grain + gloss */
.noise{
  fill: rgba(255,255,255,0.01);
  stroke: transparent;
}

.gloss{
  mix-blend-mode: overlay;
  opacity: .85;
}

/* % labels */
.labels .pct{
  font-weight: 800;
  font-size: 13px;
  fill: rgba(255,255,255,.92);
  paint-order: stroke;
  stroke: rgba(0,0,0,.10);
  stroke-width: 2px;
}

/* legend: 2 columns + chart.js-like typography */
.legend{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 18px;
  padding: 6px 6px 2px;
}

.leg-row{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width: 0;
}

.sw{
  width: 10px;
  height: 10px;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.65);
}

.leg-name{
  font-weight: 800;
  color:#52637a;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* percent badge */
.leg-pct{
  margin-left:auto;
  font-weight: 800;
  font-size: 12px;
  color:#52637a;
  background: rgba(238,242,248,.9);
  border: 1px solid rgba(226,232,244,.9);
  padding: 2px 8px;
  border-radius: 10px;
  line-height: 1.2;
  min-width: 42px;
  text-align: right;
}

/* responsive */
@media (max-width: 520px){
  .legend{ grid-template-columns: 1fr; }
}

/* OPTIONAL button styling if you uncomment it above */
/*
.view-report-btn{
  width: 100%;
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(45,118,214,0.35);
  background: linear-gradient(180deg, #4f8ef7, #2d76d6);
  color: #fff;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: .3px;
  cursor: pointer;
  box-shadow:
    0 10px 20px rgba(45,118,214,0.35),
    inset 0 1px 0 rgba(255,255,255,0.35);
}
*/
</style>
