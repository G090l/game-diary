import React, { useState, useEffect } from 'react';
import { entryService } from '../services/entryService';
import { Stats as StatsType } from '../types';

const Stats: React.FC = () => {
    const [stats, setStats] = useState<StatsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await entryService.getStats();
            console.log('Stats data:', response.data); // Для отладки
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center" style={{ padding: '40px' }}>Загрузка...</div>;

    // Безопасное получение значений с проверкой на null/undefined
    const totalEntries = stats?.total_entries || 0;
    const totalTime = stats?.total_time || 0;
    const avgRating = stats?.avg_rating || 0;
    const totalGames = stats?.total_games || 0;

    // Преобразуем avgRating в число, если это строка
    const avgRatingNumber = typeof avgRating === 'string' ? parseFloat(avgRating) : Number(avgRating);
    const displayRating = isNaN(avgRatingNumber) ? 0 : avgRatingNumber;

    return (
        <div>
            <div className="card">
                <h2 className="card-title">📊 Статистика</h2>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{totalGames}</div>
                        <div className="stat-label">Всего игр</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{totalEntries}</div>
                        <div className="stat-label">Всего записей</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{Math.floor(totalTime / 60)}ч {totalTime % 60}м</div>
                        <div className="stat-label">Общее время</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{displayRating ? displayRating.toFixed(1) : '0'}</div>
                        <div className="stat-label">Средний рейтинг</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>Статус игр</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Статус</th>
                                <th>Количество</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.status_stats && stats.status_stats.length > 0 ? (
                                stats.status_stats.map(item => (
                                    <tr key={item.status}>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(item.status)}`}>
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td><strong>{item.count}</strong></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center">Нет данных</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <h3>Дополнительная информация</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{totalEntries > 0 ? Math.floor(totalTime / totalEntries) : 0} мин</div>
                        <div className="stat-label">Среднее время на запись</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats?.status_stats?.find(s => s.status === 'playing')?.count || 0}</div>
                        <div className="stat-label">Игр в процессе</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats?.status_stats?.find(s => s.status === 'completed')?.count || 0}</div>
                        <div className="stat-label">Пройдено игр</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {totalGames > 0
                                ? `${Math.round(((stats?.status_stats?.find(s => s.status === 'completed')?.count || 0) / totalGames) * 100)}%`
                                : '0%'
                            }
                        </div>
                        <div className="stat-label">Процент прохождения</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        playing: 'status-playing',
        completed: 'status-completed',
        dropped: 'status-dropped',
        planned: 'status-planned'
    };
    return classes[status] || '';
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        playing: 'В процессе',
        completed: 'Пройдена',
        dropped: 'Брошена',
        planned: 'Запланирована'
    };
    return labels[status] || status;
};

export default Stats;