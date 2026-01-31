import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

// Tweets extraídos manualmente de @javilop
const tweets = [
  {
    title: "Magnific en la gran pantalla - Here Movie",
    content: "⚡ Magnific en la gran pantalla.\n\n¡POR FIN PUEDO HABLAR DE ESTO!\n\nEl equipo de VFX de Here (dir. Robert Zemeckis y protagonizada por Robin Wright y Tom Hanks) ha usado Magnific para sus FX 🤯\n\nPara contaros todo (y más), he entrevistado al supervisor de VFX Kevin Baillie 🧵 👇",
    url: "https://x.com/javilop/status/1891903285470388521",
    publishedAt: "2025-02-18",
    engagement: { likes: 689, reposts: 135, replies: 68 }
  },
  {
    title: "IA hace montaje de vacaciones",
    content: "Le pasé los vídeos de mis vacaciones a una IA para que hiciera un montaje y creo que voy a tener pesadillas el resto de mi vida.",
    url: "https://x.com/javilop/status/1827080302172500161",
    publishedAt: "2024-08-23",
    engagement: { likes: 100270, reposts: 7338, replies: 1258 }
  }
];

async function main() {
  console.log('========================================');
  console.log('CARGANDO TWEETS DE JAVILOP');
  console.log('========================================\n');
  
  const influencerId = 5; // javilop
  
  // 1. Actualizar red social Twitter
  console.log('[1/2] Actualizando red social Twitter...');
  try {
    const influencerRes = await axios.get(`${API_URL}/influencers/${influencerId}`);
    const socialNetworks = influencerRes.data.socialNetworks;
    
    let socialNetworkId;
    if (socialNetworks && socialNetworks.length > 0) {
      socialNetworkId = socialNetworks[0].id;
      await axios.put(`${API_URL}/social-networks/${socialNetworkId}`, {
        url: "https://twitter.com/javilop",
        accountName: "@javilop"
      });
      console.log(`✓ Red social actualizada: ID ${socialNetworkId}`);
    } else {
      const socialRes = await axios.post(`${API_URL}/influencers/${influencerId}/social-networks`, {
        platform: "TWITTER",
        accountName: "@javilop",
        url: "https://twitter.com/javilop",
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
