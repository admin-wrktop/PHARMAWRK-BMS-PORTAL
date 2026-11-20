<template>
  <div class="pw-shell">
    <a href="#pw-main" class="pw-skip-link">Skip to content</a>
    <Overlay :overlay="overlay" />

    <AppNavDrawer v-model="drawer" :items="navItems" />

    <v-app-bar
      flat
      height="56"
      color="surface"
      class="pw-appbar"
      border="b"
      role="banner"
    >
      <v-app-bar-nav-icon
        class="ml-1"
        :aria-label="drawer ? 'Hide navigation' : 'Show navigation'"
        :aria-expanded="drawer ? 'true' : 'false'"
        @click="drawer = !drawer"
      />
      <img
        v-if="!drawer"
        :src="logoSrc"
        alt="PharmaWRK"
        class="pw-appbar__logo ml-3"
      />

      <nav aria-label="Breadcrumb" class="pw-crumbs ml-2">
        <span class="pw-crumbs__home">BMS</span>
        <template v-if="breadcrumbGroup">
          <v-icon size="14" class="pw-crumbs__sep">mdi-chevron-right</v-icon>
          <span>{{ breadcrumbGroup }}</span>
        </template>
        <v-icon size="14" class="pw-crumbs__sep">mdi-chevron-right</v-icon>
        <span class="pw-crumbs__current" aria-current="page">{{
          pageTitle
        }}</span>
      </nav>
      <v-spacer />

      <v-btn
        icon
        variant="text"
        size="small"
        class="mr-2"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme()"
      >
        <v-icon>{{
          isDark ? "mdi-white-balance-sunny" : "mdi-weather-night"
        }}</v-icon>
        <v-tooltip location="bottom" activator="parent">{{
          isDark ? "Light theme" : "Dark theme"
        }}</v-tooltip>
      </v-btn>

      <v-divider vertical inset class="mx-1 hidden-xs" />

      <v-menu location="bottom end" offset="8" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="pw-user-btn mr-2 ml-1"
            height="44"
            aria-label="Account menu"
          >
            <v-avatar size="32" color="primary" class="pw-user-btn__avatar">
              <span>{{ userInitials }}</span>
            </v-avatar>
            <div class="pw-user-btn__text hidden-sm-and-down">
              <div class="pw-user-btn__name">{{ displayName }}</div>
              <div class="pw-user-btn__role">Back office</div>
            </div>
            <v-icon size="18" class="ml-1 pw-muted hidden-sm-and-down"
              >mdi-chevron-down</v-icon
            >
          </v-btn>
        </template>
        <v-card min-width="280" max-width="320" class="pw-user-menu">
          <div class="pa-4 d-flex align-center">
            <v-avatar size="44" color="primary" class="mr-3">
              <span class="text-subtitle-1 font-weight-bold">{{
                userInitials
              }}</span>
            </v-avatar>
            <div style="min-width: 0">
              <div class="font-weight-bold text-truncate">
                {{ displayName }}
              </div>
              <div class="text-caption pw-muted text-truncate">
                {{ userEmail }}
              </div>
            </div>
          </div>
          <v-divider />
          <div class="pa-3">
            <v-btn
              block
              color="error"
              variant="tonal"
              prepend-icon="mdi-logout"
              @click.stop="signOutMethod()"
              >Sign out</v-btn
            >
          </div>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main class="pw-main">
      <div id="pw-main" class="pw-main__inner" tabindex="-1">
        <header class="pw-page-header">
          <div class="pw-page-header__text">
            <h1 class="pw-page-header__title">{{ pageTitle }}</h1>
            <p v-if="pageDescription" class="pw-page-header__desc">
              {{ pageDescription }}
            </p>
          </div>
        </header>
        <router-view v-slot="{ Component, route }">
          <div v-if="isBareRoute(route.name)" class="pw-page pw-page--bare">
            <component :is="Component" />
          </div>
          <div v-else class="pw-page pw-surface">
            <component :is="Component" />
          </div>
        </router-view>
      </div>
    </v-main>
  </div>
</template>
<script>
import Overlay from "@/components/Overlay.vue";
import AppNavDrawer from "@/components/AppShell/AppNavDrawer.vue";
import { GetCurrentUser } from "@/mixins/GetCurrentUser.js";
import {
  NAV_ITEMS,
  PAGE_DESCRIPTIONS,
  displayTitle,
  routeGroup,
} from "@/components/AppShell/navigation.js";
import { signOut } from "aws-amplify/auth";

