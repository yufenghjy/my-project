<template>
  <el-container class="home-container">
    <el-aside v-if="showMenu" width="200px" class="sidebar" :style="{ backgroundColor: sidebarColor }">
      <el-menu :default-active="activeMenu" @select="handleSelect" :background-color="sidebarColor"
        :text-color="textColor" :active-text-color="activeTextColor">
        <el-menu-item index="1">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <i class="el-icon-menu"></i>
            功能菜单
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1">用户管理</el-menu-item>
            <el-menu-item index="2-2">文章管理</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <i class="el-icon-setting"></i>
            <span>主题切换</span>
          </template>
          <el-menu-item index="3-1" @click="setTheme('blue')">蓝色风格</el-menu-item>
          <el-menu-item index="3-2" @click="setTheme('yellow')">黄色风格</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="navbar" :style="{ backgroundColor: navbarColor }">
        <div class="user-info">
          <span>登录用户: {{ userStore.userInfo.name }}</span>
        </div>
      </el-header>
      <el-main class="main-content">
        <el-card shadow="always" style="height: 100%;">
          <div v-if="activeMenu === '1'" class="home-page">
            <div class="welcome-text">{{ welcomeMessage }}</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-card shadow="hover" class="avatar-card">
                  <div class="avatar">
                    <img :src="userStore.userInfo.avatar" alt="Avatar" v-if="userStore.userInfo.avatar" />
                  </div>
                </el-card>
              </el-col>
              <el-col :span="16">
                <el-calendar></el-calendar>
              </el-col>
            </el-row>
          </div>
          <component :is="currentComponent" v-else />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useWindowSize } from '@vueuse/core';
import UserManagement from './UserManagement.vue';
import Article from './Article.vue';
import ArticleManagement from './ArticleManagement.vue'; // 添加: 引入 ArticleManagement 组件
import { useUserStore } from '../stores/user';

const { width } = useWindowSize();
const showMenu = computed(() => width.value >= 1000);
const activeMenu = ref('1');
const theme = ref('blue');
const userStore = useUserStore();

const sidebarColor = computed(() => theme.value === 'blue' ? '#409EFF' : '#fadb14'); // 修改: 蓝色风格下侧边栏颜色改为蓝色
const navbarColor = computed(() => theme.value === 'blue' ? '#409EFF' : '#fffbe6'); // 修改: 蓝色风格下导航栏颜色改为蓝色
const textColor = computed(() => theme.value === 'blue' ? '#fff' : '#000');
const activeTextColor = computed(() => theme.value === 'blue' ? '#ffd04b' : '#000');

const currentComponent = ref(null); // 新增: 动态组件引用

const handleSelect = (key) => {
  activeMenu.value = key;
  if (key === '2-1') {
    currentComponent.value = UserManagement;
  } else if (key === '2-2') {
    currentComponent.value = Article; // 默认显示 Article 组件
  } else if (key === 'article-management') {
    currentComponent.value = ArticleManagement; // 动态切换到 ArticleManagement
  } else {
    currentComponent.value = null; // 清空组件
  }
};

const setTheme = (newTheme) => {
  theme.value = newTheme;
};

const welcomeMessage = computed(() => `欢迎，${userStore.userInfo.name}`); // 修改: 使用 userStore.userInfo.username 替代 loggedInUser.value

onMounted(() => {
  console.log('当前用户信息:', userStore.userInfo) // 添加调试信息
})
</script>

<style scoped>
.home-container {
  height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  border-bottom: 1px solid #ebeef5;
}

.main-content {
  padding: 20px;
}

.home-page {
  display: flex;
  flex-direction: column;
}

.avatar img {
  width: 100%;
  border-radius: 50%;
}

.welcome-text {
  text-align: center; 
  margin-bottom: 20px; 
}

/* 确保 el-submenu 的样式正确 */
.el-submenu {
  display: block;
}

.avatar-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

