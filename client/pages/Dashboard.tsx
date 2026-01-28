import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Influencer, Platform } from '../types'

const platformIcons: Record<Platform, { icon: string; color: string }> = {
  YOUTUBE: { icon: 'play_circle', color: 'text-red-500' },
  TWITTER: { icon: 'chat', color: 'text-blue-400' },
  BLOG: { icon: 'article', color: 'text-green-500' }
}

const platformLabels: Record<Platform, string> = {
  YOUTUBE: 'YouTube',
  TWITTER: 'Twitter',
  BLOG: 'Blog'
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
      <span
        key={i}
        className={`material-symbols-outlined text-lg ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-600'}`}
        style={{ fontVariationSettings: i < Math.round(rating) ? "'FILL' 1" : "'FILL' 0" }}
      >
        star
      </span>
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
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#101522]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101522] flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-[#2b5bee] rounded-lg p-1.5 text-white">
              <span className="material-symbols-outlined text-2xl">monitoring</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">PostTracker</h1>
              <p className="text-gray-500 text-xs font-medium">Influencer Pro</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#2b5bee]/10 text-[#2b5bee] font-medium" to="/">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors" to="#">
              <span className="material-symbols-outlined">analytics</span>
              <span className="text-sm">Analytics</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors" to="#">
              <span className="material-symbols-outlined">group</span>
              <span className="text-sm">Creators</span>
            </Link>
          </nav>
        </div>
        <Link
          to="/influencer/new"
          className="w-full bg-[#2b5bee] hover:bg-[#1e40af] text-white text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Add Creator
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-8 py-4 bg-white/50 dark:bg-[#101522]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold tracking-tight">Influencers</h2>
            <div className="relative w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
              <input
                type="text"
                placeholder="Search creators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#2b5bee]/50 transition-all placeholder:text-gray-500"
              />
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-2">
            <button
              onClick={() => setPlatformFilter('')}
              className={`flex h-9 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all ${
                platformFilter === ''
                  ? 'bg-[#2b5bee] text-white shadow-lg shadow-[#2b5bee]/20'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#2b5bee]'
              }`}
            >
              All Platforms
            </button>
            {(['YOUTUBE', 'TWITTER', 'BLOG'] as Platform[]).map((platform) => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`flex h-9 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all ${
                  platformFilter === platform
                    ? 'bg-[#2b5bee] text-white shadow-lg shadow-[#2b5bee]/20'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#2b5bee]'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${platformIcons[platform].color}`}>
                  {platformIcons[platform].icon}
                </span>
                {platformLabels[platform]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2b5bee]"></div>
            </div>
          ) : influencers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No creators found</p>
              <Link to="/influencer/new" className="text-[#2b5bee] hover:text-[#1e40af] mt-2 inline-block font-medium">
                Add the first one
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {influencers.map((influencer) => (
                <Link
                  key={influencer.id}
                  to={`/influencer/${influencer.id}`}
                  className="group bg-white dark:bg-[#1a1f37] border border-gray-200 dark:border-[#2d3548] rounded-xl overflow-hidden hover:shadow-xl hover:border-[#2b5bee]/50 transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full p-1 border-2 border-[#2b5bee]/30 mb-4">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#2b5bee] to-blue-500 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                          {influencer.imageUrl ? (
                            <img src={influencer.imageUrl} alt={influencer.name} className="w-full h-full object-cover" />
                          ) : (
                            influencer.name.charAt(0).toUpperCase()
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-1 group-hover:text-[#2b5bee] transition-colors">{influencer.name}</h3>
                      <div className="flex items-center gap-1 mb-3 text-amber-400">
                        {renderStars(influencer.averageRating)}
                        <span className="text-gray-400 text-xs font-medium ml-1">{influencer.averageRating.toFixed(1)}</span>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {influencer.socialNetworks.map((sn) => (
                          <div key={sn.id} className="w-7 h-7 rounded bg-gray-100 dark:bg-[#2d3548] flex items-center justify-center text-gray-600 dark:text-gray-300">
                            <span className={`material-symbols-outlined text-sm ${platformIcons[sn.platform].color}`}>
                              {platformIcons[sn.platform].icon}
                            </span>
                          </div>
                        ))}
                      </div>
                      {!influencer.isActive && (
                        <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">Inactive</span>
                      )}
                    </div>
                  </div>
                  {influencer.latestPost && (
                    <div className="bg-gray-50 dark:bg-black/20 p-4 border-t border-gray-200 dark:border-[#2d3548]">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Latest Post</p>
                      <p className="text-sm font-medium line-clamp-1 mb-1 group-hover:text-[#2b5bee] transition-colors">
                        {influencer.latestPost.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>{formatDate(influencer.latestPost.publishedAt)}</span>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
