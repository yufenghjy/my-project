<template>
  <div class="article-management-container">
    <!-- 上方区域 -->
    <el-row :gutter="20" class="header-section">
      <!-- 左侧头像 -->
      <el-col :span="8" class="avatar-section">
        <el-card shadow="hover">
          <div class="avatar">
            <img :src="userStore.userInfo.avatar" alt="Avatar" v-if="userStore.userInfo.avatar" />
          </div>
        </el-card>
      </el-col>
      <!-- 右侧用户信息 -->
      <el-col :span="16" class="info-section">
        <el-card shadow="hover">
          <div class="user-info">
            <p><strong>用户名:</strong> {{ userStore.userInfo.name }}</p>
            <p><strong>邮箱:</strong> {{ userStore.userInfo.email }}</p>
          </div>
          <el-button type="primary" @click="goBack">返回</el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下方区域 -->
    <el-row class="content-section">
      <el-col :span="24">
        <el-card shadow="always">
          <!-- 表格上方工具栏 -->
          <div class="toolbar">
            <el-button type="primary" @click="openAddArticleDialog">添加</el-button>
            <el-form :inline="true" :model="searchForm" class="search-form">
              <el-form-item label="标题">
                <el-input v-model="searchForm.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 文章列表表格 -->
          <el-table :data="currentPageArticles" style="width: 100%" border>
            <el-table-column label="序号" width="80">
              <template #default="scope">
                {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="content" label="内容" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="text" @click="editArticle(scope.row.id)">编辑</el-button>
                <el-button type="text" @click="deleteArticle(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页组件 -->
          <el-pagination
            @current-change="handlePageChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalArticles"
            layout="prev, pager, next"
            class="pagination"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加文章对话框 -->
    <el-dialog v-model="addArticleDialogVisible" title="添加文章" width="40%">
      <el-form :model="newArticle" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newArticle.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="newArticle.content" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addArticleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addArticle">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { getArticlesByAuthorIdApi, addArticleApi, deleteArticleApi } from '@/api/article';

export default {
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    // 数据
    const articles = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalArticles = ref(0);
    const searchForm = ref({ title: '' });
    const newArticle = ref({ title: '', content: '' });
    const addArticleDialogVisible = ref(false);

    // 计算属性
    const currentPageArticles = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return articles.value.slice(start, start + pageSize.value);
    });

    // 方法
    const fetchArticles = async () => {
      try {
        const response = await getArticlesByAuthorIdApi(userStore.userInfo.id);
        articles.value = response.data.data.rows || [];
        totalArticles.value = response.data.data.total || 0;
      } catch (error) {
        console.error('获取文章列表失败:', error);
      }
    };

    const goBack = () => {
      router.push('/article');
    };

    const openAddArticleDialog = () => {
      addArticleDialogVisible.value = true;
    };

    const addArticle = async () => {
      try {
        await addArticleApi(newArticle.value);
        addArticleDialogVisible.value = false;
        newArticle.value = { title: '', content: '' };
        fetchArticles();
      } catch (error) {
        console.error('添加文章失败:', error);
      }
    };

    const editArticle = (id) => {
      console.log('编辑文章ID:', id);
      // 这里可以跳转到编辑页面或打开编辑对话框
    };

    const deleteArticle = async (id) => {
      try {
        await deleteArticleApi(id);
        fetchArticles();
      } catch (error) {
        console.error('删除文章失败:', error);
      }
    };

    const handleSearch = () => {
      console.log('搜索条件:', searchForm.value);
      // 根据搜索条件重新获取数据
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchArticles();
    };

    // 生命周期钩子
    onMounted(() => {
      fetchArticles();
    });

    return {
      userStore,
      articles,
      currentPage,
      pageSize,
      totalArticles,
      searchForm,
      newArticle,
      addArticleDialogVisible,
      currentPageArticles,
      goBack,
      openAddArticleDialog,
      addArticle,
      editArticle,
      deleteArticle,
      handleSearch,
      handlePageChange
    };
  }
};
</script>

<style scoped>
.article-management-container {
  padding: 20px;
}

.header-section {
  margin-bottom: 20px;
}

.avatar img {
  width: 100%;
  border-radius: 50%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>