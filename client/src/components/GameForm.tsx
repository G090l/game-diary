import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gameService } from '../services/gameService';
import { Game } from '../types';

const GameForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState<Partial<Game>>({
        title: '',
        genre: '',
        platform: '',
        developer: '',
        release_year: new Date().getFullYear()
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            fetchGame(parseInt(id));
        }
    }, [id]);

    const fetchGame = async (gameId: number) => {
        try {
            const response = await gameService.getById(gameId);
            setForm(response.data);
        } catch (error) {
            console.error('Error fetching game:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'release_year' ? parseInt(value) || '' : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit && id) {
                await gameService.update(parseInt(id), form);
            } else {
                await gameService.create(form as Omit<Game, 'id' | 'created_at' | 'updated_at'>);
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving game:', error);
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">{isEdit ? '✏️ Редактировать игру' : '🎮 Добавить игру'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Название *</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={form.title || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Жанр</label>
                        <select name="genre" className="form-control" value={form.genre || ''} onChange={handleChange}>
                            <option value="">Выберите жанр</option>
                            <option value="RPG">RPG</option>
                            <option value="Action">Action</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Strategy">Strategy</option>
                            <option value="Shooter">Shooter</option>
                            <option value="Racing">Racing</option>
                            <option value="Sports">Sports</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Платформа</label>
                        <select name="platform" className="form-control" value={form.platform || ''} onChange={handleChange}>
                            <option value="">Выберите платформу</option>
                            <option value="PC">PC</option>
                            <option value="PlayStation">PlayStation</option>
                            <option value="Xbox">Xbox</option>
                            <option value="Nintendo Switch">Nintendo Switch</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Разработчик</label>
                        <input
                            type="text"
                            name="developer"
                            className="form-control"
                            value={form.developer || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Год выпуска</label>
                        <input
                            type="number"
                            name="release_year"
                            className="form-control"
                            value={form.release_year || ''}
                            onChange={handleChange}
                            min="1950"
                            max={new Date().getFullYear() + 1}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Сохранение...' : (isEdit ? 'Обновить' : 'Создать')}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GameForm;