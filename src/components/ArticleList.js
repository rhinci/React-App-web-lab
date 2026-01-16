import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleList.css';

function ArticleList() {
  // Временные данные для верстки
  const mockArticles = [
    {
      id: 1,
      title: 'Первая статья',
      excerpt: 'Краткое описание первой статьи...',
      date: '2024-01-15',
    },
    {
      id: 2,
      title: 'Вторая статья',
      excerpt: 'Краткое описание второй статьи...',
      date: '2024-01-14',
    },
    {
      id: 3,
      title: 'Третья статья',
      excerpt: 'Краткое описание третьей статьи...',
      date: '2024-01-13',
    },
  ];

  return (
    <div className="article-list">
      <h2 className="page-title">Последние статьи</h2>
      <div className="articles-container">
        {mockArticles.map((article) => (
          <div key={article.id} className="article-card">
            <h3 className="article-title">
              <Link to={`/article/${article.id}`}>{article.title}</Link>
            </h3>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-meta">
              <span className="article-date">{article.date}</span>
              <Link to={`/article/${article.id}`} className="read-more">
                Читать далее
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleList;
