# kunaltechie.me

Personal resume and portfolio site of Kunal Singh, live at https://www.kunaltechie.me.

Public pages: home, about, skills, experience, projects, GitHub and LeetCode stats, certificates, blog, resume and contact. An admin panel under `/admin` edits the same content in MongoDB.

## Stack

- Next.js 16 (App Router) and React 19, TypeScript
- Tailwind CSS 4, Framer Motion, React Three Fiber for the hero scene
- MongoDB with Mongoose
- NextAuth (credentials) for the admin panel

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The public pages work without a database: they fall back to the content in `src/lib/constants.ts`. The admin panel, blog and contact form need MongoDB.

## Environment variables

| Name | Used for |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET`, `AUTH_SECRET` | Session signing for NextAuth |
| `NEXTAUTH_URL` | Base URL of the site for NextAuth |
| `AUTH_TRUST_HOST` | Lets NextAuth trust the host header behind a proxy |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin account created by the seed script |
| `GITHUB_USERNAME`, `LEETCODE_USERNAME` | Profile handles |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `GROQ_API_KEY` | Chat endpoint (`/api/chat`) |
| `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN`, `LINKEDIN_API_VERSION` | Importing LinkedIn posts into the blog |

`GITHUB_TOKEN` is optional. When set, `/api/github` uses it for a higher GitHub API rate limit.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run seed` | Write the content in `src/lib/constants.ts` into MongoDB |

## Editing content

There are two places content lives, and one feeds the other:

1. **`src/lib/constants.ts`** is the source of truth for profile, experience, projects, skills, education, certificates, languages and achievements. Pages use it directly when the database has nothing to offer.
2. **MongoDB** holds what the site serves day to day. Edit it through the admin panel at `/admin` (sign in with the admin account).

`npm run seed` copies `constants.ts` into MongoDB. It replaces the profile, projects, certificates, experience, skills, education and resume summary, and resets the admin password to `ADMIN_PASSWORD`. Blog posts, job posts and contact messages are not touched. If you changed something in the admin panel and want to keep it, make the same change in `constants.ts` before seeding.

Types for all of this are in `src/types/index.ts`; the Mongoose models are in `src/models`.
