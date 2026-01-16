import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesApi } from '../api/articles';
import './ArticleList.css';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articlesApi.getAll();
        setArticles(response.data);
      } catch (err) {
        setError('Ошибка при загрузке статей');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []); // Пустой массив зависимостей = выполнить только при монтировании

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Загрузка статей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="article-list">
      <h2 className="page-title">Последние новости</h2>
      {articles.length === 0 ? (
        <p className="no-articles">Статей пока нет</p>
      ) : (
        <div className="articles-container">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <h3 className="article-title">
                <Link to={`/article/${article.id}`}>{article.title}</Link>
              </h3>
              <p className="article-excerpt">
                {article.text.length > 150
                  ? `${article.text.substring(0, 150)}...`
                  : article.text}
              </p>
              <div className="article-meta">
                <div className="meta-left">
                  <span className="article-date">
                    {formatDate(article.created_date)}
                  </span>
                  <span className="article-category">
                    🏷️ {article.category}
                  </span>
                </div>
                <Link to={`/article/${article.id}`} className="read-more">
                  Читать далее
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArticleList;
