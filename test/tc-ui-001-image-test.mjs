import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

async function testImages() {
  console.log('========================================');
  console.log('PRUEBA TC-UI-001: Imágenes de Influencers');
  console.log('========================================\n');
  
  try {
    // 1. Obtener influencers
    console.log('[PASO 1] Obteniendo influencers...');
    const response = await axios.get(`${API_URL}/influencers`);
    const influencers = response.data;
    console.log(`✓ ${influencers.length} influencers encontrados\n`);
    
    // 2. Verificar cada imagen
    console.log('[PASO 2] Verificando URLs de imágenes...\n');
    let passed = 0;
    let failed = 0;
    
    for (const influencer of influencers) {
      const name = influencer.name;
      const imageUrl = influencer.imageUrl;
      
      if (!imageUrl) {
        console.log(`⚠️  ${name}: No tiene imageUrl`);
        failed++;
        continue;
      }
      
      console.log(`🔍 ${name}:`);
      console.log(`   URL: ${imageUrl.substring(0, 70)}...`);
      
      try {
        // Verificar si la imagen es accesible con HEAD request
        const imageResponse = await axios.head(imageUrl, { 
          timeout: 10000,
          validateStatus: () => true // No lanzar error en status 4xx/5xx
        });
        
        if (imageResponse.status === 200) {
          console.log(`   ✅ Accesible (200 OK)`);
          passed++;
        } else {
          console.log(`   ❌ Error ${imageResponse.status}`);
          failed++;
        }
      } catch (error) {
        // Si es 405 (Method Not Allowed), intentar con GET
        if (error.response?.status === 405) {
          try {
            const getResponse = await axios.get(imageUrl, { 
              timeout: 10000,
              validateStatus: () => true
            });
            
            if (getResponse.status === 200) {
              console.log(`   ✅ Accesible (200 OK via GET)`);
              passed++;
            } else {
              console.log(`   ❌ Error ${getResponse.status}`);
              failed++;
            }
          } catch (getError) {
            console.log(`   ❌ Error: ${getError.message}`);
            failed++;
          }
        } else {
          console.log(`   ❌ Error: ${error.message}`);
          failed++;
        }
      }
    }
    
    // 3. Resultado
    console.log('\n========================================');
    console.log('RESULTADO DE LA PRUEBA');
    console.log('========================================');
    console.log(`Total influencers: ${influencers.length}`);
    console.log(`Imágenes accesibles: ${passed}`);
    console.log(`Imágenes con error: ${failed}`);
    console.log('');
    
    if (failed > 0) {
      console.log('❌ PRUEBA FALLIDA');
      console.log('Las imágenes de los influencers no se visualizan correctamente.');
      process.exit(1);
    } else {
      console.log('✅ PRUEBA PASADA');
      console.log('Todas las imágenes son accesibles.');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('Error en la prueba:', error.message);
    process.exit(1);
  }
}

testImages();
