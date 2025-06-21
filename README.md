# 🎤 Lingoose Agents - Voice AI System

A complete voice AI system built with **Supabase** backend and **Vapi** integration for intelligent voice conversations.

## 🚀 Features

- **Voice AI Assistant**: Intelligent conversations via phone calls
- **Conversation Memory**: Persistent context-aware conversations
- **Call Logging**: Track and review voice call history
- **User Profiles**: Personalized voice preferences and settings
- **Real-time Dashboard**: Monitor usage and system status
- **Secure Authentication**: Supabase Auth with Row Level Security

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Supabase Edge  │    │   Vapi Voice    │
│                 │    │   Functions     │    │     AI          │
│  - Dashboard    │◄──►│  - get-context  │◄──►│  - LLM Prompt   │
│  - Conversations│    │  - save-convers.│    │  - Voice Gen    │
│  - Call Logs    │    │  - twilio-webhook│    │  - Call Handle  │
│  - Settings     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Supabase Auth  │    │  Supabase DB    │    │   Twilio Voice  │
│                 │    │                 │    │                 │
│  - User Auth    │    │  - conversations│    │  - Phone Calls  │
│  - RLS Policies │    │  - call_logs    │    │  - Webhooks     │
│  - User Profiles│    │  - user_profiles│    │  - Recording    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **API**: Edge Functions (Deno)
- **Storage**: Supabase Storage (for recordings)

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Voice AI
- **Voice Platform**: Vapi.ai
- **Phone Service**: Twilio
- **LLM**: OpenAI GPT (via Vapi)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase CLI
- Vapi.ai account
- Twilio account
- OpenAI API key

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd lingooseagents
npm install
```

### 2. Supabase Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize Supabase (creates local project)
supabase init

# Start local Supabase
supabase start

# Apply database migrations
supabase db reset
```

### 3. Environment Variables

Create `.env.local` file:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Vapi
VAPI_API_KEY=your_vapi_api_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### 4. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy get-context
supabase functions deploy save-conversation
supabase functions deploy twilio-webhook
```

### 5. Vapi Configuration

Create a Vapi agent with these settings:

```json
{
  "name": "Lingoose Agent",
  "model": {
    "provider": "openai",
    "model": "gpt-4",
    "temperature": 0.7,
    "systemPrompt": "You are a helpful AI assistant. Use the context provided to have natural conversations."
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "pNInz6obpgDQGcFmaJgB"
  },
  "functions": [
    {
      "name": "get_context",
      "url": "https://your-project.functions.supabase.co/get-context"
    },
    {
      "name": "save_conversation",
      "url": "https://your-project.functions.supabase.co/save-conversation"
    }
  ]
}
```

### 6. Twilio Webhook Setup

Configure your Twilio phone number webhook:

```
Status Callback URL: https://your-project.functions.supabase.co/twilio-webhook
```

### 7. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 📁 Project Structure

```
lingooseagents/
├── src/
│   ├── components/          # React components
│   │   ├── Loading.tsx
│   │   └── Navbar.tsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Conversations.tsx
│   │   ├── CallLogs.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── lib/                # Utilities
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── get-context/
│   │   ├── save-conversation/
│   │   └── twilio-webhook/
│   ├── migrations/         # Database migrations
│   └── config.toml         # Supabase config
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔧 API Endpoints

### Edge Functions

#### `GET /functions/v1/get-context`
Fetches conversation context for AI.

**Request:**
```json
{
  "userId": "user-uuid",
  "limit": 10
}
```

**Response:**
```json
{
  "context": "user: Hello\nassistant: Hi there!",
  "userProfile": { "full_name": "John Doe" },
  "conversationCount": 5
}
```

#### `POST /functions/v1/save-conversation`
Saves a conversation message.

**Request:**
```json
{
  "userId": "user-uuid",
  "role": "user",
  "message": "Hello AI!",
  "metadata": {}
}
```

#### `POST /functions/v1/twilio-webhook`
Handles Twilio call events.

**Request:** Twilio form data
**Response:** Call log data

## 🗄️ Database Schema

### Tables

#### `conversations`
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- role (TEXT: 'user'|'assistant'|'system')
- message (TEXT)
- metadata (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

#### `user_profiles`
```sql
- id (UUID, Primary Key)
- full_name (TEXT)
- phone_number (TEXT)
- voice_preferences (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

#### `call_logs`
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- call_sid (TEXT)
- phone_number (TEXT)
- status (TEXT)
- duration (INTEGER)
- recording_url (TEXT)
- transcript (TEXT)
- metadata (JSONB)
- created_at (TIMESTAMPTZ)
```

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **User authentication** required for all operations
- **CORS** configured for Edge Functions
- **Environment variables** for sensitive data

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Supabase (Production)
```bash
# Link to production project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy

# Apply migrations
supabase db push
```

## 📞 Voice Call Flow

1. **User calls** Twilio phone number
2. **Twilio** routes to Vapi agent
3. **Vapi** calls `get-context` function for conversation history
4. **AI responds** using context and user preferences
5. **Call ends** → Twilio webhook → `twilio-webhook` function
6. **Transcript saved** to database as conversation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README
- **Issues**: Create GitHub issue
- **Discussions**: Use GitHub Discussions

## 🔮 Roadmap

- [ ] Multi-language support
- [ ] Advanced voice customization
- [ ] Call scheduling
- [ ] Analytics dashboard
- [ ] Team collaboration features
- [ ] API rate limiting
- [ ] Webhook retry logic
- [ ] Voice emotion detection

---

**Built with ❤️ using Supabase, Vapi, and React** 