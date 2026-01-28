import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesApi } from '../api/articles';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';
import './ArticleList.css';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchArticles = async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      const response = await articlesApi.getPaginated(pageNum, 5);
      
      if (pageNum === 1) {
        setArticles(response.data.results || response.data);
      } else {
        setArticles(prev => [...prev, ...(response.data.results || response.data)]);
      }

      setHasMore(
        response.data.next !== null && 
        response.data.next !== undefined
      );
      
      setPage(pageNum);
    } catch (err) {
      setError('Не удалось загрузить статьи');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchArticles(page + 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        message={error}
        onRetry={() => fetchArticles(1)}
      />
    );
  }

  return (
    <div className="article-list">
      <h2 className="page-title">Последние новости</h2>
      
      {articles.length === 0 ? (
        <p className="no-articles">Статей пока нет</p>
      ) : (
        <>
          <div className="articles-container">
            {articles.map(article => (
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
                      {article.category}
                    </span>
                  </div>
                  <Link to={`/article/${article.id}`} className="read-more">
                    Читать далее →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="load-more-container">
              <button 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="load-more-button"
              >
                {loadingMore ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ArticleList;