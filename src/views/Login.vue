<template>
  <div class="bms-auth">
    <div class="bms-auth__glow" aria-hidden="true"></div>

    <header class="bms-auth__top">
      <span v-if="env" class="bms-auth__env">{{ env }}</span>
    </header>

    <main class="bms-auth__main">
      <div class="bms-auth__brand">
        <img :src="logo" alt="PharmaWRK" class="bms-auth__logo" />
        <span class="bms-auth__divider" aria-hidden="true"></span>
        <span class="bms-auth__product">Back Office</span>
      </div>

      <div class="bms-auth__card">
        <div class="bms-auth__badge" aria-hidden="true">
          <v-icon size="22">mdi-shield-account-outline</v-icon>
        </div>
        <SignInCard />
      </div>

      <ul class="bms-auth__modules" aria-label="What BMS manages">
        <li v-for="m in modules" :key="m.text">
          <v-icon size="16">{{ m.icon }}</v-icon>
          <span>{{ m.text }}</span>
        </li>
      </ul>
    </main>

    <footer class="bms-auth__footer">
      <span>© {{ year }} WRKTOP Technologies</span>
      <span aria-hidden="true">·</span>
      <span>Authorised staff only</span>
      <span aria-hidden="true">·</span>
      <a href="mailto:contactus@wrktop.com">Support</a>
    </footer>
  </div>
</template>

<script>
import SignInCard from "@/components/Auth/SignInCard.vue";

/** Small environment tag from the hostname (dev.bms… → DEV). Hidden on prod. */
function detectEnv() {
  const host = (typeof window !== "undefined" && window.location.hostname) || "";
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(host)) return "LOCAL";
  if (/^dev\./.test(host)) return "DEV";
  return "";
}

export default {
  components: { SignInCard },
  data: () => ({
    year: new Date().getFullYear(),
    logo: require("@/assets/logo4.png"),
    env: detectEnv(),
    modules: [
      { icon: "mdi-domain", text: "Organizations" },
      { icon: "mdi-cellphone-cog", text: "Devices" },
      { icon: "mdi-bell-outline", text: "Notifications" },
      { icon: "mdi-text-box-search-outline", text: "Audit logs" },
    ],
  }),
  mounted() {
    document.title = "Sign in · PharmaWRK BMS";
  },
};
</script>

<style scoped>
.bms-auth {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(165deg, #12353a 0%, #0f2a2e 45%, #0b2023 100%);
  color: #e2ece9;
}
/* soft emerald light behind the card */
.bms-auth__glow {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 900px;
  height: 640px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    closest-side,
    rgba(16, 185, 129, 0.22),
    rgba(16, 185, 129, 0.06) 55%,
    transparent 100%
  );
  pointer-events: none;
}
.bms-auth__top,
.bms-auth__main,
.bms-auth__footer {
  position: relative;
  z-index: 1;
}
.bms-auth__top {
  display: flex;
  justify-content: flex-end;
  min-height: 56px;
  padding: 18px 24px 0;
}
.bms-auth__env {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #6ee7b7;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.3);
}
.bms-auth__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 16px 32px;
}
.bms-auth__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}
.bms-auth__logo {
  height: 40px;
  width: auto;
}
.bms-auth__divider {
  width: 1px;
  height: 26px;
  background: rgba(226, 236, 233, 0.25);
}
.bms-auth__product {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #f8fafc;
}
.bms-auth__card {
  position: relative;
  width: 100%;
  max-width: 420px;
}
.bms-auth__badge {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  box-shadow: 0 8px 20px -6px rgba(4, 120, 87, 0.6),
    0 0 0 4px rgba(255, 255, 255, 1);
}
.bms-auth__card :deep(.pw-signin) {
  padding: 40px 36px 30px;
  border: 0;
  border-radius: 18px;
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45),
    0 10px 24px -12px rgba(0, 0, 0, 0.3);
  text-align: left;
}
.bms-auth__card :deep(.pw-signin__title) {
  text-align: center;
  margin-top: 4px;
}
.bms-auth__card :deep(.pw-signin__sub) {
  text-align: center;
  margin-bottom: 26px;
}
.bms-auth__modules {
  list-style: none;
  padding: 0;
  margin: 28px 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.bms-auth__modules li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(226, 236, 233, 0.82);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
}
.bms-auth__modules .v-icon {
  color: #6ee7b7;
}
.bms-auth__footer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px 22px;
  font-size: 12.5px;
  color: rgba(226, 236, 233, 0.5);
}
.bms-auth__footer a {
  color: rgba(226, 236, 233, 0.7);
  text-decoration: none;
}
.bms-auth__footer a:hover {
  color: #6ee7b7;
  text-decoration: underline;
}
@media (max-width: 480px) {
  .bms-auth__card :deep(.pw-signin) {
    padding: 36px 22px 24px;
  }
  .bms-auth__logo {
    height: 32px;
  }
}
</style>
