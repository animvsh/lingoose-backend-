import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { vapiClient } from '../lib/vapi'
import { Phone, MessageSquare, Clock, User, Play, Plus } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalCalls: 0,
    recentActivity: 0
  })
  const [loading, setLoading] = useState(true)
  const [calling, setCalling] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState('')

  useEffect(() => {
    fetchStats()
    fetchAgents()
  }, [])

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch conversation count
      const { count: conversations } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Fetch call count
      const { count: calls } = await supabase
        .from('call_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Fetch recent activity (last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const { count: recent } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', yesterday.toISOString())

      setStats({
        totalConversations: conversations || 0,
        totalCalls: calls || 0,
        recentActivity: recent || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAgents = async () => {
    try {
      const agentsData = await vapiClient.getAgents()
      setAgents(agentsData.data || [])
      if (agentsData.data && agentsData.data.length > 0) {
        setSelectedAgent(agentsData.data[0].id)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  const handleMakeCall = async () => {
    if (!phoneNumber || !selectedAgent) {
      alert('Please enter a phone number and select an agent')
      return
    }

    setCalling(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const callResult = await vapiClient.makeCall(selectedAgent, phoneNumber, {
        userId: user?.id,
        timestamp: new Date().toISOString()
      })

      // Save call log
      await supabase
        .from('call_logs')
        .insert({
          user_id: user?.id,
          call_sid: callResult.id,
          phone_number: phoneNumber,
          status: 'initiated',
          metadata: {
            agent_id: selectedAgent,
            vapi_call_id: callResult.id
          }
        })

      alert(`Call initiated! Call ID: ${callResult.id}`)
      setPhoneNumber('')
    } catch (error) {
      console.error('Error making call:', error)
      alert('Failed to make call. Please check your Vapi configuration.')
    } finally {
      setCalling(false)
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your Voice AI assistant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Conversations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConversations}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Voice Calls</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCalls}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Activity</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Make a Voice Call</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Agent
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="input-field"
              >
                <option value="">Select an agent...</option>
                {agents.map((agent: any) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleMakeCall}
              disabled={calling || !phoneNumber || !selectedAgent}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Play size={16} />
              <span>{calling ? 'Initiating Call...' : 'Make Call'}</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.open('https://vapi.ai/agents', '_blank')}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>Create New Agent</span>
            </button>
            <button className="w-full btn-secondary">
              View Conversations
            </button>
            <button className="w-full btn-secondary">
              Call History
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Voice AI (Vapi)</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Online
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Database</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">API Services</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 