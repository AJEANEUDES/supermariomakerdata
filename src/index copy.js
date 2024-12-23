import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { collectCourseData } from './collectors/courseCollector.js';
import { processCourseData } from './processors/dataProcessor.js';
import { analyzeDifficulty } from './analyzers/difficultyAnalyzer.js';
import { generateVisualizations } from './visualizers/dataVisualizer.js';

async function ensureDirectories() {
  const dirs = [
    './data',
    './data/raw',
    './data/processed',
    './data/analysis',
    './data/visualizations'
  ];
  
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }
}

async function main() {
  try {
    console.log('Création des dossiers nécessaires...');
    await ensureDirectories();
    
    console.log('Collecte des données...');
    const rawData = await collectCourseData('https://archive.org/download/super_mario_maker_courses_202105');
    
    console.log('Traitement des données...');
    const processedData = await processCourseData();
    
    console.log('Analyse des données...');
    const analysis = await analyzeDifficulty();
    
    console.log('Génération des visualisations...');
    await generateVisualizations();
    
    console.log('\nTraitement terminé ! Résumé :');
    console.log(`- ${rawData.courses.length} niveaux collectés`);
    console.log(`- Données traitées et analysées`);
    console.log(`- Visualisations générées dans /data/visualizations/`);
    
  } catch (error) {
    console.error('Erreur lors de l\'exécution:', error);
  }
}

main();