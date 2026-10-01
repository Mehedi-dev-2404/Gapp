# Gapp

Find who's free, plan a hangout. A frontend-only web app for University of Greenwich
students: mark your weekly timetable, see who else is free at the same time — even on a
different course — and spin up a quick hangout (coffee at Whale Tea, food at Nando's,
a walk in Greenwich Park) with friends or the whole campus.

No backend, no auth, no API keys. All students and hangouts are seeded mock data
(`src/data/`); your own changes (timetable, joined/created hangouts, friends) persist in
`localStorage` so the demo survives a refresh.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). That's it — no env vars, no
server, no sign-in. You're signed in as **Sam Carter, BSc Computer Science** by default.

Use **Reset demo** in the sidebar footer at any point to wipe `localStorage` and restore
the seeded starting state.

## 60-second demo script

1. **My Week** (10s) — Point out the pre-filled timetable. Click-drag a couple of slots
   from "In class" to "Free" to show it's live and editable, then hit **Save timetable**.
2. **Who's Free** (20s) — This is the core idea. Show the free-blocks list: "Priya ·
   BSc Business" and "Elena · BA Architecture" are free at the same time as Sam even
   though they're on completely different courses. Click a bright cell on the week
   heatmap to open the side panel, then hit **Plan a hangout**.
3. **Create hangout** (15s) — Note the day/time pickers only offer slots where Sam is
   actually free. Pick Whale Tea, set visibility to "Invite friends," tick a couple of
   people, and create it.
4. **Hangouts feed** (10s) — Show it landed in the feed instantly, with a live attendee
   count. Switch the "Happening now" filter to show the two hangouts currently live.
   Join one as a visitor and watch the spots-left count update immediately.
5. **Friends** (5s) — Quick scroll through "People at Greenwich," toggle Add/Friends on
   someone to show it feeds back into Who's Free's "Friends only" filter.

## Project structure

```
src/
  components/   Shared UI: Sidebar, Avatar, PageHeader, EmptyState, CreateHangoutModal
  pages/        MyWeek, WhosFree, Hangouts, Friends
  data/         students.js (seeded roster + timetables), hangouts.js (seeded feed)
  lib/          overlap.js (pure timetable-comparison utilities), AppContext.jsx (state + localStorage)
```

`lib/overlap.js` is dependency-free and holds the core logic:
- `freeBlocks(timetable)` — turns a weekly timetable into contiguous free blocks
- `overlapWith(userBlocks, otherBlocks)` — shared free time between two people
- `overlapCounts(students)` — per-slot headcount of who's free, used by the heatmap

## Deploying to Vercel

This is a static Vite build, so it deploys with zero configuration:

```bash
npm install -g vercel   # if you don't have it
vercel                  # first run: links/creates the project, deploys a preview
vercel --prod            # promotes to your production URL
```

Or via the dashboard: push this repo to GitHub, then "Import Project" on
[vercel.com/new](https://vercel.com/new) — Vercel auto-detects Vite
(build command `vite build`, output directory `dist`). No environment variables needed.
