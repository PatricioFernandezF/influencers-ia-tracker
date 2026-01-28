import { getApplicationLogs, getApplication, deploy } from './.windsurf/skills/coolify-management/scripts/api.js';

const APP_UUID = 'i004sgoss8wkkcocw4g00o4s';

async function main() {
  try {
    console.log('=== Estado de la aplicación ===');
    const app = await getApplication(APP_UUID);
    console.log('Status:', app.status);
    console.log('Last online:', app.last_online_at);
    
    console.log('\n=== Logs de la aplicación ===');
    const logs = await getApplicationLogs(APP_UUID, 200);
    console.log(logs);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
