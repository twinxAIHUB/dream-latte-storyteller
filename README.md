# Dream Latte Storyteller

A beautiful coffee shop website built with React, TypeScript, and Tailwind CSS.

## Features

- Modern, responsive design with coffee-themed styling
- Admin dashboard for managing coffee tasting events
- Beautiful UI components using shadcn/ui
- Supabase integration for backend services
- Client-side routing with React Router

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm, yarn, or bun package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dream-latte-storyteller
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

## Building for Production

Build the application for production:
```bash
npm run build
# or
yarn build
# or
bun run build
```

## Deployment

### Netlify Deployment

This project is configured for easy deployment on Netlify:

1. **Automatic Deployment**: Connect your repository to Netlify and it will automatically deploy using the `netlify.toml` configuration.

2. **Manual Deployment**: 
   - Build the project: `npm run build`
   - Upload the `dist` folder to Netlify

3. **Environment Variables**: Add your Supabase environment variables in the Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Routing

The application uses client-side routing with React Router. The `public/_redirects` file ensures that all routes work correctly on Netlify by redirecting all requests to `index.html`.

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   └── ui/             # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── assets/             # Static assets
```

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **Backend**: Supabase
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
