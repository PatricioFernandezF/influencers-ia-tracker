import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

// Tweets extraídos manualmente de @DotCSV
const tweets = [
  {
    title: "Microsoft Copilot IA",
    content: "🔴 MADRE MÍA CON MICROSOFT\n\nHan puesto IA en el Word, PowerPoint, Excel, Outlook y hasta en la tostadora. Tremendo evento se han marcado y vaya demostración de un futuro que parecía que no llegaba y ya está aquí\n\n¿Qué os parece este nuevo COPILOT? 😄",
    url: "https://x.com/DotCSV/status/1636403510639042562",
    publishedAt: "2023-03-16",
    engagement: { likes: 8874, reposts: 2257, replies: 165 }
  },
  {
    title: "La Sexta y edición de vídeo",
    content: "Hola La Sexta, acabo de terminar de grabar un metraje de dos horas para mi próximo vídeo. ¿Os lo mando para que me lo editéis? No cuento con presupuesto para hacer este tipo de trabajos pero jajaj lol.\n\nLuego harán el reportaje y dirán que la IA devalúa el trabajo y tal.",
    url: "https://x.com/DotCSV/status/1624476821835157514",
    publishedAt: "2023-02-11",
    engagement: { likes: 7913, reposts: 1241, replies: 146 }
  }
];

async function main() {
  console.log('========================================');
  console.log('CARGANDO TWEETS DE DOTCSV');
  console.log('========================================\n');
  
  const influencerId = 3; // DotCSV (ID del Twitter, no del YouTube)
  
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
        url: "https://twitter.com/DotCSV",
        accountName: "@DotCSV"
      });
      console.log(`✓ Red social actualizada: ID ${socialNetworkId}`);
    } else {
      // Crear nueva red social
      const socialRes = await axios.post(`${API_URL}/influencers/${influencerId}/social-networks`, {
        platform: "TWITTER",
        accountName: "@DotCSV",
        url: "https://twitter.com/DotCSV",
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
    console.log(`Influencer: DotCSV (ID: ${influencerId})`);
    console.log(`Social Network: Twitter @DotCSV (ID: ${socialNetworkId})`);
    console.log(`Tweets creados: ${count}`);
    console.log('========================================');
    
  } catch (error) {
    console.error('✗ Error:', error.response?.data?.error || error.message);
  }
}

main();
