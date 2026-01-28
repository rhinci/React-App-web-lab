import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Новостной Блог</Link>
      </div>
      <nav className="nav">
        <Link to="/">Главная</Link>
        
        {isAuthenticated ? (
          <>
            <span className="welcome">Привет!</span>
            <Link to="/create-article">Создать статью</Link>
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Вход</Link>
            <Link to="/register" className="register-button">
              Регистрация
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;