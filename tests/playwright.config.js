const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './',
    testMatch: '**/*.spec.js',
    fullyParallel: false,
    retries: 2,
    workers: 1,
    reporter: 'list',
    timeout: 30000,
    use: {
        baseURL: 'http://ui:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
