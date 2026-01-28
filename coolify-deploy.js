import { get, post } from './.windsurf/skills/coolify-management/scripts/connection.js';

const APP_UUID = 'i004sgoss8wkkcocw4g00o4s';

async function main() {
  try {
    // Intentar deploy con endpoint de services (para docker-compose)
    console.log('=== Intentando deploy como servicio ===');
    const result = await post(`/services/${APP_UUID}/restart`, {});
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('Service restart failed:', error.message);
    
    try {
      // Intentar con redeploy
      console.log('\n=== Intentando redeploy ===');
      const result2 = await get(`/applications/${APP_UUID}/restart`);
      console.log('Restart result:', JSON.stringify(result2, null, 2));
    } catch (error2) {
      console.log('Restart failed:', error2.message);
    }
  }
}

main();
