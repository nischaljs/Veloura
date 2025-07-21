# Veloura

A full-stack web application with a React frontend and Node.js/Express backend.

## Setup Guide

1. Install Node.js, pnpm, and PostgreSQL.
2. Clone this repository.
3. Run `pnpm install` in both `server` and `client` folders.
4. Create `.env` files in `server` and `client` (see `.env.example` in each).
5. Create a MYSQL database and update `DATABASE_URL` in `server/.env`.
6. In the `server` folder, run `pnpm run db:migrate` to apply migrations.
7. In the `server` folder, run `pnpm run db:seed` to seed the database and download images.
8. Start the backend: `pnpm dev` (in `server`).
9. Start the frontend: `pnpm dev` (in `client`).


