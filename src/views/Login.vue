<template>
  <div class="pw-auth">
    <!-- Brand panel -->
    <aside class="pw-auth__brand" aria-label="About PharmaWRK BMS">
      <div class="pw-auth__brand-inner">
        <img :src="logoDark" alt="PharmaWRK" class="pw-auth__logo" />

        <div class="pw-auth__pitch">
          <span class="pw-auth__eyebrow">PharmaWRK BMS</span>
          <h1 class="pw-auth__headline">
            Back office for <span>every customer.</span>
          </h1>
          <p class="pw-auth__lead">
            Onboard organizations, manage devices and API keys, and keep an
            eye on platform activity — for the PharmaWRK operations team.
          </p>

          <ul class="pw-auth__points">
            <li v-for="p in points" :key="p.title">
              <span class="pw-auth__point-icon" aria-hidden="true">
                <v-icon size="18">{{ p.icon }}</v-icon>
              </span>
              <div>
                <div class="pw-auth__point-title">{{ p.title }}</div>
                <div class="pw-auth__point-text">{{ p.text }}</div>
              </div>
            </li>
          </ul>
        </div>

        <div class="pw-auth__apps">
          <span><v-icon size="14" class="mr-1">mdi-shield-lock-outline</v-icon
            >Internal tool · authorised staff only</span>
        </div>
      </div>
    </aside>

    <!-- Sign-in -->
    <main class="pw-auth__main">
      <div class="pw-auth__mobile-logo">
        <img :src="logoLight" alt="PharmaWRK" />
      </div>
      <div class="pw-auth__card">
        <SignInCard />
      </div>
      <footer class="pw-auth__footer">
        <span>© {{ year }} WRKTOP Technologies</span>
        <span class="pw-auth__dot" aria-hidden="true">·</span>
        <a href="mailto:contactus@wrktop.com">Support</a>
      </footer>
    </main>
  </div>
</template>

<script>
import SignInCard from "@/components/Auth/SignInCard.vue";

export default {
  components: { SignInCard },
  data: () => ({
    year: new Date().getFullYear(),
    logoDark: require("@/assets/logo4.png"),
    logoLight: require("@/assets/img/logo.png"),
    points: [
      {
        icon: "mdi-domain",
        title: "Organizations",
        text: "Create customers, switch modules on and manage their users.",
      },
      {
        icon: "mdi-cellphone-cog",
        title: "Devices & access",
        text: "Devices, mobile API keys and sign-in OTPs.",
      },
      {
        icon: "mdi-chart-box-outline",
        title: "Platform activity",
        text: "Usage dashboard, visit logs, audit trail and bug reports.",
      },
    ],
  }),
  mounted() {
    document.title = "Sign in · PharmaWRK BMS";
  },
};
</script>

<style scoped>
.pw-auth {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(420px, 46%) 1fr;
  background: rgb(var(--v-theme-background));
}

/* Brand panel */
.pw-auth__brand {
  position: relative;
  overflow: hidden;
  color: #e2ece9;
  background: radial-gradient(
      700px 420px at 100% 0%,
      rgba(16, 185, 129, 0.28),
      transparent 60%
    ),
    radial-gradient(600px 400px at 0% 100%, rgba(14, 165, 233, 0.14), transparent 60%),
    linear-gradient(160deg, #0f2a2e 0%, #0b2023 100%);
}
.pw-auth__brand::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent);
  pointer-events: none;
}
.pw-auth__brand-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  padding: 40px 56px;
  max-width: 620px;
}
.pw-auth__logo-link {
  display: inline-flex;
  border-radius: 8px;
}
.pw-auth__logo {
  height: 40px;
  width: auto;
  align-self: flex-start;
}
.pw-auth__eyebrow {
  display: inline-block;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6ee7b7;
  margin-bottom: 14px;
}
.pw-auth__headline {
  font-size: clamp(30px, 3.2vw, 42px);
  line-height: 1.12;
  font-weight: 750;
  letter-spacing: -0.03em;
  color: #f8fafc;
  margin: 0 0 14px;
}
.pw-auth__headline span {
  color: #6ee7b7;
}
.pw-auth__lead {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(226, 236, 233, 0.75);
  margin: 0 0 32px;
  max-width: 460px;
}
.pw-auth__points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 18px;
}
.pw-auth__points li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.pw-auth__point-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #6ee7b7;
  background: rgba(110, 231, 183, 0.1);
  border: 1px solid rgba(110, 231, 183, 0.18);
}
.pw-auth__point-title {
  font-size: 14.5px;
  font-weight: 600;
  color: #f8fafc;
}
.pw-auth__point-text {
  font-size: 13.5px;
  color: rgba(226, 236, 233, 0.65);
  margin-top: 2px;
}
.pw-auth__apps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12.5px;
  color: rgba(226, 236, 233, 0.6);
}
.pw-auth__badges {
  display: flex;
  gap: 10px;
}
.pw-auth__badges a {
  display: inline-flex;
  border-radius: 8px;
  opacity: 0.9;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.pw-auth__badges a:hover {
  opacity: 1;
  transform: translateY(-1px);
}
.pw-auth__badges img {
  height: 38px;
  width: auto;
}

/* Sign-in side */
.pw-auth__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px 24px;
  position: relative;
}
.pw-auth__mobile-logo {
  display: none;
  margin-bottom: 24px;
}
.pw-auth__mobile-logo img {
  height: 36px;
}
.pw-auth__card {
  width: 100%;
  max-width: 420px;
}
.pw-auth__footer {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--pw-muted);
}
.pw-auth__footer a {
  color: var(--pw-muted);
  text-decoration: none;
}
.pw-auth__footer a:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

@media (max-width: 960px) {
  .pw-auth {
    grid-template-columns: 1fr;
  }
  .pw-auth__brand {
    display: none;
  }
  .pw-auth__mobile-logo {
    display: block;
  }
  .pw-auth__footer {
    position: static;
    margin-top: 32px;
  }
}
</style>
