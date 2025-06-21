# 🎤 Lingoose Agents - Voice AI System

A complete voice AI system built with **Supabase** backend and **Vapi** integration for intelligent voice conversations. **No Twilio setup required!**

## 🚀 Features

- **Voice AI Assistant**: Intelligent conversations via Vapi's direct calling
- **Conversation Memory**: Persistent context-aware conversations
- **Call Logging**: Track and review voice call history
- **User Profiles**: Personalized voice preferences and settings
- **Real-time Dashboard**: Monitor usage and system status
- **Secure Authentication**: Supabase Auth with Row Level Security
- **Direct API Calls**: Make calls directly through Vapi without Twilio

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Supabase Edge  │    │   Vapi Voice    │
│                 │    │   Functions     │    │     AI          │
│  - Dashboard    │◄──►│  - get-context  │◄──►│  - LLM Prompt   │
│  - Conversations│    │  - save-convers.│    │  - Voice Gen    │
│  - Call Logs    │    │  - memory mgmt  │    │  - Direct Calls │
│  - Settings     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Supabase Auth  │    │  Supabase DB    │    │   Vapi API      │
│                 │    │                 │    │                 │
│  - User Auth    │    │  - conversations│    │  - Direct Calls │
│  - RLS Policies │    │  - call_logs    │    │  - Agent Mgmt   │
│  - User Profiles│    │  - user_profiles│    │  - Voice Models │
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
- **Voice Platform**: Vapi.ai (direct API calls)
- **LLM**: OpenAI GPT-4o (via Vapi)
- **Voice**: Built-in voices or ElevenLabs integration

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase CLI
- Vapi.ai account
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
# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Vapi (Required)
VITE_VAPI_API_KEY=your_vapi_api_key

# OpenAI (Required)
OPENAI_API_KEY=your_openai_api_key
```

### 4. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy get-context
supabase functions deploy save-conversation
```

### 5. Vapi Agent Setup

1. Go to [vapi.ai](https://vapi.ai) and create an account
2. Create a new agent with these settings:
   - **Model**: OpenAI GPT-4o
   - **System Prompt**: "You are a helpful AI assistant with access to conversation history."
   - **Voice**: Choose from built-in voices
3. Copy your agent ID for the dashboard

### 6. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 🎯 How to Use

### Making Voice Calls

1. **Sign up** for Vapi.ai and create an agent
2. **Add your Vapi API key** to `.env.local`
3. **Go to Dashboard** and enter a phone number
4. **Select your agent** from the dropdown
5. **Click "Make Call"** - Vapi will call the number directly!

### Creating Custom Agents

1. Go to [vapi.ai/agents](https://vapi.ai/agents)
2. Click "Create Agent"
3. Choose your model (GPT-4o recommended)
4. Set your system prompt
5. Choose a voice
6. Save and use the agent ID in your dashboard

## 📁 Project Structure

```
lingooseagents/
├── src/
│   ├── components/          # React components
│   │   ├── Loading.tsx
│   │   └── Navbar.tsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Voice call interface
│   │   ├── Conversations.tsx
│   │   ├── CallLogs.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── lib/                # Utilities
│   │   ├── supabase.ts
│   │   └── vapi.ts         # Vapi API client
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── get-context/
│   │   └── save-conversation/
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

### Vapi API

#### `POST /calls`
Make a direct phone call.

**Request:**
```json
{
  "agentId": "agent-uuid",
  "phoneNumber": "+1234567890",
  "metadata": {
    "userId": "user-uuid"
  }
}
```

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

1. **User enters phone number** in dashboard
2. **Frontend calls Vapi API** directly
3. **Vapi makes phone call** to the number
4. **AI responds** using conversation context
5. **Call transcript saved** to database
6. **Frontend shows updated** conversation history

## 💡 Use Cases

| Use Case | Description | Setup |
|----------|-------------|-------|
| **Daily Language Tutor** | Calls you every morning in Spanish/French | Create language tutor agent |
| **AI Therapist** | Checks in on your mood, remembers sessions | Create therapist agent |
| **Personal Assistant** | Reminds you of meetings, books reservations | Create assistant agent |
| **Customer Support** | Handles customer calls with context | Create support agent |
| **Memory Call Agent** | Remembers who you are, asks about your day | Create memory agent |

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
- [ ] Voice emotion detection
- [ ] Real-time call monitoring

---

**Built with ❤️ using Supabase, Vapi, and React** 