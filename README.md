# Adoptium Dashboard

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c22df43-6f0d-46ea-a1fd-9cd11e37d67f/deploy-status)](https://app.netlify.com/sites/eclipsefdn-adoptium-dash/deploys)
[![codecov](https://codecov.io/gh/adoptium/dash.adoptium.net/graph/badge.svg?token=JW7GMMZX7J)](https://codecov.io/gh/adoptium/dash.adoptium.net)

The next gen download dashboard

## Local run/development steps

- start DownloadStats

```bash
npm install
npm start
```

- open http://localhost:3000

## Deployment

- Compile and generate static files

```bash
npm run-script build
```

- serve ./dist
