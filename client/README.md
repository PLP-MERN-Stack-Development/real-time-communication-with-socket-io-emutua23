<!-- ...existing code... -->

# 🎨 React + Vite (Client)

A minimal React + Vite template with HMR and basic ESLint guidance — optimized for building the chat client.

---

## ✨ At a Glance

| Item | Details |
|------|---------|
| Framework | React |
| Bundler | Vite (fast dev server + HMR) |
| Linter | ESLint (recommended) |
| Optional | @vitejs/plugin-react / @vitejs/plugin-react-swc |

---

## 🚀 Quick Start

| Step | Command |
|------|---------|
| Install deps | npm install |
| Dev server | npm run dev |
| Build | npm run build |
| Preview production build | npm run preview |

Run on Windows (example):
```powershell
cd client
npm install
npm run dev
```

---

## 🧩 Official Plugins

| Plugin | Purpose |
|--------|---------|
| @vitejs/plugin-react | Babel-based fast refresh |
| @vitejs/plugin-react-swc | SWC-based fast refresh (faster builds) |

Use one in vite.config.js depending on needs.

---

## 🔎 ESLint & TypeScript

- For production apps prefer TypeScript + type-aware ESLint.
- To enable stricter lint rules: add typescript, @typescript-eslint/parser and @typescript-eslint/eslint-plugin.
- Example recommendation:
  - Use React + TS template if you want type-aware linting and better DX.

---

## 🛠 Recommended Scripts (package.json)

| Script | What it does |
|--------|--------------|
| dev | Start Vite dev server with HMR |
| build | Create production bundle |
| preview | Locally preview production build |
| lint | Run ESLint checks (add if configured) |

---

## 📚 Tips

- Use the React Compiler only if you need runtime/compile-time features — otherwise keep default for best dev/build performance.
- Keep HMR enabled during development for fast UI feedback.
- Add a .env file for VITE_ variables (e.g. VITE_SERVER_URL).

---

## 🔗 Useful Links

- Vite: https://vitejs.dev/  
- React: https://react.dev/  
- Vite React plugin: https://github.com/vitejs/vite/tree/main/packages/plugin-react

---

## ✅ Summary

This client template is lightweight and ready for the chat app UI. Add plugins and linting as your app grows.

<!-- ...existing code... -->