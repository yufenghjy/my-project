import request from '../utils/request.js';
export const queryPageApi = (username, page, pageSize) => request.get(`/users?username=${username}&page=${page}&pageSize=${pageSize}`);

export const addUserApi = (data) => request.post('/users', data);

export const updateUserApi = (data) => request.put(`/users`, data);

export const deleteUserApi = (id) => request.delete(`/users/${id}`);

