import fetch from 'node-fetch';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function collectCourseData(archiveUrl) {
  try {
    // Créer le dossier data/raw s'il n'existe pas
    const dataDir = './data/raw';
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    console.log('Téléchargement des données depuis:', archiveUrl);
    const response = await fetch(archiveUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Lire le contenu brut
    const rawText = await response.text();
    
    // Simuler des données de test en attendant l'accès à l'API réelle
    const testData = generateTestData();
    
    const courseData = {
      metadata: {
        collectionDate: new Date().toISOString(),
        source: archiveUrl,
        isTestData: true
      },
      courses: testData
    };

    // Sauvegarde des données
    const outputPath = path.join(dataDir, 'courses.json');
    await writeFile(outputPath, JSON.stringify(courseData, null, 2));
    console.log('Données sauvegardées dans:', outputPath);

    return courseData;
  } catch (error) {
    console.error('Erreur lors de la collecte:', error);
    throw error;
  }
}

function generateTestData() {
  const difficulties = ['Easy', 'Normal', 'Expert', 'Super Expert'];
  const testData = [];
  
  for (let i = 0; i < 100; i++) {
    const clearRate = Math.random() * 100;
    const attempts = Math.floor(Math.random() * 10000) + 100;
    const clears = Math.floor(attempts * (clearRate / 100));
    
    testData.push({
      id: `COURSE_${i}`,
      name: `Test Course ${i}`,
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      clear_rate: clearRate,
      attempts: attempts,
      clears: clears,
      likes: Math.floor(Math.random() * 1000),
      boos: Math.floor(Math.random() * 200),
      world_record: Math.floor(Math.random() * 300) + 30
    });
  }
  
  return testData;
}