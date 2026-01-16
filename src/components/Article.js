import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articlesApi } from '../api/articles';
import './Article.css';

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await articlesApi.getById(id);
        setArticle(response.data);
      } catch (err) {
        setError('Статья не найдена или произошла ошибка');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Загрузка статьи...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <a href="/" className="back-link">
          Вернуться к статьям
        </a>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="not-found">
        <p>Статья не найдена</p>
        <a href="/" className="back-link">
          Вернуться к статьям
        </a>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <a href="/" className="back-link">
        Все статьи
      </a>

      <h1 className="article-title">{article.title}</h1>

      <div className="article-meta">
        <div className="meta-item">
          <span>{formatDate(article.created_date)}</span>
        </div>
        <div className="meta-item">
          <span className="category-badge">{article.category}</span>
        </div>
        <div className="meta-item">
          <span>{article.user?.username || 'Автор'}</span>
        </div>
      </div>

      <div className="article-content">
        {article.text.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="article-footer">
        <a href="/" className="back-link">
          ← Вернуться к статьям
        </a>
      </div>
    </div>
  );
}

export default Article;
