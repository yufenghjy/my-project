import request from '../utils/request.js';

export const logoffApi = (id) => request.delete(`/usert/${id}`);