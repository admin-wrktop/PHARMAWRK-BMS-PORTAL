<template>
  <v-app>
    <Overlay :overlay="overlay" />
    <v-app-bar
      clipped-left
      app
      class="elevation-1"
      density="compact"
      color="#37474f"
    >
      <v-app-bar-nav-icon
        color="white"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-img max-width="111px" src="@/assets/PortalFinalLogo.png"></v-img>
      <v-divider class="ml-4" vertical></v-divider>
      <h2 class="ml-2 text-white">BMS</h2>
      <v-spacer />
      <strong class="text-white">{{
        $store.getters.get_current_user_details.user_email_id
      }}</strong>
      <v-btn icon color="primary" to="/">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-divider />
    <v-navigation-drawer
      app
      clipped
      permanent
      width="220"
      v-model="drawer"
      :class="['gradient-bg']"
    >
      <v-list density="compact" rounded>
        <!-- <v-list-group v-model="selectedItem" active-class="secondary"> -->
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          active-class="active"
          class="text-white mt-2"
          v-model="selectedItem"
        >
          <template v-slot:prepend>
            <v-icon size="small" class="text-white ml-0">{{ item.icon }}</v-icon
            ><span class="FontSize13px font-weight-bold ml-4">{{
              item.title
            }}</span>
          </template>
          <!-- <v-list-item-title class="text-white FontSize">{{
              item.title
            }}</v-list-item-title> -->
        </v-list-item>
        <!-- </v-list-group> -->
      </v-list>
    </v-navigation-drawer>
    <!-- <div ref="home"> -->
    <v-main class="ma-2">
      <router-view />
    </v-main>
    <!-- </div> -->
  </v-app>
</template>
<script>
import Overlay from "@/components/Overlay.vue";
import { GetCurrentUser } from "@/mixins/GetCurrentUser.js";
export default {
  mixins: [GetCurrentUser],
  components: {
    Overlay,
  },
  data: () => ({
    drawer: true,
    overlay: false,
    CardHeight: 0,
    selectedItem: 0,
    Email: "",
    current_route_name: "",
    items: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "Dashboard",
      },
      {
        title: "Organization",
        icon: "mdi-earth",
        to: "Organization",
      },
      {
        title: "Device Management",
        icon: "mdi-cellphone-settings",
        to: "device",
      },

      {
        title: "Notifications",
        icon: "mdi-alert-circle-outline",
        to: "Notifications",
      },

      {
        title: "Api Key",
        icon: "mdi-key",
        to: "apikey",
      },

      {
        title: "Visit Log",
        icon: "mdi-map-marker",
        to: "visitlog",
      },

      {
        title: "Audit Log",
        icon: "mdi-math-log",
        to: "auditlog",
      },
      {
        title: "Raydeo Settings",
        icon: "mdi-bell",
        to: "RaydeoSettings",
      },
      {
        title: "Bugs Report",
        icon: "mdi-laptop-off",
        to: "BugReport",
      },
      {
        title: "Set Users OTP",
        icon: "mdi-lock-reset",
        to: "manualOTP",
      },
      {
        title: "Data Templates",
        icon: "mdi-database-import",
        to: "uploadTemplates",
      },

      // {
      //   title: "Audit Trail",
      //   icon: "mdi-dice-multiple",
      //   to: "AuditTrail",
      // },
      // {
      //   title: "Specialization",
      //   icon: "mdi-clipboard-edit",
      //   to: "Specialization",
      // },
      // {
      //   title: "Designation",
      //   icon: "mdi-briefcase-check",
      //   to: "Designation",
      // },
      // {
      //   title: "Drug Type",
      //   icon: "mdi-eyedropper",
      //   to: "DrugType",
      // },
    ],
    Previous_routes: [],
    GetCurrentUserDetailsObj: {},
    right: null,
  }),
  watch: {
    "$route.name": {
      immediate: true,
      handler(newValue) {
        const matchedItem = this.items.find((item) => item.to === newValue);

        if (matchedItem) {
          this.current_route_name = matchedItem.title;
        }
      },
    },
    // GetCurrentUserDetailsObj(val) {
    //   this.Email = val.user_email_id;
    //   if (Object.keys(val).length != 0) {
    //     this.$router.push("Dashboard");
    //   }
    // },
  },
  mounted() {
    this.GetCurrentUser();
    this.CardHeight = window.innerHeight;
    if (this.$route.path === "/") {
      this.$router.replace({ name: "Dashboard" });
    }
  },
  methods: {
  },
};
</script>

<style scoped>
.active {
  background: linear-gradient(to bottom, #212121 20%, #000000 60%) !important;
  border-radius: 20px !important; /* Makes the corners rounded */
  margin: 4px !important; /* Adds some spacing around the item */
  transition: background 0.3s ease !important; /* Smooth transition for background */
}

.active:hover {
  border-radius: 20px !important;
  background: linear-gradient(to bottom, #424242 20%, #212121 60%) !important;
}
.grade {
  background: linear-gradient(145deg, #0fc566 60%, #0a876e 90%);
  -webkit-text-fill-color: #ffff;
}
</style>
