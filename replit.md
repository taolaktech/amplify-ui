# Amplify UI

A Next.js 15 marketing campaign management application with Firebase authentication.

## Project Overview

This is a React-based web application built with:
- Next.js 15.2.4
- React 19
- TypeScript
- Tailwind CSS 4
- Firebase Authentication
- Stripe for payments
- Zustand for state management
- TanStack Query for data fetching

## Project Structure

```
app/                    # Next.js App Router pages
  auth/                 # Authentication pages (login, signup, reset password)
  campaigns/            # Campaign management
  company/              # Company settings and brand assets
  create-campaign/      # Campaign creation flow
  lib/                  # Shared libraries
    api/                # API clients (base, integrations, wallet, AI)
    components/         # Shared components
    hooks/              # Custom React hooks
    stores/             # Zustand state stores
  pricing/              # Pricing and checkout pages
  settings/             # User settings
  setup/                # Onboarding setup flow
  ui/                   # UI components
public/                 # Static assets
fonts/                  # Custom fonts (Satoshi)
```

## Required Environment Variables

The following environment variables need to be configured:

### Firebase Configuration (Required)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### API Endpoints
- `NEXT_PUBLIC_BASE_URL` - Base API URL for campaigns
- `NEXT_PUBLIC_API_HOST` - Main API host
- `NEXT_PUBLIC_API_WALLET_HOST` - Wallet API host
- `NEXT_PUBLIC_API_INTEGRATION_HOST` - Integrations API host

### Stripe Configuration
- `NEXT_PUBLIC_STRIPE_KEY` - Stripe publishable key

### Pricing Configuration (Optional)
- `NEXT_PUBLIC_STARTER_PLAN_PRICE`
- `NEXT_PUBLIC_GROW_PLAN_PRICE`
- `NEXT_PUBLIC_SCALE_PLAN_PRICE`
- Various Stripe price IDs for different plans

## Development

The development server runs on port 5000:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
npm start
```
