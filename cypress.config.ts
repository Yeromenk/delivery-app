import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    videosFolder: 'tests/e2e/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'tests/e2e/screenshots',
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 60000,
    specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/e2e.ts',
    fixturesFolder: 'tests/e2e/fixtures',
    excludeSpecPattern: ['**/examples/**', '**/node_modules/**'],
    experimentalStudio: true,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      API_URL: 'http://localhost:5000',
      TEST_USER_EMAIL: 'test@example.com',
      TEST_USER_PASSWORD: 'password123'
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/component.ts',
    indexHtmlFile: 'tests/e2e/support/component-index.html',
    viewportWidth: 1000,
    viewportHeight: 660
  },
  chromeWebSecurity: false,
  watchForFileChanges: true,
  numTestsKeptInMemory: 50,
  defaultBrowser: 'chrome'
})
