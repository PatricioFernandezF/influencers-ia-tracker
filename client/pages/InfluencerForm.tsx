import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Youtube, Twitter, FileText } from 'lucide-react'
import { api } from '../api'
import { Platform } from '../types'

interface SocialNetworkInput {
  id?: number
  platform: Platform
  accountName: string
  url: string
  description: string
}

const platformIcons: Record<Platform, JSX.Element> = {
  YOUTUBE: <Youtube className="w-5 h-5 text-red-500" />,
  TWITTER: <Twitter className="w-5 h-5 text-blue-400" />,
  BLOG: <FileText className="w-5 h-5 text-green-500" />
}

export default function InfluencerForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkInput[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEditing) {
      loadInfluencer()
    }
  }, [id])

  const loadInfluencer = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await api.getInfluencer(parseInt(id))
      setName(data.name)
      setDescription(data.description || '')
      setImageUrl(data.imageUrl || '')
      setIsActive(data.isActive)
      setSocialNetworks(data.socialNetworks.map((sn: any) => ({
        id: sn.id,
        platform: sn.platform,
        accountName: sn.accountName,
        url: sn.url,
        description: sn.description || ''
      })))
    } catch (error) {
      console.error('Error loading influencer:', error)
    }
    setLoading(false)
  }

  const addSocialNetwork = (platform: Platform) => {
    setSocialNetworks([...socialNetworks, {
      platform,
      accountName: '',
      url: '',
      description: ''
    }])
  }

  const updateSocialNetwork = (index: number, field: keyof SocialNetworkInput, value: string) => {
    const updated = [...socialNetworks]
    updated[index] = { ...updated[index], [field]: value }
    setSocialNetworks(updated)
  }

  const removeSocialNetwork = async (index: number) => {
    const sn = socialNetworks[index]
    if (sn.id && isEditing) {
      try {
        await api.deleteSocialNetwork(sn.id)
      } catch (error) {
        console.error('Error deleting social network:', error)
        return
      }
    }
    setSocialNetworks(socialNetworks.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    try {
      if (isEditing && id) {
        await api.updateInfluencer(parseInt(id), {
          name,
          description,
          imageUrl,
          isActive
        })
        
        for (const sn of socialNetworks) {
          if (sn.id) {
            await api.updateSocialNetwork(sn.id, {
              platform: sn.platform,
              accountName: sn.accountName,
              url: sn.url,
              description: sn.description
            })
          } else {
            await api.addSocialNetwork(parseInt(id), {
              platform: sn.platform,
              accountName: sn.accountName,
              url: sn.url,
              description: sn.description
            })
          }
        }
        navigate(`/influencer/${id}`)
      } else {
        const newInfluencer = await api.createInfluencer({
          name,
          description,
          imageUrl,
          isActive,
          socialNetworks: socialNetworks.map(sn => ({
            platform: sn.platform,
            accountName: sn.accountName,
            url: sn.url,
            description: sn.description
          }))
        })
        navigate(`/influencer/${newInfluencer.id}`)
      }
    } catch (error) {
      console.error('Error saving influencer:', error)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to={isEditing ? `/influencer/${id}` : '/'} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Link>
        </div>

        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            {isEditing ? 'Editar Influencer' : 'Nuevo Influencer'}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="Nombre del influencer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                  rows={3}
                  placeholder="Descripción del influencer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL de imagen</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
                <span className="text-sm">Activo</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-4">Redes Sociales</label>
                
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => addSocialNetwork('YOUTUBE')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => addSocialNetwork('TWITTER')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </button>
                  <button
                    type="button"
                    onClick={() => addSocialNetwork('BLOG')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Blog
                  </button>
                </div>

                <div className="space-y-4">
                  {socialNetworks.map((sn, index) => (
                    <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {platformIcons[sn.platform]}
                          <span className="font-medium">{sn.platform}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSocialNetwork(index)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={sn.accountName}
                          onChange={(e) => updateSocialNetwork(index, 'accountName', e.target.value)}
                          className="p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                          placeholder="Nombre de cuenta"
                        />
                        <input
                          type="url"
                          value={sn.url}
                          onChange={(e) => updateSocialNetwork(index, 'url', e.target.value)}
                          className="p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                          placeholder="URL"
                        />
                      </div>
                      <input
                        type="text"
                        value={sn.description}
                        onChange={(e) => updateSocialNetwork(index, 'description', e.target.value)}
                        className="w-full mt-3 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                        placeholder="Descripción (opcional)"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Link
                to={isEditing ? `/influencer/${id}` : '/'}
                className="flex-1 py-3 bg-gray-700 text-center rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
