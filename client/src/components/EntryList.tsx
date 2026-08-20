import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { entryService } from '../services/entryService';
import { GameEntry } from '../types';

const EntryList: React.FC = () => {
    const [entries, setEntries] = useState<GameEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const gameId = searchParams.get('gameId');

    useEffect(() => {
        fetchEntries();
    }, [gameId]);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            let response;
            if (gameId) {
                response = await entryService.getByGame(parseInt(gameId));
            } else {
                response = await entryService.getAll();
            }
            setEntries(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching entries:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить запись?')) {
            try {
                await entryService.delete(id);
                setEntries(entries.filter(entry => entry.id !== id));
            } catch (error) {
                console.error('Error deleting entry:', error);
            }
        }
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

    if (loading) return <div className="text-center">Загрузка...</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h2>{gameId ? '📝 Записи по игре' : '📋 Все записи'}</h2>
                <Link to="/entries/new" className="btn btn-primary">+ Добавить запись</Link>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Дата</th>
                            {!gameId && <th>Игра</th>}
                            <th>Время</th>
                            <th>Рейтинг</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center">Нет записей</td>
                            </tr>
                        ) : (
                            entries.map(entry => (
                                <tr key={entry.id}>
                                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                                    {!gameId && <td>{entry.game_title || 'Без названия'}</td>}
                                    <td>{entry.time_spent} мин</td>
                                    <td>{entry.rating ? `${entry.rating}/10` : '—'}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(entry.status)}`}>
                                            {getStatusLabel(entry.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/entries/edit/${entry.id}`} className="btn btn-warning btn-sm">Изменить</Link>
                                        <button onClick={() => handleDelete(entry.id)} className="btn btn-danger btn-sm">Удалить</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EntryList;