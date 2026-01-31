import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

async function testRealImages() {
  console.log('========================================');
  console.log('PRUEBA TC-UI-002: Imágenes Reales de Redes Sociales');
  console.log('========================================\n');
  
  let passed = 0;
  let failed = 0;
  let twitterCount = 0;
  let youtubeCount = 0;
  
  try {
    // Paso 1: Obtener influencers
    console.log('[PASO 1] Obteniendo influencers del API...');
    const response = await axios.get(`${API_URL}/influencers`);
    const influencers = response.data;
    console.log(`✓ ${influencers.length} influencers encontrados\n`);
    
    // Paso 2: Verificar URLs son de redes sociales
    console.log('[PASO 2] Verificando URLs de redes sociales...\n');
    
    for (const influencer of influencers) {
      if (!influencer.imageUrl) {
        console.log(`⚠️  ${influencer.name}: Sin imageUrl`);
        failed++;
        continue;
      }
      
      const isTwitter = influencer.imageUrl.includes('pbs.twimg.com');
      const isYouTube = influencer.imageUrl.includes('yt3.googleusercontent.com');
      const isRealSocial = isTwitter || isYouTube;
      
      if (isTwitter) twitterCount++;
      if (isYouTube) youtubeCount++;
      
      const source = isTwitter ? 'Twitter/X' : (isYouTube ? 'YouTube' : 'Otro');
      console.log(`${isRealSocial ? '✅' : '❌'} ${influencer.name}: ${source}`);
      console.log(`   URL: ${influencer.imageUrl.substring(0, 70)}...`);
    }
    
    console.log(`\n📊 Resumen fuentes:`);
    console.log(`   Twitter/X: ${twitterCount}`);
    console.log(`   YouTube: ${youtubeCount}`);
    
    // Paso 3: Verificar accesibilidad
    console.log('\n[PASO 3] Verificando accesibilidad de imágenes...\n');
    
    for (const influencer of influencers) {
      if (!influencer.imageUrl) continue;
      
      try {
        const imageResponse = await axios.get(influencer.imageUrl, { 
          timeout: 10000,
          validateStatus: () => true,
          responseType: 'arraybuffer'
        });
        
        if (imageResponse.status === 200) {
          const size = imageResponse.data.length;
          console.log(`✅ ${influencer.name}: ${(size/1024).toFixed(1)} KB`);
          passed++;
        } else {
          console.log(`❌ ${influencer.name}: Error ${imageResponse.status}`);
          failed++;
        }
      } catch (error) {
        console.log(`❌ ${influencer.name}: ${error.message}`);
        failed++;
      }
    }
    
    // Resultado
    console.log('\n========================================');
    console.log('RESULTADO DE LA PRUEBA TC-UI-002');
    console.log('========================================');
    console.log(`Total influencers: ${influencers.length}`);
    console.log(`Imágenes reales (Twitter/YouTube): ${twitterCount + youtubeCount}`);
    console.log(`Imágenes accesibles: ${passed}`);
    console.log(`Imágenes con error: ${failed}`);
    console.log('');
    
    const allReal = (twitterCount + youtubeCount) === influencers.length;
    const allAccessible = passed === influencers.length;
    
    if (allReal && allAccessible) {
      console.log('✅ PRUEBA PASADA');
      console.log('Todas las imágenes son reales de redes sociales y accesibles.');
      process.exit(0);
    } else {
      console.log('❌ PRUEBA FALLIDA');
      if (!allReal) console.log('Algunas imágenes no son de redes sociales.');
      if (!allAccessible) console.log('Algunas imágenes no son accesibles.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error en la prueba:', error.message);
    process.exit(1);
  }
}

testRealImages();
