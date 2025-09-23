# NoteApp Copilot Instructions

This document provides instructions for AI agents to effectively contribute to the NoteApp codebase.

## Architecture Overview

This is a multi-tenant SaaS application built with the Next.js App Router. The backend and frontend are colocated in the same repository and deployed on Vercel.

-   **Framework**: Next.js (App Router)
-   **Database**: PostgreSQL with Prisma ORM.
-   **Authentication**: JWT-based authentication using the `better-auth` library.
-   **UI**: React with shadcn/ui components, Tailwind CSS.
-   **State Management**: Zustand for global client-side state.
-   **Forms**: React Hook Form with Zod for validation.

## Key Concepts & Patterns

### 1. Multi-Tenancy

The application uses a **shared schema, shared database** approach. Data isolation is enforced by a `tenantId` (or `organizationId`) column on relevant tables like `Note`.

-   **Critical**: All database queries that access tenant-specific data **must** be filtered by the `tenantId` of the currently authenticated user's organization.
-   **Example**: When fetching notes, always include a `where` clause like `{ tenantId: activeOrganization.id }`.
-   The Prisma schema is located at `prisma/schema.prisma`.

### 2. Server-Side Logic

Business logic is encapsulated in functions within the `src/server/` directory. These functions are the single source of truth for data manipulation and are called by API routes and Server Actions.

-   **Directory**: `src/server/`
-   **Pattern**: API routes in `src/app/api/` should be lean and primarily act as wrappers around functions imported from `src/server/`. For example, `src/app/api/notes/route.ts` will call functions from `src/server/notes.ts`.
-   This keeps business logic separate from the HTTP layer and promotes reusability.

### 3. Authentication & Authorization

Authentication is handled by a JWT-based system. A middleware (`src/lib/middleware.ts`) protects routes and extracts user session information.

-   **Auth Logic**: Core authentication utilities are in `src/lib/auth.ts`.
-   **Session**: Use the `useAuthState` hook from `@/hooks/use-auth.ts` on the client-side to get the current user and their role.
-   **Roles**: The primary roles are `admin` and `user` (or `member`). Role checks are performed to authorize actions (e.g., only admins can invite users).

### 4. State Management with Zustand

Global state, particularly for the active organization, its members, and invitations, is managed with Zustand.

-   **Store Provider**: `useOrganizationStore` is the main store, initialized via `OrganizationStoreProvider`.
-   **Location**: `src/zustand/`
-   **Usage**: When performing mutations (e.g., removing a member), ensure you update the Zustand store on the client-side to reflect the change without a full page reload. See `handleRemoveMember` in `src/app/dashboard/users/page.tsx` for an example.

### 5. UI and Components

The UI is built with **shadcn/ui**.

-   **Component Library**: Components are located in `src/components/ui/`. These are Radix UI primitives styled with Tailwind CSS.
-   **Forms**: Reusable forms are in `src/components/forms/`. They use `react-hook-form` and `zod` for validation. When creating a new form, follow the pattern in existing forms like `invitation-form.tsx`.

## Developer Workflow

-   **Run Development Server**: `npm run dev`
-   **Build for Production**: `npm run build`
-   **Prisma**: After making changes to `prisma/schema.prisma`, run `npx prisma generate` to update the Prisma Client. This is automatically included in the `build` command.
-   **Linting**: `npm run lint`

## Key Files and Directories

-   `prisma/schema.prisma`: The single source of truth for the database schema.
-   `src/server/`: Contains all core business logic (e.g., `organizations.ts`, `members.ts`, `notes.ts`).
-   `src/app/api/`: Defines the public API endpoints.
-   `src/lib/auth.ts` & `src/lib/middleware.ts`: Core of the authentication and session management system.
-   `src/zustand/providers/organization-store-provider.ts`: The central client-side state store.
-   `src/components/ui/`: Base UI components from shadcn/ui.
