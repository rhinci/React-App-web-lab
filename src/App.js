import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import CreateArticleForm from './components/CreateArticleForm';
import EditArticleForm from './components/EditArticleForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create-article" element={<CreateArticleForm />} />
            <Route path="/edit-article/:id" element={<EditArticleForm />} />  
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
