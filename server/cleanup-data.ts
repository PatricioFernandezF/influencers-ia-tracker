import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cleanupData = [
  { id: 3, name: 'DotCSV', description: 'Divulgador de IA y Machine Learning. Análisis y noticias sobre modelos, herramientas y avances en inteligencia artificial.' },
  { id: 4, name: 'midudev', description: 'Desarrollador y creador de contenido sobre JavaScript, React y herramientas de desarrollo. Comparte noticias sobre IA y desarrollo web.' },
  { id: 5, name: 'javilop', description: 'Desarrollador de videojuegos y experto en IA. Comparte opiniones sobre el impacto de la IA en la industria tecnológica.' },
  { id: 6, name: 'Xavier Mitjana', description: 'Experto en tecnología e IA. Comparte análisis y ejemplos sobre nuevas herramientas de inteligencia artificial.' },
  { id: 7, name: 'Google DeepMind', description: 'División de investigación en IA de Google. Anuncia nuevos modelos Gemini, herramientas y avances en inteligencia artificial.' }
];

async function main() {
  console.log('Starting data cleanup...');
  
  for (const item of cleanupData) {
    try {
      await prisma.influencer.update({
        where: { id: item.id },
        data: {
          name: item.name,
          description: item.description
        }
      });
      console.log(`✓ Fixed influencer ${item.id}: ${item.name}`);
    } catch (error) {
      console.error(`✗ Failed to fix influencer ${item.id}:`, error);
    }
  }
  
  console.log('Data cleanup completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
