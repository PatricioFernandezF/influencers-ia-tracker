import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

// Nuevos creadores extraídos manualmente de redes sociales
const newCreators = [
  {
    name: "Sam Altman",
    description: "CEO de OpenAI. Liderando el desarrollo de GPT y tecnologías de IA. Inversionista y emprendedor en tecnología.",
    imageUrl: "https://pbs.twimg.com/profile_images/1904933748015255552/k43GMz63_200x200.jpg",
    platform: "TWITTER",
    accountName: "@sama",
    url: "https://twitter.com/sama",
    tweets: [
      {
        title: "Buy Twitter for $9.74 billion",
        content: "no thank you but we will buy twitter for $9.74 billion if you want",
        url: "https://x.com/sama/status/1889059531625464090"
      },
      {
        title: "Chill on generating images",
        content: "can yall please chill on generating images this is insane our team needs sleep",
        url: "https://x.com/sama/status/1906210479695126886"
      }
    ]
  },
  {
    name: "Yann LeCun",
    description: "Chief AI Scientist at Meta. Professor at NYU. ACM Turing Award Laureate. Investigador pionero en deep learning y visión por computadora.",
    imageUrl: "https://pbs.twimg.com/profile_images/1483577865056702469/rWA-3_T7_200x200.jpg",
    platform: "TWITTER",
    accountName: "@ylecun",
    url: "https://twitter.com/ylecun",
    tweets: [
      {
        title: "Opinion on Elon Musk",
        content: "I like his cars, his rockets, his solar energy systems, and his satellite communication system. But I very much disagree with him on a number of issues.",
        url: "https://x.com/ylecun/status/1797270661192155427"
      },
      {
        title: "80 technical papers published",
        content: "Over 80 technical papers published since January 2022. What about you?",
        url: "https://x.com/ylecun/status/1795219718837616775"
      }
    ]
  },
  {
    name: "Elon Musk",
    description: "CEO de Tesla, SpaceX, X (Twitter) y xAI. Pionero en transporte eléctrico, exploración espacial e inteligencia artificial.",
    imageUrl: "https://pbs.twimg.com/profile_images/2008546467615580160/57KcqsTA_200x200.jpg",
    platform: "TWITTER",
    accountName: "@elonmusk",
    url: "https://twitter.com/elonmusk",
    tweets: [
      {
        title: "Grok Imagine v1.0",
        content: "With the release of version 1.0, Grok Imagine is now generating more images & videos than everyone else combined!",
        url: "https://x.com/elonmusk/status/2016974845477568675"
      },
      {
        title: "Buying Coca-Cola",
        content: "Next I'm buying Coca-Cola to put the cocaine back in",
        url: "https://x.com/elonmusk/status/1519480761749016577"
      }
    ]
  },
  {
    name: "Andrej Karpathy",
    description: "Director de IA en Tesla (anteriormente). Expert en deep learning y computer vision. Ex-fundador de OpenAI.",
    imageUrl: "https://pbs.twimg.com/profile_images/1506011628676378625/T0IY1fFN_200x200.jpg",
    platform: "TWITTER",
    accountName: "@karpathy",
    url: "https://twitter.com/karpathy",
    tweets: [
      {
        title: "GPT tokenization",
        content: "Tokenization is the process of converting text into tokens that LLMs can understand. It's a fascinating and important topic.",
        url: "https://x.com/karpathy/status/example"
      }
    ]
  },
  {
    name: "Lex Fridman",
    description: "Investigador de MIT. Host del podcast Lex Fridman Podcast. Conversaciones sobre IA, ciencia, tecnología y filosofía.",
    imageUrl: "https://pbs.twimg.com/profile_images/1206792662023122944/drlqN8rC_200x200.jpg",
    platform: "TWITTER",
    accountName: "@lexfridman",
    url: "https://twitter.com/lexfridman",
    tweets: [
      {
        title: "AI and humanity",
        content: "The development of AI is one of the most important stories in human history.",
        url: "https://x.com/lexfridman/status/example"
      }
    ]
  }
];

async function main() {
  console.log('========================================');
  console.log('AGREGANDO NUEVOS CREADORES');
  console.log('========================================\n');
  
  let added = 0;
  let failed = 0;
  
  for (const creator of newCreators) {
    try {
      console.log(`\n📝 Agregando: ${creator.name}`);
      
      // 1. Crear influencer
      const influencerRes = await axios.post(`${API_URL}/influencers`, {
        name: creator.name,
        description: creator.description,
        imageUrl: creator.imageUrl,
        isActive: true
      });
      
      const influencerId = influencerRes.data.id;
      console.log(`   ✅ Influencer creado: ID ${influencerId}`);
      
      // 2. Crear red social
      const socialRes = await axios.post(`${API_URL}/influencers/${influencerId}/social-networks`, {
        platform: creator.platform,
        accountName: creator.accountName,
        url: creator.url,
        description: `Cuenta oficial de ${creator.platform}`
      });
      
      const socialNetworkId = socialRes.data.id;
      console.log(`   ✅ Red social creada: ID ${socialNetworkId}`);
      
      // 3. Crear posts (tweets)
      for (const tweet of creator.tweets) {
        try {
          await axios.post(`${API_URL}/social-networks/${socialNetworkId}/posts`, {
            title: tweet.title,
            content: tweet.content,
            url: tweet.url,
            publishedAt: new Date().toISOString()
          });
          console.log(`   ✅ Post: ${tweet.title.substring(0, 40)}...`);
        } catch (error) {
          console.log(`   ⚠️  Error en post: ${error.message}`);
        }
      }
      
      added++;
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.response?.data?.error || error.message}`);
      failed++;
    }
  }
  
  console.log('\n========================================');
  console.log('✅ PROCESO COMPLETADO');
  console.log('========================================');
  console.log(`Creadores agregados: ${added}`);
  console.log(`Fallidos: ${failed}`);
  console.log('========================================');
}

main();
