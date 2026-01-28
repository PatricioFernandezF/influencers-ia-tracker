import { createRepo } from './.windsurf/skills/compose-repo-generator/scripts/api.js';

const repoName = 'influencers-ia-tracker';
const description = 'Plataforma para gestionar influencers de IA con seguimiento de posts, valoraciones y filtrado por redes sociales (YouTube, Twitter, Blog)';

try {
  const result = await createRepo(repoName, description, false, false);
  console.log('✅ Repositorio creado exitosamente!');
  console.log('URL:', result.html_url);
  console.log('Clone URL:', result.clone_url);
} catch (error) {
  console.error('❌ Error:', error.message);
}
