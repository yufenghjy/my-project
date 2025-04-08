import request from '../utils/request.js';

export const getAuthorListApi = (name, page, pageSize) => request.get(`/authors?name=${name}&page=${page}&pageSize=${pageSize}`);

export const getAuthorByIdApi = (id) => request.get(`/authors/${id}`);

export const addArticleApi = (data) => request.post('/articles', data);

export const getAllArticleApi = (name, page, pageSize) => request.get(`/articles?name=${name}&page=${page}&pageSize=${pageSize}`);

export const getArticlesByAuthorIdApi = (authorId) => request.get(`/articles/${authorId}`);
export const updateArticleApi = (id, data) => request.put(`/articles/${id}`, data);

export const deleteArticleApi = (id) => request.delete(`/articles/${id}`);

