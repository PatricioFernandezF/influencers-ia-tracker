export type Platform = 'YOUTUBE' | 'TWITTER' | 'BLOG'

export interface Post {
  id: number
  title: string
  url: string
  description?: string
  publishedAt: string
  socialNetworkId: number
}

export interface SocialNetwork {
  id: number
  platform: Platform
  accountName: string
  url: string
  description?: string
  influencerId: number
  posts: Post[]
}

export interface Rating {
  id: number
  score: number
  comment?: string
  createdAt: string
  influencerId: number
}

export interface Influencer {
  id: number
  name: string
  description?: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  socialNetworks: SocialNetwork[]
  ratings: Rating[]
  averageRating: number
  latestPost?: Post
}
