import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

// Tweets extraídos manualmente de @GoogleDeepMind
const tweets = [
  {
    title: "Project Genie - Virtual Worlds",
    content: "Step inside Project Genie: our experimental research prototype that lets you create, edit, and explore virtual worlds. 🌎",
    url: "https://x.com/GoogleDeepMind/status/2016919756440240479",
    publishedAt: "2025-01-29",
    engagement: { likes: 33726, reposts: 6920, replies: 921 }
  }
];

async function main() {
  console.log('========================================');
  console.log('CARGANDO TWEETS DE GOOGLE DEEPMIND');
  console.log('========================================\n');
  
  const influencerId = 7; // Google DeepMind
  
  // 1. Actualizar red social Twitter
  console.log('[1/2] Actualizando red social Twitter...');
  try {
    const influencerRes = await axios.get(`${API_URL}/influencers/${influencerId}`);
    const socialNetworks = influencerRes.data.socialNetworks;
    
    let socialNetworkId;
    if (socialNetworks && socialNetworks.length > 0) {
      socialNetworkId = socialNetworks[0].id;
      await axios.put(`${API_URL}/social-networks/${socialNetworkId}`, {
        url: "https://twitter.com/GoogleDeepMind",
        accountName: "@GoogleDeepMind"
      });
      console.log(`✓ Red social actualizada: ID ${socialNetworkId}`);
    } else {
      const socialRes = await axios.post(`${API_URL}/influencers/${influencerId}/social-networks`, {
        platform: "TWITTER",
        accountName: "@GoogleDeepMind",
        url: "https://twitter.com/GoogleDeepMind",
        description: "Cuenta oficial de Twitter/X"
      });
      socialNetworkId = socialRes.data.id;
      console.log(`✓ Red social creada: ID ${socialNetworkId}`);
    }
    
    // 2. Crear posts
    console.log('\n[2/2] Creando tweets...');
    let count = 0;
    for (const tweet of tweets) {
      try {
        await axios.post(`${API_URL}/social-networks/${socialNetworkId}/posts`, {
          title: tweet.title,
          content: tweet.content,
          url: tweet.url,
          description: `❤️ ${tweet.engagement.likes.toLocaleString()} likes • 🔄 ${tweet.engagement.reposts.toLocaleString()} reposts • 💬 ${tweet.engagement.replies} replies`,
          publishedAt: new Date(tweet.publishedAt).toISOString()
        });
        count++;
        console.log(`  ✓ ${count}. ${tweet.title.substring(0, 50)}...`);
      } catch (error) {
        console.error(`  ✗ Error: ${error.response?.data?.error || error.message}`);
      }
    }
    
    console.log('\n========================================');
    console.log('✓ CARGA COMPLETADA');
    console.log(`Tweets creados: ${count}`);
    console.log('========================================');
    
  } catch (error) {
    console.error('✗ Error:', error.response?.data?.error || error.message);
  }
}

main();
