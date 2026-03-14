# Pistanero Platform — Software Documentation

> **Live URL:** [www.pistanero.store](https://www.pistanero.store)  
> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Developed by:** [Neville](https://github.com/neville04)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Environment & Configuration](#4-environment--configuration)
5. [Authentication](#5-authentication)
6. [Database Schema](#6-database-schema)
7. [Pages & Routes](#7-pages--routes)
8. [Admin Panel](#8-admin-panel)
9. [E-Commerce & Checkout Flow](#9-e-commerce--checkout-flow)
10. [Email Notifications](#10-email-notifications)
11. [Edge Functions](#11-edge-functions)
12. [Storage Buckets](#12-storage-buckets)
13. [Security Model](#13-security-model)
14. [Design System](#14-design-system)
15. [Key Business Rules](#15-key-business-rules)
16. [Known Limitations & Future Improvements](#16-known-limitations--future-improvements)
17. [Contact & Support](#17-contact--support)

---

## 1. Project Overview

**Pistanero** is a full-stack web platform for a sports recreation centre based in Sabagabo, Uganda. It combines:

- **E-commerce storefront** — sports apparel and equipment (Men's, Women's, Bags categories)
- **Court booking information** — Tennis, Basketball, Volleyball, and Badminton
- **Membership management** — Monthly and Annual plans with pricing
- **Wellness & Fitness programmes** — Running Club, Fitness Classes
- **Skills Development** — Coaching and Youth Tennis Programme
- **Admin dashboard** — full back-office management for products, orders, users, events, and sales

The platform is entirely web-based, fully responsive for mobile and desktop.

---

## 2. Tech Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Frontend       | React 18 + TypeScript + Vite          |
| Styling        | Tailwind CSS + shadcn/ui              |
| Animation      | Framer Motion                         |
| Routing        | React Router v6                       |
| State          | React Context (Auth, Cart)            |
| Backend        | Supabase                              |
| Database       | PostgreSQL (via Supabase)             |
| Auth           | Supabase Auth (email + Google)        |
| Storage        | Supabase Storage                      |
| Edge Functions | Deno (Supabase Edge Functions)        |
| Email          | Resend API (`orders@pistanero.store`) |
| Hosting        | Namecheap (domain)                    |

---

## 3. Project Structure

```
src/
├── assets/              # Static images (courts, hero slides, logo)
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── AdminLayout.tsx  # Admin-specific layout wrapper
│   ├── AdminNavbar.tsx  # Admin navigation bar
│   ├── Footer.tsx       # Site-wide footer
│   ├── HeroCarousel.tsx # Home page hero slider
│   ├── Navbar.tsx       # Main site navigation
│   ├── SignInPromptDialog.tsx  # Modal prompting unauthenticated users to sign in
│   └── WelcomeDialog.tsx       # First-visit welcome dialog
├── contexts/
│   ├── AuthContext.tsx  # Global auth state (user, session, signOut)
│   └── CartContext.tsx  # Global cart state (items, add, remove, clear)
├── hooks/
│   ├── useProducts.ts   # Fetches products from database
│   └── use-mobile.tsx   # Responsive breakpoint hook
├── integrations/
│   ├── supabase/
│   │   ├── client.ts    # Supabase client (auto-generated, do not edit)
│   │   └── types.ts     # Database type definitions (auto-generated, do not edit)
│   └── lovable/
│       └── index.ts     # Lovable OAuth helper (auto-generated, do not edit)
├── pages/
│   ├── Index.tsx        # Home page
│   ├── Products.tsx     # Full product listing
│   ├── SectionProducts.tsx  # Men / Women / Bags filtered views
│   ├── Cart.tsx         # Cart + checkout flow
│   ├── Orders.tsx       # User's order history
│   ├── Courts.tsx       # Court info + pricing
│   ├── Membership.tsx   # Membership plans
│   ├── Wellness.tsx     # Fitness programmes
│   ├── Skills.tsx       # Coaching + youth development
│   ├── Contact.tsx      # Contact page
│   ├── Auth.tsx         # Login + Sign up
│   ├── ResetPassword.tsx # Password reset flow
│   ├── AdminLogin.tsx   # Admin-only login
│   ├── AdminDashboard.tsx  # Legacy dashboard (superseded by /admin)
│   └── admin/
│       ├── AdminHome.tsx     # Admin overview with KPIs
│       ├── AdminOrders.tsx   # Order management + status updates
│       ├── AdminProducts.tsx # Product CRUD
│       ├── AdminEvents.tsx   # Events CRUD
│       ├── AdminSales.tsx    # Delivered orders / revenue report
│       └── AdminUsers.tsx    # User listing + order history
supabase/
├── functions/
│   ├── send-order-email/index.ts  # Sends status update emails via Resend
│   ├── list-users/index.ts        # Admin: lists all auth users
│   └── delete-user/index.ts       # Deletes the calling user's account
└── config.toml
```

---

## 4. Environment & Configuration

The project uses a single `.env` file (auto-managed — **do not edit manually**):

```env
VITE_SUPABASE_URL=https://knulhygeseazoappsedy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon key>
VITE_SUPABASE_PROJECT_ID=knulhygeseazoappsedy
```

**Backend secrets** (stored in Lovable Cloud / Supabase vault — never in code):

| Secret Name                 | Purpose                               |
| --------------------------- | ------------------------------------- |
| `RESEND_API_KEY`            | Sends transactional emails via Resend |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin operations in edge functions    |
| `SUPABASE_ANON_KEY`         | Public client key                     |
| `SUPABASE_URL`              | Database URL for edge functions       |

---

## 5. Authentication

### How it works

- Users sign up/log in at `/auth` using **email + password** or **Google OAuth**
- Sessions are persisted in `localStorage` via Supabase Auth
- The `AuthContext` exposes `user`, `session`, `loading`, and `signOut` globally
- Password reset is supported via `/reset-password` (email link flow)

### Admin Authentication

- Admins log in at `/admin-login` using their email + password
- After sign-in, the system checks the `user_roles` table for `role = 'admin'`
- Non-admins are signed out immediately and shown an error
- Admin routes (`/admin/*`) are protected by role checks in each page's `useEffect`

### User Roles

Roles are stored in the `user_roles` table (separate from the users table for security):

| Role        | Access                                 |
| ----------- | -------------------------------------- |
| `admin`     | Full admin panel, all data             |
| `moderator` | Defined in enum, not yet actively used |
| `user`      | Standard storefront access             |

To grant admin access to a user, insert a row into `user_roles`:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<user-uuid>', 'admin');
```

---

## 6. Database Schema

### `products`

| Column        | Type        | Notes                             |
| ------------- | ----------- | --------------------------------- |
| `id`          | uuid        | Primary key                       |
| `name`        | text        | Product name                      |
| `price`       | numeric     | Price in UGX                      |
| `category`    | text        | e.g. Footwear, Apparel, Equipment |
| `section`     | text        | e.g. men, women, bags             |
| `description` | text?       | Optional product description      |
| `color`       | text?       | Optional                          |
| `size`        | text?       | Optional                          |
| `image_urls`  | text[]      | Array of public image URLs        |
| `is_featured` | boolean     | Shows on home page if true        |
| `created_at`  | timestamptz |                                   |
| `updated_at`  | timestamptz |                                   |

### `orders`

| Column            | Type        | Notes                                   |
| ----------------- | ----------- | --------------------------------------- |
| `id`              | uuid        | Primary key                             |
| `user_id`         | uuid        | References auth.users (not FK)          |
| `items`           | jsonb       | Array of `{id, name, price, quantity}`  |
| `total`           | numeric     | Total in UGX                            |
| `status`          | text        | `pending` / `processing` / `delivered`  |
| `transaction_id`  | text?       | MTN MOMO transaction reference          |
| `delivery_method` | text        | `pickup` / `delivery` / `safeboda`      |
| `customer_name`   | text?       | From user metadata at time of order     |
| `customer_email`  | text?       | Email used to send status notifications |
| `phone`           | text?       | Contact number for order                |
| `created_at`      | timestamptz |                                         |
| `updated_at`      | timestamptz |                                         |

### `events`

| Column       | Type        | Notes                         |
| ------------ | ----------- | ----------------------------- |
| `id`         | uuid        | Primary key                   |
| `title`      | text        | Event title                   |
| `excerpt`    | text?       | Short description             |
| `tag`        | text        | e.g. Announcement, Tournament |
| `date_label` | text        | Human-readable date string    |
| `image_url`  | text?       | Public image URL              |
| `created_at` | timestamptz |                               |
| `updated_at` | timestamptz |                               |

### `user_roles`

| Column    | Type     | Notes                              |
| --------- | -------- | ---------------------------------- |
| `id`      | uuid     | Primary key                        |
| `user_id` | uuid     | References auth user ID            |
| `role`    | app_role | Enum: `admin`, `moderator`, `user` |

---

## 7. Pages & Routes

### Public Routes

| Route               | Page            | Description                                                                           |
| ------------------- | --------------- | ------------------------------------------------------------------------------------- |
| `/`                 | Index           | Home: hero carousel, events, featured products                                        |
| `/products`         | Products        | Full product catalogue with category filter                                           |
| `/men`              | SectionProducts | Men's collection                                                                      |
| `/women`            | SectionProducts | Women's collection                                                                    |
| `/bags`             | SectionProducts | Bags & carriers                                                                       |
| `/courts`           | Courts          | All courts overview                                                                   |
| `/courts/:sport`    | Courts          | Individual court detail + pricing (`tennis`, `basketball`, `volleyball`, `badminton`) |
| `/membership`       | Membership      | Monthly & Annual plan overview                                                        |
| `/membership/:type` | Membership      | Plan detail (`monthly`, `annual`)                                                     |
| `/wellness`         | Wellness        | Fitness programme listing                                                             |
| `/wellness/:type`   | Wellness        | Programme detail (`running-club`, `fitness-classes`)                                  |
| `/skills`           | Skills          | Skills development overview                                                           |
| `/skills/:type`     | Skills          | Section detail (`coaches`, `youth-tennis`)                                            |
| `/contact`          | Contact         | Contact info + message form                                                           |
| `/auth`             | Auth            | Login / Sign Up                                                                       |
| `/reset-password`   | ResetPassword   | Password reset (requires email link)                                                  |

### Authenticated User Routes

| Route     | Page   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| `/cart`   | Cart   | Shopping cart + 2-step checkout             |
| `/orders` | Orders | User's order history with real-time updates |

### Admin Routes

| Route             | Page          | Access     |
| ----------------- | ------------- | ---------- |
| `/admin-login`    | AdminLogin    | Anyone     |
| `/admin`          | AdminHome     | Admin only |
| `/admin/orders`   | AdminOrders   | Admin only |
| `/admin/products` | AdminProducts | Admin only |
| `/admin/events`   | AdminEvents   | Admin only |
| `/admin/sales`    | AdminSales    | Admin only |
| `/admin/users`    | AdminUsers    | Admin only |

---

## 8. Admin Panel

Access the admin panel at `/admin-login`. The admin uses a dedicated navigation bar (`AdminNavbar`) that replaces the standard site navbar.

### Admin Home (`/admin`)

- KPI cards: Total Orders, Total Sales (UGX), Pending, Processing, Delivered counts

### Admin Orders (`/admin/orders`)

- Lists all orders with customer name, date, total, delivery method, items
- Dropdown to update order status: `pending → processing → delivered`
- On status change, an automated email is sent to the customer (see §10)

### Admin Products (`/admin/products`)

- Add, edit, and delete products
- Upload multiple product images to the `product-images` storage bucket
- Toggle "Featured" status (controls home page featured grid)
- Fields: name, price (UGX), section, category, description, color, size

### Admin Events (`/admin/events`)

- Add, edit, and delete events shown on the home page
- Fields: title, excerpt, tag, date label, image (upload or URL)

### Admin Sales (`/admin/sales`)

- Filters orders by `status = 'delivered'`
- Shows total revenue and a table of completed orders

### Admin Users (`/admin/users`)

- Fetches all registered users via the `list-users` edge function
- Click a user to view their full order history with status breakdown

---

## 9. E-Commerce & Checkout Flow

### Adding to Cart

1. User browses products on `/products`, `/men`, `/women`, or `/bags`
2. Unauthenticated users are prompted to sign in (via `SignInPromptDialog`)
3. Authenticated users add items — stored in React `CartContext` (in-memory, not persisted across sessions)

### Cart (`/cart`)

- View and adjust item quantities or remove items
- Total displayed in UGX

### Checkout (2-step within `/cart`)

**Step 1 — Cart review** → click "Proceed to Checkout"  
**Step 2 — Checkout form:**

1. **Order Summary** — itemised list with totals in UGX
2. **Contact Details** — phone number (pre-filled from account if available)
3. **Delivery Method** — Pickup (free) or Delivery (with optional SafeBoda option)
4. **Payment** — MTN Mobile Money to `0771699039` (Business: Pistanero)
5. **Transaction ID** — user enters their MTN MOMO confirmation reference

On submit, an order record is created in the `orders` table with `status = 'pending'`.

### Order Statuses

| Status       | Meaning                                  |
| ------------ | ---------------------------------------- |
| `pending`    | Order received, payment not yet verified |
| `processing` | Payment verified, order being prepared   |
| `delivered`  | Order has been delivered or collected    |

---

## 10. Email Notifications

Transactional emails are sent via **Resend** from `orders@pistanero.store`.

The domain `pistanero.store` has been verified on Resend. Do **not** change the `from` address without first verifying the new domain/subdomain on Resend.

### When are emails sent?

Emails are triggered whenever an admin updates an order status in `/admin/orders`. The `send-order-email` edge function is called with:

```json
{
  "email": "customer@example.com",
  "name": "Customer Name",
  "orderId": "uuid",
  "status": "processing",
  "total": 45000
}
```

### Email Templates (per status)

| Status       | Subject                                       | Message summary                         |
| ------------ | --------------------------------------------- | --------------------------------------- |
| `pending`    | Order Received - Payment Pending Verification | Payment verification in progress        |
| `processing` | Payment Verified - Order Processing           | Payment confirmed, order being prepared |
| `delivered`  | Order Delivered                               | Thank-you message                       |

The email HTML is a dark-themed branded template with the Pistanero logo, order details, and footer.

> **Important:** If you switch email providers or change the sender domain, update the `from` field in `supabase/functions/send-order-email/index.ts` and re-deploy the function.

---

## 11. Edge Functions

All edge functions live in `supabase/functions/` and are deployed automatically. They run on Deno.

### `send-order-email`

- **Trigger:** Called by `AdminOrders` page when order status changes
- **Auth:** No auth check (called server-to-server from admin session)
- **Action:** Sends HTML email via Resend API
- **Secrets used:** `RESEND_API_KEY`

### `list-users`

- **Trigger:** Called by `AdminUsers` page on load
- **Auth:** Validates caller JWT, checks `user_roles` for `admin` role
- **Action:** Returns list of all registered users using the admin client (`auth.admin.listUsers`)
- **Secrets used:** `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`

### `delete-user`

- **Trigger:** Called from `Navbar` when a user clicks "Delete Account"
- **Auth:** Validates caller JWT — only deletes the requesting user's own account
- **Action:** Calls `auth.admin.deleteUser` with the authenticated user's ID
- **Secrets used:** `SUPABASE_SERVICE_ROLE_KEY`

---

## 12. Storage Buckets

Both buckets are **public** (read-only without auth for public URLs).

| Bucket           | Used for                                                    |
| ---------------- | ----------------------------------------------------------- |
| `product-images` | Product photos uploaded via Admin Products and Admin Events |
| `email-assets`   | Email template assets (e.g. logo.png used in order emails)  |

**Upload path for product images:** Files are uploaded to `product-images/<filename>` and the public URL is stored in `products.image_urls[]`.

---

## 13. Security Model

### Row-Level Security (RLS)

All tables have RLS enabled. Key policies:

| Table        | Who can SELECT            | Who can INSERT/UPDATE/DELETE                        |
| ------------ | ------------------------- | --------------------------------------------------- |
| `products`   | Anyone (public)           | Admins only                                         |
| `events`     | Anyone (public)           | Admins only                                         |
| `orders`     | Owner or Admin            | Authenticated users (own orders); Admins can UPDATE |
| `user_roles` | Owner (own role) or Admin | No one via client (managed by backend only)         |

### Role Check Function

```sql
-- Check if a user has a specific role (SECURITY DEFINER — bypasses RLS safely)
SELECT public.has_role(auth.uid(), 'admin');
```

This function is used in all admin RLS policies to prevent recursive checks.

### Admin Security Notes

- Admin status is **never** checked via localStorage or client-side flags
- Every admin page performs a server-side role check via `user_roles` on mount
- Admin users who lose their role are redirected immediately
- The `list-users` edge function re-validates admin status on every call

---

## 14. Design System

The platform uses a custom dark theme defined in `src/index.css` and `tailwind.config.ts`.

### Colors (HSL CSS variables)

| Token           | Value            | Usage                    |
| --------------- | ---------------- | ------------------------ |
| `--background`  | Dark navy        | Page background          |
| `--foreground`  | Off-white        | Body text                |
| `--primary`     | Orange (#f97316) | CTAs, highlights, prices |
| `--secondary`   | Dark grey        | Card backgrounds         |
| `--muted`       | Muted grey       | Subtle text              |
| `--border`      | Dim border       | Card / input borders     |
| `--destructive` | Red              | Delete actions           |

### Typography

- **Display font** (`font-display`): Used for headings, buttons, labels
- **Body font** (`font-body`): Used for navigation, body text

### Utility Classes (custom)

| Class        | Description                                    |
| ------------ | ---------------------------------------------- |
| `glass-card` | Semi-transparent card with backdrop blur       |
| `glass-nav`  | Navigation bar glass effect                    |
| `hover-glow` | Orange glow on hover (primary-coloured shadow) |

---

## 15. Key Business Rules

| Rule                      | Detail                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Currency**              | All prices are in **UGX (Ugandan Shillings)**                                          |
| **Payment method**        | MTN Mobile Money only — number `0771699039` (Business: Pistanero)                      |
| **Order validation**      | A Transaction ID is required before an order can be placed                             |
| **Delivery via SafeBoda** | Delivery charges are separate from order total and communicated offline                |
| **Court bookings**        | Handled offline via phone/WhatsApp — the site shows pricing info only                  |
| **Membership sign-up**    | Handled offline via phone/WhatsApp — the site shows pricing info only                  |
| **Featured products**     | Only products with `is_featured = true` appear on the home page grid                   |
| **Account deletion**      | Permanent and irreversible — deletes all user data via the `delete-user` edge function |
| **Operating hours**       | Courts: 6:00 AM – 10:00 PM daily                                                       |
| **Location**              | Mutungo, Ssabagabo, Uganda                                                             |
| **Contact**               | Phone: `0771699039` · Email: `pistanero@outlook.com`                                   |

---

## 16. Known Limitations & Future Improvements

| Area                       | Current State                           | Suggested Improvement                        |
| -------------------------- | --------------------------------------- | -------------------------------------------- |
| **Cart persistence**       | Cart resets on page refresh (in-memory) | Persist cart to database or localStorage     |
| **Court booking**          | Info-only, bookings via phone           | Build an online booking/calendar system      |
| **Membership sign-up**     | Info-only, sign-up via phone            | Add online membership registration form      |
| **Contact form**           | UI only, not wired to a backend         | Connect form to Resend or a support inbox    |
| **Payment verification**   | Manual (admin checks MTN MOMO)          | Integrate MTN MOMO API for auto-verification |
| **Delivery charges**       | Communicated offline                    | Build a delivery fee calculator              |
| **SMS notifications**      | Not implemented                         | Integrate Africa's Talking for SMS alerts    |
| **Order cancellation**     | No cancel option for users or admins    | Add a "Cancelled" order status               |
| **Product stock tracking** | No inventory system                     | Add stock quantity field to products         |
| **Search**                 | No site-wide search                     | Add full-text search across products         |

---

## 17. Contact & Support

| Role      | Contact                                 |
| --------- | --------------------------------------- |
| Developer | [Neville](https://github.com/neville04) |
| Client    | pistanero@outlook.com                   |
| Phone     | 0771699039                              |
| Location  | Sabagabo, Uganda                        |

---

_This document covers the full system as of March 2026. Update this file whenever significant features are added or changed._
