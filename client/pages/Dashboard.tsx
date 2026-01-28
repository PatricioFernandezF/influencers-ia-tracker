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
    <main className="flex-1 flex flex-col bg-slate-50 dark:bg-[#101522]">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-8 py-4 bg-white/50 dark:bg-[#101522]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold tracking-tight">Latest Posts</h2>
            <div className="relative w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#2b5bee]/50 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-[#101522] rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-sm font-semibold leading-none">Alex Rivers</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">Campaign Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border-2 border-[#2b5bee]/20"></div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Platform Filters (Chips) */}
          <div className="flex items-center justify-between mb-8">
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Sort by:</span>
              <button className="flex items-center gap-1 text-sm font-semibold bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                Newest First
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">Total Posts</p>
                <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-0.5 rounded-full">+12.5%</span>
              </div>
              <p className="text-3xl font-bold tracking-tight">{influencers.length * 15}</p>
              <p className="text-xs text-slate-400 mt-2">vs last month</p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">Avg. Engagement</p>
                <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-0.5 rounded-full">+0.8%</span>
              </div>
              <p className="text-3xl font-bold tracking-tight">4.21%</p>
              <p className="text-xs text-slate-400 mt-2">Global benchmark: 3.5%</p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">Active Creators</p>
                <span className="text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">0%</span>
              </div>
              <p className="text-3xl font-bold tracking-tight">{influencers.filter(i => i.isActive).length}</p>
              <div className="flex gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
            </div>
          </div>

          {/* Influencer Cards */}
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
                  className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#2b5bee]/50"
                >
                  <div className="p-5">
                    <div className="flex flex-col items-center text-center">
                      <div className="size-24 rounded-full p-1 border-2 border-[#2b5bee]/30 mb-4">
                        <div className="w-full h-full rounded-full bg-center bg-cover overflow-hidden">
                          {influencer.imageUrl ? (
                            <img src={influencer.imageUrl} alt={influencer.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#2b5bee] to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                              {influencer.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{influencer.name}</h3>
                      <div className="flex items-center gap-1 mb-3 text-amber-400">
                        {renderStars(influencer.averageRating)}
                        <span className="text-slate-400 text-xs font-medium ml-1">{influencer.averageRating.toFixed(1)}</span>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {influencer.socialNetworks.map((sn) => (
                          <div key={sn.id} className="size-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                            <span className={`material-symbols-outlined text-sm ${platformIcons[sn.platform].color}`}>
                              {platformIcons[sn.platform].icon}
                            </span>
                          </div>
                        ))}
                      </div>
                      {!influencer.isActive && (
                        <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded-full">Inactive</span>
                      )}
                    </div>
                  </div>
                  {influencer.latestPost && (
                    <div className="bg-slate-50 dark:bg-black/20 p-4 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">Latest Post</p>
                      <p className="text-sm font-medium line-clamp-1 mb-1 group-hover:text-[#2b5bee] transition-colors">
                        {influencer.latestPost.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
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
  )
}
