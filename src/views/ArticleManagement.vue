<template>
  <div class="article-management-container">
    <!-- 上方区域 -->
    <el-row :gutter="20" class="header-section">
      <!-- 左侧头像 -->
      <el-col :span="8" class="avatar-section">
        <el-card shadow="hover" class="full-height">
          <div class="avatar">
            <img :src="currentAuthor.avatar" alt="Avatar" style="width: 50%;" v-if="currentAuthor.avatar" />
          </div>
        </el-card>
      </el-col>
      <!-- 右侧用户信息 -->
      <el-col :span="16" class="info-section">
        <el-card shadow="hover" class="full-height">
          <div class="user-info">
            <p><strong>作者:</strong> {{ currentAuthor.name }}</p>
            <p><strong>邮箱:</strong> {{ currentAuthor.email }}</p>
            <p><strong>生日:</strong> {{ formattedBirthday }}</p>
            <p><strong>余额:</strong> {{ currentAuthor.money }}</p>
          </div>
          <el-button type="primary" @click="goBack">返回</el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下方区域 -->
    <el-scrollbar height="400px">
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
            <el-pagination @current-change="handlePageChange" :current-page="currentPage" :page-size="pageSize"
              :total="totalArticles" layout="prev, pager, next" class="pagination" />

          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>

    <!-- 添加文章对话框 -->
    <el-dialog v-model="addArticleDialogVisible" title="添加文章" width="40%">
      <el-form :model="newArticle" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newArticle.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="newArticle.content" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-select v-model="newArticle.author" placeholder="请选择作者">
            <el-option v-for="author in authors" :key="author.id" :label="author.name" :value="author.id" />
          </el-select>
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
import { ref, computed, onMounted, watch, inject } from 'vue'; // 添加 inject 的导入
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useAuthorsStore } from '../stores/authors'; // 使用 authors store
import { getArticlesByAuthorIdApi, addArticleApi, deleteArticleApi, updateAuthorApi } from '@/api/article';

export default {
  setup() {
    const userStore = useUserStore();
    const authorsStore = useAuthorsStore(); // 使用 authors store
    const router = useRouter();
    const handleSelect = inject('handleSelect'); // 注入 handleSelect 方法

    const articles = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalArticles = ref(0);
    const searchForm = ref({ title: '' });
    const newArticle = ref({ title: '', content: '', author: null });
    const addArticleDialogVisible = ref(false);

    const authors = computed(() => authorsStore.authors); // 从 Pinia store 获取 authors

    // 添加计算属性 currentAuthor
    const currentAuthor = computed(() => {
      const selectedAuthorId = authorsStore.selectedAuthorId;
      return authors.value.find(author => author.id === selectedAuthorId) || {};
    });

    // 添加计算属性 formattedBirthday
    const formattedBirthday = computed(() => {
      if (!currentAuthor.value.birthday) return '';
      const date = new Date(currentAuthor.value.birthday);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    });

    const currentPageArticles = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return articles.value.slice(start, start + pageSize.value);
    });

    const fetchArticles = async () => {
      try {
        const authorId = authorsStore.selectedAuthorId; // 使用 Pinia store 中存储的选择的作者 ID
        const response = await getArticlesByAuthorIdApi(authorId, searchForm.value.title, currentPage.value, pageSize.value);
        articles.value = response.data.data.rows || [];
        totalArticles.value = response.data.data.total || 0;
      } catch (error) {
        console.error('获取文章列表失败:', error);
      }
    };

    const goBack = () => {
      handleSelect('2-2'); // 使用 handleSelect 方法
    };

    const openAddArticleDialog = () => {
      addArticleDialogVisible.value = true;
    };

    const addArticle = async () => {
      try {
        await addArticleApi({ ...newArticle.value, author: newArticle.value.author });
        addArticleDialogVisible.value = false;
        newArticle.value = { title: '', content: '', author: newArticle.value.author };
        fetchArticles();
        await updateAuthorApi({ id: newArticle.value.author });
      } catch (error) {
        console.error('添加文章失败:', error);
      }
    };

    const editArticle = (id) => {
      console.log('编辑文章ID:', id);
    };

    const deleteArticle = async (id) => {
      try {
        await deleteArticleApi(id);
        fetchArticles();
        const article = articles.value.find(article => article.id === id);
        if (article) {
          await updateAuthorApi({ id: article.author });
        }
      } catch (error) {
        console.error('删除文章失败:', error);
      }
    };

    const handleSearch = () => {
      console.log('搜索条件:', searchForm.value);
      fetchArticles();
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchArticles();
    };

    onMounted(() => {
      // 假设从路由参数中获取作者 ID
      const authorId = router.currentRoute.value.params.authorId;
      newArticle.value.author = authorId;
      fetchArticles();
    });

    // 监听 authors 数据的变化，确保在 authors 数据更新后设置 newArticle 的 author 字段
    watch(authors, (newAuthors) => {
      if (newAuthors.length > 0 && !newArticle.value.author) {
        newArticle.value.author = newAuthors[0].id; // 设置默认作者
      }
    });

    // 监听 selectedAuthorId 的变化
    watch(() => authorsStore.selectedAuthorId, (newAuthorId) => {
      newArticle.value.author = newAuthorId;
      fetchArticles();
    });

    return {
      userStore,
      authorsStore,
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
      handlePageChange,
      authors, // 暴露 authors 给模板使用
      handleSelect, // 暴露 handleSelect 给模板使用
      currentAuthor, // 暴露 currentAuthor 给模板使用
      formattedBirthday, // 暴露 formattedBirthday 给模板使用
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
  display: flex;
  /* 添加 Flexbox 布局 */
  align-items: stretch;
  /* 使子元素高度拉伸以匹配容器高度 */
  height: 40%;
}

.avatar {
  display: flex;
  /* 添加 Flexbox 布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
  /* 确保容器高度占满 */
}

.avatar img {
  max-width: 100%;
  /* 修改为 max-width */
  max-height: 100%;
  /* 修改为 max-height */
  width: auto;
  /* 添加 width: auto */
  height: auto;
  /* 添加 height: auto */
  border-radius: 50%;
}

.full-height {
  height: 100%;
  /* 设置卡片高度为 100% */
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-section {
  overflow-y: auto;
  /* 添加垂直滚动条 */
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>