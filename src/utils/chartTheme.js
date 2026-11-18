/**
 * PharmaWRK chart theme (ApexCharts).
 *
 * Categorical palette — fixed order, never cycled. Validated with the dataviz
 * six-checks validator (lightness band, chroma floor, adjacent CVD ΔE ≥ 8,
 * normal-vision floor, ≥ 3:1 contrast) on both chart surfaces:
 *   light on #FFFFFF  ·  dark on #111A2B
 * Slots 1–3 also pass the all-pairs check (pie/doughnut/scatter safe).
 */
export const SERIES_LIGHT = [
  "#047857", // 1 emerald (brand)
  "#2563EB", // 2 blue
  "#D97706", // 3 amber
  "#8B5CF6", // 4 violet
  "#EC4899", // 5 pink
  "#0891B2", // 6 cyan
];
export const SERIES_DARK = [
  "#059669",
  "#3B82F6",
  "#D97706",
  "#8B5CF6",
  "#EC4899",
  "#0891B2",
];
/** Neutral for an "Other" bucket. */
export const OTHER_LIGHT = "#94A3B8";
export const OTHER_DARK = "#64748B";

export function seriesColors(dark, n) {
  const p = dark ? SERIES_DARK : SERIES_LIGHT;
  return p.slice(0, Math.min(n || p.length, p.length));
}

const nf = new Intl.NumberFormat("en-IN");
export const formatNumber = (v) =>
  v === null || v === undefined || Number.isNaN(Number(v))
    ? "–"
    : nf.format(Number(v));
export const formatCompact = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return v;
  if (Math.abs(n) >= 1e7) return `${+(n / 1e7).toFixed(1)}Cr`;
  if (Math.abs(n) >= 1e5) return `${+(n / 1e5).toFixed(1)}L`;
  if (Math.abs(n) >= 1e3) return `${+(n / 1e3).toFixed(1)}k`;
  return nf.format(n);
};

/** Base ApexCharts options shared by every chart. Deep-merge your own on top. */
export function apexBase(dark = false) {
  const text = dark ? "#94A3B8" : "#64748B";
  const grid = dark ? "rgba(226,232,240,0.08)" : "rgba(15,23,42,0.07)";
  return {
    chart: {
      fontFamily: "Inter, Roboto, system-ui, sans-serif",
      foreColor: text,
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: "easeout",
        speed: 450,
        animateGradually: { enabled: true, delay: 40 },
      },
      parentHeightOffset: 0,
    },
    theme: { mode: dark ? "dark" : "light" },
    colors: seriesColors(dark),
    grid: {
      borderColor: grid,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 6, right: 10, top: 0, bottom: 0 },
    },
    dataLabels: { enabled: false },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "12.5px",
      fontWeight: 500,
      labels: { colors: dark ? "#CBD5E1" : "#334155" },
      markers: { size: 6, shape: "circle", strokeWidth: 0, offsetX: -2 },
      itemMargin: { horizontal: 12, vertical: 4 },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "11.5px" }, hideOverlappingLabels: true },
      crosshairs: {
        stroke: { color: dark ? "#475569" : "#CBD5E1", width: 1, dashArray: 3 },
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "11.5px" },
        formatter: (v) => formatCompact(v),
      },
    },
    tooltip: {
      theme: dark ? "dark" : "light",
      shared: true,
      intersect: false,
      style: { fontSize: "12.5px" },
      y: { formatter: (v) => formatNumber(v) },
      marker: { show: true },
    },
    states: {
      hover: { filter: { type: "darken", value: 0.9 } },
      active: { filter: { type: "none" } },
    },
    stroke: { width: 2, curve: "monotoneCubic", lineCap: "round" },
    markers: { size: 0, strokeWidth: 2, hover: { size: 5 } },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        columnWidth: "56%",
      },
      pie: {
        expandOnClick: false,
        donut: {
          size: "68%",
          labels: {
            show: true,
            name: { fontSize: "12.5px", color: text, offsetY: 18 },
            value: {
              fontSize: "24px",
              fontWeight: 700,
              color: dark ? "#E5E7EB" : "#0F172A",
              offsetY: -12,
              formatter: (v) => formatNumber(v),
            },
            total: {
              show: true,
              label: "Total",
              color: text,
              fontSize: "12.5px",
              formatter: (w) =>
                formatNumber(w.globals.seriesTotals.reduce((a, b) => a + b, 0)),
            },
          },
        },
      },
    },
    noData: {
      text: "No data for this period",
      style: { color: text, fontSize: "13px" },
    },
  };
}

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
/** Small deep merge (arrays replace). */
export function mergeOptions(base, extra) {
  const out = { ...base };
  Object.keys(extra || {}).forEach((k) => {
    out[k] = isObj(base[k]) && isObj(extra[k])
      ? mergeOptions(base[k], extra[k])
      : extra[k];
  });
  return out;
}
