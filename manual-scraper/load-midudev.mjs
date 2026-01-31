import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

// Tweets extraídos manualmente de @midudev
const tweets = [
  {
    title: "Regalo de Navidad - Cursos Gratis",
    content: "Felices fiestas. Mi regalo de Navidad para ti.\n\nTodos mis Cursos de Programación gratis:\n\nJavaScript → midu.link/js\nPython → midu.link/python\nReact → midu.link/react\nAstro → midu.link/astro\nNode → midu.link/node",
    url: "https://x.com/midudev/status/2003838639655039128",
    publishedAt: "2025-12-24",
    engagement: { likes: 3666, reposts: 519, replies: 55 }
  },
  {
    title: "12 Juegos para aprender Programación",
    content: "Aprender a PROGRAMAR NO TIENE que ser ABURRIDO.\n\n¡Te comparto 12 JUEGOS GRATUITOS para que mejores en Desarrollo Web a tu ritmo!\n\n[ H I L O ] ⇩",
    url: "https://x.com/midudev/status/1547952848322719744",
    publishedAt: "2022-07-15",
    engagement: { likes: 52750, reposts: 11885, replies: 533 }
  },
  {
    title: "7 Trucos para dejar de Procrastinar",
    content: "¿Quieres dejar de PROCRASTINAR?\n\nAquí te dejo 7 TRUCOS que a mi me funcionan y pueden ayudarte:",
    url: "https://x.com/midudev/status/1575866563311321089",
    publishedAt: "2022-09-30",
    engagement: { likes: 51421, reposts: 11260, replies: 668 }
  }
];

async function main() {
  console.log('========================================');
  console.log('CARGANDO TWEETS DE MIDUDEV');
  console.log('========================================\n');
  
  const influencerId = 4; // midudev
  
  // 1. Actualizar red social Twitter
  console.log('[1/2] Actualizando red social Twitter...');
  try {
    const influencerRes = await axios.get(`${API_URL}/influencers/${influencerId}`);
    const socialNetworks = influencerRes.data.socialNetworks;
    
    let socialNetworkId;
    if (socialNetworks && socialNetworks.length > 0) {
      socialNetworkId = socialNetworks[0].id;
      await axios.put(`${API_URL}/social-networks/${socialNetworkId}`, {
        url: "https://twitter.com/midudev",
        accountName: "@midudev"
      });
      console.log(`✓ Red social actualizada: ID ${socialNetworkId}`);
    } else {
      const socialRes = await axios.post(`${API_URL}/influencers/${influencerId}/social-networks`, {
        platform: "TWITTER",
        accountName: "@midudev",
        url: "https://twitter.com/midudev",
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
