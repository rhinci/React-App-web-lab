import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesApi } from '../api/articles';
import ErrorDisplay from './ErrorDisplay';
import './ArticleList.css';
import Loader from './Loader';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesApi.getAll();
      setArticles(response.data);
    } catch (err) {
      setError('Не удалось загрузить статьи. Проверьте подключение к серверу.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchArticles} />;
  }

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
                  <span className="article-category">{article.category}</span>
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
