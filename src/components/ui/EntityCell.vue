<template>
  <div class="pw-entity">
    <v-avatar
      :size="size"
      rounded="lg"
      class="pw-entity__avatar"
      :style="avatarStyle"
      aria-hidden="true"
    >
      <v-img v-if="image" :src="image" cover />
      <v-icon v-else-if="icon" :size="size * 0.55">{{ icon }}</v-icon>
      <span v-else>{{ initials }}</span>
    </v-avatar>
    <div class="pw-entity__text">
      <div class="pw-entity__title" :title="title">{{ title || "–" }}</div>
      <div v-if="subtitle" class="pw-entity__sub" :title="subtitle">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Primary column of a listing: avatar (image / icon / initials) + title +
 * optional secondary line.
 *   <EntityCell :title="item.user_name" :subtitle="item.user_email_id" />
 *   <EntityCell :title="item.pov_name" subtitle="Cardiology" icon="mdi-stethoscope" />
 */
const HUES = ["#047857", "#2563EB", "#D97706", "#7C3AED", "#DB2777", "#0891B2"];

export default {
  name: "EntityCell",
  props: {
    title: { type: [String, Number], default: "" },
    subtitle: { type: [String, Number], default: "" },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    size: { type: Number, default: 32 },
  },
  computed: {
    initials() {
      return String(this.title || "?")
        .replace(/^(dr|mr|mrs|ms)\.?\s+/i, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");
    },
    hue() {
      const s = String(this.title || "");
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return HUES[h % HUES.length];
    },
    avatarStyle() {
      return {
        color: this.hue,
        background: `color-mix(in srgb, ${this.hue} 12%, transparent)`,
      };
    },
  },
};
</script>

<style scoped>
.pw-entity {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  max-width: 320px;
  padding: 4px 0;
}
.pw-entity__avatar {
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.pw-entity__text {
  min-width: 0;
  line-height: 1.25;
}
.pw-entity__title {
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pw-entity__sub {
  font-size: 12px;
  color: var(--pw-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
