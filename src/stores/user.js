import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 用户信息状态
  const userInfo = ref({
    name: '',
    avatar: ''
  });

  // 设置用户信息 (登录时调用)
  const setUser = (userData) => {
    userInfo.value = userData;
    // 持久化到 localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 清除用户信息 (退出时调用)
  const clearUser = () => {
    userInfo.value = null;
    localStorage.removeItem('user');
  };

  // 初始化时从 localStorage 恢复
  const initialize = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      userInfo.value = JSON.parse(savedUser);
    }
  };

  return {
    userInfo,
    setUser,
    clearUser,
    initialize
  };
});