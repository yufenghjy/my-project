import request from '../utils/request.js';

export const getAuthorListApi = (name, page, pageSize) => request.get(`/authors?name=${name}&page=${page}&pageSize=${pageSize}`);

export const getAuthorByIdApi = (id) => request.get(`/authors/${id}`);

export const addArticleApi = (data) => request.post('/articles', data);

export const getArticlesByAuthorIdApi = (authorId, title = '', page = 1, pageSize = 10) => request.get(`/articles/${authorId}?title=${title}&page=${page}&pageSize=${pageSize}`);
export const updateArticleApi = (id, data) => request.put(`/articles/${id}`, data);

export const deleteArticleApi = (id) => request.delete(`/articles/${id}`);

export const updateAuthorApi = (data) => request.put(`/authors`, data);