import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse form data from Twilio webhook
    const formData = await req.formData()
    const callSid = formData.get('CallSid') as string
    const callStatus = formData.get('CallStatus') as string
    const from = formData.get('From') as string
    const to = formData.get('To') as string
    const duration = formData.get('CallDuration') as string
    const recordingUrl = formData.get('RecordingUrl') as string
    const transcript = formData.get('TranscriptionText') as string

    // Extract user ID from the 'to' number or custom parameters
    // You might need to adjust this based on your phone number mapping strategy
    const userId = formData.get('userId') as string

    if (!callSid) {
      return new Response(
        JSON.stringify({ error: 'CallSid is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Insert or update call log
    const { data, error } = await supabase
      .from('call_logs')
      .upsert({
        call_sid: callSid,
        user_id: userId,
        phone_number: from,
        status: callStatus,
        duration: duration ? parseInt(duration) : null,
        recording_url: recordingUrl,
        transcript,
        metadata: {
          to_number: to,
          call_status: callStatus,
          timestamp: new Date().toISOString()
        }
      }, {
        onConflict: 'call_sid'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // If call is completed and we have a transcript, save it as a conversation
    if (callStatus === 'completed' && transcript && userId) {
      await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          role: 'user',
          message: transcript,
          metadata: {
            call_sid: callSid,
            source: 'voice_call',
            phone_number: from
          }
        })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        callLog: data 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in twilio-webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 