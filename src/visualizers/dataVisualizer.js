import { createCanvas } from 'canvas';
import { Chart } from 'chart.js';
import { writeFile } from 'fs/promises';
import path from 'path';
import {
  createDifficultyConfig,
  createEngagementConfig,
  createReplayabilityConfig
} from './chartConfigs.js';

async function createChart(config, width = 800, height = 600) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const chart = new Chart(ctx, config);
  const buffer = canvas.toBuffer('image/png');
  chart.destroy();
  
  return buffer;
}

export async function generateVisualizations() {
  try {
    const data = JSON.parse(
      await readFile('./data/analysis/difficulty_analysis.json', 'utf-8')
    );

    // Générer les visualisations
    const charts = [
      {
        name: 'difficulty_distribution.png',
        config: createDifficultyConfig(data.difficultyDistribution)
      },
      {
        name: 'engagement_correlation.png',
        config: createEngagementConfig(data.correlations.difficultyVsEngagement)
      },
      {
        name: 'replayability_trends.png',
        config: createReplayabilityConfig(data.summary.replayabilityStats)
      }
    ];

    for (const chart of charts) {
      const buffer = await createChart(chart.config);
      await writeFile(
        path.join('./data/visualizations', chart.name),
        buffer
      );
    }

    console.log('Visualisations générées avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération des visualisations:', error);
    throw error;
  }
}