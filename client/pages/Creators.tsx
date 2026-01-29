import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
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

export default function Creators() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInfluencers()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadInfluencers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadInfluencers = async () => {
    setLoading(true)
    try {
      const data = await api.getInfluencers(undefined, search || undefined)
      setInfluencers(data)
    } catch (error) {
      console.error('Error loading influencers:', error)
    }
    setLoading(false)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${name}?`)) return
    try {
      await api.deleteInfluencer(id)
      loadInfluencers()
    } catch (error) {
      console.error('Error deleting influencer:', error)
    }
  }

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined text-lg ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-600'}`}
        style={{ fontVariationSettings: i < Math.round(rating) ? '"FILL" 1' : '"FILL" 0' }}
      >
        star
      </span>
    ))
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-border-dark px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Creators</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your influencers</p>
          </div>
          <Link
            to="/influencer/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#2b5bee] text-white rounded-lg hover:bg-[#2347c5] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Creator
          </Link>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-border-dark rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b5bee]/50"
          />
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2b5bee]"></div>
          </div>
        ) : influencers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No creators found</p>
            <Link
              to="/influencer/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2b5bee] text-white rounded-lg hover:bg-[#2347c5] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add your first creator
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {influencers.map((influencer) => (
              <div
                key={influencer.id}
                className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-border-dark rounded-xl p-6 hover:shadow-lg dark:hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full p-1 border-2 border-[#2b5bee]/30">
                      <div className="w-full h-full rounded-full bg-center bg-cover overflow-hidden">
                        {influencer.imageUrl ? (
                          <img src={influencer.imageUrl} alt={influencer.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#2b5bee] to-blue-500 flex items-center justify-center text-xl font-bold text-white">
                            {influencer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{influencer.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(influencer.averageRating)}
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{influencer.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {influencer.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{influencer.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {influencer.socialNetworks.map((sn) => (
                    <a
                      key={sn.id}
                      href={sn.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-border-dark rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className={`material-symbols-outlined text-base ${platformIcons[sn.platform].color}`}>
                        {platformIcons[sn.platform].icon}
                      </span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">{platformLabels[sn.platform]}</span>
                      <ExternalLink className="w-3 h-3 text-gray-500" />
                    </a>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-border-dark">
                  <Link
                    to={`/influencer/${influencer.id}`}
                    className="flex-1 px-3 py-2 text-center text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/influencer/${influencer.id}/edit`}
                    className="px-3 py-2 bg-[#2b5bee]/10 text-[#2b5bee] rounded-lg hover:bg-[#2b5bee]/20 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(influencer.id, influencer.name)}
                    className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
