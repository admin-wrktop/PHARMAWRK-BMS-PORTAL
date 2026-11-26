<template>
  <!-- "What's new" bar. A Vuetify layout item, so the app bar, drawer and page
       move down by its height; the sign-in page reads --pw-banner-height. -->
  <v-system-bar
    v-if="showBanner"
    order="-1"
    :height="bannerHeight"
    color="primary"
    class="pw-rn-bar support-capture-exclude"
    role="region"
    aria-label="What's new"
  >
    <div ref="barInner" class="pw-rn-bar__inner">
      <v-icon size="18" class="pw-rn-bar__icon">mdi-bullhorn-outline</v-icon>
      <span class="pw-rn-bar__text">
        <strong>What's new</strong>
        <span class="pw-rn-bar__sep" aria-hidden="true">·</span>
        {{ latest.title || "Latest changes" }}
        <span class="pw-rn-bar__date">({{ formatDate(latest.date) }})</span>
      </span>
      <v-btn size="small" variant="flat" color="surface" class="pw-rn-bar__btn" @click="openNotes()">
        See what's new
      </v-btn>
      <v-btn
        icon
        size="x-small"
        variant="text"
        class="pw-rn-bar__close"
        aria-label="Close what's new"
        @click="dismiss()"
      >
        <v-icon size="18">mdi-close</v-icon>
      </v-btn>
    </div>
  </v-system-bar>

  <!-- Release notes: history (newest first) + the running build -->
  <v-dialog v-model="notesOpen" max-width="640" scrollable>
    <v-card class="pw-rn-dialog">
      <v-card-title class="d-flex align-center pt-4 px-5">
        <v-icon color="primary" class="mr-2">mdi-bullhorn-outline</v-icon>
        Release notes
        <v-spacer />
        <v-btn icon variant="text" size="small" aria-label="Close release notes" @click="notesOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="px-5 py-4">
        <section v-for="(r, i) in notes" :key="r.id" class="pw-rn-release" :class="{ 'mt-6': i > 0 }">
          <div class="pw-rn-release__head">
            <h3 class="pw-rn-release__title">{{ r.title || "Release" }}</h3>
            <span class="pw-rn-release__date">{{ formatDate(r.date) }}</span>
            <span v-if="i === 0" class="pw-rn-release__latest">Latest</span>
          </div>
          <ul class="pw-rn-release__notes">
            <li v-for="(n, j) in r.notes" :key="j">{{ n }}</li>
          </ul>
        </section>
      </v-card-text>
      <v-divider />
      <v-card-actions class="px-5">
        <span class="pw-rn-build">{{ buildText }}</span>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="notesOpen = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- A newer version is live and this tab was in use: ask -->
  <v-dialog v-model="updateOpen" max-width="440" persistent>
    <v-card>
      <v-card-title class="pt-4 px-5">New version available</v-card-title>
      <v-card-text class="px-5">
        A newer version of the BMS has been released. Refresh to start using it. Anything you
        haven't saved on this page will be lost, so finish or save it first if you need to.
      </v-card-text>
      <v-card-actions class="px-5 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="skipUpdate()">Skip for now</v-btn>
        <v-btn color="primary" variant="flat" @click="refresh()">Refresh</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  getReleaseNotes,
  latestRelease,
  formatDate,
  buildLabel,
  shouldShowBanner,
  dismissLatest,
  checkForUpdate,
  claimAutoReload,
  reloadPage,
  POLL_MS,
  FOCUS_MIN_GAP_MS,
  SKIP_MS,
  OPEN_RELEASE_NOTES_EVENT,
} from "@/services/releaseNotesService";

