<div align="center">

# Nexora

**A modern customer management dashboard built with Next.js 16, React 19, and TanStack Query.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Routes](#routes)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Nexora is a customer management application that covers the full lifecycle of a customer record: browsing, searching, viewing, creating, editing, and deleting. It is built on the Next.js App Router with a clear separation between UI, data-fetching, validation, and utilities, which keeps the codebase easy to extend and test.

## Features

- **Customer CRUD**: create, view, update, and delete customers with confirmation flows.
- **Fast, scalable lists**: virtualized table rendering with `@tanstack/react-virtual` and pagination for large datasets.
- **Search and filtering**: debounced search input with filters synchronized to the URL, so every view is shareable and survives a refresh.
- **Smart caching**: TanStack Query with centralized query keys and options, plus cache helpers that keep list and detail views consistent after mutations.
- **Server-side data seeding**: customer detail pages are prefetched on the server for a faster first paint.
- **Schema validation**: forms powered by React Hook Form and Zod, with typed error handling.
- **User feedback**: toast notifications for success and failure states, skeleton loaders, empty states, and dedicated error and not-found pages.
- **Accessible UI primitives**: a reusable component layer built on Base UI and shadcn conventions, styled with Tailwind CSS 4.
- **SEO basics**: generated `sitemap.xml` and `robots.txt`.
- **Developer experience**: strict TypeScript, ESLint, Prettier, Husky git hooks, and a Vitest suite.

## Tech Stack

| Area           | Technology                                                |
| -------------- | --------------------------------------------------------- |
| Framework      | Next.js 16 (App Router), React 19                         |
| Language       | TypeScript 5                                              |
| Data fetching  | TanStack Query 5, Axios                                   |
| Forms          | React Hook Form, Zod 4, `@hookform/resolvers`             |
| UI             | Tailwind CSS 4, Base UI, shadcn, class-variance-authority |
| Icons / Toasts | lucide-react, react-hot-toast                             |
| Tables         | TanStack Virtual                                          |
| Testing        | Vitest                                                    |
| Tooling        | ESLint 9, Prettier 3, Husky 9, pnpm 10                    |

## Getting Started

### Prerequisites

- **Node.js** 20.9 or newer (22 LTS recommended)
- **pnpm** 10.x (`corepack enable` will pick up the version pinned in `package.json`)

### Installation

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd nexora

# 2. Install dependencies (also sets up Husky git hooks)
pnpm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start the development server
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

All variables are documented in [`.env.example`](./.env.example). Copy it to `.env` and fill in the values for your environment.

> **Note:** Never commit `.env` or any real credentials. Only `.env.example` should be tracked.

## Available Scripts

| Command             | Description                                         |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | Start the development server                        |
| `pnpm build`        | Create an optimized production build                |
| `pnpm start`        | Run the production build                            |
| `pnpm lint`         | Lint the codebase with ESLint                       |
| `pnpm typecheck`    | Generate Next.js types and run the TypeScript check |
| `pnpm test`         | Run the Vitest suite once                           |
| `pnpm format`       | Format all files with Prettier                      |
| `pnpm format:check` | Verify formatting without writing changes           |

## Project Structure

```text
.
├── app/                    # App Router: routes, layouts, error and not-found pages
│   └── customers/          # List, detail, add, and edit routes
├── components/
│   ├── pages/customers/    # Feature components (list, form, detail, actions, modals)
│   ├── shared/             # Reusable building blocks (DataTable, Modal, SearchInput, forms)
│   └── ui/                 # Low-level UI primitives (button, input, table, dialog, ...)
├── lib/
│   ├── configs/            # Axios instance and request helpers
│   ├── constants/          # App config and route definitions
│   ├── hooks/              # Filters, debounce, query params, cache sync hooks
│   ├── providers/          # React Query client and app providers
│   ├── services/customer/  # Query keys, query options, and API controllers
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Parsing, serialization, error, and cache utilities
│   └── validations/        # Zod schemas
├── public/                 # Static assets and local fonts
├── tests/                  # Vitest test suites
└── vitest.config.mts
```

## Architecture

**Layered data access.** Each API operation lives in its own controller under `lib/services/customer/`. Query keys and query options are defined once (`customer.keys.ts`, `customer.options.ts`) and reused by both client components and server prefetching, which prevents key drift and duplicated logic.

**URL as the source of truth for list state.** Search, filters, and pagination are parsed from and serialized to the query string (`parseCustomerListParams`, `serializeSearchParams`, `useQueryParams`). This keeps views linkable and makes server and client rendering consistent.

**Cache coherence after mutations.** Create, update, and delete operations go through shared cache helpers (`customerCache`, `useCustomerCacheChanges`) so the list and detail views reflect changes immediately without unnecessary refetching.

**Validation at the boundary.** Form input and parsed parameters are validated with Zod schemas in `lib/validations`, so invalid data is caught before it reaches the API layer.

## Routes

| Path                   | Description                       |
| ---------------------- | --------------------------------- |
| `/`                    | Landing page                      |
| `/customers`           | Customer list with search/filters |
| `/customers/add`       | Create a new customer             |
| `/customers/[id]`      | Customer detail view              |
| `/customers/[id]/edit` | Edit an existing customer         |

## Testing

Tests are written with [Vitest](https://vitest.dev/) and live in the `tests/` directory. They cover cache behavior, schema validation, field parsing, request and toast handling, and the query params hook.

```bash
pnpm test
```

## Code Quality

Husky runs checks automatically on git hooks (`pre-commit` and `pre-push`). Before opening a pull request, run:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test
```

## Deployment

Nexora can be deployed to any platform that supports Next.js, such as Vercel, a Node.js server, or a container.

```bash
pnpm build
pnpm start
```

Make sure all required environment variables are set in your hosting environment before building.

## Contributing

Contributions are welcome.

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes with clear, focused commits.
3. Ensure lint, type checks, formatting, and tests all pass.
4. Open a pull request describing what changed and why.

## License

This project is private. All rights reserved unless a license is added to the repository.
