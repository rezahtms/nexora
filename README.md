# Nexora CRM

A responsive customer workspace built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, and DummyJSON.

## Run locally

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local`. The default API URL is `https://dummyjson.com`.
3. Generate the typed API client with `pnpm generate:api`.
4. Start the app with `pnpm dev` and open `http://localhost:3000/customers`.
5. Verify the project with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

## Technical decisions

- The customer directory is fetched and rendered on the server for its first response, then hydrated into the browser's TanStack Query cache.
- Search, sort, and pagination are derived from the URL. Search is debounced, query keys include the complete filter state, and Next.js's integrated native history API updates filters without an extra server navigation.
- The OpenAPI contract is the source for the Orval client; a shared axios mutator passes cancellation signals and normalizes API errors.
- Customer edits and deletes update cached lists optimistically. Failed writes restore snapshots, while session changes are retained in the query cache and browser session storage because DummyJSON does not persist writes.
- A cancelled query signal is passed through axios, and React Query isolates each search result by its stable key to prevent stale responses from taking over the latest view.
- The mobile directory uses stacked customer cards, while wider screens use a semantic table. Detail sections group personal, contact, address, company, and supplemental data.

## Limitations

- DummyJSON is a demonstration API: create, edit, and delete requests are simulated and do not alter its server data. Local changes last only for the current browser session and reset when that session storage is cleared.
- DummyJSON's search endpoint and sort semantics are limited to its own behavior; local session changes are merged into the current result page rather than being backed by a persistent server-side index.
- The shadcn component registry could not be reached from this environment. The small Base UI primitives used here are locally styled with the existing shadcn tokens instead.
- Lighthouse was not run in this environment, and the dev server could not verify live DummyJSON requests. Run those checks against a network-enabled deployment before release.
