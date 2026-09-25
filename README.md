# Luxury Estates

A production-grade luxury real estate platform built with **Next.js 16 (App
Router)**, **React 19**, **Prisma / PostgreSQL**, **NextAuth**, **Cloudinary**,
and **Resend**. It ships a polished public marketing site and a fully-featured
admin console for managing properties, agents, inquiries, and subscribers.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Data Model](#data-model)
- [API Routes](#api-routes)
- [Architecture Notes](#architecture-notes)
- [Security](#security)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### Public site

- **Home** (`/`) - cinematic hero with preloaded LCP image, hero search,
  animated stat counters, marquee of property categories, Suspense-streamed
  featured listings, "how it works" process, location links, testimonials,
  newsletter
- **Listings** (`/listings`) - server-filtered & sorted grid (location, type,
  min/max price, beds, baths), active filter chips, sticky filter sidebar,
  responsive auto-fit grid, `SortSelect` URL sync
- **Property detail** (`/property/[id]`) - gallery with keyboard-accessible
  lightbox, property overview, feature list, embedded Google Map, live mortgage
  calculator, agent card, share buttons, view tracking, sticky mobile CTA,
  similar properties
- **About** (`/about`) - editorial story, "how we work" process, animated
  stats, live agent directory pulled from the database
- **Contact** (`/contact`) - multi-step intent-driven form (Buy / Sell / Tour /
  Investment) with dynamic copy, honeypot protection, optional `propertyId`
  context
- **Shortlist** - `localStorage`-backed saved-property drawer
  (portal-rendered), email delivery, no account required
- **Privacy** (`/privacy`) & **Terms** (`/terms`) - structured legal pages
  with in-page navigation
- **SEO** - schema.org JSON-LD (`RealEstateAgent`, `WebSite`,
  `RealEstateListing`, `Residence`, `BreadcrumbList`, `ItemList`, `AboutPage`,
  `ContactPage`, `WebPage`), sitemap, robots, Open Graph, per-page metadata

### Admin console (`/admin`)

- Credential login at `/admin/login` with role-gated middleware
- **Dashboard** - attention banner, KPIs (properties / views / inquiries /
  subscribers), featured residence, priority inquiry queue, Recharts (property
  mix + 6-month inquiry activity), top listings, recent inquiries, portfolio
  control card
- **Properties** - searchable & status-filtered list (desktop table + mobile
  cards), quick actions (view / edit / delete), metrics bar
- **Property editor** - multi-section form with live preview rail (title,
  image, price, beds/baths/sqft, readiness checklist), custom accessible
  combobox, Cloudinary uploads
- **Agents** - directory with listing counts, 3-step wizard form (Identity ->
  Contact -> Profile) with progress bar and completion rail
- **Inquiries** - full inbox with server-side search (`?q=`), unread/read
  toggle, delete, rich card layout
- **Subscribers** - audience directory with "new this month" and "latest
  signup" stats
- **Sidebar** - live counts (properties, agents, unread inquiries,
  subscribers), mobile drawer with focus management, sign-out

### Platform

- Custom accessible `LuxurySelect` combobox used across Property / Hero Search
  / Contact forms (roving highlight, `aria-activedescendant`, full keyboard
  nav)
- IntersectionObserver-driven `Reveal`, DOM-writing `CountUp` (no React
  re-renders), reduced-motion aware throughout
- Deferred hydration - `BackToTop` and `CookieBanner` dynamically imported and
  idle-scheduled; heavy sections (Testimonials, Newsletter) mount after idle
- `next/image` with AVIF/WebP, 1-year cache TTL, Cloudinary remote pattern,
  `resolveImage()` normalizes local filenames vs absolute URLs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js `16.3.5` (App Router, RSC) |
| Runtime / UI | React `19.2.8`, TypeScript `^5` |
| Styling | Tailwind CSS `^4` (`@tailwindcss/postcss`) with `@theme` tokens |
| Database | **PostgreSQL** + Prisma `^5.22.0` |
| Auth | NextAuth `^4.24.15` (Credentials + JWT sessions) |
| Media | Cloudinary (unsigned upload preset) |
| Email | Resend `^6.28.1` |
| Charts | Recharts `^3.10.1` |
| Icons | Lucide React `^1.46.0` |
| Toasts | Sonner `^2.0.8` |
| Fonts | Playfair Display (serif), Montserrat (sans) |

---

## Project Structure

```text
luxury-estate/
|
+-- app/
|   +-- layout.tsx                     # Root layout: fonts, providers, Nav, Footer
|   +-- page.tsx                       # Home
|   +-- globals.css                    # Tailwind 4 theme tokens, reveal animations
|   +-- error.tsx
|   +-- not-found.tsx
|   +-- robots.ts
|   +-- sitemap.ts
|   +-- favicon.ico
|   |
|   +-- about/
|   |   +-- page.tsx
|   +-- contact/
|   |   +-- page.tsx
|   +-- listings/
|   |   +-- page.tsx
|   +-- privacy/
|   |   +-- page.tsx
|   +-- terms/
|   |   +-- page.tsx
|   +-- property/
|   |   +-- [id]/
|   |       +-- page.tsx
|   |
|   +-- admin/
|   |   +-- layout.tsx                 # Auth gate + Sidebar + counts
|   |   +-- page.tsx                   # Dashboard
|   |   +-- login/
|   |   |   +-- page.tsx
|   |   +-- agents/
|   |   |   +-- actions.ts             # createAgent / updateAgent / deleteAgent
|   |   |   +-- page.tsx
|   |   |   +-- new/
|   |   |   |   +-- page.tsx
|   |   |   +-- [id]/edit/
|   |   |       +-- page.tsx
|   |   +-- inquiries/
|   |   |   +-- actions.ts             # toggleInquiryRead / deleteInquiry
|   |   |   +-- page.tsx
|   |   +-- properties/
|   |   |   +-- actions.ts             # createProperty / updateProperty / deleteProperty
|   |   |   +-- page.tsx
|   |   |   +-- new/
|   |   |   |   +-- page.tsx
|   |   |   +-- [id]/edit/
|   |   |       +-- page.tsx
|   |   +-- subscribers/
|   |       +-- page.tsx
|   |
|   +-- api/
|       +-- auth/[...nextauth]/
|       |   +-- route.ts
|       +-- contact/
|       |   +-- route.ts               # Rate-limited + honeypot inquiry endpoint
|       +-- newsletter/
|       |   +-- route.ts               # Rate-limited subscriber endpoint
|       +-- shortlist/
|       |   +-- route.ts               # Email shortlist + upsert subscriber + inquiry
|       +-- views/
|           +-- route.ts               # Property view counter
|
+-- components/
|   +-- admin/
|   |   +-- AgentForm.tsx
|   |   +-- DeleteAgentButton.tsx
|   |   +-- ImageUpload.tsx
|   |   +-- InquiryActivityChart.tsx
|   |   +-- LoginForm.tsx
|   |   +-- PropertyForm.tsx
|   |   +-- PropertyTypeChart.tsx
|   |   +-- Sidebar.tsx
|   |   +-- SignOutButton.tsx
|   +-- BackToTop.tsx
|   +-- ContactForm.tsx
|   +-- CookieBanner.tsx
|   +-- CountUp.tsx
|   +-- Deferred.tsx
|   +-- DeferredOverlays.tsx
|   +-- FeaturedProperties.tsx         # + FeaturedPropertiesSkeleton
|   +-- FilterSelect.tsx
|   +-- Footer.tsx
|   +-- HeroBackground.tsx
|   +-- HeroSearch.tsx
|   +-- JsonLd.tsx
|   +-- MortgageCalculator.tsx
|   +-- Nav.tsx
|   +-- Newsletter.tsx
|   +-- PageHero.tsx
|   +-- PageLoader.tsx
|   +-- PropertyCard.tsx
|   +-- PropertyGallery.tsx
|   +-- PropertyMap.tsx
|   +-- Reveal.tsx
|   +-- ShareProperty.tsx
|   +-- ShortlistButton.tsx
|   +-- ShortlistDrawer.tsx
|   +-- ShortlistProvider.tsx
|   +-- SortSelect.tsx
|   +-- Testimonials.tsx
|   +-- Toast.tsx
|   +-- ViewTracker.tsx
|
+-- lib/
|   +-- auth.ts                        # NextAuth options
|   +-- email.ts                       # Resend templates
|   +-- format.ts                      # formatCurrency
|   +-- image.ts                       # resolveImage
|   +-- prisma.ts                      # Prisma singleton
|   +-- rate-limit.ts                  # In-memory bucket limiter
|   +-- seo.ts                         # schema.org JSON-LD builders
|
+-- prisma/
|   +-- schema.prisma
|   +-- seed.ts
|
+-- public/                            # Static assets (property imagery, EMP photos)
+-- scripts/
|   +-- create-admin.ts
|   +-- test-email.ts
+-- types/                             # Shared TypeScript types
|
+-- .env                               # Local environment (gitignored)
+-- .gitignore
+-- eslint.config.mjs
+-- next-env.d.ts
+-- next.config.ts
+-- package.json
+-- package-lock.json
+-- postcss.config.mjs
+-- proxy.ts                           # NextAuth middleware (admin gate)
+-- README.md
+-- tsconfig.json
+-- tsconfig.tsbuildinfo#   l u x u r y - e s t a t e s  
 