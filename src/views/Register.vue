<template>
  <div class="register-container">
    <el-form :model="form" ref="formRef" :rules="rules" class="register-form" label-width="100px">
      <h2>注册</h2>
      <el-row :gutter="20">
        <!-- 左侧表单 (大屏幕)/上方表单 (小屏幕) -->
        <el-col :xs="24" :sm="24" :md="12" class="left-panel">
          <el-form-item prop="name" label="用户名">
            <el-input v-model="form.name" prefix-icon="User" size="large" />
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              show-password
              size="large"
            />
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="form.email" prefix-icon="Message" size="large" />
          </el-form-item>
          <el-form-item prop="birthday" label="出生年月">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="选择日期"
              size="large"
            />
          </el-form-item>
        </el-col>

        <!-- 右侧上传头像 (大屏幕)/下方上传头像 (小屏幕) -->
        <el-col :xs="24" :sm="24" :md="12" class="right-panel">
          <span>头像上传</span>
            <div class="avatar-upload-container">
              <el-upload
                class="avatar-uploader"
                action="/upload"
                :show-file-list="false"
                :on-success="handleAvatarUpload"
                :http-request="uploadFile"
              >
                <img v-if="form.avatar" :src="form.avatar" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div>
        </el-col>
      </el-row>
      <div class="button-group">
        <el-button type="primary" @click="submitForm" size="large">提交</el-button>
        <el-button type="text" @click="handleReturnLogin" size="large">返回登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { User, Lock, Message, Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router'; // 导入 useRouter
import { ElMessage } from 'element-plus';
import { uploadApi,addUserTApi } from '../api/register'; // 导入 uploadApi

const form = ref({
  name: '',
  password: '',
  email: '',
  birthday: '',
  avatar: ''
});

const formRef = ref(null);

const rules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  email: [
    { required: true, type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  birthday: [
    { required: true, message: '请选择出生年月', trigger: 'change' }
  ]
};

const router = useRouter(); // 获取 router 实例

const handleAvatarUpload = (res) => {
  if (res.data.code === 1 && res.data.data) {
    form.value.avatar = res.data.data;
  } else {
    ElMessage.error('上传成功但未获取到图片URL');
  }
};

const uploadFile = async (options) => {
  if (!options.file) {
    ElMessage.error('请选择文件');
    return;
  }
  try {
    const formData = new FormData();
    formData.append('file', options.file);
    const response = await uploadApi(formData);
    if (response.data.code === 1) {
      handleAvatarUpload(response);
      ElMessage.success('上传成功');
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error('上传失败，请重试');
  }
};

const submitForm = async () => {
  await formRef.value.validate();
  // 提交逻辑
  const response = await addUserTApi(form.value);
  // 处理响应
  if (response.data.code === 1) {
    // 注册成功，跳转到登录页面
    // 提示框
    ElMessage.success('注册成功');
    router.push('/login'); 
  } else {
    // 注册失败，显示错误信息
    ElMessage.error(response.message); 
  }
};

const handleReturnLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
}

.register-form {
  padding: 10px;
  border-radius: 10px;
  width: 800px; /* 设置固定宽度 */
  background-color: #fff; /* 添加背景色 */
  border: 1px solid #ddd; /* 添加边框 */
}

/* 大屏幕布局 (≥800px) */
@media (min-width: 800px) {
  .left-panel {
    border-right: 1px solid #eee;
    padding-right: 30px;
  }

  .right-panel {
    padding-left: 30px;
    text-align: center;
  }
}

/* 小屏幕布局 (≤800px) */
@media (max-width: 800px) {
  .register-form {
    margin: 10px 15px;
    width: 400px;
  }

  .left-panel {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #eee;
  }
}

/* 公共样式 */
h2 {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-preview img {
  width: 178px;
  height: 178px;
  display: block;
  margin-top: 10px; /* 调整间距 */
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>