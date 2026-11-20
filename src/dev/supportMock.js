/**
 * DEV-ONLY in-memory Support Cases API, used only in `?uiPreview=1` mode on a
 * local dev server (see uiPreview.js). Stripped from production builds.
 * All data is fictitious.
 */
const KEY = "pharmawrk.bms.uiPreview";
const DAY = 86400000;
const now = Date.now();

function on() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch (e) {
    return false;
  }
}

const orgs = [
  { id: "org-a", name: "Asclepius Pharma" },
  { id: "org-b", name: "Borealis Labs" },
  { id: "org-c", name: "Cedarline Healthcare" },
];
const subjects = [
  ["Visit log not syncing after going offline", "MOBILE", "BUG", "HIGH"],
  ["Expense report export shows wrong totals", "PORTAL", "BUG", "NORMAL"],
  ["Add bulk approve for tour plans", "PORTAL", "ENHANCEMENT", "LOW"],
  ["App crashes when attaching a photo", "MOBILE", "BUG", "URGENT"],
  ["Doctor list search is slow", "PORTAL", "BUG", "NORMAL"],
  ["Allow managers to edit holiday calendar", "PORTAL", "ENHANCEMENT", "NORMAL"],
  ["OTP not received on some numbers", "MOBILE", "BUG", "HIGH"],
  ["Attendance shows absent although logged in", "MOBILE", "BUG", "NORMAL"],
];
const statuses = ["OPEN", "IN_PROGRESS", "PENDING_CUSTOMER", "REOPENED", "RESOLVED", "OPEN", "RESOLVED", "IN_PROGRESS"];

const tickets = subjects.map(([subject, area, type, sev], i) => {
  const org = orgs[i % orgs.length];
  const created = now - (i + 1) * DAY * 0.7;
  return {
    ticket_id: `t-${i + 1}`,
    case_number: `PW-${100001 + i}`,
    organization_id: org.id,
    organization_name: org.name,
    subject,
    category: area === "MOBILE" ? "Visit Log" : "Reports",
    severity: sev,
    case_status: statuses[i],
    case_type: type,
    app_area: area,
    source_app: area,
    creator_email: `user${i + 1}@example.com`,
    creator_name: ["Asha Rao", "Vikram Shah", "Neha Iyer", "Rahul Menon"][i % 4],
    context: { page: area === "MOBILE" ? "VisitLogScreen" : "/Reports", app_version: "2.4.1", timezone: "Asia/Kolkata" },
    created_on: created,
    updated_on: created + DAY * 0.3,
    last_reply_by: i % 3 === 0 ? "STAFF" : "CUSTOMER",
    message_count: 2,
    assigned_to: i % 2 ? "staff-1" : undefined,
    assigned_to_name: i % 2 ? "Preview Admin" : undefined,
    awaiting_release: i === 1,
  };
});

const messages = {};
tickets.forEach((t) => {
  messages[t.ticket_id] = [
    {
      message_id: `${t.created_on}#a`, created_on: t.created_on, author_type: "CUSTOMER",
      author_name: t.creator_name, author_email: t.creator_email,
      body: `${t.subject}.\n\nSteps: open the screen, try again, same result.`,
      attachments: [{ key: "k1", name: "screenshot.png", content_type: "image/png", size: 182000, is_screenshot: true,
        url: "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" text-anchor="middle" fill="#475569" font-family="sans-serif" font-size="14">screenshot.png</text></svg>') }],
    },
    {
      message_id: `${t.created_on + 3600000}#b`, created_on: t.created_on + 3600000, author_type: "STAFF",
      author_name: "Preview Admin", internal: true, body: "Reproduced on DEV. Looks like a sync retry issue.", attachments: [],
    },
    {
      message_id: `${t.created_on + 7200000}#c`, created_on: t.created_on + 7200000, author_type: "SYSTEM",
      body: "Status changed from Open to In progress", attachments: [],
    },
  ];
});

let settings = { to_emails: ["support@example.com"], cc_emails: [], urgent_to_emails: ["oncall@example.com"] };

function counts() {
  const c = {};
  tickets.forEach((t) => (c[t.case_status] = (c[t.case_status] || 0) + 1));
  return c;
}

export function supportMock(command, p) {
  if (!on()) return undefined;
  const find = (id) => {
    const t = tickets.find((x) => x.ticket_id === id);
    if (!t) throw new Error("Case not found");
    return t;
  };
  switch (command) {
    case "bmsListSupportCases": {
      let items = tickets.slice();
      const sf = p.status_filter;
      if (sf === "OPEN_ONLY") items = items.filter((t) => t.case_status !== "RESOLVED");
      else if (sf && sf !== "ALL") items = items.filter((t) => t.case_status === sf);
      if (p.severity_filter) items = items.filter((t) => t.severity === p.severity_filter);
      if (p.case_type_filter) items = items.filter((t) => (t.case_type || "BUG") === p.case_type_filter);
      if (p.organization_id_filter) items = items.filter((t) => t.organization_id === p.organization_id_filter);
      items.sort((a, b) => b.updated_on - a.updated_on);
      return Promise.resolve({ status: "SUCCESS", items, next_token: null, counts: counts() });
    }
    case "bmsGetSupportCase": {
      const t = find(p.ticket_id);
      return Promise.resolve({ status: "SUCCESS", ticket: { ...t }, messages: messages[t.ticket_id].slice(), customer_cc_emails: ["it-head@example.com"] });
    }
    case "bmsReplySupportCase": {
      const t = find(p.ticket_id);
      const ts = Date.now();
      messages[t.ticket_id].push({
        message_id: `${ts}#r`, created_on: ts, author_type: "STAFF", author_name: "Preview Admin",
        body: p.body, internal: !!p.internal,
        attachments: (p.attachments || []).map((a) => ({ ...a, size: 1000, content_type: "application/octet-stream" })),
      });
      if (!p.internal) t.case_status = p.new_status || "PENDING_CUSTOMER";
      t.updated_on = ts;
      t.message_count += 1;
      if (!t.assigned_to) { t.assigned_to = "staff-1"; t.assigned_to_name = "Preview Admin"; }
      return Promise.resolve({ status: "SUCCESS", ticket: { ...t } });
    }
    case "bmsUpdateSupportCase": {
      const t = find(p.ticket_id);
      const changed = Object.keys(p).filter((k) => k !== "ticket_id");
      changed.forEach((k) => (t[k] = p[k]));
      t.updated_on = Date.now();
      messages[t.ticket_id].push({ message_id: `${t.updated_on}#s`, created_on: t.updated_on, author_type: "SYSTEM", body: `Updated: ${changed.join(", ")}`, attachments: [] });
      return Promise.resolve({ status: "SUCCESS", ticket: { ...t } });
    }
    case "bmsGetSupportUploadUrl":
      return Promise.resolve({ mock: true, upload_url: "", key: `support-cases/mock/${p.file_name}`, content_type: p.content_type });
    case "bmsGetSupportSettings":
      return Promise.resolve({ status: "SUCCESS", ...settings });
    case "bmsUpdateSupportSettings":
      settings = { to_emails: p.to_emails, cc_emails: p.cc_emails, urgent_to_emails: p.urgent_to_emails };
      return Promise.resolve({ status: "SUCCESS", ...settings });
    default:
      return undefined;
  }
}
