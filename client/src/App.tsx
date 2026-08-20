import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GameList from './components/GameList';
import GameForm from './components/GameForm';
import EntryList from './components/EntryList';
import EntryForm from './components/EntryForm';
import Stats from './components/Stats';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">🎮 Игровой Дневник</div>
            <div className="nav-links">
              <Link to="/">Игры</Link>
              <Link to="/entries">Записи</Link>
              <Link to="/stats">Статистика</Link>
              <Link to="/entries/new" className="btn-primary">+ Новая запись</Link>
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<GameList />} />
            <Route path="/games/new" element={<GameForm />} />
            <Route path="/games/edit/:id" element={<GameForm />} />
            <Route path="/entries" element={<EntryList />} />
            <Route path="/entries/new" element={<EntryForm />} />
            <Route path="/entries/edit/:id" element={<EntryForm />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;