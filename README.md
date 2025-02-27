# Re:Zero

[https://www.re-zero.io](https://www.re-zero.io)

Resistance Zero is a [time management system created by Mark Forster](http://markforster.squarespace.com/blog/2022/6/14/resistance-how-to-make-the-most-of-it-the-resistance-zero-sy.html).

It helps you get through tasks, even ones you resist doing.

## Requirements

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/)
- [Clerk](https://clerk.com/)
- [PostHog](https://posthog.com/)

## Getting Started

### Environment variables

```bash
cp .env.example .env
```

Update the values in `.env`, except `DATABASE_URL` which will automatically be
generated in the [Setup the database](#setup-the-database) step.

### Install dependencies

```bash
bun install
```

### Setup the database

```bash
# Ensure the Docker daemon is running
./start-database.sh
bun run db:generate
```

### Run the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
