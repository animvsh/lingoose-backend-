import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Conversation {
  id: string
  user_id: string
  role: 'user' | 'assistant' | 'system'
  message: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  full_name: string | null
  phone_number: string | null
  voice_preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CallLog {
  id: string
  user_id: string
  call_sid: string
  phone_number: string
  status: string
  duration: number | null
  recording_url: string | null
  transcript: string | null
  metadata: Record<string, any>
  created_at: string
} 