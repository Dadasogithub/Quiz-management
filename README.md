# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Quiz Management App (added by me)

This repository has been extended into a simple Quiz Management application featuring:

Run the app:
1. Start MongoDB locally or use an Atlas instance, then create `server/.env` (copy from `server/.env.example`).
2. Start backend: `cd server && npm install && npm run dev` (uses nodemon)
3. Start frontend: `npm install && npm run dev`
4. Optional: Create a root `.env` file and set `VITE_ADMIN_USER` and `VITE_ADMIN_PASS` to auto-login to the admin UI for convenience.

By default the client expects the API at `http://localhost:5000/api`. Set `VITE_API_BASE` if different.

API endpoints implemented:
- GET /api/quizzes -> returns quizzes (without correct answers)
- GET /api/quizzes/:id -> returns quiz detail including correct answer index (only for server-side testing)
- POST /api/admin/login -> {username,password}
- POST /api/admin/quizzes -> add a quiz (requires admin headers x-admin-user and x-admin-pass)
- GET /api/admin/quizzes -> list all quizzes (admin only)
- PUT /api/admin/quizzes/:id -> update a quiz (admin only)
- DELETE /api/admin/quizzes/:id -> delete a quiz (admin only)

This is a demo project; admin auth is intentionally simple and not secure for production.
Quick troubleshooting checklist

- If admin login error is “Unable to connect to API server…”:
- If you see 401 from `POST /admin/login`:
Check DB connection and server state
1. Check server logs — when the backend successfully connects to MongoDB you should see "Connected to MongoDB" and the Mongoose event logs.
2. Use the DB health endpoint we've added:
```
curl http://localhost:5000/api/db-health
```
Response example: `{ ok: true, state: 1, status: "connected" }` where `1`/`connected` means the connection is active.
3. Try connecting with `mongosh` directly from your machine to ensure the DB endpoint is reachable:
```
mongosh "mongodb://127.0.0.1:27017/quiz-app"
# then run: db.stats() or show dbs
```
4. Use MongoDB Compass or other GUI client to connect to the same `MONGO_URI` and verify the database is reachable and lists collections.
