import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    env: {
      NODE_ENV: "development",
    },
    environmentOptions: {
      // Stop happy-dom from following <a> clicks (which triggers fetch + stderr noise).
      // Routini behavior is asserted via PUSHSTATE events, not native navigation.
      happyDOM: {
        settings: { navigation: { disableMainFrameNavigation: true } },
      },
    },
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
