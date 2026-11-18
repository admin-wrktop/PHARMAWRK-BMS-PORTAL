import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";

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
        name: "Api Key",
        path: "/apikey",
        component: () =>
          import(
            /* webpackChunkName: "MasterPOVList" */ "../views/ChildHomePages/apikey.vue"
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
        name: "Raydeo Settings",
        path: "/RaydeoSettings",
        component: () =>
          import(
            /* webpackChunkName: "MasterPOVList" */ "../views/ChildHomePages/RaydeoDashboard.vue"
          ),
      },
      {
        name: "Set Users OTP",
        path: "/manualOTP",
        component: () =>
          import(
            /* webpackChunkName: "MasterPOVList" */ "../views/ChildHomePages/SetManualOTP.vue"
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
      // {
      //   name: "DrugType",
      //   path: "/DrugType",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "Specialization" */ "../views/ChildHomePages/DrugType.vue"
      //     ),
      // },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
