import { defineConfig } from "@playwright/test";

/**
 * Panel testleri yerel depoyla koşar: GitHub yerine geçici bir klasördeki
 * content/*.json dosyaları kullanılır (bkz. tests/panel.spec.ts).
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  // Testler aynı yerel depoyu paylaştığı için sırayla koşar.
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://127.0.0.1:3100",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: "http://127.0.0.1:3100/giris",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          ADMIN_PAROLA: "test-parola-123",
          ICERIK_KOKU: process.env.ICERIK_KOKU ?? "./.yerel/test-icerik",
          SITE_ORIGINS: "http://127.0.0.1:3000",
        },
      },
  globalSetup: "./tests/kurulum.ts",
});
