<template>
  <div :class="['forgot-pwd-container', $root.theme]">
    <el-form 
      :model="form" 
      ref="formRef" 
      :rules="rules" 
      class="forgot-pwd-form"
      :style="{ width: windowWidth >= 800 ? '600px' : '90%' }"
    >
      <h2>修改密码</h2>
      
      <!-- 响应式布局 -->
      <el-row :gutter="20">
        <!-- 大屏幕分两列 -->
        <template v-if="windowWidth > 800">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" />
            </el-form-item>
          </el-col>
        </template>

        <!-- 小屏幕单列 -->
        <template v-else>
          <el-col :span="24">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" />
            </el-form-item>
          </el-col>
        </template>
      </el-row>

      <div class="back-login">
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
      <div class="back-login">
        <router-link to="/login">返回登录</router-link>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { forgotPwdApi } from '@/api/forgotPwd';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  username: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const rules = {
  username: [
    { required: true, message: '用户名不能为空' }
  ],
  oldPassword: [
    { required: true, message: '旧密码不能为空' }
  ],
  newPassword: [
    { required: true, message: '新密码不能为空' },
    { validator: (rule, value, callback) => {
      if (value === form.value.oldPassword) {
        callback(new Error('新密码不能与旧密码相同'));
      } else {
        callback();
      }
    }}
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码' },
    { validator: (rule, value, callback) => {
      if (value !== form.value.newPassword) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    }}
  ]
};

// 响应式窗口宽度
const windowWidth = ref(window.innerWidth);
const updateWidth = () => windowWidth.value = window.innerWidth;
onMounted(() => window.addEventListener('resize', updateWidth));
onUnmounted(() => window.removeEventListener('resize', updateWidth));

// 提交逻辑
const submitForm = async () => {
  try {
    //await form.value.validate();
    
    // 实际应调用API提交数据
    const response = await forgotPwdApi(form.value);
    if (response.data.code === 1) {
      // 密码修改成功
      ElMessage.success('密码修改成功');
      router.push('/login');
    } else {
      // 密码修改失败
      ElMessage.error('密码修改失败');
    }
  } catch (error) {
    ElMessage.error('请检查输入的具体错误信息');
  }
};
</script>

<style scoped>
.forgot-pwd-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s;
}

.forgot-pwd-form {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.back-login {
  margin-top: 15px;
  text-align: center; /* 确保按钮居中 */
}
</style>