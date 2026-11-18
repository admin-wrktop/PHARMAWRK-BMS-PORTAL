<template>
  <div
    class="pw-loader"
    :class="[`pw-loader--${mode}`, { 'is-on': overlay }]"
    role="status"
    aria-live="polite"
    :aria-busy="overlay ? 'true' : 'false'"
    :aria-hidden="overlay ? 'false' : 'true'"
  >
    <template v-if="rendered">
      <v-progress-linear
        indeterminate
        color="primary"
        height="3"
        class="pw-loader__bar"
      />

      <!-- First load: skeleton of a listing page -->
      <div v-if="mode === 'skeleton'" class="pw-loader__skeleton" aria-hidden="true">
        <div class="pw-loader__filters">
          <span v-for="n in 4" :key="n" class="pw-shimmer pw-loader__field"></span>
          <span class="pw-shimmer pw-loader__btn"></span>
        </div>
        <div class="pw-loader__thead">
          <span v-for="n in 6" :key="n" class="pw-shimmer pw-loader__th"></span>
        </div>
        <div v-for="r in 8" :key="r" class="pw-loader__row">
          <span class="pw-shimmer pw-loader__avatar"></span>
          <span class="pw-loader__cell-group">
            <span class="pw-shimmer pw-loader__line" :style="{ width: 90 + ((r * 37) % 70) + 'px' }"></span>
            <span class="pw-shimmer pw-loader__line pw-loader__line--sub" :style="{ width: 60 + ((r * 53) % 50) + 'px' }"></span>
          </span>
          <span
            v-for="c in 4"
            :key="c"
            class="pw-shimmer pw-loader__cell"
            :style="{ width: 50 + (((r + c) * 29) % 80) + 'px' }"
          ></span>
        </div>
      </div>

      <!-- Refresh: keep content visible, show a small pill -->
      <div v-else class="pw-loader__pill">
        <v-progress-circular indeterminate color="primary" size="16" width="2" />
        <span>{{ mode === "fullscreen" ? "Loading…" : "Updating…" }}</span>
      </div>
      <span class="pw-sr-only">Loading</span>
    </template>
  </div>
</template>

<script>
/**
 * Shared page loader (prop API unchanged: `overlay`).
 *  - inside a page with no rows yet → skeleton of the listing
 *  - inside a page that already shows data → dimmed content + "Updating…"
 *  - outside any card/page surface → small fullscreen pill
 */
export default {
  props: {
    overlay: Boolean,
  },
  data: () => ({
    mode: "skeleton",
    rendered: false,
    hideTimer: null,
  }),
  watch: {
    // Class-based fade (no <transition> leave state that can get stuck when
    // loading toggles on/off quickly).
    overlay: {
      immediate: true,
      handler(on) {
        clearTimeout(this.hideTimer);
        if (on) {
          this.pickMode();
          this.rendered = true;
        } else {
          this.hideTimer = setTimeout(() => {
            this.rendered = false;
          }, 260);
        }
      },
    },
  },
  beforeUnmount() {
    clearTimeout(this.hideTimer);
  },
  methods: {
    pickMode() {
      // decide before paint, from the surrounding DOM
      const anchor = this.$el && this.$el.parentElement
        ? this.$el.parentElement
        : this.$parent && this.$parent.$el;
      const host =
        anchor && anchor.closest
          ? anchor.closest(".pw-surface, .v-dialog .v-card, .v-card")
          : null;
      if (!host) {
        this.mode = "fullscreen";
        return;
      }
      if (host.closest(".v-dialog")) {
        this.mode = "dim";
        return;
      }
      const hasRows = host.querySelector(
        "tbody tr:not(.v-data-table-rows-no-data):not(.v-data-table-progress)",
      );
      const hasCards = host.querySelector(".pw-stat .pw-stat__value");
      this.mode = hasRows || hasCards ? "dim" : "skeleton";
    },
  },
};
</script>

<style scoped>
.pw-loader {
  position: absolute;
  inset: 0;
  z-index: 20;
  border-radius: inherit;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.22s ease, visibility 0s linear 0.22s;
}
.pw-loader.is-on {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity 0.18s ease, visibility 0s;
}
.pw-loader--skeleton {
  background: rgb(var(--v-theme-surface));
}
.pw-loader--dim {
  background: rgba(var(--v-theme-surface), 0.62);
  backdrop-filter: blur(1px);
}
.pw-loader--fullscreen {
  position: fixed;
  z-index: 2400;
  background: rgba(15, 23, 42, 0.18);
  display: grid;
  place-items: center;
}
.pw-loader__bar {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
.pw-loader--fullscreen .pw-loader__bar {
  position: fixed !important;
}

/* skeleton */
.pw-loader__skeleton {
  padding: 4px 0 0;
}
.pw-loader__filters {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--pw-border);
}
.pw-loader__field {
  height: 40px;
  flex: 0 1 200px;
  border-radius: 10px;
}
.pw-loader__btn {
  height: 38px;
  width: 132px;
  margin-left: auto;
  border-radius: 10px;
}
.pw-loader__thead {
  display: flex;
  gap: 48px;
  padding: 14px 20px;
  background: rgb(var(--v-theme-surface-light));
  border-bottom: 1px solid var(--pw-border);
}
.pw-loader__th {
  height: 10px;
  width: 70px;
  border-radius: 4px;
}
.pw-loader__row {
  display: flex;
  align-items: center;
  gap: 40px;
  height: 52px;
  padding: 0 20px;
  border-bottom: 1px solid var(--pw-border);
}
.pw-loader__avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  flex-shrink: 0;
  margin-right: -28px;
}
.pw-loader__cell-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;
}
.pw-loader__line {
  height: 10px;
  border-radius: 4px;
}
.pw-loader__line--sub {
  height: 8px;
  opacity: 0.7;
}
.pw-loader__cell {
  height: 10px;
  border-radius: 4px;
}
.pw-shimmer {
  display: block;
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-on-surface), 0.06) 0%,
    rgba(var(--v-theme-on-surface), 0.12) 40%,
    rgba(var(--v-theme-on-surface), 0.06) 80%
  );
  background-size: 200% 100%;
  animation: pwShimmer 1.3s ease-in-out infinite;
}
@keyframes pwShimmer {
  from {
    background-position: 150% 0;
  }
  to {
    background-position: -50% 0;
  }
}

/* pill */
.pw-loader__pill {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 10px;
  border-radius: 999px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border: 1px solid var(--pw-border);
  box-shadow: var(--pw-shadow-md);
  font-size: 12.5px;
  font-weight: 600;
}
.pw-loader--fullscreen .pw-loader__pill {
  position: static;
  transform: none;
  padding: 10px 18px 10px 14px;
  font-size: 13.5px;
}
</style>
