# Multi-Tenant SaaS Notes Application

This project is a **multi-tenant SaaS Notes Application** developed as part of a technical assessment. The application allows multiple tenants (companies) to manage their users and notes securely, while enforcing role-based access control and subscription feature gating. Both the backend and frontend are deployed on **Vercel**.

---

## 🚀 Features

* Multi-tenancy with strict tenant isolation
* JWT-based authentication and role-based authorization
* Subscription tiers: Free (3 notes limit) and Pro (unlimited)
* CRUD operations for notes with tenant isolation
* Upgrade endpoint for subscriptions
* Minimal frontend to interact with the API
* Health endpoint for monitoring

---

## 🏗️ Implementation Details

### 1. Multi-Tenancy

* **Approach Chosen**: Shared schema with a `tenantId` column.
* Each record in `users` and `notes` tables is associated with a `tenantId`.
* All queries are scoped to the tenant of the authenticated user to enforce strict isolation.

**Schema Example:**

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  tenantId UUID NOT NULL,
  userId UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

---

### 2. Authentication & Authorization

* **JWT-based login** implemented at `/api/auth/login`.
* Roles supported:

  * **Admin**: can invite users and upgrade subscriptions.
  * **Member**: can create, view, edit, and delete notes.

**Mandatory Test Accounts** (password: `password`):

* `admin@acme.test` → Admin (Tenant: Acme)
* `user@acme.test` → Member (Tenant: Acme)
* `admin@globex.test` → Admin (Tenant: Globex)
* `user@globex.test` → Member (Tenant: Globex)

---

### 3. Subscription Feature Gating

* **Free Plan**: Tenant limited to **3 notes**.
* **Pro Plan**: Unlimited notes.
* **Upgrade Endpoint**:

  ```http
  POST /api/tenants/:slug/upgrade
  ```

  * Accessible only to **Admins**.
  * Removes note limits immediately after upgrade.

---

### 4. Notes API

Endpoints are tenant-aware and enforce role restrictions:

* **Create Note**: `POST /api/notes`
* **List Notes**: `GET /api/notes`
* **Retrieve Note**: `GET /api/notes/:id`
* **Update Note**: `PUT /api/notes/:id`
* **Delete Note**: `DELETE /api/notes/:id`

---

### 5. Deployment

* Backend and frontend hosted on **Vercel**.
* **CORS** enabled for external integrations and automated test scripts.
* **Health Endpoint**:

  ```http
  GET /api/health
  → { "status": "ok" }
  ```

---

### 6. Frontend

* Built with **Next.js (App Router)**.
* Features:

  * Login using predefined accounts
  * List, create, and delete notes
  * Show **“Upgrade to Pro”** button when Free tenants reach note limit

---

## 🔍 Evaluation Coverage

The following will be validated by automated test scripts:

* Health endpoint availability
* Successful login for predefined accounts
* Enforcement of tenant isolation
* Role-based access restrictions
* Free plan note limit and Pro plan upgrade
* Correct CRUD functionality
* Frontend accessibility

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── accept-invitation/
│   │   ├── auth/
│   │   ├── notes/           # Notes CRUD endpoints
│   │   ├── organizations/
│   │   ├── tenants/         # Tenant upgrade endpoint
│   │   └── users/
│   ├── dashboard/
│   │   ├── settings/
│   │   └── users/
│   ├── login/
│   ├── signup/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── hooks/
├── lib/
├── server/
├── types/
├── prisma/
├── public/
└── ...
```

---

## 🧪 Health Check

To verify service health:

```bash
curl https://<your-deployment-url>/api/health
# → { "status": "ok" }
```

---

## ⚡ Tech Stack

* **Next.js** (App Router)
* **Prisma ORM**
* **PostgreSQL**
* **JWT** for authentication
* **Vercel** for deployment

---

