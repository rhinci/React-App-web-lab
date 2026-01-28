import api from './config';

export const articlesApi = {
  getAll: () => api.get('/articles/'),
  getById: (id) => api.get(`/articles/${id}/`),
  getByCategory: (category) => api.get(`/articles/?category=${category}`),
  getSortedByDate: (order = 'desc') =>
    api.get(`/articles/?ordering=${order === 'desc' ? '-created_date' : 'created_date'}`),
  getPaginated: (page = 1, pageSize = 5) => 
    api.get(`/articles/?page=${page}&page_size=${pageSize}`),
};

export const authApi = {
  login: (username, password) => api.post('/token/', { username, password }),

  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),

  verifyToken: (token) => api.post('/token/verify/', { token }),

  register: (username, email, password, password2) => 
    api.post('/register/', { 
      username, 
      email: email || '',
      password, 
      password2 
    }),
};

export const commentsApi = {
  getByArticle: (articleId) => api.get(`/articles/${articleId}/comments/`),
  create: (articleId, data) => api.post('/comments/', data),
};

