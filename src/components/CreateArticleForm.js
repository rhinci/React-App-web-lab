import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ArticleForm.css';

function CreateArticleForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    category: 'news'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await axios.post(
        'http://127.0.0.1:8000/api/articles/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );

      navigate(`/article/${response.data.id}`);
      
    } catch (err) {
      console.error('Ошибка создания статьи:', err);
      setError(err.response?.data?.detail || 'Ошибка создания статьи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="article-form-container">
      <h2>Создать статью</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Заголовок:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Категория:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="news">Новости</option>
            <option value="technology">Технологии</option>
            <option value="science">Наука</option>
            <option value="art">Искусство</option>
            <option value="other">Другое</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Текст статьи:</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            rows="10"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Создание...' : 'Создать статью'}
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateArticleForm;