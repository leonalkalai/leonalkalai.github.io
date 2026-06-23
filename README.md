# Leon Kountouras — Next.js Portfolio with Protected AI/ML Screenshot Dashboard

A modern portfolio website built with **Next.js 16**, **React**, **TypeScript**, and a Webflow-compatible visual system.
The project presents selected web development work, project case studies, professional experience, dynamic project imagery, and a protected AI/ML-assisted screenshot dashboard used to generate and manage portfolio screenshots.

This repository contains the final Next.js application, not the temporary generation assets that were used during development.

---

## Overview

This portfolio was built as a migration and modernization project. The original visual direction came from static/Webflow-style source material, which was transformed into a modular Next.js application with reusable components, dynamic project data, custom animations, project overlays, selected screenshots, and protected internal tooling.

The project includes:

- Next.js 16 App Router
- React and TypeScript
- Webflow-compatible layout and animation structure
- Dynamic project data
- Project detail pages
- Case-study style presentation
- Professional experience timeline
- Custom visual effects and embedded 3D/animated frames
- AI/ML-assisted screenshot dashboard
- Dynamic screenshot selection architecture
- Protected admin dashboard using Basic Auth through `proxy.ts`
- GitHub/Vercel-ready deployment setup
- `.gitignore` and `.vercelignore` rules to keep generated/runtime files out of production

---

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- CSS / custom global styles
- Webflow-compatible class structure
- Responsive layout
- Static and dynamic project pages

### Runtime / Tooling

- Node.js
- Next.js API routes
- File-based JSON data
- Local screenshot worker script
- GitHub for version control
- Vercel for deployment

### AI/ML Screenshot System

The project includes a protected dashboard for screenshot selection and project imagery management.

This is not a heavy TensorFlow or deep learning pipeline. It is a practical **ML-ready, feedback-assisted screenshot ranking system** designed for the current portfolio use case.

It supports:

- Capturing project screenshots
- Generating candidate screenshots
- Selecting final cover and slide images
- Storing final frontend image mappings
- Managing project screenshot metadata
- Keeping temporary candidates out of GitHub and Vercel
- Using selected screenshots dynamically in the frontend

---

## Project Structure

```txt
app/
  about/
  admin/screenshot-training/
  api/ml/
  projects/[slug]/
  globals.css
  layout.tsx
  page.tsx

components/
  ml/
  CVTimeline.tsx
  CVTimelineControls.tsx
  CretoMenu.tsx
  FirmoAboutEffects.tsx
  PageEffects.tsx
  ProjectOverlay.tsx
  WebflowScripts.tsx

data/
  experience.ts
  portfolio.ts
  spaceball.ts
  ml/
    frontend-images.json
    projects.json

hooks/
  useProjectImages.ts

lib/
  ml/
    frontend-images.ts
    ml-store.ts
    screenshot-ranking.ts

public/
  ml-screenshots/
  profile.png
  logos
  visual assets
  iframe animation files

scripts/
  ml-screenshot-worker.mjs

proxy.ts
next.config.ts
package.json
tsconfig.json
postcss.config.mjs
```

---

## How the Portfolio Was Built

The portfolio started from a Webflow/static HTML visual source and was migrated into a modern Next.js 16 application.

The work included:

1. Extracting and cleaning the original static HTML structure.
2. Preserving important Webflow class names and visual behavior.
3. Replacing demo content with real portfolio data.
4. Converting static sections into React/Next.js components.
5. Creating project and experience data files.
6. Building dynamic project detail routes.
7. Integrating selected screenshots into project cards and overlays.
8. Creating a protected internal screenshot-training dashboard.
9. Preparing the project for GitHub and Vercel deployment.

The final result is a production-ready portfolio that keeps the original premium visual direction while using a maintainable modern application structure.

---

## Main Features

### Portfolio Homepage

The homepage presents:

- Personal branding
- Selected work
- Project previews
- Experience highlights
- Animated visual sections
- Webflow-compatible effects
- Dynamic project images

### About Page

The about page includes:

- Professional background
- Core strengths
- Experience-oriented presentation
- Visual placeholder sections and profile imagery
- Clean responsive layout

### Project Pages

Each project has a dynamic route:

```txt
/projects/[slug]
```

The project system is based on structured data and can be expanded without hardcoding every page manually.

### Project Overlay

The portfolio includes an interactive project overlay/gallery system that can use selected screenshots from the AI/ML screenshot pipeline.

### Professional Timeline

The CV/experience timeline is structured through React components and data files, making it easier to update work history, roles, tools, and experience details.

