import axios from 'axios';

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

// Imágenes extraídas manualmente de las redes sociales
const influencerImages = [
  {
    id: 2, // MoureDev
    name: "MoureDev",
    imageUrl: "https://pbs.twimg.com/profile_images/1894626661674434560/OnX1WQyM_200x200.jpg",
    source: "Twitter @MoureDev"
  },
  {
    id: 3, // DotCSV (Twitter version)
    name: "DotCSV",
    imageUrl: "https://pbs.twimg.com/profile_images/1356184155881672705/giFRkA6Z_200x200.jpg",
    source: "Twitter @DotCSV"
  },
  {
    id: 4, // midudev
    name: "midudev",
    imageUrl: "https://pbs.twimg.com/profile_images/1824773087323111424/-S3LUmjQ_200x200.jpg",
    source: "Twitter @midudev"
  },
  {
    id: 5, // javilop
    name: "javilop",
    imageUrl: "https://pbs.twimg.com/profile_images/1581679886267301888/BHGZpOc6_200x200.jpg",
    source: "Twitter @javilop"
  },
  {
    id: 6, // Xavier Mitjana
    name: "Xavier Mitjana",
    imageUrl: "https://pbs.twimg.com/profile_images/1813666485/motor-capri_200x200.jpg",
    source: "Twitter @XavierMitjana"
  },
  {
    id: 7, // Google DeepMind
    name: "Google DeepMind",
    imageUrl: "https://pbs.twimg.com/profile_images/1695024885070737408/-M-HSH5P_200x200.jpg",
    source: "Twitter @GoogleDeepMind"
  },
  {
    id: 8, // DotCSV (YouTube version - mejor calidad)
    name: "DotCSV",
    imageUrl: "https://yt3.googleusercontent.com/pGhn-jSPAeZpYa4zHPsK2xEUR-Fj0Lkusox6-Gd9vB_7raytUgmyANw9JvUeZWdYxhk_qJ6Nsg=s176-c-k-c0x00ffffff-no-rj",
    source: "YouTube @DotCSV"
  }
];

async function main() {
  console.log('========================================');
  console.log('ACTUALIZANDO IMÁGENES DESDE REDES SOCIALES');
  console.log('========================================\n');
  
  let updated = 0;
  let failed = 0;
  
  for (const influencer of influencerImages) {
    try {
      console.log(`🔄 ${influencer.name} (${influencer.source})...`);
      
      await axios.put(`${API_URL}/influencers/${influencer.id}`, {
        imageUrl: influencer.imageUrl
      });
      
      console.log(`   ✅ Actualizado: ${influencer.imageUrl.substring(0, 60)}...`);
      updated++;
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.data?.error || error.message}`);
      failed++;
    }
  }
  
  console.log('\n========================================');
  console.log('✅ ACTUALIZACIÓN COMPLETADA');
  console.log('========================================');
  console.log(`Total: ${influencerImages.length}`);
  console.log(`Actualizados: ${updated}`);
  console.log(`Fallidos: ${failed}`);
  console.log('========================================');
}

main();
