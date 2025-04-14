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
              <el-button type="primary" @click="openAddArticleDialog">
                <el-icon><Plus /></el-icon>添加</el-button>
              <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item label="标题">
                  <el-input v-model="searchForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSearch">搜索<el-icon><Search /></el-icon></el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 文章列表表格 -->
            <el-table :data="articles" style="width: 100%" border>
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
            <div class="pagination-block" style="margin-top: 20px;">
              <div class="demonstration"></div>
              <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30]" :size="size" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="totalArticles" @size-change="handleSizeChange"
                @current-change="handlePageChange" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>

    <!-- 添加文章对话框 -->
    <el-dialog 
      v-model="addArticleDialogVisible" 
      :title="editMode ? '编辑文章' : '添加文章'" 
      width="40%"
    >
      <el-form :model="currentArticle" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="currentArticle.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="currentArticle.content" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="saveArticle">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, inject } from 'vue'; // 添加 inject 的导入
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useAuthorsStore } from '../stores/authors'; // 使用 authors store
import { getArticlesByAuthorIdApi, addArticleApi, deleteArticleApi, updateAuthorApi, updateArticleApi } from '@/api/article';

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
    const newArticle = ref({ title: '', content: '', author: authorsStore.selectedAuthorId });
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

    const editMode = ref(false);
    const selectedArticle = ref({});
    const currentArticle = ref({ id: '',title: '', content: '', author: authorsStore.selectedAuthorId });

    const fetchArticles = async () => {
      try {
        let authorId = authorsStore.selectedAuthorId; // 使用 Pinia store 中存储的选择的作者 ID
        let response = await getArticlesByAuthorIdApi(authorId, searchForm.value.title, currentPage.value, pageSize.value);
        articles.value = response.data.data.rows;
        totalArticles.value = response.data.data.total;
      } catch (error) {
        console.error('获取文章列表失败:', error);
      }
    };

    const goBack = () => {
      handleSelect('2-2'); // 使用 handleSelect 方法
    };

    const openAddArticleDialog = () => {
      editMode.value = false;
      currentArticle.value = { 
        id: '',
        title: '', 
        content: '', 
        author: authorsStore.selectedAuthorId 
      };
      addArticleDialogVisible.value = true;
    };

    const editArticle = async (id) => {
      const article = articles.value.find(article => article.id === id);
      if (article) {
        editMode.value = true;
        currentArticle.value = { ...article };
        addArticleDialogVisible.value = true;
      }
    };

    const saveArticle = async () => {
      try {
        if (editMode.value) {
          await updateArticleApi(currentArticle.value);
        } else {
          await addArticleApi({
            title: currentArticle.value.title,
            content: currentArticle.value.content,
            author: authorsStore.selectedAuthorId
          });
        }
        addArticleDialogVisible.value = false;
        resetForm();
        await fetchArticles();
        await updateAuthorApi({ id: currentArticle.value.author });
      } catch (error) {
        console.error('保存文章失败:', error);
      }
    };

    const resetForm = () => {
      editMode.value = false;
      addArticleDialogVisible.value = false;
      currentArticle.value = { 
        id: '',
        title: '', 
        content: '', 
        author: authorsStore.selectedAuthorId 
      };
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

    const handlePageChange = (val) => {
      currentPage.value = val;
      fetchArticles(); // 确保在分页变化后执行一次查询
    };

    const handleSizeChange = (val) => {
      console.log(`${val} items per page`);
      pageSize.value = val; // 更新分页大小
      fetchArticles(); // 调用查询方法以重新获取数据
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

    const size = ref('default');
    const background = ref(false);
    const disabled = ref(false);

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
      goBack,
      openAddArticleDialog,
      editArticle,
      deleteArticle,
      handleSearch,
      handlePageChange,
      handleSizeChange,
      authors, // 暴露 authors 给模板使用
      handleSelect, // 暴露 handleSelect 给模板使用
      currentAuthor, // 暴露 currentAuthor 给模板使用
      formattedBirthday, // 暴露 formattedBirthday 给模板使用
      editMode,
      selectedArticle,
      currentArticle,
      saveArticle,
      resetForm,
      size,
      background,
      disabled,
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

.pagination-block {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>