const THEME_KEY = "pharmawrk.theme";
// Pages that render their own cards (dashboards) — no page surface around them.
const BARE_ROUTES = ["Dashboard", "Support Cases"];

export default {
  mixins: [GetCurrentUser],
  components: { Overlay, AppNavDrawer },
  data: () => ({
    logoSrc: require("@/assets/PortalFinalLogo.png"),
    drawer: true,
    overlay: false,
    navItems: NAV_ITEMS,
    GetCurrentUserDetailsObj: {},
  }),
  computed: {
    pageTitle() {
      return displayTitle(this.$route.name);
    },
    pageDescription() {
      return PAGE_DESCRIPTIONS[this.$route.name] || "";
    },
    breadcrumbGroup() {
      return routeGroup(this.$route.name);
    },
    user() {
      return this.$store.getters.get_current_user_details || {};
    },
    userEmail() {
      return this.user.user_email_id || this.$store.getters.get_user_email;
    },
    displayName() {
      return this.user.user_name || this.userEmail || "BMS user";
    },
    userInitials() {
      const src = this.user.user_name || (this.userEmail || "").split("@")[0];
      return (
        (src || "")
          .split(/[\s._-]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0].toUpperCase())
          .join("") || "?"
      );
    },
    isDark() {
      return this.$vuetify.theme.global.name === "myCustomThemeDark";
    },
  },
  watch: {
    "$route.name": {
      immediate: true,
      handler(name) {
        if (typeof document !== "undefined") {
          document.title = `${displayTitle(name)} · PharmaWRK BMS`;
        }
      },
    },
  },
  created() {
    // Permanent drawer on desktop; tablets/phones open it on demand.
    this.drawer = !this.$vuetify.display.mdAndDown;
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "myCustomThemeDark" || saved === "myCustomTheme") {
        this.$vuetify.theme.global.name = saved;
      }
    } catch (e) {
      /* storage unavailable — keep default theme */
    }
  },
  async mounted() {
    if (this.$route.name === "Landing") {
      this.$router.replace({ name: "Dashboard", query: this.$route.query });
    }
    if (process.env.NODE_ENV === "development") {
      const preview = await import("@/dev/uiPreview.js");
      if (preview.isUiPreview(this.$route)) {
        this.$store.commit("SET_CURRENTUSER_DETAILS", preview.previewUser());
        return;
      }
    }
    this.GetCurrentUser();
  },
  methods: {
    isBareRoute(name) {
      return BARE_ROUTES.includes(name);
    },
    toggleTheme() {
      const next = this.isDark ? "myCustomTheme" : "myCustomThemeDark";
      this.$vuetify.theme.global.name = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* ignore */
      }
    },
    async signOutMethod() {
      try {
        await signOut();
      } catch (e) {
        console.warn("Sign out failed", e);
      }
      this.$store.commit("SET_CURRENTUSER_DETAILS", {});
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
.pw-appbar {
  background: rgba(var(--v-theme-surface), 0.92) !important;
  backdrop-filter: saturate(1.4) blur(8px);
}
.pw-appbar__logo {
  height: 30px;
  width: auto;
  background: #0f2a2e;
  padding: 4px 8px;
  border-radius: 8px;
}
.pw-crumbs {
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 1.2;
  color: var(--pw-muted);
  font-weight: 500;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
}
.pw-crumbs__current {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
}
.pw-crumbs__sep {
  opacity: 0.6;
  margin: 0 2px;
}
.pw-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 4px 14px;
}
.pw-page-header__title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0;
}
.pw-page-header__desc {
  font-size: 13.5px;
  color: var(--pw-muted);
  margin: 4px 0 0;
  max-width: 760px;
}
.pw-user-btn {
  padding: 0 6px !important;
}
.pw-user-btn__avatar {
  font-size: 12.5px;
  font-weight: 700;
}
.pw-user-btn__text {
  text-align: left;
  margin-left: 10px;
  line-height: 1.2;
  max-width: 220px;
}
.pw-user-btn__name {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pw-user-btn__role {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--pw-muted);
}
.pw-main {
  background: rgb(var(--v-theme-background));
  min-height: 100vh;
}
.pw-main__inner {
  padding: 12px 16px;
  outline: none;
}
.pw-page {
  animation: pwPageIn 0.22s ease-out both;
}
@keyframes pwPageIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (max-width: 960px) {
  .pw-main__inner {
    padding: 12px;
  }
}
</style>
