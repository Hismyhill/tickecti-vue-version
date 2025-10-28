# Ticketi — Vue Implementation

A ticket management system built with Vue 3, Vite, and Supabase.

## Features

- User authentication
- Ticket CRUD (Create, Read, Update, Delete)
- Responsive, accessible UI
- Protected routes
- Tailwind CSS styling

## Tech Stack

- Vue 3 + Vite
- Pinia (state management)
- Tailwind CSS
- Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

```bash
git clone <repository-url>
cd vue-ticket
npm install
```

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

## Project Structure

```
src/
  components/   # UI components
  pages/        # Route views
  stores/       # Pinia stores
  utils/        # Helpers
```

## Environment Variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## License

MIT
