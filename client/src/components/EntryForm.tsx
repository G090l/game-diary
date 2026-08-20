import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { entryService } from '../services/entryService';
import { gameService } from '../services/gameService';
import { GameEntry, Game } from '../types';

const EntryForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState<Partial<GameEntry>>({
        game_id: 0,
        date: new Date().toISOString().split('T')[0],
        time_spent: 60,
        rating: 5,
        review: '',
        status: 'playing'
    });
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGames();
        if (isEdit && id) {
            fetchEntry(parseInt(id));
        }
    }, [id]);

    const fetchGames = async () => {
        try {
            const response = await gameService.getAll();
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    const fetchEntry = async (entryId: number) => {
        try {
            const response = await entryService.getAll();
            const entry = response.data.find(e => e.id === entryId);
            if (entry) {
                setForm({
                    ...entry,
                    date: entry.date.split('T')[0]
                });
            }
        } catch (error) {
            console.error('Error fetching entry:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'game_id' ? parseInt(value) :
                name === 'time_spent' ? parseInt(value) || 0 :
                    name === 'rating' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit && id) {
                await entryService.update(parseInt(id), form);
            } else {
                await entryService.create(form as Omit<GameEntry, 'id' | 'created_at' | 'updated_at'>);
            }
            navigate('/entries');
        } catch (error) {
            console.error('Error saving entry:', error);
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">{isEdit ? '✏️ Редактировать запись' : '📝 Добавить запись'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Игра *</label>
                    <select
                        name="game_id"
                        className="form-control"
                        value={form.game_id || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите игру</option>
                        {games.map(game => (
                            <option key={game.id} value={game.id}>{game.title}</option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Дата *</label>
                        <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={form.date || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Время (минут) *</label>
                        <input
                            type="number"
                            name="time_spent"
                            className="form-control"
                            value={form.time_spent || ''}
                            onChange={handleChange}
                            required
                            min="1"
                            max="1440"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Статус</label>
                        <select name="status" className="form-control" value={form.status || 'playing'} onChange={handleChange}>
                            <option value="planned">Запланирована</option>
                            <option value="playing">В процессе</option>
                            <option value="completed">Пройдена</option>
                            <option value="dropped">Брошена</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Рейтинг (1-10)</label>
                        <input
                            type="number"
                            name="rating"
                            className="form-control"
                            value={form.rating || ''}
                            onChange={handleChange}
                            min="1"
                            max="10"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Отзыв</label>
                    <textarea
                        name="review"
                        className="form-control"
                        value={form.review || ''}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Ваш отзыв об игре..."
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Сохранение...' : (isEdit ? 'Обновить' : 'Создать')}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/entries')}>
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EntryForm;