<template>
  <component
    :is="clickable ? 'button' : 'div'"
    class="pw-stat pw-card"
    :class="{ 'pw-card--interactive': clickable }"
    :type="clickable ? 'button' : undefined"
    :aria-label="clickable ? `${title}: open details` : undefined"
    @click="clickable && $emit('click')"
  >
    <div class="pw-stat__head">
      <div class="pw-stat__icon" :style="iconStyle">
        <v-icon size="20">{{ icon }}</v-icon>
      </div>
      <div class="pw-stat__title">{{ title }}</div>
      <v-icon v-if="clickable" size="18" class="pw-stat__go"
        >mdi-arrow-top-right</v-icon
      >
    </div>

    <div class="pw-stat__primary">
      <v-skeleton-loader
        v-if="loading"
        type="heading"
        width="120"
        class="ml-n4"
      />
      <template v-else>
        <span class="pw-stat__value pw-num">{{ format(value) }}</span>
        <span v-if="valueLabel" class="pw-stat__value-label">{{
          valueLabel
        }}</span>
      </template>
    </div>

    <div v-if="metrics.length" class="pw-stat__grid">
      <div v-for="m in metrics" :key="m.label" class="pw-stat__metric">
        <div class="pw-stat__metric-label">{{ m.label }}</div>
        <div class="pw-stat__metric-value pw-num">
          {{ loading ? "–" : format(m.value) }}
        </div>
      </div>
    </div>
  </component>
</template>

<script>
/**
 * KPI / stat card. Presentational only.
 *  <StatCard title="Users Attendance" icon="mdi-account-star"
 *            :value="12" value-label="Present"
 *            :metrics="[{ label: 'Absent', value: 3 }]" clickable @click="..." />
 */
export default {
  name: "StatCard",
  props: {
    title: { type: String, required: true },
    icon: { type: String, default: "mdi-chart-box-outline" },
    value: { type: [Number, String], default: null },
    valueLabel: { type: String, default: "" },
    metrics: { type: Array, default: () => [] },
    accent: { type: String, default: "#047857" },
    clickable: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  emits: ["click"],
  computed: {
    iconStyle() {
      return {
        color: this.accent,
        background: `color-mix(in srgb, ${this.accent} 12%, transparent)`,
      };
    },
  },
  methods: {
    format(v) {
      if (v === null || v === undefined || v === "") return "–";
      const n = Number(v);
      return Number.isFinite(n) ? n.toLocaleString("en-IN") : v;
    },
  },
};
</script>

<style scoped>
.pw-stat {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 18px 20px 16px;
  text-align: left;
  font: inherit;
  color: inherit;
}
.pw-stat:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
.pw-stat__head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pw-stat__icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.pw-stat__title {
  font-size: 14px;
  font-weight: 600;
  flex: 1;
}
.pw-stat__go {
  color: var(--pw-muted);
  transition: transform 0.18s ease, color 0.18s ease;
}
.pw-stat:hover .pw-stat__go {
  color: rgb(var(--v-theme-primary));
  transform: translate(2px, -2px);
}
.pw-stat__primary {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 16px 0 14px;
  min-height: 40px;
}
.pw-stat__value {
  font-size: 32px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.pw-stat__value-label {
  font-size: 13px;
  color: var(--pw-muted);
  font-weight: 500;
}
.pw-stat__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 10px 12px;
  padding-top: 14px;
  border-top: 1px dashed var(--pw-border-strong);
}
.pw-stat__metric-label {
  font-size: 11.5px;
  color: var(--pw-muted);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pw-stat__metric-value {
  font-size: 15px;
  font-weight: 600;
  margin-top: 2px;
}
</style>
