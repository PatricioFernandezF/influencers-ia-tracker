import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all influencers with optional filter by platform
app.get('/api/influencers', async (req, res) => {
  try {
    const { platform, search } = req.query;
    
    const where: any = {};
    
    if (platform) {
      where.socialNetworks = {
        some: {
          platform: platform as string
        }
      };
    }
    
    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive'
      };
    }
    
    const influencers = await prisma.influencer.findMany({
      where,
      include: {
        socialNetworks: {
          include: {
            posts: {
              orderBy: { publishedAt: 'desc' },
              take: 1
            }
          }
        },
        ratings: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const result = influencers.map(inf => ({
      ...inf,
      averageRating: inf.ratings.length > 0 
        ? inf.ratings.reduce((acc, r) => acc + r.score, 0) / inf.ratings.length 
        : 0,
      latestPost: inf.socialNetworks.flatMap(sn => sn.posts)[0] || null
    }));
    
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching influencers' });
  }
});

// GET single influencer
app.get('/api/influencers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const influencer = await prisma.influencer.findUnique({
      where: { id: parseInt(id) },
      include: {
        socialNetworks: {
          include: {
            posts: {
              orderBy: { publishedAt: 'desc' }
            }
          }
        },
        ratings: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }
    
    const averageRating = influencer.ratings.length > 0 
      ? influencer.ratings.reduce((acc, r) => acc + r.score, 0) / influencer.ratings.length 
      : 0;
    
    res.json({ ...influencer, averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching influencer' });
  }
});

// CREATE influencer
app.post('/api/influencers', async (req, res) => {
  try {
    const { name, description, imageUrl, isActive, socialNetworks } = req.body;
    
    const influencer = await prisma.influencer.create({
      data: {
        name,
        description,
        imageUrl,
        isActive: isActive ?? true,
        socialNetworks: socialNetworks ? {
          create: socialNetworks.map((sn: any) => ({
            platform: sn.platform,
            accountName: sn.accountName,
            url: sn.url,
            description: sn.description
          }))
        } : undefined
      },
      include: {
        socialNetworks: true
      }
    });
    
    res.status(201).json(influencer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating influencer' });
  }
});

// UPDATE influencer
app.put('/api/influencers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isActive } = req.body;
    
    const influencer = await prisma.influencer.update({
      where: { id: parseInt(id) },
      data: { name, description, imageUrl, isActive },
      include: {
        socialNetworks: true,
        ratings: true
      }
    });
    
    res.json(influencer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating influencer' });
  }
});

// DELETE influencer
app.delete('/api/influencers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.influencer.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Influencer deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting influencer' });
  }
});

// ADD social network to influencer
app.post('/api/influencers/:id/social-networks', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, accountName, url, description } = req.body;
    
    const socialNetwork = await prisma.socialNetwork.create({
      data: {
        platform,
        accountName,
        url,
        description,
        influencerId: parseInt(id)
      }
    });
    
    res.status(201).json(socialNetwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding social network' });
  }
});

// UPDATE social network
app.put('/api/social-networks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, accountName, url, description } = req.body;
    
    const socialNetwork = await prisma.socialNetwork.update({
      where: { id: parseInt(id) },
      data: { platform, accountName, url, description }
    });
    
    res.json(socialNetwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating social network' });
  }
});

// DELETE social network
app.delete('/api/social-networks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.socialNetwork.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Social network deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting social network' });
  }
});

// ADD post to social network
app.post('/api/social-networks/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description, publishedAt } = req.body;
    
    const post = await prisma.post.create({
      data: {
        title,
        url,
        description,
        publishedAt: new Date(publishedAt),
        socialNetworkId: parseInt(id)
      }
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding post' });
  }
});

// DELETE post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// ADD rating to influencer
app.post('/api/influencers/:id/ratings', async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;
    
    if (score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }
    
    const rating = await prisma.rating.create({
      data: {
        score,
        comment,
        influencerId: parseInt(id)
      }
    });
    
    res.status(201).json(rating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding rating' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
