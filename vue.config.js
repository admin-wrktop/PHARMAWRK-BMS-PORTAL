const fs = require("fs");
const path = require("path");
const { defineConfig } = require("@vue/cli-service");

// Written by scripts/generate-build-info.js (prebuild / preserve). The bundle
// carries this commit so a tab can tell when /build-info.json names a newer one.
function buildInfo() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "public/build-info.json"), "utf8"));
  } catch (e) {
    return { commit: "dev", builtAt: "" };
  }
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  chainWebpack: (config) => {
    const info = buildInfo();
    config.plugin("define").tap((args) => {
      args[0].__PW_BUILD_COMMIT__ = JSON.stringify(info.commit || "dev");
      args[0].__PW_BUILD_AT__ = JSON.stringify(info.builtAt || "");
      return args;
    });
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
