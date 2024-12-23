export function calculateStatistics(values) {
    const n = values.length;
    if (n === 0) return null;
  
    const mean = values.reduce((a, b) => a + b, 0) / n;
    
    const variance = values.reduce((acc, val) => 
      acc + Math.pow(val - mean, 2), 0) / n;
    
    const stdDev = Math.sqrt(variance);
    
    const sorted = [...values].sort((a, b) => a - b);
    const median = n % 2 === 0 
      ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
      : sorted[Math.floor(n/2)];
  
    return {
      mean,
      median,
      stdDev,
      min: sorted[0],
      max: sorted[n - 1],
      q1: sorted[Math.floor(n * 0.25)],
      q3: sorted[Math.floor(n * 0.75)]
    };
  }
  
  export function normalizeValue(value, min, max) {
    return (value - min) / (max - min || 1);
  }
  
  export function calculateZScore(value, mean, stdDev) {
    return (value - mean) / (stdDev || 1);
  }