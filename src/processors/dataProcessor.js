import { readFile, writeFile } from 'fs/promises';
import { calculateAdvancedDifficultyMetrics } from '../metrics/difficultyMetrics.js';
import { calculateEngagementMetrics } from '../metrics/engagementMetrics.js';
import { calculateStatistics } from '../utils/statistics.js';

export async function processCourseData() {
  try {
    const rawData = JSON.parse(
      await readFile('./data/raw/courses.json', 'utf-8')
    );

    // Calcul des métriques avancées
    const processedData = rawData.courses.map(course => ({
      ...course,
      metrics: {
        difficulty: calculateAdvancedDifficultyMetrics(course),
        engagement: calculateEngagementMetrics(course)
      }
    }));

    // Calcul des statistiques globales
    const globalStats = calculateGlobalStatistics(processedData);

    const finalData = {
      metadata: rawData.metadata,
      statistics: globalStats,
      courses: processedData
    };

    await writeFile(
      './data/processed/analyzed_courses.json',
      JSON.stringify(finalData, null, 2)
    );

    return finalData;
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    throw error;
  }
}

function calculateGlobalStatistics(courses) {
  return {
    difficulty: calculateStatistics(
      courses.map(c => c.metrics.difficulty.challengeScore)
    ),
    engagement: calculateStatistics(
      courses.map(c => c.metrics.engagement.communityRating)
    ),
    replayability: calculateStatistics(
      courses.map(c => c.metrics.engagement.replayability)
    )
  };
}