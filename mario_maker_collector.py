import pandas as pd
import logging
from pathlib import Path
import requests
from typing import Dict, List
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarioMakerCollector:
    def __init__(self):
        self.output_dir = Path('data/mario_maker')
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.base_url = "https://raw.githubusercontent.com/leomaurodesenv/dataset-2019-mario-maker/master/data/"
        self.files = {
            'clears': 'clears.csv',
            'course_meta': 'course-meta.csv',
            'courses': 'courses.csv',
            'likes': 'likes.csv',
            'players': 'players.csv',
            'plays': 'plays.csv',
            'records': 'records.csv'
        }
        
    def collect_all_data(self):
        """Collecte tous les fichiers CSV du dataset Mario Maker"""
        all_data = {}
        
        for key, filename in self.files.items():
            try:
                logger.info(f"Collecte des données de {filename}")
                url = f"{self.base_url}{filename}"
                df = pd.read_csv(url)
                
                # Sauvegarde des données brutes
                self.save_data(df, f"raw_{filename}")
                all_data[key] = df
                
                # Calcul des statistiques spécifiques pour chaque type de données
                stats = self._calculate_specific_statistics(key, df)
                self.save_statistics(stats, f"stats_{key}.json")
                
            except Exception as e:
                logger.error(f"Erreur lors de la collecte de {filename}: {e}")
                continue
        
        # Analyse croisée des données
        if all_data:
            self._cross_analysis(all_data)

    def _calculate_specific_statistics(self, data_type: str, df: pd.DataFrame) -> Dict:
        """Calcule des statistiques spécifiques selon le type de données"""
        stats = {
            'total_entries': len(df),
            'columns': list(df.columns)
        }
        
        try:
            if data_type == 'courses':
                stats.update({
                    'difficulty_distribution': df['difficulty'].value_counts().to_dict(),
                    'game_style_distribution': df['game_style'].value_counts().to_dict(),
                    'avg_clear_rate': float(df['clear_rate'].mean()) if 'clear_rate' in df else None
                })
            
            elif data_type == 'clears':
                stats.update({
                    'total_clears': len(df),
                    'unique_players': df['player_id'].nunique(),
                    'unique_courses': df['course_id'].nunique()
                })
            
            elif data_type == 'plays':
                stats.update({
                    'total_plays': len(df),
                    'avg_plays_per_course': float(df.groupby('course_id').size().mean())
                })
            
            elif data_type == 'records':
                if 'time' in df:
                    stats.update({
                        'avg_completion_time': float(df['time'].mean()),
                        'fastest_time': float(df['time'].min()),
                        'slowest_time': float(df['time'].max())
                    })
        
        except Exception as e:
            logger.warning(f"Erreur lors du calcul des statistiques pour {data_type}: {e}")
        
        return stats

    def _cross_analysis(self, data: Dict[str, pd.DataFrame]):
        """Analyse croisée des différents datasets"""
        try:
            cross_stats = {
                'dataset_sizes': {k: len(v) for k, v in data.items()},
                'correlation_analysis': {}
            }
            
            # Fusion des données pertinentes
            if all(k in data for k in ['courses', 'plays', 'clears']):
                merged_df = pd.merge(
                    data['courses'],
                    data['plays'].groupby('course_id').size().reset_index(name='total_plays'),
                    on='course_id',
                    how='left'
                )
                
                # Calcul des corrélations
                if 'difficulty' in merged_df and 'total_plays' in merged_df:
                    cross_stats['correlation_analysis']['difficulty_vs_plays'] = float(
                        merged_df['difficulty'].corr(merged_df['total_plays'])
                    )
            
            self.save_statistics(cross_stats, "cross_analysis.json")
            
        except Exception as e:
            logger.error(f"Erreur lors de l'analyse croisée: {e}")

    def save_data(self, df: pd.DataFrame, filename: str):
        """Sauvegarde les données dans un fichier CSV"""
        try:
            output_path = self.output_dir / filename
            df.to_csv(output_path, index=False)
            logger.info(f"Données sauvegardées dans {output_path}")
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde des données: {e}")

    def save_statistics(self, stats: Dict, filename: str):
        """Sauvegarde les statistiques au format JSON"""
        try:
            output_path = self.output_dir / filename
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(stats, f, indent=2, ensure_ascii=False)
            logger.info(f"Statistiques sauvegardées dans {output_path}")
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde des statistiques: {e}")

def main():
    collector = MarioMakerCollector()
    collector.collect_all_data()

if __name__ == "__main__":
    main()