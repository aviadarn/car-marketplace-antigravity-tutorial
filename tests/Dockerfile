FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /tests

COPY package.json playwright.config.js ./

# Install playwright test from @playwright/test package
RUN npm install
RUN npx playwright install chromium --with-deps

COPY . .

# Run using the installed playwright binary
CMD ["npx", "--yes", "@playwright/test", "test"]
