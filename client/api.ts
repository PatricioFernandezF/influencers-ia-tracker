const API_URL = import.meta.env.VITE_API_URL || ''

export const api = {
  async getInfluencers(platform?: string, search?: string) {
    const params = new URLSearchParams()
    if (platform) params.append('platform', platform)
    if (search) params.append('search', search)
    const res = await fetch(`${API_URL}/api/influencers?${params}`)
    return res.json()
  },

  async getInfluencer(id: number) {
    const res = await fetch(`${API_URL}/api/influencers/${id}`)
    return res.json()
  },

  async createInfluencer(data: any) {
    const res = await fetch(`${API_URL}/api/influencers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async updateInfluencer(id: number, data: any) {
    const res = await fetch(`${API_URL}/api/influencers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async deleteInfluencer(id: number) {
    const res = await fetch(`${API_URL}/api/influencers/${id}`, {
      method: 'DELETE'
    })
    return res.json()
  },

  async addSocialNetwork(influencerId: number, data: any) {
    const res = await fetch(`${API_URL}/api/influencers/${influencerId}/social-networks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async updateSocialNetwork(id: number, data: any) {
    const res = await fetch(`${API_URL}/api/social-networks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async deleteSocialNetwork(id: number) {
    const res = await fetch(`${API_URL}/api/social-networks/${id}`, {
      method: 'DELETE'
    })
    return res.json()
  },

  async addPost(socialNetworkId: number, data: any) {
    const res = await fetch(`${API_URL}/api/social-networks/${socialNetworkId}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async deletePost(id: number) {
    const res = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'DELETE'
    })
    return res.json()
  },

  async addRating(influencerId: number, data: { score: number; comment?: string }) {
    const res = await fetch(`${API_URL}/api/influencers/${influencerId}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async getDashboardInsights() {
    const res = await fetch(`${API_URL}/api/dashboard-insights`)
    return res.json()
  }
}
