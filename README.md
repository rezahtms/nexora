# Nexora CRM

A responsive customer workspace built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, axios, and DummyJSON.

## Run locally

1. Install dependencies with `pnpm install`.
2. Optionally set `NEXT_PUBLIC_API_URL` in `.env.local`. The default API URL is `https://dummyjson.com`.
3. Start the app with `pnpm dev` and open `http://localhost:3000/customers`.
4. Verify the project with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

## Technical decisions

- The customer directory and profile pages are prefetched on the server via shared `queryOptions` factories and hydrated into the browser's TanStack Query cache with zero prop drilling.
- Search, sort, and pagination are derived from the URL. Search is debounced, query keys include the complete filter state, and the browser history API updates filters without an extra server navigation.
- API communication uses a hand-written, type-safe services architecture built on a single generic `sendRequest` function and one shared axios instance.
- All success and error toast notifications are handled centrally inside the axios response interceptors, guarded for browser execution and deduplicated with stable toast IDs.
- Customer creates, edits, and deletes survive during the current browser session purely through the TanStack Query cache (`setQueryData` and optimistic updates with rollback on failure).
- A reusable, generic `DataTable` built on shadcn table primitives renders both the desktop table and mobile stacked-card layout from a single column definition array.

## Limitations

- DummyJSON is a demonstration API: create, edit, and delete requests are simulated and do not alter its server data. Local changes last only for the current browser session in the React Query cache.
- Because there is no server-side session mechanism, direct server requests for newly created IDs that DummyJSON does not persist return a 404 from DummyJSON.
- The shadcn component registry could not be reached from this environment; the table and Base UI primitives are styled locally with the project's shadcn tokens.
