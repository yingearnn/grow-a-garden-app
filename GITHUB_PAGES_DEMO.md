# Garden Game — GitHub Pages browser demo

This demo runs without Node.js or MySQL. The original Express/MySQL application is preserved in `src/` and `index.js`, but GitHub Pages does not execute it.

## Deploy
1. Add the changed files (the workflow, frontend HTML files, `frontend/demo/mock-api.js`, and this guide) to your repository and commit to `main`.
2. Open GitHub repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Open **Actions** and run/inspect `Deploy Garden Game Demo to GitHub Pages` (or push a commit to trigger it).
4. Open `https://st0503-bed.github.io/bed-ca2-yingearnn/`.

The `frontend` directory is uploaded as the Pages artifact, making its `index.html` the site entry point. No `npm run build` is necessary.

## Important limitations
- Demo profiles, inventory, challenges, scores and leaderboard live in browser localStorage and do not sync between users or devices.
- The demo registration/login is **NOT secure authentication** and does **not verify passwords**. Never use a real password or sensitive personal information here.
- This is suitable for a playable demonstration, not a replacement for a real backend/database.
- Clearing browser storage resets all demo data.
