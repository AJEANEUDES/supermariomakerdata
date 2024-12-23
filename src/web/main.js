async function loadData() {
    try {
        const response = await fetch('/data/analysis/difficulty_analysis.json');
        const data = await response.json();
        createCharts(data);
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

function displayStats(data) {
    // Affichage des statistiques de difficulté
    document.getElementById('difficultyStats').innerHTML = formatStats(data.summary.difficulty, [
        { label: 'Moyenne', key: 'mean' },
        { label: 'Médiane', key: 'median' },
        { label: 'Écart type', key: 'stdDev' }
    ]);

    // Affichage des statistiques d'engagement
    document.getElementById('engagementStats').innerHTML = formatStats(data.summary.engagement, [
        { label: 'Moyenne', key: 'mean' },
        { label: 'Maximum', key: 'max' },
        { label: 'Minimum', key: 'min' }
    ]);

    // Affichage des statistiques de rejouabilité
    document.getElementById('replayabilityStats').innerHTML = formatStats(data.summary.replayability, [
        { label: 'Moyenne', key: 'mean' },
        { label: 'Q1', key: 'q1' },
        { label: 'Q3', key: 'q3' }
    ]);
}

function formatStats(stats, fields) {
    return fields.map(field => `
        <div class="d-flex justify-content-between mb-2">
            <span>${field.label}:</span>
            <strong>${stats[field.key].toFixed(2)}</strong>
        </div>
    `).join('');
}

function displayError() {
    const containers = ['difficultyStats', 'engagementStats', 'replayabilityStats'];
    containers.forEach(id => {
        document.getElementById(id).innerHTML = `
            <div class="alert alert-danger">
                Erreur lors du chargement des données
            </div>
        `;
    });
}

function createCharts(data) {
    createDifficultyChart(data.difficultyDistribution);
    createEngagementChart(data.correlations.difficultyVsEngagement);
    createReplayabilityChart(data.summary.replayabilityStats);
}

function createDifficultyChart(distribution) {
    const ctx = document.getElementById('difficultyChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(distribution),
            datasets: [{
                label: 'Nombre de niveaux',
                data: Object.values(distribution),
                backgroundColor: 'rgba(54, 162, 235, 0.8)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribution des niveaux de difficulté'
                }
            }
        }
    });
}

function createEngagementChart(correlationData) {
    const ctx = document.getElementById('engagementChart');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Difficulté vs Engagement',
                data: correlationData,
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Corrélation Difficulté-Engagement'
                }
            }
        }
    });
}

function createReplayabilityChart(stats) {
    const ctx = document.getElementById('replayabilityChart');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Min', 'Q1', 'Median', 'Q3', 'Max'],
            datasets: [{
                label: 'Distribution de la rejouabilité',
                data: [
                    stats.min,
                    stats.q1,
                    stats.median,
                    stats.q3,
                    stats.max
                ],
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Tendances de rejouabilité'
                }
            }
        }
    });
}

loadData();