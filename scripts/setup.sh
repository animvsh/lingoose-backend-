#!/bin/bash

echo "🎤 Setting up Lingoose Agents Voice AI System"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your actual API keys"
fi

# Initialize Supabase if not already done
if [ ! -f supabase/config.toml ]; then
    echo "🚀 Initializing Supabase..."
    supabase init
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your API keys"
echo "2. Run: supabase start"
echo "3. Run: supabase db reset"
echo "4. Run: supabase functions deploy"
echo "5. Run: npm run dev"
echo ""
echo "📚 See README.md for detailed setup instructions" 