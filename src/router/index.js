import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import { fetchAuthSession } from "aws-amplify/auth";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/Landing",
    name: "Landing",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Landing.vue"),
    children: [
      {
        name: "Dashboard",
        path: "/Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "Organization" */ "../views/ChildHomePages/Dashboard.vue"
          ),
      },
      {
        name: "Organization",
        path: "/Organization",
        component: () =>
          import(
            /* webpackChunkName: "Organization" */ "../views/ChildHomePages/Organization.vue"
          ),
      },
      {
        name: "Device",
        path: "/device",
        component: () =>
          import(
            /* webpackChunkName: "MasterPOVList" */ "../views/ChildHomePages/device.vue"
          ),
      },

      {
        name: "Notification",
        path: "/Notifications",
        component: () =>
          import(
            /* webpackChunkName: "MasterPOVList" */ "../views/ChildHomePages/Notifications.vue"
          ),
      },

      {
        name: "Visit Log",
        path: "/visitlog",
        component: () =>
          import(
            /* webpackChunkName: "MasterPOVList" */ "../views/ChildHomePages/Visitlog.vue"
          ),
      },

      {
        name: "Audit Log",
        path: "/auditlog",
        component: () =>
          import(
            /* webpackChunkName: "MasterPOVList" */ "../views/ChildHomePages/Auditlog.vue"
          ),
      },

      {
        name: "Upload Templates",
        path: "/uploadTemplates",
        component: () =>
          import(
            /* webpackChunkName: "MasterPOVList" */ "../views/ChildHomePages/UploadTemplates.vue"
          ),
      },

      {
        name: "BugReport",
        path: "/BugReport",
        component: () =>
          import(
            /* webpackChunkName: "Specialization" */ "../views/ChildHomePages/BugReportView.vue"
          ),
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: { name: "Dashboard" } },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const PUBLIC_ROUTES = ["Login"];

async function isSignedIn() {
  try {
    const { tokens } = await fetchAuthSession();
    return !!(tokens && tokens.idToken);
  } catch (e) {
    return false;
  }
}

// DEV ONLY: `?uiPreview=1` shows signed-in screens without a backend.
function isDevPreview(to) {
  if (process.env.NODE_ENV !== "development") return false;
  try {
    const KEY = "pharmawrk.bms.uiPreview";
    if (to.query.uiPreview === "1") sessionStorage.setItem(KEY, "1");
    if (to.query.uiPreview === "0") sessionStorage.removeItem(KEY);
    return sessionStorage.getItem(KEY) === "1";
  } catch (e) {
    return false;
  }
}

// Every page except sign-in needs a Cognito session. Signed-out users are
// sent to sign-in and returned to the page they asked for afterwards.
router.beforeEach(async (to) => {
  const isPublic = PUBLIC_ROUTES.includes(to.name);
  const preview = isDevPreview(to);
  if (!isPublic && preview) return true;

  const signedIn = await isSignedIn();
  if (!isPublic && !signedIn) {
    const redirect = to.fullPath !== "/Dashboard" ? to.fullPath : undefined;
    return { name: "Login", query: redirect ? { redirect } : {} };
  }
  if (isPublic && signedIn) {
    return safeRedirect(to.query.redirect) || { name: "Dashboard" };
  }
  return true;
});

// Only follow in-app paths ("/x"), never "//host" or absolute URLs.
export function safeRedirect(path) {
  return typeof path === "string" && /^\/(?![\/\\])/.test(path) ? path : null;
}

export default router;
