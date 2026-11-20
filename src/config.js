// Runtime configuration.
//
// Every environment-specific value (GraphQL URL, Cognito IDs, region...) is
// read at startup from /config.json, which the deploy workflow writes per
// environment. The JavaScript bundle itself contains no environment values,
// so DEV and PROD serve byte-identical builds.
//
// config.json shape:
// {
//   "region": "ap-south-1",
//   "userPoolId": "ap-south-1_xxxx",
//   "userPoolClientId": "xxxx",
//   "graphqlEndpoint": "https://xxxx.appsync-api.ap-south-1.amazonaws.com/graphql",
//   "esperConsoleUrl": "https://xxxx.esper.cloud",   (optional)
//   "features": { "supportCases": true, "latLng": true }   (optional; missing = on)
// }

const REQUIRED = ["region", "userPoolId", "userPoolClientId", "graphqlEndpoint"];

let config = null;

function devFallback() {
  // Local `npm run serve` only: fall back to .env values when there is no
  // public/config.json. Removed from production builds.
  if (process.env.NODE_ENV !== "development") return null;
  return {
    region: process.env.VUE_APP_AWS_PROJECT_REGION,
    userPoolId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID,
    userPoolClientId: process.env.VUE_APP_AWS_USER_POOL_WEB_CLIENT_ID,
    graphqlEndpoint: process.env.VUE_APP_AWS_GRAPHQL_ENDPOINT,
    esperConsoleUrl: process.env.VUE_APP_ESPER_CONSOLE_URL,
  };
}

export async function loadConfig() {
  let loaded = null;
  try {
    const res = await fetch(`${process.env.BASE_URL}config.json`, { cache: "no-store" });
    const type = res.headers.get("content-type") || "";
    if (res.ok && type.includes("json")) loaded = await res.json();
  } catch (e) {
    loaded = null;
  }
  if (!loaded) loaded = devFallback();
  const missing = REQUIRED.filter((k) => !loaded || !loaded[k]);
  if (missing.length && process.env.NODE_ENV === "development") {
    // Local UI preview (?uiPreview=1) can run without a backend.
    console.warn(`[config] missing ${missing.join(", ")}; copy config.example.json to public/config.json`);
  } else if (missing.length) {
    throw new Error(`config.json is missing: ${missing.join(", ")}`);
  }
  config = Object.freeze({ ...loaded });
  return config;
}

export function getConfig() {
  if (!config) throw new Error("Config not loaded yet");
  return config;
}

/**
 * Per-environment feature switch from config.json "features". A feature
 * that isn't listed is on, so DEV and local dev keep everything; an
 * environment turns one off with { "features": { "<name>": false } }.
 */
export function featureOn(name) {
  const f = config && config.features;
  return !f || f[name] !== false;
}
