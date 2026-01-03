<template>
  <div class="lr-mini-card">
    <!-- donut -->
    <div class="lr-donut-wrap">
      <svg
        class="lr-donut"
        :width="size"
        :height="size"
        :viewBox="`0 0 ${size} ${size}`"
        role="img"
        aria-label="Lab results donut chart"
      >
        <defs>
          <!-- subtle grain -->
          <filter id="lrNoise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 .08 0"
            />
          </filter>

          <!-- soft gloss -->
          <radialGradient id="lrGloss" cx="30%" cy="26%" r="70%">
            <stop offset="0%" stop-color="rgba(255,255,255,.22)" />
            <stop offset="55%" stop-color="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <!-- segments rotated -90 so start at top -->
        <g :transform="`rotate(-90 ${cx} ${cy})`">
          <circle class="lr-ring-bg" :cx="cx" :cy="cy" :r="r" :stroke-width="stroke" />

          <!-- separators (white gaps) -->
          <circle
            v-for="seg in segments"
            :key="seg.key + '-sep'"
            class="lr-ring-sep"
            :cx="cx"
            :cy="cy"
            :r="r"
            :stroke-width="stroke + sep"
            :stroke-dasharray="seg.dasharray"
            :stroke-dashoffset="seg.dashoffset"
          />

          <!-- colored arcs -->
          <circle
            v-for="seg in segments"
            :key="seg.key"
            class="lr-ring"
            :cx="cx"
            :cy="cy"
            :r="r"
            :stroke="seg.color"
            :stroke-width="stroke"
            :stroke-dasharray="seg.dasharray"
            :stroke-dashoffset="seg.dashoffset"
          />
        </g>

        <!-- hole -->
        <circle class="lr-hole" :cx="cx" :cy="cy" :r="holeR" />

        <!-- overlays (no drop shadow like your latest ref) -->
        <circle class="lr-noise" :cx="cx" :cy="cy" :r="r + stroke / 2" filter="url(#lrNoise)" />
        <circle class="lr-gloss" :cx="cx" :cy="cy" :r="r + stroke / 2" fill="url(#lrGloss)" />

        <!-- % labels -->
        <g class="lr-labels">
          <text
            v-for="lab in sliceLabels"
            :key="lab.key"
            class="lr-pct"
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

    <!-- legend (2 columns, with count badges like screenshot) -->
    <div class="lr-legend">
      <div v-for="it in normalized" :key="it.key" class="lr-leg-row">
        <span class="lr-sw" :style="{ background: it.color }" />
        <span class="lr-name">{{ it.label }}</span>
        <span class="lr-badge">{{ it.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

/**
 * items: [{ label: "Normal", value: 15, color: "#2F86FF" }, ...]
 * Matches screenshot-style legend (label + count badge).
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  size: { type: Number, default: 170 },  // smaller donut like screenshot
  stroke: { type: Number, default: 26 }, // medium ring thickness
});

// chart-like white separators
const sep = 4;

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);

// padding to fit nicely
const r = computed(() => props.size / 2 - props.stroke / 2 - 10);
const holeR = computed(() => r.value - props.stroke / 2 + 1);

const total = computed(() => {
  const t = props.items.reduce((s, it) => s + (Number(it.value) || 0), 0);
  return t || 1;
});

const normalized = computed(() =>
  props.items.map((it, idx) => {
    const v = Number(it.value) || 0;
    const pct = Math.round((v / total.value) * 100);
    return {
      key: `${it.label ?? "Item"}-${idx}`,
      label: it.label ?? `Item ${idx + 1}`,
      value: v,
      pct,
      color: it.color || "#2F86FF",
    };
  })
);

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

// label positions (centered in band)
const sliceLabels = computed(() => {
  const out = [];
  let acc = 0;

  const labelRadius = r.value; // center of ring band
  for (const it of normalized.value) {
    if (!it.value) continue;

    const segLen = (it.value / total.value) * C.value;
    const mid = acc + segLen / 2;
    const ang = (mid / C.value) * 2 * Math.PI - Math.PI / 2;

    // hide tiny slices
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
/* card like the screenshot: soft, light, rounded */
.lr-mini-card{
  border-radius: 14px;
  border: 1px solid rgba(226,232,244,0.9);
  background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,249,255,0.72));
  box-shadow:
    0 14px 26px rgba(34,50,74,0.10),
    inset 0 1px 0 rgba(255,255,255,0.9);
  padding: 12px 12px 10px;
  overflow: hidden;
}

/* top donut area */
.lr-donut-wrap{
  display:flex;
  justify-content:center;
  align-items:center;
  padding: 6px 6px 8px;
}

.lr-donut{ display:block; }

/* ring styles */
.lr-ring-bg{
  fill:none;
  stroke: rgba(226,232,244,0.65);
}

.lr-ring{
  fill:none;
  stroke-linecap: butt;
}

.lr-ring-sep{
  fill:none;
  stroke: rgba(255,255,255,0.95);
  stroke-linecap: butt;
}

/* hole */
.lr-hole{
  fill: rgba(255,255,255,0.92);
  stroke: rgba(226,232,244,0.85);
  stroke-width: 1;
}

/* overlays */
.lr-noise{
  fill: rgba(255,255,255,0.01);
  stroke: transparent;
}
.lr-gloss{
  mix-blend-mode: overlay;
  opacity: .85;
}

/* labels */
.lr-pct{
  font-weight: 900;
  font-size: 12px;
  fill: rgba(255,255,255,.95);
  paint-order: stroke;
  stroke: rgba(0,0,0,.10);
  stroke-width: 2px;
}

/* legend: 2 columns with badges */
.lr-legend{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 14px;
  padding: 2px 6px 0;
}

.lr-leg-row{
  display:flex;
  align-items:center;
  gap: 8px;
  min-width: 0;
}

.lr-sw{
  width: 10px;
  height: 10px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
}

.lr-name{
  font-weight: 800;
  font-size: 12px;
  color:#52637a;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* count badge (small pill) */
.lr-badge{
  margin-left:auto;
  font-weight: 900;
  font-size: 11px;
  color:#52637a;

  background: rgba(238,242,248,.92);
  border: 1px solid rgba(226,232,244,.95);
  padding: 2px 7px;
  border-radius: 9px;
  line-height: 1.1;
  min-width: 22px;
  text-align: center;
}
</style>
