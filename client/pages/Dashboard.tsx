import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { DashboardInsights, Influencer, Platform } from '../types'

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

const notificationsSeed = [
  { id: '1', title: 'Nuevo rating publicado', body: 'AI Expert Test recibió una valoración de 5 estrellas.' },
  { id: '2', title: 'Post trending en Twitter', body: 'Xavier Mitjana compartió una guía sobre modelos conversacionales.' },
  { id: '3', title: 'Recordatorio', body: 'Revisa los posts pendientes de validación antes del viernes.' }
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating', label: 'Highest Rating' }
 ] as const

export default function Dashboard() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState<Platform | ''>('')
  const [loading, setLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'rating'>('newest')
  const [insights, setInsights] = useState<DashboardInsights | null>(null)
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [insightsError, setInsightsError] = useState<string | null>(null)

  useEffect(() => {
    loadInfluencers()
  }, [platformFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadInfluencers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    loadInsights()
  }, [])

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

  const loadInsights = async () => {
    setInsightsLoading(true)
    setInsightsError(null)
    try {
      const data = await api.getDashboardInsights()
      setInsights(data)
    } catch (error) {
      console.error('Error loading insights:', error)
      setInsightsError('No se pudieron cargar los insights recientes.')
    }
    setInsightsLoading(false)
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

  const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

  const sortedInfluencers = useMemo(() => {
    const copy = [...influencers]
    return copy.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sortOption === 'rating') {
        return b.averageRating - a.averageRating
      }
      return 0
    })
  }, [influencers, sortOption])

  const handleSortSelect = (option: typeof sortOptions[number]['value']) => {
    setSortOption(option)
    setShowSortMenu(false)
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
            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
                aria-expanded={showNotifications}
                aria-label="Abrir notificaciones"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-[#101522] rounded-full"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Notificaciones</p>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      cerrar
                    </button>
                  </div>
                  <div className="mt-3 space-y-3 text-xs text-slate-500">
                    {notificationsSeed.map((note) => (
                      <article key={note.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                        <p className="font-semibold text-slate-900 dark:text-white">{note.title}</p>
                        <p className="mt-1 text-slate-500">{note.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
          <section className="mb-10 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Insights</p>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Posts trending & métricas</h3>
                <p className="text-sm text-slate-500">
                  Resumen semanal por red social y acceso rápido para agregar nuevos creadores.
                </p>
              </div>
              <Link
                to="/influencer/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#2b5bee] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#2b5bee]/30 transition hover:bg-[#1e40af]"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Agregar nuevo creador
              </Link>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr,1fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {insightsLoading ? (
                  Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-40 animate-pulse rounded-xl bg-slate-100/80 dark:bg-slate-800"
                    />
                  ))
                ) : insights?.trendingPosts?.length ? (
                  insights.trendingPosts.map((post) => (
                    <article
                      key={post.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                    >
                      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-500">
                        <span>{platformLabels[post.platform]}</span>
                        <span className="text-slate-400">{Math.round(post.engagement)} pts</span>
                      </div>
                      <h4 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{post.title}</h4>
                      <p className="text-sm text-slate-500">{post.influencerName}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>{post.ratingAverage.toFixed(1)}⭐</span>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Sin posts activos para mostrar esta semana.</p>
                )}
                {insights && (
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    {insights.platformBreakdown.map((item) => (
                    <span
                      key={item.platform}
                        className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 dark:border-slate-700 dark:bg-slate-800"
                      >
                        {platformLabels[item.platform]} · {item.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 text-center dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-widest text-slate-500">Posts semana</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {insights?.metrics.weeklyPosts ?? 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 text-center dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-widest text-slate-500">Rating</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {(insights?.metrics.averageRating ?? 0).toFixed(1)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 text-center dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-widest text-slate-500">Crecimiento</p>
                    <p className="text-2xl font-semibold text-emerald-500">
                      {formatPercent(insights?.metrics.growthPercent ?? 0)}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Creadoras destacadas</p>
                  <div className="mt-3 space-y-3">
                    {insights?.topCreators?.length ? (
                      insights.topCreators.map((creator) => (
                        <div key={creator.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{creator.name}</p>
                            <p className="text-xs text-slate-500">
                              {creator.ratingAverage.toFixed(1)}⭐ · {creator.networks} redes
                            </p>
                          </div>
                          <span className="text-xs text-slate-400">Top</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Aún no hay creadores destacados.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {insightsError && <p className="mt-4 text-xs text-rose-500">{insightsError}</p>}
          </section>
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
            <div className="flex items-center gap-2 relative">
              <span className="text-sm text-slate-500 font-medium">Sort by:</span>
              <button
                onClick={() => setShowSortMenu((prev) => !prev)}
                className="flex items-center gap-1 text-sm font-semibold bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                aria-haspopup="true"
                aria-expanded={showSortMenu}
              >
                {
                  sortOptions.find((option) => option.value === sortOption)?.label ?? 'Newest First'
                }
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-2xl border border-slate-200 bg-white/90 shadow-xl dark:border-slate-700 dark:bg-slate-900/90">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value as typeof sortOptions[number]['value'])}
                      className={`w-full px-4 py-2 text-left text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        sortOption === option.value ? 'text-[#2b5bee]' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">Total Posts</p>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    (insights?.metrics.growthPercent ?? 0) >= 0
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  {formatPercent(insights?.metrics.growthPercent ?? 0)}
                </span>
              </div>
              <p className="text-3xl font-bold tracking-tight">
                {insights?.metrics.weeklyPosts ?? influencers.length * 15}
              </p>
              <p className="text-xs text-slate-400 mt-2">últimos 7 días</p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">Avg. Rating</p>
                <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-0.5 rounded-full">
                  sobre 5
                </span>
              </div>
              <p className="text-3xl font-bold tracking-tight">
                {(insights?.metrics.averageRating ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-slate-400 mt-2">valoración global</p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">Active Creators</p>
                <span className="text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">Live</span>
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
          ) : sortedInfluencers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No creators found</p>
              <Link to="/influencer/new" className="text-[#2b5bee] hover:text-[#1e40af] mt-2 inline-block font-medium">
                Add the first one
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedInfluencers.map((influencer) => (
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
