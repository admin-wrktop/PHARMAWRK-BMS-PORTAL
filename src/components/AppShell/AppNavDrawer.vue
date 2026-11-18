<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :width="252"
    class="pw-nav"
    color="secondary"
    theme="dark"
    border="0"
    aria-label="Main navigation"
  >
    <!-- Brand -->
    <div class="pw-nav__brand">
      <router-link
        :to="{ name: 'Dashboard' }"
        class="pw-nav__brand-link"
        aria-label="PharmaWRK BMS home"
      >
        <img
          :src="logoSrc"
          alt="PharmaWRK"
          class="pw-nav__logo"
          width="96"
          height="36"
        />
      </router-link>
      <span class="pw-nav__product">BMS</span>
    </div>

    <v-list class="pw-nav__list" density="compact" nav bg-color="transparent">
      <template v-for="entry in items" :key="entry.key || entry.link">
        <div v-if="entry.type === 'header'" class="pw-nav__header">
          {{ entry.text }}
        </div>
        <v-list-item
          v-else
          :to="{ name: entry.link }"
          :prepend-icon="entry.icon"
          :title="entry.text"
          class="pw-nav__item"
          rounded="lg"
        />
      </template>
    </v-list>

    <template #append>
      <div class="pw-nav__footer">
        <v-icon size="14" class="mr-1">mdi-shield-check-outline</v-icon>
        PharmaWRK Back Office
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "AppNavDrawer",
  props: {
    modelValue: { type: Boolean, default: true },
    items: { type: Array, default: () => [] },
  },
  emits: ["update:modelValue"],
  data: () => ({
    logoSrc: require("@/assets/logo4.png"),
  }),
};
</script>

<style scoped>
.pw-nav {
  background: linear-gradient(180deg, #0f2a2e 0%, #0b2023 100%) !important;
  color: #e2ece9;
}
.pw-nav__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 60px;
  padding: 0 18px;
}
.pw-nav__brand-link {
  display: inline-flex;
  border-radius: 8px;
}
.pw-nav__logo {
  height: 36px;
  width: auto;
  display: block;
}
.pw-nav__product {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 999px;
  color: #6ee7b7;
  background: rgba(52, 211, 153, 0.14);
}
.pw-nav__header {
  padding: 16px 10px 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(226, 236, 233, 0.42);
}
.pw-nav__list {
  padding: 4px 10px 12px;
}
.pw-nav__list :deep(.v-list-item) {
  min-height: 36px !important;
  margin-bottom: 2px;
  padding-inline: 10px !important;
  color: rgba(226, 236, 233, 0.82);
}
.pw-nav__list :deep(.v-list-item-title) {
  font-size: 13.5px !important;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.25;
}
.pw-nav__list :deep(.v-list-item__prepend > .v-icon) {
  font-size: 18px;
  opacity: 0.72;
  color: inherit;
  margin-inline-end: 12px;
}
.pw-nav__list :deep(.v-list-item__spacer) {
  width: 0 !important;
}
.pw-nav__list :deep(.v-list-item:hover) {
  color: #fff;
}
.pw-nav__list :deep(.v-list-item:hover > .v-list-item__overlay) {
  opacity: 0.06;
}
.pw-nav__list :deep(.v-list-item--active) {
  color: #fff !important;
  background: rgba(52, 211, 153, 0.14);
}
.pw-nav__list :deep(.v-list-item--active > .v-list-item__overlay) {
  opacity: 0 !important;
}
.pw-nav__list :deep(.v-list-item--active .v-list-item__prepend > .v-icon) {
  color: #6ee7b7;
  opacity: 1;
}
.pw-nav__list :deep(.v-list-item--active .v-list-item-title) {
  font-weight: 600;
}
.pw-nav__footer {
  padding: 12px 20px 16px;
  font-size: 11px;
  color: rgba(226, 236, 233, 0.4);
  display: flex;
  align-items: center;
}
</style>
