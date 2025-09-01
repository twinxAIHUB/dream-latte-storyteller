#!/bin/bash

echo "🚀 Setting up Dream Latte Storyteller..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit https://nodejs.org/ or use a version manager like nvm"
    exit 1
fi

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "📦 Installing dependencies with npm..."
    npm install
elif command -v yarn &> /dev/null; then
    echo "📦 Installing dependencies with yarn..."
    yarn install
elif command -v bun &> /dev/null; then
    echo "📦 Installing dependencies with bun..."
    bun install
else
    echo "❌ No package manager found. Please install npm, yarn, or bun"
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Create a .env file with your Supabase credentials:"
echo "   VITE_SUPABASE_URL=your_supabase_url"
echo "   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. For Netlify deployment:"
echo "   - Connect your repository to Netlify"
echo "   - Add environment variables in Netlify dashboard"
echo "   - Deploy automatically or manually upload the dist folder"
echo ""
echo "🌐 Your app will be available at http://localhost:8080"
