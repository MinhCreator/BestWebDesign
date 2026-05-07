# Implementation Plan - Convert to Vite + React + Tailwind CSS

This plan outlines the steps to migrate the **ENDURANCE|HUB** project to a React-based architecture using Vite and Tailwind CSS.

## User Review Required

> [!IMPORTANT]
> The project structure will follow a standard Vite-React layout. Existing templates in `src/template` will be converted into React components and organized into `src/components` and `src/pages`. 
> React Router will be used to handle navigation between pages.

## Proposed Changes

### 1. Project Initialization & Dependencies
- Initialize a new `package.json`.
- Install core dependencies: `react`, `react-dom`, `react-router-dom`.
- Install build tools: `vite`, `@vitejs/plugin-react`.
- Install styling tools: `tailwindcss`, `postcss`, `autoprefixer`, `daisyui`.

### 2. Configuration
- **[NEW] `vite.config.js`**: Configure Vite for React.
- **[NEW] `tailwind.config.js`**: Configure Tailwind with DaisyUI plugin.
- **[NEW] `postcss.config.js`**: Configure PostCSS for Tailwind.

### 3. File Reorganization
- **[NEW] `index.html`**: Move/rebuild the main entry point at the root.
- **[NEW] `src/main.jsx`**: Main React entry point.
- **[NEW] `src/App.jsx`**: Main application component with routing.
- **[NEW] `src/index.css`**: Global styles including Tailwind directives.

### 4. Component Migration
- **Navbar & Footer**: Convert `Navbar.html` and `footer.html` into reusable components in `src/components/`.
- **Pages**: Convert the following templates from `src/template/` into React page components in `src/pages/`:
    - `home.html` -> `Home.jsx`
    - `Jogging.html` -> `Jogging.jsx`
    - `Rank.html` -> `Rank.jsx`
    - `bill.html` -> `Bill.jsx`
    - `new.html` -> `New.jsx`
    - `team.html` -> `Team.jsx`
    - `tracking.html` -> `Tracking.jsx`
- **Dynamic Assets**: Move contents of `src/public` to a root `public/` folder to maintain path consistency or use `src/assets/`.

### 5. Routing Implementation
- Use `BrowserRouter` in `App.jsx` to map routes to the new page components.

## Open Questions

- Should I preserve all existing CSS files in `src/style` as CSS modules, or try to convert most of their custom styles to Tailwind utility classes?
- Are there any specific "WIP" features (like the Node.js/Express parts mentioned in README) that should be considered, or should we focus strictly on the frontend conversion for now?

## Verification Plan

### Automated Tests
- Run `npm run dev` and verify the Vite server starts successfully.
- Use the browser agent to navigate through all routes and verify UI consistency.

### Manual Verification
- Check responsiveness on mobile and desktop views using browser developer tools.
- Verify that interactive elements (like navigation links and hover effects) work as expected in the React environment.
