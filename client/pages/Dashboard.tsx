import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Youtube, Twitter, FileText, Star } from 'lucide-react'
import { api } from '../api'
import { Influencer, Platform } from '../types'

const platformIcons: Record<Platform, JSX.Element> = {
  YOUTUBE: <Youtube className="w-4 h-4 text-red-500" />,
  TWITTER: <Twitter className="w-4 h-4 text-blue-400" />,
  BLOG: <FileText className="w-4 h-4 text-green-500" />
}

const platformColors: Record<Platform, string> = {
  YOUTUBE: 'bg-red-500/20 text-red-400 border-red-500/30',
  TWITTER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  BLOG: 'bg-green-500/20 text-green-400 border-green-500/30'
}

export default function Dashboard() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState<Platform | ''>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInfluencers()
  }, [platformFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadInfluencers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadInfluencers = async () => {
    setLoading(true)
    try {
      const data = await api.getInfluencers(platformFilter || undefined, search || undefined)
      setInfluencers(data)
    } catch (error) {
      console.error('Error loading influencers:', error)
    }
    setLoading(false)
  }

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ))
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days} días`
    return date.toLocaleDateString('es-ES')
  }

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Influencers IA Tracker
          </h1>
          <Link
            to="/influencer/new"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all"
          >
            <Plus className="w-5 h-5" />
            Agregar Influencer
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar influencer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPlatformFilter('')}
              className={`px-4 py-2 rounded-lg border transition-all ${
                platformFilter === '' 
                  ? 'bg-purple-600 border-purple-500' 
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              Todos
            </button>
            {(['YOUTUBE', 'TWITTER', 'BLOG'] as Platform[]).map((platform) => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  platformFilter === platform 
                    ? platformColors[platform] 
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                {platformIcons[platform]}
                {platform === 'YOUTUBE' ? 'YouTube' : platform === 'TWITTER' ? 'Twitter' : 'Blog'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : influencers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No se encontraron influencers</p>
            <Link to="/influencer/new" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
              Agregar el primero
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {influencers.map((influencer) => (
              <Link
                key={influencer.id}
                to={`/influencer/${influencer.id}`}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold overflow-hidden">
                    {influencer.imageUrl ? (
                      <img src={influencer.imageUrl} alt={influencer.name} className="w-full h-full object-cover" />
                    ) : (
                      influencer.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate group-hover:text-purple-300 transition-colors">
                      {influencer.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(influencer.averageRating)}
                      <span className="text-sm text-gray-400 ml-1">
                        ({influencer.averageRating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                  {!influencer.isActive && (
                    <span className="px-2 py-1 text-xs bg-gray-700 rounded">Inactivo</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {influencer.socialNetworks.map((sn) => (
                    <span
                      key={sn.id}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${platformColors[sn.platform]}`}
                    >
                      {platformIcons[sn.platform]}
                      {sn.accountName}
                    </span>
                  ))}
                </div>

                {influencer.latestPost && (
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Último post</p>
                    <p className="text-sm text-gray-300 truncate">{influencer.latestPost.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(influencer.latestPost.publishedAt)}
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
