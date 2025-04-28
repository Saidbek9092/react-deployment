# React Deployment with GitHub Pages and GitHub Actions

This project demonstrates how to deploy a React application to GitHub Pages using GitHub Actions for continuous deployment and testing.

## Table of Contents
- [Setup GitHub Pages](#setup-github-pages)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Testing Setup](#testing-setup)
- [Repository Settings](#repository-settings)

## Setup GitHub Pages

1. **Create a React Project**
   ```bash
   npm create vite@latest react-deployment -- --template react-ts
   cd react-deployment
   npm install
   ```

2. **Install GitHub Pages Package**
   ```bash
   npm install gh-pages --save-dev
   ```

3. **Update package.json**
   ```json
   {
     "name": "react-deployment",
     "homepage": "https://<username>.github.io/react-deployment",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Update vite.config.ts**
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: "/react-deployment"
   })
   ```

## GitHub Actions Workflows

We created two workflow files for different purposes:

### 1. check-pr.yml
This workflow runs tests on pull requests to ensure code quality before merging.

```yaml
name: Check PR Readiness

on:
  pull_request:
    branches:
      - main

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build the project
        run: npm run build

      - name: Check for linting errors
        run: npm run lint

      - name: Check for TypeScript errors
        run: npm run type-check
```

### 2. deploy.yml
This workflow handles the deployment to GitHub Pages when changes are merged to main.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Build the project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Testing Setup

1. **Install Testing Dependencies**
   ```bash
   npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
   ```

2. **Create Test Setup File (src/test/setup.ts)**
   ```typescript
   import { expect, afterEach } from 'vitest'
   import { cleanup } from '@testing-library/react'
   import * as matchers from '@testing-library/jest-dom/matchers'

   expect.extend(matchers)
   afterEach(() => {
     cleanup()
   })
   ```

3. **Update vite.config.ts for Testing**
   ```typescript
   /// <reference types="vitest" />
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: ['./src/test/setup.ts'],
     },
     base: "/react-deployment"
   })
   ```

4. **Add Test Scripts to package.json**
   ```json
   {
     "scripts": {
       "test": "vitest",
       "type-check": "tsc --noEmit"
     }
   }
   ```

## Repository Settings

1. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to "Pages" under "Code and automation"
   - Select "GitHub Actions" as the source

2. **Configure Branch Protection**
   - Go to repository Settings
   - Navigate to "Branches" under "Code and automation"
   - Click "Add rule"
   - Under "Branch name pattern", enter `main`
   - Enable these options:
     - ✓ "Require status checks to pass before merging"
     - ✓ "Require branches to be up to date before merging"
   - Under "Status checks that are required", select:
     - `check` (from check-pr.yml workflow)

3. **Configure Workflow Permissions**
   - Go to repository Settings
   - Navigate to "Actions" → "General"
   - Under "Workflow permissions":
     - Select "Read and write permissions"
     - Enable "Allow GitHub Actions to create and approve pull requests"

## Why Two YAML Files?

We use two separate workflow files for better separation of concerns:

1. **check-pr.yml**
   - Runs on pull requests
   - Focuses on code quality
   - Prevents merging of broken code
   - Runs tests, linting, and type checking

2. **deploy.yml**
   - Runs only on pushes to main
   - Handles deployment
   - Ensures only production-ready code is deployed
   - Uses GitHub Pages action for deployment

This separation allows us to:
- Test code before merging
- Deploy only after successful tests
- Keep deployment and testing concerns separate
- Maintain a clean and organized workflow structure
