/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
  ],
  // ovo sam napisao kako bi linter ignorirao config datoteke
  // https://stackoverflow.com/questions/70973306/how-to-convert-postcss-config-js-and-tailwind-config-js-to-es-modules
  overrides: [
    {
      files: ["*.config.js"],
      env: {
        node: true,
      },
    },
  ],
};
