import { readFile, writeFile } from 'fs/promises';
import { calculateStatistics } from '../utils/statistics.js';

function createHistogramBins(scores, binCount = 20) {
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const binWidth = (max - min) / binCount;
  
  // Créer les bins
  const bins = new Array(binCount).fill(0);
  
  // Compter les scores dans chaque bin
  scores.forEach(score => {
    const binIndex = Math.min(
      Math.floor((score - min) / binWidth),
      binCount - 1
    );
    bins[binIndex]++;
  });
  
  // Créer les labels (milieu de chaque bin)
  const labels = Array.from({length: binCount}, (_, i) => 
    ((min + binWidth * i + min + binWidth * (i + 1)) / 2).toFixed(1)
  );
  
  return { bins, labels, binWidth };
}

export async function analyzeDifficulty() {
  try {
    const data = JSON.parse(
      await readFile('./data/processed/analyzed_courses.json', 'utf-8')
    );

    const difficultyScores = data.courses.map(
      course => course.metrics.difficulty.challengeScore
    );

    const { bins, labels } = createHistogramBins(difficultyScores);

    const analysis = {
      summary: calculateSummaryStats(data.courses),
      difficultyDistribution: {
        counts: bins,
        scores: labels
      },
      correlations: analyzeCorrelations(data.courses)
    };

    await writeFile(
      './data/analysis/difficulty_analysis.json',
      JSON.stringify(analysis, null, 2)
    );

    return analysis;
  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    throw error;
  }
}