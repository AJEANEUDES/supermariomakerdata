import { calculateStatistics } from '../utils/statistics.js';

export function calculateAdvancedDifficultyMetrics(course) {
  return {
    // Difficulté basée sur le taux de réussite
    baseComplexity: (1 - (course.clearRate / 100)),
    
    // Indice de persévérance (tentatives par succès)
    persistenceIndex: course.attempts / (course.clears || 1),
    
    // Score de défi (combine complexité et persévérance)
    challengeScore: calculateChallengeScore(course),
    
    // Indice d'accessibilité (inverse de la difficulté)
    accessibilityScore: calculateAccessibilityScore(course),
    
    // Ratio temps/succès (si disponible)
    timeEfficiency: course.timeRecord ? 
      calculateTimeEfficiency(course) : null
  };
}

function calculateChallengeScore(course) {
  const baseComplexity = 1 - (course.clearRate / 100);
  const attemptRatio = course.attempts / (course.clears || 1);
  return (baseComplexity * Math.log10(attemptRatio + 1)) * 100;
}

function calculateAccessibilityScore(course) {
  const clearRateWeight = 0.6;
  const attemptsWeight = 0.4;
  
  const normalizedClearRate = course.clearRate / 100;
  const normalizedAttempts = 1 / (Math.log10(course.attempts + 1));
  
  return (normalizedClearRate * clearRateWeight + 
          normalizedAttempts * attemptsWeight) * 100;
}

function calculateTimeEfficiency(course) {
  const averageTimePerClear = course.timeRecord / course.clears;
  const normalizedTime = 1 / (Math.log10(averageTimePerClear + 1));
  return normalizedTime * 100;
}