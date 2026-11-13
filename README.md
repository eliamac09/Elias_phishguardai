# PhishGuard AI

**Detect. Alert. Educate. Protect.**

A client-side phishing-awareness prototype built with React, TypeScript and Vite.

## Features
- Rule-based analysis of pasted email/SMS text and URLs.
- Advisory risk bands: Low, Medium, High and Inconclusive.
- Evidence-led explanations and security recommendations.
- Session-only scan history; submitted content is not intentionally persisted.
- URL analysis is lexical only: the app does not open, fetch, or resolve submitted URLs.
- The current explainer is a deterministic mock, clearly labelled in the interface. It is not a live AI provider.

## Run locally
```bash
npm ci
npm run typecheck
npm run build
npm run dev
```

## Deploy
The GitHub Actions workflow at `.github/workflows/deploy.yml` builds the Vite app and deploys the `dist/` directory to GitHub Pages whenever code is pushed to `main`.

In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. Then check the **Actions** tab for the deployment result.

Expected project URL: https://eliamac09.github.io/Elias_phishguardai/

## Important limitations
- This prototype is not a validated phishing detector and its score thresholds are illustrative.
- A Low result does not establish that a message or URL is safe.
- No SPF/DKIM, reputation, threat-intelligence or machine-learning checks are performed.
- Do not paste passwords, OTPs, financial details or confidential content.
