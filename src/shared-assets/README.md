# Shared Assets

This directory contains shared assets and configurations that are used across all implementations (React, Vue, and Twig) of the Ticketi application.

## Contents

### 1. Supabase Client (`supabase.js`)

A shared Supabase client configuration and helper functions for authentication and ticket management.

#### Usage:

```javascript
// In your implementation's config file:
import {
  supabase,
  auth,
  tickets,
  TICKET_STATUS,
  validateTicket,
} from "../../shared-assets/supabase.js";

// Auth operations
const { data, error } = await auth.signIn({ email, password });

// Ticket operations
const { data, error } = await tickets.create(newTicket);
```

#### Environment Variables Required:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Tailwind Configuration (`tailwind.config.js`)

Shared Tailwind CSS configuration to ensure consistent styling across implementations.

#### Usage:

```javascript
// In your implementation's tailwind.config.js:
import sharedConfig from "../../shared-assets/tailwind.config.js";

export default {
  ...sharedConfig,
  // Add implementation-specific configurations here
};
```

## Features

### Authentication

- Sign Up
- Sign In
- Sign Out
- Get Current User

### Ticket Management

- Create Ticket
- Update Ticket
- Delete Ticket
- Get All Tickets
- Get Ticket by ID

### Utilities

- Date Formatting
- Ticket Validation
- Status Constants

## Best Practices

1. Always import from shared assets using relative paths
2. Don't modify shared files directly; extend them in your implementation
3. Keep environment variables in each implementation's .env file
4. Use the provided validation functions for consistent data handling

## Shared Constants

### Ticket Statuses

```javascript
TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
};
```

## Contributing

When adding new shared functionality:

1. Update this README
2. Add proper JSDoc comments
3. Test in all implementations
4. Update the validation schema if needed
