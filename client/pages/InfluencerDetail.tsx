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

        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-5xl font-bold overflow-hidden flex-shrink-0">
              {influencer.imageUrl ? (
                <img src={influencer.imageUrl} alt={influencer.name} className="w-full h-full object-cover" />
              ) : (
                influencer.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{influencer.name}</h1>
                  <p className="text-gray-400 mb-4">{influencer.description || 'Sin descripción'}</p>
                </div>
                {!influencer.isActive && (
                  <span className="px-3 py-1 bg-gray-700 rounded-lg text-sm">Inactivo</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(influencer.averageRating)}
                  <span className="text-lg ml-2">{influencer.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({influencer.ratings.length} valoraciones)</span>
                </div>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
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
              className={`border rounded-xl p-6 ${platformColors[sn.platform]}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {platformIcons[sn.platform]}
                  <span className="font-semibold">{sn.platform}</span>
                </div>
                <a
                  href={sn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="font-medium mb-1">{sn.accountName}</p>
              {sn.description && <p className="text-sm opacity-80">{sn.description}</p>}
              <button
                onClick={() => {
                  setSelectedNetwork(sn)
                  setShowPostModal(true)
                }}
                className="mt-4 flex items-center gap-1 text-sm opacity-80 hover:opacity-100 transition-opacity"
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
                    className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{post.title}</h3>
                      <span className={`p-1 rounded ${platformColors[sn.platform]}`}>
                        {platformIcons[sn.platform]}
                      </span>
                    </div>
                    {post.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{post.description}</p>
                    )}
                    <p className="text-xs text-gray-500">{formatDate(post.publishedAt)}</p>
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
