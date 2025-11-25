# Server for Quiz App

This folder contains the Express server to store quizzes (MongoDB via Mongoose).

1) Copy `.env.example` to `.env` and fill MONGO_URI, ADMIN_USER and ADMIN_PASS.
2) Run `npm install` then `npm run dev` (nodemon) or `npm start`.

Notes:
- The admin auth is a simple header-based compare against environment variables and is intended for demo purposes only.
