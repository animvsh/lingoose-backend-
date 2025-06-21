import { useState, useEffect } from 'react'
import { supabase, Conversation } from '../lib/supabase'
import { MessageSquare, User, Bot } from 'lucide-react'

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setConversations(data || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-600">Your chat history with the AI assistant</p>
      </div>

      <div className="space-y-4">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
            <p className="mt-1 text-sm text-gray-500">Start a conversation to see your history here.</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div key={conversation.id} className="card">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {conversation.role === 'user' ? (
                    <User className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Bot className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {conversation.role}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(conversation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{conversation.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 