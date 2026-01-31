import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://kg408swo8wkk8g8k0oos44ow.37.60.236.102.sslip.io/api';

// Colores predefinidos para cada influencer (gradientes)
const colorSchemes = [
  ['#FF6B6B', '#4ECDC4'],   // Rojo-Cyan
  ['#667eea', '#764ba2'],   // Morado
  ['#f093fb', '#f5576c'],   // Rosa
  ['#4facfe', '#00f2fe'],   // Azul
  ['#43e97b', '#38f9d7'],   // Verde
  ['#fa709a', '#fee140'],   // Naranja-Rosa
  ['#30cfd0', '#330867'],   // Turquesa-Morado
];

async function main() {
  console.log('========================================');
  console.log('ACTUALIZANDO IMÁGENES DE INFLUENCERS');
  console.log('========================================\n');
  
  try {
    // Obtener influencers
    console.log('[1/2] Obteniendo influencers...');
    const response = await axios.get(`${API_URL}/influencers`);
    const influencers = response.data;
    console.log(`✓ ${influencers.length} influencers encontrados\n`);
    
    // Actualizar cada influencer con avatar generado
    console.log('[2/2] Actualizando URLs de imágenes...\n');
    let updated = 0;
    
    for (let i = 0; i < influencers.length; i++) {
      const influencer = influencers[i];
      const colors = colorSchemes[i % colorSchemes.length];
      
      // Usar UI Avatars con fondo de gradiente
      const initials = influencer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(influencer.name)}&background=${colors[0].replace('#', '')}&color=fff&size=256&bold=true`;
      
      try {
        await axios.put(`${API_URL}/influencers/${influencer.id}`, {
          imageUrl: avatarUrl
        });
        console.log(`✅ ${influencer.name}: ${avatarUrl.substring(0, 60)}...`);
        updated++;
      } catch (error) {
        console.log(`❌ ${influencer.name}: Error actualizando`);
      }
    }
    
    console.log('\n========================================');
    console.log('✅ ACTUALIZACIÓN COMPLETADA');
    console.log('========================================');
    console.log(`Total: ${influencers.length}`);
    console.log(`Actualizadas: ${updated}`);
    console.log('\nUsando: ui-avatars.com (avatares generados por nombre)');
    console.log('========================================');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
