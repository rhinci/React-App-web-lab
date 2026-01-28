import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ArticleForm.css';

function EditArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    category: 'news'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/articles/${id}/`);
        setArticle(response.data);
        setFormData({
          title: response.data.title,
          text: response.data.text,
          category: response.data.category
        });
      } catch (err) {
        setError('Не удалось загрузить статью');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      
      await axios.put(
        `http://127.0.0.1:8000/api/articles/${id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );

      navigate(`/article/${id}`);
      
    } catch (err) {
      console.error('Ошибка редактирования:', err);
      setError(err.response?.data?.detail || 'Ошибка редактирования статьи');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!article) return <div>Статья не найдена</div>;

  return (
    <div className="article-form-container">
      <h2>Редактировать статью</h2>
      
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
            disabled={saving}
          />
        </div>
        
        <div className="form-group">
          <label>Категория:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={saving}
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
            disabled={saving}
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={() => navigate(`/article/${id}`)}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditArticleForm;