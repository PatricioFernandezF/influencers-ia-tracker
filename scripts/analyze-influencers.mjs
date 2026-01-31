import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

async function analyzeInfluencers() {
  console.log('========================================');
  console.log('ANÁLISIS DE INFLUENCERS Y POSTS');
  console.log('========================================\n');
  
  try {
    const response = await axios.get(`${API_URL}/influencers`);
    const influencers = response.data;
    
    console.log(`Total influencers: ${influencers.length}\n`);
    
    // Analizar cada influencer
    const analysis = influencers.map(inf => {
      const totalPosts = inf.socialNetworks?.reduce((sum, sn) => sum + (sn.posts?.length || 0), 0) || 0;
      const networks = inf.socialNetworks?.length || 0;
      
      return {
        id: inf.id,
        name: inf.name,
        totalPosts,
        networks,
        socialNetworks: inf.socialNetworks || []
      };
    });
    
    // Ordenar por número de posts
    analysis.sort((a, b) => b.totalPosts - a.totalPosts);
    
    console.log('Ranking de influencers por actividad:');
    console.log('------------------------------------');
    analysis.forEach((inf, index) => {
      console.log(`${index + 1}. ${inf.name}`);
      console.log(`   Posts: ${inf.totalPosts} | Redes: ${inf.networks}`);
      inf.socialNetworks.forEach(sn => {
        console.log(`   - ${sn.platform}: ${sn.posts?.length || 0} posts`);
      });
      console.log('');
    });
    
    // Top influencers para la newsletter
    const topInfluencers = analysis.filter(inf => inf.totalPosts > 0);
    
    console.log('========================================');
    console.log('TOP INFLUENCERS PARA NEWSLETTER');
    console.log('========================================');
    topInfluencers.forEach((inf, index) => {
      console.log(`${index + 1}. ${inf.name} (${inf.totalPosts} posts)`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyzeInfluencers();
