# Deployment Guide

## Netlify Deployment

This project is configured for easy deployment on Netlify with proper routing support.

### Prerequisites

1. **Node.js**: Version 18 or higher
2. **Package Manager**: npm, yarn, or bun
3. **Supabase Project**: Set up your Supabase project and get your credentials

### Step 1: Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

### Step 2: Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 3: Build the Project

```bash
npm run build
```

### Step 4: Deploy to Netlify

#### Option A: Automatic Deployment (Recommended)

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the `netlify.toml` configuration
3. Add your environment variables in the Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

#### Option B: Manual Deployment

1. Upload the `dist` folder to Netlify
2. Add your environment variables in the Netlify dashboard
3. Configure redirects (already handled by `public/_redirects`)

### Routing Configuration

The project includes proper routing configuration for Netlify:

- `public/_redirects`: Handles client-side routing
- `netlify.toml`: Build configuration
- All routes will work correctly: `/`, `/coffee-tasting`, `/admin`, `/dashboard`

### Available Routes

- `/` - Home page
- `/coffee-tasting` - Coffee tasting event registration
- `/admin` - Admin dashboard (requires login)
- `/dashboard` - Admin dashboard (requires login)
- `/*` - 404 page for any other routes

### Troubleshooting

1. **404 Errors**: Make sure the `public/_redirects` file is included in your deployment
2. **Build Errors**: Check that all dependencies are installed
3. **Environment Variables**: Ensure Supabase credentials are correctly set in Netlify dashboard

### Admin Access

Default admin credentials:
- Username: `admin`
- Password: `admin123`

**Important**: Change these credentials in production!
