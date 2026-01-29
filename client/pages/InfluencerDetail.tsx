import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Youtube, Twitter, FileText, Star, Plus, ExternalLink } from 'lucide-react'
import { api } from '../api'
import { Influencer, Platform, SocialNetwork } from '../types'

const platformIcons: Record<Platform, JSX.Element> = {
  YOUTUBE: <Youtube className="w-5 h-5" />,
  TWITTER: <Twitter className="w-5 h-5" />,
  BLOG: <FileText className="w-5 h-5" />
}

const platformColors: Record<Platform, string> = {
  YOUTUBE: 'bg-red-500/20 text-red-400 border-red-500',
  TWITTER: 'bg-blue-500/20 text-blue-400 border-blue-500',
  BLOG: 'bg-green-500/20 text-green-400 border-green-500'
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
  const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')

  useEffect(() => {
    loadInfluencer()
  }, [id])

  useEffect(() => {
    if (influencer?.imageUrl) {
      setImageStatus('loading')
    } else {
      setImageStatus('error')
    }
  }, [influencer?.imageUrl])

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
      <Star
        key={i}
        onClick={() => interactive && onSelect && onSelect(i + 1)}
        className={`w-6 h-6 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
          i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
        }`}
      />
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!influencer) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-gray-400 text-lg mb-4">Influencer no encontrado</p>
        <Link to="/" className="text-purple-400 hover:text-purple-300">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Link>
          <div className="flex gap-2">
            <Link
              to={`/influencer/${influencer.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-[#1f2937]/90 via-[#111827]/80 to-[#0f172a]/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="relative w-40 flex-shrink-0">
              <div className="relative h-40 w-40 rounded-full bg-gradient-to-br from-[#2b5bee] to-[#7c3aed] shadow-xl overflow-hidden border-4 border-white/30 flex items-center justify-center">
                {influencer.imageUrl && (
                  <img
                    src={influencer.imageUrl}
                    alt={influencer.name}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
                      imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageStatus('loaded')}
                    onError={() => setImageStatus('error')}
                    loading="lazy"
                  />
                )}
                {imageStatus === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/40 border-t-white"></div>
                  </div>
                )}
                {(imageStatus === 'error' || !influencer.imageUrl) && (
                  <span className="text-4xl font-bold text-white">
                    {influencer.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white">{influencer.name}</h1>
                  <p className="mt-2 text-sm text-slate-300 lg:w-3/4">{influencer.description || 'Sin descripción'}</p>
                </div>
                {!influencer.isActive && (
                  <span className="rounded-full border border-rose-500/60 bg-rose-500/10 px-4 py-1 text-sm font-semibold text-rose-300">
                    Inactivo
                  </span>
                )}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(influencer.averageRating)}
                  <div>
                    <p className="text-lg font-semibold text-white">{influencer.averageRating.toFixed(1)}</p>
                    <p className="text-xs uppercase tracking-widest text-slate-300">
                      {influencer.ratings.length} valoraciones
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="rounded-full border border-yellow-400/60 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-500/20"
                >
                  Valorar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {influencer.socialNetworks.map((sn) => (
            <div
              key={sn.id}
              className={`group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 ${platformColors[sn.platform]}`}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-20">
                <div className="h-full w-full bg-gradient-to-br from-white to-transparent opacity-20"></div>
              </div>
              <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                  <span className="text-white/80">{platformIcons[sn.platform]}</span>
                  <span>{sn.platform}</span>
                </div>
                <a
                  href={sn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 rounded-full border border-white/30 bg-white/5 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:border-white hover:text-white"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="relative z-10 text-base font-semibold text-white">{sn.accountName}</p>
              {sn.description && (
                <p className="relative z-10 mt-2 text-sm text-slate-300 leading-relaxed">{sn.description}</p>
              )}
              <button
                onClick={() => {
                  setSelectedNetwork(sn)
                  setShowPostModal(true)
                }}
                className="relative z-10 mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2b5bee] transition hover:text-white"
              >
                <Plus className="w-4 h-4" />
                Agregar post
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Últimos Posts</h2>
          {influencer.socialNetworks.flatMap(sn => sn.posts).length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay posts registrados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {influencer.socialNetworks.flatMap(sn =>
                sn.posts.map(post => (
                  <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 transition hover:-translate-y-0.5 hover:border-[#2b5bee]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base font-semibold text-white">{post.title}</h3>
                      <span className="rounded-full border border-white/30 bg-white/5 p-1 text-xs text-white/70">
                        {platformIcons[sn.platform]}
                      </span>
                    </div>
                    {post.description && (
                      <p className="text-sm text-slate-300 mb-3 line-clamp-2">{post.description}</p>
                    )}
                    <div className="mt-auto flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
                      <span className="material-symbols-outlined text-[12px] text-slate-400">schedule</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </a>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Valorar Influencer</h3>
            <div className="flex justify-center gap-2 mb-4">
              {renderStars(ratingScore, true, setRatingScore)}
            </div>
            <textarea
              placeholder="Comentario (opcional)"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-purple-500"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddRating}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showPostModal && selectedNetwork && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Agregar Post - {selectedNetwork.accountName}</h3>
            <input
              type="text"
              placeholder="Título del post"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-3 focus:outline-none focus:border-purple-500"
            />
            <input
              type="url"
              placeholder="URL del post"
              value={newPost.url}
              onChange={(e) => setNewPost({ ...newPost, url: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-3 focus:outline-none focus:border-purple-500"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-3 focus:outline-none focus:border-purple-500"
              rows={2}
            />
            <input
              type="date"
              value={newPost.publishedAt}
              onChange={(e) => setNewPost({ ...newPost, publishedAt: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-purple-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowPostModal(false)
                  setSelectedNetwork(null)
                }}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPost}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
