import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Plus, ExternalLink } from 'lucide-react'
import { api } from '../api'
import { Influencer, Platform, SocialNetwork } from '../types'

const platformIcons: Record<Platform, string> = {
  YOUTUBE: 'play_circle',
  TWITTER: 'chat',
  BLOG: 'article'
}

const platformColors: Record<Platform, string> = {
  YOUTUBE: 'text-red-500 bg-red-500/10',
  TWITTER: 'text-blue-400 bg-blue-400/10',
  BLOG: 'text-green-500 bg-green-500/10'
}

export default function InfluencerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [influencer, setInfluencer] = useState<Influencer | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork | null>(null)
  const [ratingScore, setRatingScore] = useState(5)
  const [ratingComment, setRatingComment] = useState('')
  const [newPost, setNewPost] = useState({ title: '', url: '', description: '', publishedAt: '' })

  useEffect(() => {
    loadInfluencer()
  }, [id])

  const loadInfluencer = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await api.getInfluencer(parseInt(id))
      setInfluencer(data)
    } catch (error) {
      console.error('Error loading influencer:', error)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!influencer || !confirm('¿Estás seguro de eliminar este influencer?')) return
    try {
      await api.deleteInfluencer(influencer.id)
      navigate('/')
    } catch (error) {
      console.error('Error deleting influencer:', error)
    }
  }

  const handleAddRating = async () => {
    if (!influencer) return
    try {
      await api.addRating(influencer.id, { score: ratingScore, comment: ratingComment })
      setShowRatingModal(false)
      setRatingScore(5)
      setRatingComment('')
      loadInfluencer()
    } catch (error) {
      console.error('Error adding rating:', error)
    }
  }

  const handleAddPost = async () => {
    if (!selectedNetwork) return
    try {
      await api.addPost(selectedNetwork.id, newPost)
      setShowPostModal(false)
      setNewPost({ title: '', url: '', description: '', publishedAt: '' })
      setSelectedNetwork(null)
      loadInfluencer()
    } catch (error) {
      console.error('Error adding post:', error)
    }
  }

  const renderStars = (rating: number, interactive = false, onSelect?: (n: number) => void) => {
    return Array(5).fill(0).map((_, i) => (
      <span
        key={i}
        onClick={() => interactive && onSelect && onSelect(i + 1)}
        className={`material-symbols-outlined text-xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
          i < Math.round(rating) ? 'text-amber-400' : 'text-gray-400'
        }`}
        style={{ fontVariationSettings: i < Math.round(rating) ? '"FILL" 1' : '"FILL" 0' }}
      >
        star
      </span>
    ))
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-[#101522]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2b5bee]"></div>
      </main>
    )
  }

  if (!influencer) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#101522]">
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">Influencer no encontrado</p>
        <Link to="/" className="text-[#2b5bee] hover:text-[#1e40af]">Volver al inicio</Link>
      </main>
    )
  }

  const totalPosts = influencer.socialNetworks.reduce((sum, sn) => sum + sn.posts.length, 0)
  const uniquePlatforms = Array.from(new Set<Platform>(influencer.socialNetworks.map((sn) => sn.platform)))

  return (
    <main className="flex-1 overflow-auto bg-slate-50 dark:bg-[#101522]">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </Link>
          <div className="flex gap-3">
            <Link
              to={`/influencer/${influencer.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#2b5bee] transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="size-32 rounded-full p-1.5 border-2 border-[#2b5bee]/30">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {influencer.imageUrl ? (
                    <img src={influencer.imageUrl} alt={influencer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2b5bee] to-blue-500 flex items-center justify-center text-4xl font-bold text-white">
                      {influencer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{influencer.name}</h1>
                  <p className="text-slate-500 dark:text-slate-400 max-w-2xl">{influencer.description || 'Sin descripción'}</p>
                </div>
                {!influencer.isActive && (
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-sm font-medium">
                    Inactivo
                  </span>
                )}
              </div>

              {/* Platforms */}
              <div className="flex flex-wrap gap-2 mb-6">
                {uniquePlatforms.map((platform) => (
                  <span key={platform} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${platformColors[platform]}`}>
                    <span className="material-symbols-outlined text-base">{platformIcons[platform]}</span>
                    {platform}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {renderStars(influencer.averageRating)}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">{influencer.averageRating.toFixed(1)}</span>
                  <span className="text-slate-400 ml-1">({influencer.ratings.length} valoraciones)</span>
                </div>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="px-4 py-2 bg-[#2b5bee]/10 text-[#2b5bee] rounded-lg hover:bg-[#2b5bee]/20 transition-colors text-sm font-medium"
                >
                  Valorar
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Posts</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalPosts}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Redes</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{uniquePlatforms.length}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Estado</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{influencer.isActive ? 'Activo' : 'Inactivo'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Networks */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Redes Sociales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {influencer.socialNetworks.map((sn) => (
            <div
              key={sn.id}
              className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${platformColors[sn.platform]}`}>
                  <span className="material-symbols-outlined text-base">{platformIcons[sn.platform]}</span>
                  <span>{sn.platform}</span>
                </div>
                <a
                  href={sn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-[#2b5bee] hover:bg-[#2b5bee]/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white mb-1">{sn.accountName}</p>
              {sn.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{sn.description}</p>
              )}
              <button
                onClick={() => {
                  setSelectedNetwork(sn)
                  setShowPostModal(true)
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#2b5bee] hover:text-[#1e40af] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar post
              </button>
            </div>
          ))}
        </div>

        {/* Posts */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Últimos Posts</h2>
          {influencer.socialNetworks.flatMap(sn => sn.posts).length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No hay posts registrados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {influencer.socialNetworks.flatMap(sn =>
                sn.posts.map(post => (
                  <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-[#2b5bee]/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-[#2b5bee] transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      <span className={`material-symbols-outlined text-sm ${platformColors[sn.platform].split(' ')[1]}`}>
                        {platformIcons[sn.platform]}
                      </span>
                    </div>
                    {post.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{post.description}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </a>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Valorar Influencer</h3>
            <div className="flex justify-center gap-1 mb-4">
              {renderStars(ratingScore, true, setRatingScore)}
            </div>
            <textarea
              placeholder="Comentario (opcional)"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#2b5bee]/50 text-slate-900 dark:text-white"
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddRating}
                className="px-4 py-2 bg-[#2b5bee] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && selectedNetwork && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Agregar Post - {selectedNetwork.accountName}</h3>
            <input
              type="text"
              placeholder="Título del post"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2b5bee]/50 text-slate-900 dark:text-white"
            />
            <input
              type="url"
              placeholder="URL del post"
              value={newPost.url}
              onChange={(e) => setNewPost({ ...newPost, url: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2b5bee]/50 text-slate-900 dark:text-white"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2b5bee]/50 text-slate-900 dark:text-white"
              rows={2}
            />
            <input
              type="date"
              value={newPost.publishedAt}
              onChange={(e) => setNewPost({ ...newPost, publishedAt: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#2b5bee]/50 text-slate-900 dark:text-white"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowPostModal(false)
                  setSelectedNetwork(null)
                }}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPost}
                className="px-4 py-2 bg-[#2b5bee] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
