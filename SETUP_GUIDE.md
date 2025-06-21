# 🚀 Quick Setup Guide - Vapi Voice AI

This guide will get your voice AI system running in **under 10 minutes** with just **3 API keys**!

## 📋 What You Need

1. **Supabase** (free) - Database & Auth
2. **Vapi.ai** (free tier) - Voice AI platform  
3. **OpenAI** (pay-per-use) - AI responses

## ⚡ Step-by-Step Setup

### Step 1: Get Your API Keys

#### 🔑 Supabase (2 minutes)
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Go to Settings → API
5. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

#### 🎤 Vapi.ai (3 minutes)
1. Go to [vapi.ai](https://vapi.ai)
2. Sign up for free account
3. Go to API Keys section
4. Create new API key → `VITE_VAPI_API_KEY`
5. Go to Agents → Create Agent:
   - **Name**: "My AI Assistant"
   - **Model**: OpenAI GPT-4o
   - **System Prompt**: "You are a helpful AI assistant."
   - **Voice**: Choose any voice
6. Save and note the **Agent ID**

#### 🤖 OpenAI (2 minutes)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up and add billing
3. Go to API Keys
4. Create new key → `OPENAI_API_KEY`

### Step 2: Configure Your Project

```bash
# 1. Clone and setup
git clone https://github.com/animvsh/lingoose-backend-.git
cd lingoose-backend-

# 2. Install dependencies
npm install

# 3. Create environment file
cp env.example .env.local

# 4. Edit .env.local with your keys
```

**Add your keys to `.env.local`:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_VAPI_API_KEY=your_vapi_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Step 3: Setup Database

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Start local Supabase
supabase start

# Apply database schema
supabase db reset

# Deploy functions
supabase functions deploy
```

### Step 4: Start Your App

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 🎯 How to Make Your First Call

1. **Sign up** in your app
2. **Go to Dashboard**
3. **Enter a phone number** (your own to test)
4. **Select your Vapi agent**
5. **Click "Make Call"**
6. **Answer your phone** - AI will talk to you!

## 💡 Pro Tips

### Create Different Agents
- **Language Tutor**: "You are a French tutor. Only speak French."
- **Therapist**: "You are a supportive therapist. Ask about feelings."
- **Assistant**: "You are a helpful personal assistant."

### Test Without Phone
- Use Vapi's **browser testing** feature
- Go to your agent page → "Test Agent" → "Browser Call"

### Monitor Usage
- **Vapi**: Check usage in dashboard
- **OpenAI**: Monitor in OpenAI dashboard
- **Supabase**: Free tier is generous

## 🚨 Troubleshooting

### "Vapi API error"
- Check your `VITE_VAPI_API_KEY` is correct
- Make sure you have credits in Vapi

### "Supabase connection failed"
- Verify your Supabase URL and key
- Check if Supabase is running locally

### "OpenAI API error"
- Check your `OPENAI_API_KEY`
- Make sure you have billing set up

### "No agents found"
- Create an agent in Vapi dashboard first
- Make sure agent is active

## 💰 Cost Breakdown

| Service | Free Tier | Your Usage |
|---------|-----------|------------|
| **Supabase** | $0/month | $0 (generous free tier) |
| **Vapi** | $0.10/minute | ~$1-5/month for testing |
| **OpenAI** | $0.03/1K tokens | ~$2-10/month for testing |

**Total: ~$3-15/month for personal use**

## 🎉 You're Done!

You now have a **working voice AI system** that can:
- ✅ Make phone calls directly
- ✅ Remember conversations
- ✅ Use custom AI personalities
- ✅ Track call history
- ✅ Scale to production

**Next steps:**
- Create more agents for different use cases
- Add your own phone numbers
- Customize the UI
- Deploy to production

---

**Need help?** Check the main README.md or create an issue on GitHub! 