---

## AI/ML Dynamic Screenshot Architecture

The project includes an internal screenshot dashboard located at:

```txt
/admin/screenshot-training
```

The purpose of this dashboard is to help generate and manage clean screenshots for portfolio projects.

### Why It Exists

Portfolio project screenshots often become outdated or inconsistent. Manually capturing, cropping, naming, and replacing images for many projects is time-consuming.

The screenshot dashboard solves this by creating a structured workflow:

```txt
Project URL
  ↓
Screenshot candidates
  ↓
Ranking / filtering
  ↓
Manual or smart selection
  ↓
Final cover and slide images
  ↓
Frontend image mapping
  ↓
Portfolio cards and overlays
```

### Important Files

```txt
data/ml/projects.json
```

Stores project metadata used by the screenshot system.

```txt
data/ml/frontend-images.json
```

Maps each project slug to its selected frontend images.

Example concept:

```json
{
  "hotels-finder": {
    "cover": "/ml-screenshots/hotels-finder/cover.webp",
    "images": [
      "/ml-screenshots/hotels-finder/cover.webp",
      "/ml-screenshots/hotels-finder/slide-1.webp",
      "/ml-screenshots/hotels-finder/slide-2.webp",
      "/ml-screenshots/hotels-finder/slide-3.webp"
    ]
  }
}
```

Final screenshots are stored under:

```txt
public/ml-screenshots/<project-slug>/cover.webp
public/ml-screenshots/<project-slug>/slide-1.webp
public/ml-screenshots/<project-slug>/slide-2.webp
public/ml-screenshots/<project-slug>/slide-3.webp
```

Temporary screenshot candidates are ignored and not deployed:

```txt
public/ml-screenshots/<project-slug>/candidates-*/
```

---

## Machine Learning Direction

The screenshot system is intentionally lightweight.

It is currently a **feedback-assisted and ranking-based system**, not a full deep learning model. This was a deliberate decision because the immediate goal was practical:

```txt
Generate a few clean screenshots for each portfolio project.
```

A full TensorFlow, Transformers.js, or Python ML pipeline would be unnecessary at this stage.

The architecture is still ML-ready because it separates:

- Project definitions
- Screenshot candidates
- Ranking metadata
- Selected frontend images
- User preferences
- Runtime job status
- Final production assets

This makes it possible to evolve later into:

- Feature-based scoring
- Image similarity filtering
- Embeddings
- TensorFlow.js classification
- Transformers.js visual embeddings
- Python/scikit-learn model training
- More advanced automatic visual QA

For the current production portfolio, the best approach is:

```txt
Rules + ranking + selected screenshots + protected dashboard
```

rather than heavy ML overengineering.

---

## Problems Solved During Development

### 1. Static HTML to Next.js Migration

The original structure was not built for React. It contained static markup, Webflow-specific classes, external scripts, and source assets.

Solution:

- Extracted useful body structure
- Removed incompatible scripts from raw React rendering
- Rebuilt the app using Next.js App Router
- Preserved important visual classes
- Created reusable components

---

### 2. Webflow Script and Animation Compatibility

Webflow-style animations and interactions do not automatically work when copied into a React/Next.js project.

Solution:

- Isolated script loading
- Added dedicated components for client-side effects
- Preserved class naming where needed
- Avoided unsafe inline script usage inside React components

---

### 3. Dynamic Portfolio Data

Hardcoding every project would make the portfolio difficult to maintain.

Solution:

- Moved project data into structured files
- Created dynamic routes
- Connected cards, overlays, and case studies to data-driven content

---

### 4. Project Screenshots

The project needed real screenshots instead of generic placeholders.

Problem:

- Screenshots can become numerous
- Candidate images can consume disk space
- Temporary files should not be deployed
- Only selected images should appear in production

Solution:

- Created screenshot dashboard
- Stored final selected images as `cover.webp` and `slide-*.webp`
- Ignored `candidates-*` folders
- Used `frontend-images.json` as the production mapping
- Added `.gitignore` and `.vercelignore` rules

---

### 5. Avoiding Unnecessary Deployment Files

Several files were used only during generation, such as source HTML, PDFs, ZIP files, and generator scripts.

These files are not part of the final production app.

Solution:

- Kept them local only
- Excluded them from GitHub and Vercel
- Tracked only the final Next.js application and production assets

Examples of ignored local-only files:

```txt
*.pdf
*.zip
demo.html
urls.txt
firmo-about.html
spaceball.html
init-project-webflow-compatible.js
setup-ml-screenshot-system.mjs
```

---

