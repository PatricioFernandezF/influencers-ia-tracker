import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

// Tweets extraídos manualmente de @MoureDev
const tweets = [
  {
    title: "Regalo de Navidad - Cursos y Guías Gratis",
    content: "Este es mi pequeño regalo de Navidad! 🎁 Todos mis Cursos y Guías para aprender programación y desarrollo de software desde cero 100% Gratis. ✓ +110 horas en vídeo ✓ +600 lecciones ✓ +200 páginas en pdf ✓ +1100 fundamentos y comandos",
    url: "https://x.com/MoureDev/status/2003835762140139874",
    publishedAt: "2025-12-24",
    engagement: { likes: 2209, reposts: 386, replies: 42 }
  },
  {
    title: "WinRAR Camiseta",
    content: "Van a ganar más dinero con esta camiseta que con todas las licencias vendidas de WinRAR.",
    url: "https://x.com/MoureDev/status/1841531938961592740",
    publishedAt: "2024-10-02",
    engagement: { likes: 59081, reposts: 4310, replies: 79 }
  }
];

async function main() {
  console.log('========================================');
  console.log('CARGANDO TWEETS DE MOUREDEV');
  console.log('========================================\n');
  
  const influencerId = 2; // MoureDev
  
  // 1. Actualizar red social Twitter
  console.log('[1/2] Actualizando red social Twitter...');
  try {
    // Obtener redes sociales del influencer
    const influencerRes = await axios.get(`${API_URL}/influencers/${influencerId}`);
    const socialNetworks = influencerRes.data.socialNetworks;
    
    let socialNetworkId;
    if (socialNetworks && socialNetworks.length > 0) {
      socialNetworkId = socialNetworks[0].id;
      // Actualizar la URL
      await axios.put(`${API_URL}/social-networks/${socialNetworkId}`, {
        url: "https://twitter.com/MoureDev",
        accountName: "@MoureDev"
      });
      console.log(`✓ Red social actualizada: ID ${socialNetworkId}`);
    } else {
      // Crear nueva red social
      const socialRes = await axios.post(`${API_URL}/influencers/${influencerId}/social-networks`, {
        platform: "TWITTER",
        accountName: "@MoureDev",
        url: "https://twitter.com/MoureDev",
        description: "Cuenta oficial de Twitter/X"
      });
      socialNetworkId = socialRes.data.id;
      console.log(`✓ Red social creada: ID ${socialNetworkId}`);
    }
    
    // 2. Crear posts (tweets)
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
    console.log('========================================');
    console.log(`Influencer: MoureDev (ID: ${influencerId})`);
    console.log(`Social Network: Twitter @MoureDev (ID: ${socialNetworkId})`);
    console.log(`Tweets creados: ${count}`);
    console.log('========================================');
    
  } catch (error) {
    console.error('✗ Error:', error.response?.data?.error || error.message);
  }
}

main();
