import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Новостной Блог</Link>
      </div>
      <nav className="nav">
        <Link to="/">Главная</Link>
        <Link to="/login">Вход</Link>
      </nav>
    </header>
  );
}

export default Header;