### 6. Protecting the AI/ML Dashboard

The dashboard should exist in the GitHub repository and be usable when needed, but it should not be publicly open.

Solution:

- Added `proxy.ts`
- Protected dashboard and ML API routes with Basic Auth
- Kept public portfolio pages accessible
- Kept `/api/ml/frontend-images` available for frontend image loading

Protected routes include:

```txt
/admin/screenshot-training
/api/ml/run-screenshot-job
/api/ml/screenshots-status
/api/ml/preferences
/api/ml/preferences-files
/api/ml/projects
/api/ml/next-phase
```

---

### 7. Next.js 16 Middleware Change

During development, Next.js warned that the old `middleware.ts` convention is deprecated in favor of `proxy.ts`.

Solution:

- Replaced `middleware.ts` with `proxy.ts`
- Renamed the exported function from `middleware` to `proxy`
- Kept the route matcher logic for dashboard protection

---

### 8. Git and Deployment Hygiene

Before pushing to GitHub, the repository was cleaned so that only useful source files and production assets are tracked.

Ignored files include:

```txt
.env.local
.next/
node_modules/
PDF files
ZIP files
generator scripts
runtime ML JSON files
temporary screenshot candidates
```

Tracked files include:

```txt
Next.js app source
components
data files
public production assets
selected screenshots
protected dashboard source
package files
configuration files
```

---

## Environment Variables

Create a local `.env.local` file:

```env
ML_DASHBOARD_USER=leon
ML_DASHBOARD_PASSWORD=your-secure-password
```

These values are required for the protected AI/ML dashboard.

Do not commit `.env.local`.

For Vercel, add the same variables in:

```txt
Vercel Project Settings → Environment Variables
```

Required variables:

```env
ML_DASHBOARD_USER=leon
ML_DASHBOARD_PASSWORD=your-secure-password
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Open the protected dashboard:

```txt
http://localhost:3000/admin/screenshot-training
```

The browser should request username and password.

---

## Production Build

Run:

```bash
npm run build
```

Start production mode locally:

```bash
npm run start
```

The build should include:

```txt
/
 /about
 /projects/[slug]
 /admin/screenshot-training
 /api/ml/*
 Proxy protection
```

The dashboard route exists in the build but is protected by `proxy.ts`.

---

## Deployment

The project is intended to be deployed through GitHub and Vercel.

### GitHub

The repository tracks:

- Next.js source code
- Protected AI/ML dashboard code
- Final selected screenshots
- Production public assets
- Configuration files

The repository does not track:

- `.env.local`
- temporary screenshot candidates
- PDFs
- ZIP files
- generation scripts
- local runtime ML state

### Vercel

Before using the dashboard on Vercel, configure:

```env
ML_DASHBOARD_USER=leon
ML_DASHBOARD_PASSWORD=your-secure-password
```

The public portfolio remains accessible, while the dashboard requires authentication.

---

## Git Hygiene

Before committing, useful checks:

```bash
git status --short --ignored
```

Check staged files for things that should not be committed:

```bash
git diff --cached --name-only | grep -Ei 'candidates-|\.env|\.pdf$|\.zip$|init-project|setup-ml|demo\.html|urls\.txt|jobs\.json|rankings\.json|preferences\.json|worker\.log'
```

If the command returns nothing, the staged files are clean.

---

## Current Repository Policy

Tracked:

```txt
app/
components/
data/
hooks/
lib/
public/
scripts/
types/
proxy.ts
package.json
package-lock.json
next.config.ts
postcss.config.mjs
tsconfig.json
```

Ignored:

```txt
.env.local
.next/
node_modules/
*.pdf
*.zip
demo/source HTML files
generator scripts
runtime ML state files
temporary screenshot candidates
```

---

## Why This Architecture Was Chosen

The goal was not to build an overengineered machine learning platform.

The goal was to build a real portfolio that can:

- Present projects professionally
- Use real screenshots
- Keep screenshots maintainable
- Avoid deploying unnecessary generated files
- Keep internal tooling available but protected
- Remain deployable on Vercel
- Stay ready for future AI/ML improvements

The final architecture keeps a clean separation between:

```txt
Production portfolio
Internal screenshot dashboard
Temporary generated assets
Final selected assets
Future ML-ready data
```

This gives the project a practical balance between visual quality, maintainability, security, and future extensibility.

---

## Author

**Leon Kountouras**
Full-Stack / Software Engineer
Portfolio focused on modern web applications, React, Next.js, TypeScript, Node.js, APIs, databases, SEO, performance, and AI-assisted development workflows.
