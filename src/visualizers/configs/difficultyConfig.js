export function createDifficultyConfig(distribution) {
  return {
    type: 'bar',
    data: {
      labels: distribution.scores,
      datasets: [{
        label: 'Nombre de niveaux',
        data: distribution.counts,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribution des scores de difficulté'
        },
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Score de difficulté'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Nombre de niveaux'
          },
          beginAtZero: true
        }
      }
    }
  };
}