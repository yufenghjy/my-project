import request from '../utils/request.js';

export const uploadApi = (data) => request.post('/upload', data);

export const addUserTApi = (data) => request.post('/register', data);