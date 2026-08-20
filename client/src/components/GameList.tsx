import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gameService } from '../services/gameService';
import { Game } from '../types';

const GameList: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await gameService.getAll();
            setGames(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching games:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить игру?')) {
            try {
                await gameService.delete(id);
                setGames(games.filter(game => game.id !== id));
            } catch (error) {
                console.error('Error deleting game:', error);
                alert('Ошибка при удалении игры');
            }
        }
    };

    const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(search.toLowerCase()) ||
        game.genre?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="text-center" style={{ padding: '40px' }}>Загрузка...</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">🎮 Мои игры</h2>
                <Link to="/games/new" className="btn btn-primary">+ Добавить игру</Link>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Поиск игр..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: '400px' }}
                />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Жанр</th>
                            <th>Платформа</th>
                            <th>Разработчик</th>
                            <th>Год</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGames.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center" style={{ padding: '40px' }}>
                                    {search ? 'Игры не найдены' : 'Нет добавленных игр'}
                                </td>
                            </tr>
                        ) : (
                            filteredGames.map(game => (
                                <tr key={game.id}>
                                    <td><strong>{game.title}</strong></td>
                                    <td>{game.genre || '—'}</td>
                                    <td>{game.platform || '—'}</td>
                                    <td>{game.developer || '—'}</td>
                                    <td>{game.release_year || '—'}</td>
                                    <td>
                                        <Link to={`/entries?gameId=${game.id}`} className="btn btn-success btn-sm">Записи</Link>
                                        <Link to={`/games/edit/${game.id}`} className="btn btn-warning btn-sm">Изменить</Link>
                                        <button onClick={() => handleDelete(game.id)} className="btn btn-danger btn-sm">Удалить</button>
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

export default GameList;