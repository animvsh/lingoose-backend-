// Vapi API client for direct voice calls
export class VapiClient {
  private apiKey: string;
  private baseUrl = 'https://api.vapi.ai';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Make a direct phone call
  async makeCall(agentId: string, phoneNumber: string, metadata?: any) {
    const response = await fetch(`${this.baseUrl}/calls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId,
        phoneNumber,
        metadata
      })
    });

    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get call status
  async getCallStatus(callId: string) {
    const response = await fetch(`${this.baseUrl}/calls/${callId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all calls
  async getCalls() {
    const response = await fetch(`${this.baseUrl}/calls`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Create a new agent
  async createAgent(agentConfig: any) {
    const response = await fetch(`${this.baseUrl}/agents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentConfig)
    });

    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all agents
  async getAgents() {
    const response = await fetch(`${this.baseUrl}/agents`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.statusText}`);
    }

    return response.json();
  }
}

// Initialize Vapi client
export const vapiClient = new VapiClient(import.meta.env.VITE_VAPI_API_KEY || ''); 