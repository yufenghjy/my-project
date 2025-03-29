import request from '../utils/request.js';

export const forgotPwdApi = (data) => request.post(`/forgotPwd`,data);