export default {
  name: "ReleaseNotesBanner",
  data: () => ({
    notes: getReleaseNotes(),
    latest: latestRelease(),
    showBanner: shouldShowBanner(),
    bannerHeight: 40,
    notesOpen: false,
    updateOpen: false,
    buildText: buildLabel(),
    lastCheck: 0,
    skippedUntil: 0,
    interacted: false,
    pollTimer: null,
    resizeObs: null,
  }),
  watch: {
    showBanner() {
      this.$nextTick(this.observeBanner);
    },
  },
  mounted() {
    window.addEventListener(OPEN_RELEASE_NOTES_EVENT, this.openNotes);
    window.addEventListener("focus", this.onFocus);
    document.addEventListener("visibilitychange", this.onFocus);
    window.addEventListener("pointerdown", this.onInteract, { once: true, capture: true });
    window.addEventListener("keydown", this.onInteract, { once: true, capture: true });
    this.observeBanner();
    this.runCheck();
    this.pollTimer = setInterval(this.runCheck, POLL_MS);
  },
  beforeUnmount() {
    window.removeEventListener(OPEN_RELEASE_NOTES_EVENT, this.openNotes);
    window.removeEventListener("focus", this.onFocus);
    document.removeEventListener("visibilitychange", this.onFocus);
    window.removeEventListener("pointerdown", this.onInteract, { capture: true });
    window.removeEventListener("keydown", this.onInteract, { capture: true });
    clearInterval(this.pollTimer);
    if (this.resizeObs) this.resizeObs.disconnect();
    this.setBannerVar(0);
  },
  methods: {
    formatDate,
    openNotes() {
      this.notesOpen = true;
      // Reading the notes counts as seen.
      if (this.showBanner) this.dismiss();
    },
    dismiss() {
      dismissLatest();
      this.showBanner = false;
    },
    // ---- banner height -> layout and --pw-banner-height
    setBannerVar(px) {
      document.documentElement.style.setProperty("--pw-banner-height", `${px}px`);
    },
    observeBanner() {
      if (this.resizeObs) this.resizeObs.disconnect();
      const el = this.$refs.barInner;
      if (!this.showBanner || !el) {
        this.setBannerVar(0);
        return;
      }
      const measure = () => {
        const h = Math.max(40, Math.ceil(el.scrollHeight) + 8);
        this.bannerHeight = h;
        this.setBannerVar(h);
      };
      measure();
      if (typeof ResizeObserver !== "undefined") {
        this.resizeObs = new ResizeObserver(measure);
        this.resizeObs.observe(el);
      }
    },
    // ---- new-version check
    onInteract() {
      this.interacted = true;
    },
    onFocus() {
      if (document.visibilityState === "hidden") return;
      if (Date.now() - this.lastCheck < FOCUS_MIN_GAP_MS) return;
      this.runCheck();
    },
    async runCheck() {
      this.lastCheck = Date.now();
      const commit = await checkForUpdate();
      if (!commit) return;
      // A tab nobody has used yet reloads by itself, once per target commit.
      if (!this.interacted && claimAutoReload(commit)) {
        reloadPage();
        return;
      }
      if (Date.now() < this.skippedUntil || this.updateOpen) return;
      this.updateOpen = true;
    },
    skipUpdate() {
      this.updateOpen = false;
      this.skippedUntil = Date.now() + SKIP_MS;
    },
    refresh() {
      reloadPage();
    },
  },
};
</script>

<style scoped>
.pw-rn-bar {
  justify-content: center !important;
  text-align: start !important;
  padding-inline: 12px !important;
}
.pw-rn-bar__inner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 12px;
  width: 100%;
  max-width: 1200px;
  padding: 4px 0;
  font-size: 13.5px;
  line-height: 1.4;
}
.pw-rn-bar__icon {
  opacity: 0.9;
}
.pw-rn-bar__text {
  flex: 1 1 260px;
  min-width: 0;
}
.pw-rn-bar__sep {
  margin: 0 6px;
  opacity: 0.7;
}
.pw-rn-bar__date {
  opacity: 0.85;
  margin-left: 4px;
}
.pw-rn-bar__btn {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}
.pw-rn-release__head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 10px;
  margin-bottom: 8px;
}
.pw-rn-release__title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.pw-rn-release__date {
  font-size: 13px;
  color: var(--pw-muted);
}
.pw-rn-release__latest {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
}
.pw-rn-release__notes {
  margin: 0;
  padding-left: 20px;
  line-height: 1.55;
  font-size: 14px;
}
.pw-rn-release__notes li + li {
  margin-top: 6px;
}
.pw-rn-build {
  font-size: 12px;
  color: var(--pw-muted);
}
</style>
