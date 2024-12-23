import { collectCourseData } from './collectors/courseCollector.js';
import { processCourseData } from './processors/dataProcessor.js';
import { analyzeDifficulty } from './analyzers/difficultyAnalyzer.js';
// import { generateVisualizations } from './visualizers/dataVisualizer.js';


async function main() {
  try {
    console.log('Démarrage de l\'analyse des données Mario Maker...');
    
    // Collecte des données
    console.log('Collecte des données...');
    await collectCourseData('https://archive.org/download/super_mario_maker_courses_202105');
    
    // Traitement des données
    console.log('Traitement des données...');
    await processCourseData();
    
    // Analyse
    console.log('Analyse des données...');
    const analysis = await analyzeDifficulty();
    

    
    console.log('Analyse terminée !');
    console.log('Résumé:', analysis.summary);
    
  } catch (error) {
    console.error('Erreur lors de l\'exécution:', error);
  }
}

main();