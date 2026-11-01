# Smart Campus Room Availability Checker

Find a campus room that fits your group (attendees, equipment) and check whether it is free for a time slot.
All rooms and bookings are fictional; there is no login, payment, live API or database.

## Setup and run

```bash
npm install        # install dependencies
npm run dev        # start the app (Vite dev server)
npm run build      # production build into dist/
```

## Tests and checks

```bash
npx vitest run                    # all automated tests (unit, integration, UI)
npx vitest run --reporter=verbose # the same, listing every test by name
npm run typecheck                 # TypeScript check (tsc --noEmit)
```

Tests live next to the code they cover:

| File | Covers |
| --- | --- |
| `src/domain/availability.test.ts` | AC1–AC5 booking rules (14 tests) |
| `src/domain/time.test.ts` | shared time formatter and limits (4 tests) |
| `src/domain/filters.test.ts` | F1–F5 room filtering (9 tests) |
| `src/catalog.integration.test.ts` | catalog + filtering + availability together (2 tests) |
| `src/App.ui.test.tsx` | rendered UI: filter, room switch, empty state (1 test, jsdom) |

## Project structure

```
src/
  App.tsx                 screen state + composition (no rules)
  types.ts                Room, Booking, AvailabilityResult, Equipment
  data/rooms.ts           fictional room catalog (5 rooms)
  domain/availability.ts  AC1–AC5 availability rules
  domain/filters.ts       F1–F2 capacity and equipment filtering
  domain/time.ts          DAY_MINUTES, MAX_DURATION, minutesToHHMM
  components/RoomFilter.tsx    attendees, equipment, matching rooms, empty state
  components/BookingPanel.tsx  time inputs, check button, result
  components/RoomDetails.tsx   room status, capacity, equipment, bookings
```

Times are minutes after midnight (0–1440); the default current time is fixed at 540 (09:00).

## Versions for the assignment

- Initial version: `a4-initial/` (copy of `src/` and config before Assignment #04)
- Final version: `src/`
- Recorded test runs: `a4-evidence/`
