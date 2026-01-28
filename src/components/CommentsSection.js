import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CommentsSection.css';

function CommentsSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/articles/${articleId}/comments/`);
        const commentsData = response.data;
        
        if (Array.isArray(commentsData)) {
          setComments(commentsData);
        } else if (commentsData.results) {
          setComments(commentsData.results);
        } else {
          setComments([]);
        }
        
      } catch (err) {
        console.error('Ошибка загрузки комментариев:', err);
        setError('Не удалось загрузить комментарии');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/comments/',
        {
          article: articleId,
          text: newComment,
          author_name: 'Аноним'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
      
    } catch (err) {
      console.error('Ошибка создания комментария:', err.response?.data || err.message);
      
      if (err.response?.status === 403) {
        setError('Требуется авторизация для комментирования');
      } else if (err.response?.status === 400) {
        const errors = err.response.data;
        let errorMsg = 'Ошибка валидации: ';
        
        if (errors.article) errorMsg += `Статья: ${errors.article[0]}`;
        else if (errors.text) errorMsg += `Текст: ${errors.text[0]}`;
        else errorMsg += JSON.stringify(errors);
        
        setError(errorMsg);
      } else {
        setError(`Ошибка отправки: ${err.message || 'Неизвестная ошибка'}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="comments-loading">Загрузка комментариев...</div>;
  }

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Комментарии ({comments.length})
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите ваш комментарий..."
            rows="4"
            disabled={submitting}
            className="comment-input"
          />
          <button 
            type="submit" 
            disabled={submitting || !newComment.trim()}
            className="submit-comment-btn"
          >
            {submitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      ) : (
        <div className="login-to-comment">
          <p>Чтобы оставить комментарий, <a href="/login">войдите</a> в систему</p>
        </div>
      )}

      <div className="comments-list">
        {error && <div className="comments-error">{error}</div>}
        
        {Array.isArray(comments) && comments.length === 0 ? (
          <p className="no-comments">Пока нет комментариев. Будьте первым!</p>
        ) : (
          Array.isArray(comments) && comments.map(comment => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <strong className="comment-author">
                  {comment.author_name}
                </strong>
                <span className="comment-date">
                  {formatDate(comment.date)}
                </span>
              </div>
              <div className="comment-text">
                {comment.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentsSection;