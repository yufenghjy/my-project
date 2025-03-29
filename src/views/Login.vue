<template>
  <div class="login-container">
    <div class="login-main">      
      <el-card class="login-card">
        <h1>登录</h1>
        <el-row :gutter="30">
          <!-- 左侧登录方式 (大屏幕) -->
          <el-col 
            :xs="24" 
            :sm="24" 
            :md="12"
            class="left-panel"
          >
            <div class="social-login">
              <el-button class="qq-btn" size="large">
                <el-icon><img src="@/assets/qq.png" alt="QQ" class="icon" /></el-icon>
                QQ登录
              </el-button>
              <el-button class="wechat-btn" size="large">
                <el-icon><img src="@/assets/wechat.png" alt="WeChat" class="icon" /></el-icon>
                微信登录
              </el-button>
              <el-button class="alipay-btn" size="large">
                <el-icon><img src="@/assets/alipay.png" alt="Alipay" class="icon" /></el-icon>
                支付宝登录
              </el-button>
            </div>
          </el-col>

          <!-- 右侧表单 (大屏幕)/下方表单 (小屏幕) -->
          <el-col 
            :xs="24" 
            :sm="24" 
            :md="12"
            class="right-panel"
          >
            <el-form :model="form" ref="loginForm">
              <el-form-item prop="name">
                <el-input
                  v-model="form.name"
                  placeholder="用户名"
                  prefix-icon="User"
                  size="large"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="密码"
                  prefix-icon="Lock"
                  show-password
                  size="large"
                />
              </el-form-item>
              
              <!-- 登录按钮 -->
              <el-button 
                type="primary" 
                class="login-btn" 
                size="large"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form>

            <!-- 底部链接 -->
            <div class="bottom-links">
              <router-link to="/register">注册用户</router-link>
              <router-link to="/forgot-password">修改密码</router-link>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { LoginApi } from '../api/login';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';


const form = ref({
  name: '',
  password: ''
});

const rules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
};

const router = useRouter(); // 获取 router 实例

const userStore = useUserStore();

const handleLogin = async () => {
  // 处理登录逻辑
  const response = await LoginApi(form.value);
  if (response.data.code === 1) {
    // 登录成功，跳转到首页
    ElMessage.success('登录成功');
    // 保存用户信息到pinia和localStore
    userStore.setUser({
      name: response.data.data.name,
      avatar: response.data.data.avatar
    })
    router.push('/home'); 
  }else{
    ElMessage.error('登录失败');
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  padding: 10px;
  border-radius: 10px;
  width: 800px; /* 设置固定宽度 */
}

/* 大屏幕布局 (≥800px) */
@media (min-width: 800px) {
  .left-panel {
    border-right: 1px solid #eee;
    padding-right: 30px;
  }

  .social-login {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }

  .right-panel {
    padding-left: 30px;
    text-align: center;
  }

  .bottom-links {
    margin-top: 30px;
    /* 底部链接居中 */
    display: flex;
    justify-content: center;
    gap: 20px;
  }
}

/* 小屏幕布局 (≤800px) */
@media (max-width: 800px) {
  .login-card {
    margin: 10 15px;
    width: 400px; 
  }

  .left-panel {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #eee;
  }

  .social-login {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .bottom-links {
    margin: 25px auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}

/* 公共样式 */
h1{
  text-align: center;
}
.social-login button {
  width: 80%;
  margin: 0 auto;
}

.login-btn {
  width: 100%;
  margin: 0 auto;
}

.bottom-links a {
  color: #666;
  text-decoration: none;
  font-size: 0.9em;
}

.bottom-links a:hover {
  color: #409EFF;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.qq-btn {
  background-color: #bfe9ff; /* 修改QQ按钮颜色 */
  border-color: #bfe9ff;
}

.qq-btn:hover {
  background-color: #0b72a5;
  border-color: #0b72a5;
}

.wechat-btn {
  background-color: #92ffc7; /* 修改微信按钮颜色 */
  border-color: #92ffc7;
}

.wechat-btn:hover {
  background-color: #06984f;
  border-color: #06984f;
}

.alipay-btn {
  background-color: #8ab5f3; /* 修改支付宝按钮颜色 */
  border-color: #8ab5f3;
}

.alipay-btn:hover {
  background-color: #1155cc;
  border-color: #1155cc;
}
</style>