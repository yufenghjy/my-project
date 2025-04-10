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
        <el-dropdown @command="handleDropdownCommand">
          <span class="el-dropdown-link">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item command="calendar">日历</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main class="main-content">
        <el-card shadow="always" style="height: 100%;">
          <div v-if="activeMenu === '1'" class="home-page">
            <div v-if="dropdownCommand === 'profile' || dropdownCommand === 'calendar'" class="profile-info">
              <div class="avatar-panel">
                <div class="avatar">
                  <img :src="userStore.userInfo.avatar" alt="Avatar" v-if="userStore.userInfo.avatar" />
                </div>
              </div>
              <div class="info-panel">
                <el-table :data="userInfoData" style="width: 100%" v-if="dropdownCommand === 'profile'">
                  <el-table-column prop="key" width="180"></el-table-column>
                  <el-table-column prop="value"></el-table-column>
                </el-table>
                <el-calendar v-model="calendarDate" v-if="dropdownCommand === 'calendar'" />
              </div>
            </div>
            <div v-else class="welcome-text">{{ welcomeMessage }}</div>
          </div>
          <component :is="currentComponent" v-else />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue';
import { useRouter } from 'vue-router'; // 新增: 引入 useRouter
import { useWindowSize } from '@vueuse/core';
import UserManagement from './UserManagement.vue';
import Article from './Article.vue';
import ArticleManagement from './ArticleManagement.vue'; // 添加: 引入 ArticleManagement 组件
import { useUserStore } from '../stores/user';
import { ElCalendar } from 'element-plus'; // 新增: 引入 ElCalendar 组件

const router = useRouter(); // 新增: 初始化 router

const { width } = useWindowSize();
const showMenu = computed(() => width.value >= 1000);
const activeMenu = ref('1');
const theme = ref('blue');
const userStore = useUserStore();
const dropdownCommand = ref('profile'); // 修改: 默认展示个人信息

const sidebarColor = computed(() => theme.value === 'blue' ? '#409EFF' : '#fadb14'); // 修改: 蓝色风格下侧边栏颜色改为蓝色
const navbarColor = computed(() => theme.value === 'blue' ? '#409EFF' : '#fffbe6'); // 修改: 蓝色风格下导航栏颜色改为蓝色
const textColor = computed(() => theme.value === 'blue' ? '#fff' : '#000');
const activeTextColor = computed(() => theme.value === 'blue' ? '#ffd04b' : '#000');

const currentComponent = ref(null); // 新增: 动态组件引用
const calendarDate = ref(new Date()); // 新增: 日历日期绑定

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

const handleDropdownCommand = (command) => {
  dropdownCommand.value = command;
  if (command === 'logout') {
    // 处理退出登录逻辑
    router.push('/login'); // 新增: 路由跳转到登录页面
  }
};

const setTheme = (newTheme) => {
  theme.value = newTheme;
};

const welcomeMessage = computed(() => `欢迎，${userStore.userInfo.name}`); // 修改: 使用 userStore.userInfo.username 替代 loggedInUser.value

const formattedBirthday = computed(() => {
  const birthday = new Date(userStore.userInfo.birthday);
  return birthday.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
});

const userInfoData = computed(() => [
  { key: '用户名', value: userStore.userInfo.name },
  { key: '邮箱', value: userStore.userInfo.email },
  { key: '生日', value: formattedBirthday.value },
  { key: '余额', value: userStore.userInfo.money }
]);

onMounted(() => {
  console.log('当前用户信息:', userStore.userInfo) // 添加调试信息
})

// 提供 handleSelect 方法给子组件
provide('handleSelect', handleSelect);
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

.profile-info,
.calendar-view {
  display: flex;
  align-items: flex-start;
}

.avatar-panel {
  flex: 1;
  margin-right: 20px;
}

.info-panel {
  flex: 2;
}

.avatar {
  margin-right: 20px;
}

.user-details {
  margin-top: 10px;
  text-align: left;
}

.calendar-content {
  flex-grow: 1;
}

.calendar-view {
  width: 100%;
  height: 100%;
}
</style>