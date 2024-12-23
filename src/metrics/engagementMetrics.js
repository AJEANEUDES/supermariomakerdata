export function calculateEngagementMetrics(course) {
    return {
      // Score d'appréciation communautaire
      communityRating: calculateCommunityRating(course),
      
      // Indice de rejouabilité
      replayability: calculateReplayability(course),
      
      // Taux d'engagement (tentatives par joueur unique)
      engagementRate: calculateEngagementRate(course),
      
      // Score de viralité
      viralityScore: calculateViralityScore(course)
    };
  }
  
  function calculateCommunityRating(course) {
    const totalVotes = course.likes + course.boos;
    if (totalVotes === 0) return 0;
    
    const likeRatio = course.likes / totalVotes;
    const voteWeight = Math.min(1, Math.log10(totalVotes) / 2);
    
    return likeRatio * voteWeight * 100;
  }
  
  function calculateReplayability(course) {
    const averageAttempts = course.attempts / (course.clears || 1);
    return Math.min(100, (averageAttempts / 10) * 100);
  }
  
  function calculateEngagementRate(course) {
    const estimatedPlayers = Math.max(
      course.likes + course.boos,
      course.clears
    );
    
    return (course.attempts / (estimatedPlayers || 1)) * 10;
  }
  
  function calculateViralityScore(course) {
    const socialSpread = (course.likes - course.boos) / 
                        (course.likes + course.boos || 1);
    const popularity = Math.log10(course.attempts + 1);
    
    return (socialSpread * 0.7 + popularity * 0.3) * 100;
  }