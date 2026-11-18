<template>
  <div class="pw-chart" :style="{ minHeight: heightPx }">
    <apexchart
      :key="themeKey"
      :type="type"
      :height="height"
      :options="mergedOptions"
      :series="series"
    />
  </div>
</template>

<script>
/**
 * Themed ApexCharts wrapper. Applies the PharmaWRK chart theme (palette,
 * typography, grid, tooltip, legend) for the current light/dark theme.
 *   <PwChart type="bar" :series="[...]" :options="{ xaxis: { categories } }" />
 */
import VueApexCharts from "vue3-apexcharts";
import { apexBase, mergeOptions, seriesColors } from "@/utils/chartTheme.js";

export default {
  name: "PwChart",
  components: { apexchart: VueApexCharts },
  props: {
    type: { type: String, default: "line" },
    series: { type: Array, default: () => [] },
    options: { type: Object, default: () => ({}) },
    height: { type: [Number, String], default: 280 },
  },
  computed: {
    dark() {
      return !!this.$vuetify.theme.current.dark;
    },
    themeKey() {
      return this.dark ? "dark" : "light";
    },
    heightPx() {
      return typeof this.height === "number" ? `${this.height}px` : this.height;
    },
    mergedOptions() {
      const base = apexBase(this.dark);
      if (this.type === "donut" || this.type === "pie") {
        base.tooltip = { ...base.tooltip, shared: false };
        base.stroke = { width: 2, colors: [this.dark ? "#111A2B" : "#FFFFFF"] };
        base.legend = { ...base.legend, position: "bottom", horizontalAlign: "center" };
      }
      if (this.type === "bar") {
        // 2px surface gap between adjacent bars
        base.stroke = { show: true, width: 2, colors: ["transparent"] };
      }
      if (this.type === "area") {
        base.fill = {
          type: "gradient",
          gradient: { shadeIntensity: 0, opacityFrom: 0.22, opacityTo: 0.02, stops: [0, 95] },
        };
      }
      const n = (this.series || []).length;
      if (n && this.type !== "donut" && this.type !== "pie") {
        base.colors = seriesColors(this.dark, n);
      }
      return mergeOptions(base, this.options);
    },
  },
};
</script>

<style scoped>
.pw-chart {
  width: 100%;
}
.pw-chart :deep(.apexcharts-tooltip) {
  border-radius: 10px !important;
  border: 1px solid var(--pw-border) !important;
  box-shadow: var(--pw-shadow-md) !important;
}
.pw-chart :deep(.apexcharts-tooltip-title) {
  font-weight: 600 !important;
  background: transparent !important;
  border-bottom: 1px solid var(--pw-border) !important;
}
.pw-chart :deep(.apexcharts-legend-text) {
  font-family: inherit !important;
}
</style>
