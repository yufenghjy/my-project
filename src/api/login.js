import request from '../utils/request.js';
export const LoginApi = (data) => request.post(`/login`,data);