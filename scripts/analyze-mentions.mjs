import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

async function analyzePostContent() {
  console.log('========================================');
  console.log('ANÁLISIS DE MENCIONES EN POSTS');
  console.log('========================================\n');
  
  try {
    // Obtener todos los influencers y sus posts
    const response = await axios.get(`${API_URL}/influencers`);
    const influencers = response.data;
    
    // Recolectar todos los posts
    const allPosts = [];
    influencers.forEach(inf => {
      inf.socialNetworks?.forEach(sn => {
        sn.posts?.forEach(post => {
          allPosts.push({
            influencerName: inf.name,
            postTitle: post.title,
            postContent: post.content || post.description || '',
            platform: sn.platform
          });
        });
      });
    });
    
    console.log(`Total posts analizados: ${allPosts.length}\n`);
    
    // Contar menciones de cada influencer en los posts de otros
    const mentions = {};
    
    influencers.forEach(inf => {
      mentions[inf.name] = {
        count: 0,
        mentionedBy: [],
        posts: []
      };
    });
    
    // Buscar menciones
    allPosts.forEach(post => {
      influencers.forEach(inf => {
        if (inf.name !== post.influencerName) {
          const searchName = inf.name.toLowerCase();
          const searchInTitle = post.postTitle.toLowerCase().includes(searchName);
          const searchInContent = post.postContent.toLowerCase().includes(searchName);
          
          if (searchInTitle || searchInContent) {
            mentions[inf.name].count++;
            mentions[inf.name].mentionedBy.push(post.influencerName);
            mentions[inf.name].posts.push({
              by: post.influencerName,
              title: post.postTitle,
              platform: post.platform
            });
          }
        }
      });
    });
    
    // Ordenar por menciones
    const sortedMentions = Object.entries(mentions)
      .filter(([_, data]) => data.count > 0)
      .sort((a, b) => b[1].count - a[1].count);
    
    console.log('========================================');
    console.log('INFLUENCERS MÁS MENCIONADOS EN POSTS');
    console.log('========================================\n');
    
    sortedMentions.forEach(([name, data], index) => {
      console.log(`${index + 1}. ${name}`);
      console.log(`   Menciones: ${data.count}`);
      console.log(`   Mencionado por: ${[...new Set(data.mentionedBy)].join(', ')}`);
      console.log('   Posts donde aparece:');
      data.posts.forEach(post => {
        console.log(`     - "${post.title.substring(0, 60)}..." (por ${post.by} en ${post.platform})`);
      });
      console.log('');
    });
    
    // Si no hay menciones, mostrar ranking por posts propios
    if (sortedMentions.length === 0) {
      console.log('No se encontraron menciones entre influencers.\n');
      console.log('========================================');
      console.log('RANKING POR POSTS PROPIOS');
      console.log('========================================\n');
      
      const ranking = influencers
        .map(inf => ({
          name: inf.name,
          posts: inf.socialNetworks?.reduce((sum, sn) => sum + (sn.posts?.length || 0), 0) || 0,
          networks: inf.socialNetworks?.length || 0
        }))
        .sort((a, b) => b.posts - a.posts);
      
      ranking.forEach((inf, index) => {
        if (inf.posts > 0) {
          console.log(`${index + 1}. ${inf.name} - ${inf.posts} posts (${inf.networks} redes)`);
        }
      });
    }
    
    // Resumen final
    console.log('========================================');
    console.log('RESUMEN PARA NEWSLETTER');
    console.log('========================================');
    console.log('Influencers a destacar:\n');
    
    // Top 5
    const top5 = sortedMentions.length > 0 
      ? sortedMentions.slice(0, 5).map(([name]) => name)
      : influencers
          .sort((a, b) => {
            const postsA = a.socialNetworks?.reduce((sum, sn) => sum + (sn.posts?.length || 0), 0) || 0;
            const postsB = b.socialNetworks?.reduce((sum, sn) => sum + (sn.posts?.length || 0), 0) || 0;
            return postsB - postsA;
          })
          .slice(0, 5)
          .map(inf => inf.name);
    
    top5.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyzePostContent();
