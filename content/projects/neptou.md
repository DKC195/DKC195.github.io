---
title: Neptou
slug: neptou
summary: Built and lead the full technical stack for Neptou, a Nepal travel companion app, across a native SwiftUI iOS app, a FastAPI and Postgres backend with Claude-powered planning, and a Next.js website and admin panel.
audiences: [engineering, leadership]
tags: [Swift, SwiftUI, FastAPI, PostgreSQL, Next.js, Claude API, Kotlin, Xcode Cloud]
status: ongoing
featured: true
year: 2025
period: Apr 2025 - Present
relatedExperienceIds:
  - neptou-head-of-technology
sections:
  - overview
  - role
  - stack
  - outcomes
links:
  - label: Download on the App Store
    kind: app-store
    href: https://apps.apple.com/app/apple-store/id6756244066?pt=128211987&ct=dhirajkc195-portfolio&mt=8
  - label: Neptou website
    href: https://neptou.github.io
    kind: live
gallery:
  - src: /content/projects/neptou/images/01-neptou-cover.webp
    alt: Neptou wordmark in orange above a snow-covered mountain, with the tagline "Let's explore the unexplored".
archiveContext: |
  Source notes (Nov 2026):
  - Start date: 15 Apr 2025 (per Dhiraj; an earlier note said 27 Jan 2026, which was superseded). Title: Head of Technology.
  - Oversees almost everything technical: backend, iOS app, and currently building the Android version (AI-assisted).
  - Neptou is a pre-revenue startup and is not yet formally registered.
  - App Store listing is published under Subodh Kathayat's developer account (seller id1845577157).
  - App Store subtitle: "Temples, Treks & Hidden Gems". Category: Travel. Requires iOS 18.1+, also runs on iPadOS, Apple silicon Macs, and visionOS.
  - App Store features: DISCOVER (curated destinations, descriptions, photos, local insights), PLAN YOUR TRIP (day-by-day itineraries, trip planner, saved places), NAVIGATE (interactive map with category filters, nearby places).
  - Version history seen on the listing: 1.0 (9 Jul), 1.0.1 (14 Jul, Maps App setting, "Picks for You"), 1.0.2 (28 Sep, UI fixes), 1.1.0 (27 Oct).
  - Code for Impact 2026: Neptou was one of four national winners (top 4 of 7 finalists, 190 applicant teams), announced at the Kathmandu showcase on Friday 17 Jul 2026 (date inferred from "Friday" in the 18-19 Jul news reports). Prize: US$1,000 seed grant, US$5,000 AWS credits, AI platform access, continued mentoring. Sources: Himalayan Times 19 Jul 2026, ekantipur 18 Jul 2026 (both list Neptou among the four). Kathmandu Post 21 Jul 2026 profiles Neptou ("Neptu") among seven national winners and names the team: Subodh Kathayat, Alisha Hada (business lead), Dhiraj KC, Keshav Thapa; its top-four list omits Neptou and includes NepAI instead. See content/recognition/code-for-impact-2026.md.
  - Technical breakdown (Nov 2026, generated from the codebases; the source called it a "solo full-stack project", but the startup team also
    includes Subodh Kathayat, Alisha Hada and Keshav Thapa per the Kathmandu Post, so public copy avoids "solo"):
    Three projects share one backend.
    1. iOS app, Swift/SwiftUI (iOS 18.1+): Apple frameworks only (SwiftUI, SwiftData, MapKit, CoreLocation, Combine, async/await), no third-party deps.
       Offline-first: SwiftData local store, syncs places, foods, airports, districts and the route graph from the backend; ships starter places for first launch.
       On-device trip planner: route optimizer orders districts then stops with nearest-neighbour + 2-opt; inter-district travel uses the synced route graph; map draws flight arcs.
       MapKit with native clustering, geohashing matching the server, Apple Maps place search/images, image cache.
       Local recommendation engine, onboarding, saved/liked places, multiple trips per user.
       40 XCTest unit tests (route optimizer, geohash, recommendations, data merging).
       CI/CD: Xcode Cloud to TestFlight and App Store; custom ci_scripts limit builds to manual starts and auto-set build numbers.
    2. Backend, Python/FastAPI on Supabase Postgres, deployed on Render (Docker).
       Raw psycopg2 with parameterized SQL, Pydantic schemas, idempotent table migrations.
       Public sync endpoints, versioned /api/v1 so shipped app builds keep working.
       Claude (Anthropic API) endpoints for chat, recommendations, itinerary optimization; rate-limited with slowapi. RAG/semantic search written but disabled.
       Admin API: JWT (python-jose), bcrypt, roles (super_admin/admin with per-resource permissions); CRUD for places, foods, festivals, hotels, guides,
       emergency contacts, with a verification workflow. Geohash map search, CORS allowlist.
    3. Website + admin panel, Next.js 16 / React 19 / TypeScript / Tailwind CSS 4: static export to GitHub Pages via GitHub Actions (pnpm).
       Marketing site with SEO/AEO: Open Graph, JSON-LD (MobileApplication, FAQPage, Organization), sitemap, AI-crawler-friendly robots, llms.txt, Apple Smart App Banner.
       Client-side staff admin dashboard on the FastAPI backend with JWT; role-based UI; CRUD tables, map-based coordinate checker, team management.
       Pings the backend health endpoint on load to wake the free-tier Render server.
    In progress: Android port in Kotlin / Jetpack Compose.
  - App Store link uses campaign tracking: pt=128211987 (provider token for Subodh Kathayat's account, shared by both apps) and ct=dhirajkc195-portfolio. Stats appear in his App Store Connect under Acquisition > Campaigns.
---

## Overview

Neptou is a travel companion for Nepal. It brings handpicked places from across the country into one app, from the temples of Kathmandu Valley to Himalayan treks. Travelers can discover destinations, plan multi-stop trips, and explore on a map, even without a connection.

Neptou is an early-stage, pre-revenue startup. The iOS app is live on the App Store, and Neptou was one of four national winners of Code for Impact 2026.

## Role

As Head of Technology, I built and run the technical side of the product across three connected codebases: the iOS app, the backend that powers it, and the website and admin panel.

- **iOS app.** A native SwiftUI app using only Apple frameworks. It works offline first: data is stored on the device and synced from the backend. An on-device trip planner orders districts and stops using nearest-neighbour plus 2-opt optimization. Maps use MapKit clustering and the same geohashing as the server. 40 unit tests cover the optimizer, geohashing, recommendations, and data merging.
- **Backend.** A FastAPI service on Supabase Postgres, deployed on Render with Docker. A versioned API keeps app builds already in users' hands working. Claude-powered endpoints handle chat, recommendations, and itinerary optimization, with rate limiting. An admin API uses JWT auth, role-based permissions, and a verification workflow for content.
- **Website and admin panel.** A Next.js static site on GitHub Pages with SEO and AI-search work (structured data, `llms.txt`, Apple Smart App Banner). It also hosts a role-aware staff dashboard for managing places, foods, festivals, hotels, guides, and emergency contacts.
- **Android.** Porting the app to Kotlin and Jetpack Compose, using AI-assisted development.

## Stack

- iOS: Swift, SwiftUI, SwiftData, MapKit, CoreLocation, XCTest
- Backend: Python, FastAPI, PostgreSQL (Supabase), Pydantic, Anthropic Claude API
- Web: Next.js, React, TypeScript, Tailwind CSS
- Delivery: Xcode Cloud (TestFlight and App Store), GitHub Actions, Render, Docker
- In progress: Kotlin, Jetpack Compose

## Outcomes

- Shipped Neptou to the App Store, followed by regular feature and stability updates, with automated builds through Xcode Cloud.
- Led engineering for one of four national winners of Code for Impact 2026, out of 190 applicant teams from across Nepal.
