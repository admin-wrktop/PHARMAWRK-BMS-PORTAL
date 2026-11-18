<template>
  <span
    v-if="label"
    class="pw-status"
    :class="`pw-status--${resolvedTone}`"
    :title="raw"
  >
    <span class="pw-status__dot" aria-hidden="true"></span>
    {{ label }}
  </span>
  <span v-else class="pw-muted">–</span>
</template>

<script>
/** Status pill: colour by meaning, text always visible (never colour alone). */
const TONES = {
  success: [
    "ACTIVE", "APPROVED", "VERIFIED", "COMPLETED", "COMPLETE", "PRESENT",
    "ACCEPTED", "SUCCESS", "SENT", "VIEWED", "READ", "DONE", "ENABLED",
    "LOGGED_IN", "CONVERTED", "PASSED", "PAID", "VALID",
  ],
  warning: [
    "PENDING", "IN_PROGRESS", "INPROGRESS", "DRAFT", "SCHEDULED", "ON_HOLD",
    "PARTIAL", "PARTIALLY_APPROVED", "REVIEW", "SUBMITTED", "OPEN",
    "UNVERIFIED", "EDITED", "UNREAD", "HALF_DAY", "LEAVE", "NOT_VIEWED",
  ],
  error: [
    "INACTIVE", "REJECTED", "ABSENT", "CANCELLED", "CANCELED", "DELETED",
    "FAILED", "EXPIRED", "BLOCKED", "DISABLED", "INVALID", "DECLINED",
    "LOGGED_OUT", "CLOSED", "DEACTIVATED",
  ],
};

export default {
  name: "StatusChip",
  props: {
    status: { type: [String, Number, Boolean], default: "" },
    /** Force a tone: success | warning | error | info | neutral */
    tone: { type: String, default: "" },
  },
  computed: {
    raw() {
      return this.status === null || this.status === undefined
        ? ""
        : String(this.status);
    },
    key() {
      return this.raw.trim().toUpperCase().replace(/[\s-]+/g, "_");
    },
    label() {
      if (!this.raw || this.raw === "-") return "";
      return this.raw
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    },
    resolvedTone() {
      if (this.tone) return this.tone;
      for (const [tone, list] of Object.entries(TONES)) {
        if (list.includes(this.key)) return tone;
      }
      return "neutral";
    },
  },
};
</script>

<style scoped>
.pw-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 9px 0 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  color: var(--pw-tone-fg);
  background: var(--pw-tone-bg);
}
.pw-status__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--pw-tone-dot);
  flex-shrink: 0;
}
.pw-status--success {
  --pw-tone-fg: #065f46;
  --pw-tone-bg: rgba(16, 185, 129, 0.12);
  --pw-tone-dot: #10b981;
}
.pw-status--warning {
  --pw-tone-fg: #92400e;
  --pw-tone-bg: rgba(245, 158, 11, 0.14);
  --pw-tone-dot: #f59e0b;
}
.pw-status--error {
  --pw-tone-fg: #991b1b;
  --pw-tone-bg: rgba(239, 68, 68, 0.11);
  --pw-tone-dot: #ef4444;
}
.pw-status--info {
  --pw-tone-fg: #1e40af;
  --pw-tone-bg: rgba(59, 130, 246, 0.11);
  --pw-tone-dot: #3b82f6;
}
.pw-status--neutral {
  --pw-tone-fg: rgba(var(--v-theme-on-surface), 0.8);
  --pw-tone-bg: rgba(var(--v-theme-on-surface), 0.07);
  --pw-tone-dot: rgba(var(--v-theme-on-surface), 0.4);
}
.v-theme--myCustomThemeDark .pw-status--success { --pw-tone-fg: #6ee7b7; }
.v-theme--myCustomThemeDark .pw-status--warning { --pw-tone-fg: #fcd34d; }
.v-theme--myCustomThemeDark .pw-status--error { --pw-tone-fg: #fca5a5; }
.v-theme--myCustomThemeDark .pw-status--info { --pw-tone-fg: #93c5fd; }
</style>
