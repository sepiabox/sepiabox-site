// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests",
  use: {
    baseURL: "http://127.0.0.1:4173",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx http-server . -p 4173 -a 127.0.0.1 --silent",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
