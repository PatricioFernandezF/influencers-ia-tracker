import { useState, useEffect } from 'react'
import { api } from '../api'
import { Influencer, SocialNetwork } from '../types'

interface NewsletterInfluencer extends Influencer {
  totalPosts: number
  avgRating: number
}

export default function Newsletter() {
  const [influencers, setInfluencers] = useState<NewsletterInfluencer[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, posts: 0 })

  useEffect(() => {
    loadNewsletter()
  }, [])

  const loadNewsletter = async () => {
    try {
      const data = await api.getNewsletter()
      setInfluencers(data.topInfluencers)
      setStats({ total: data.totalInfluencers, posts: data.totalPosts })
    } catch (error) {
      console.error('Error loading newsletter:', error)
    }
    setLoading(false)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'YOUTUBE': return '▶️'
      case 'TWITTER': return '🐦'
      case 'BLOG': return '📝'
      default: return '🌐'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🚀 Newsletter IA</h1>
          <p className="text-xl text-purple-200">
            Los mejores creadores de contenido sobre Inteligencia Artificial
          </p>
          <div className="mt-6 flex justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-purple-300">Influencers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.posts}</div>
              <div className="text-purple-300">Posts</div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">📊 Destacados del Mes</h2>
          <p className="text-yellow-700">
            Estos son los influencers más activos generando contenido de calidad sobre IA y tecnología.
          </p>
        </div>

        {/* Influencers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((influencer, index) => (
            <div 
              key={influencer.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Rank Badge */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 flex justify-between items-center">
                <span className="font-bold">#{index + 1}</span>
                <span className="text-sm opacity-90">Top Influencer</span>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={influencer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(influencer.name)}&background=random`}
                    alt={influencer.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-purple-200"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{influencer.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {influencer.socialNetworks.map((sn: SocialNetwork) => (
                        <span key={sn.id} className="text-2xl" title={sn.platform}>
                          {getPlatformIcon(sn.platform)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {influencer.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{influencer.totalPosts}</div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{influencer.socialNetworks.length}</div>
                    <div className="text-xs text-gray-500">Redes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{influencer.avgRating.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>

                {/* Latest Post */}
                {influencer.socialNetworks[0]?.posts[0] && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Último Post</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {influencer.socialNetworks[0].posts[0].title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white">
          <p className="text-purple-200">
            © 2026 Influencers IA Tracker - Generado automáticamente
          </p>
          <p className="text-sm mt-2 opacity-70">
            Actualizado: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  )
}
