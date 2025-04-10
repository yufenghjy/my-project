<template>
  <div class="container">
    <el-row :gutter="20">
      <!-- 左侧作者列表 -->
      <el-col :span="8">
        <el-card>
          <div slot="header">作者列表</div>
          <el-table :data="currentPageAuthors" style="width: 100%">
            <el-table-column label="序号" width="80">
              <template #default="scope">
                {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="作者姓名" />
            <el-table-column prop="articleCnt" label="文章数量" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="primary" @click="goToArticleManagement(scope.row.id)">管理文章</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-pagination
            @current-change="handlePageChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalAuthors"
          />
        </el-card>
      </el-col>

      <!-- 右侧统计图 -->
      <el-col :span="16">
        <div id="chart" style="width: 600px; height: 400px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getAuthorListApi } from '@/api/article';
import { ref, onMounted, inject, nextTick } from 'vue'; // 导入 inject 和其他必要的 API
import { useAuthorsStore } from '../stores/authors'; // 引入 authors store

export default {
  setup() {
    // 使用 inject 获取父组件提供的 handleSelect 方法
    const handleSelect = inject('handleSelect');
    const authorsStore = useAuthorsStore(); // 使用 authors store

    const authors = ref([]); // 作者数据（需从API获取）
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalAuthors = ref(0);
    const chart = ref(null);

    const currentPageAuthors = ref([]); // 当前页的作者数据

    const fetchAuthors = async () => {
      try {
        const response = await getAuthorListApi('', currentPage.value, pageSize.value);
        // 确保 authors 是一个数组
        authors.value = response.data.data.rows;
        totalAuthors.value = response.data.data.total;
        // 更新当前页的作者数据
        currentPageAuthors.value = authors.value;
        // 数据加载完成后更新图表
        await nextTick();
        updateChart();
        // 将 authors 存入 Pinia store
        authorsStore.setAuthors(authors.value);
      } catch (error) {
        console.error('获取作者列表失败:', error);
        // 如果接口异常，确保 authors 不会是 undefined
        authors.value = [];
        totalAuthors.value = 0;
        currentPageAuthors.value = [];
      }
    };

    const updateChart = () => {
      if (!currentPageAuthors.value || currentPageAuthors.value.length === 0) {
        console.warn('当前页作者数据为空，无法更新图表');
        return;
      }
      const data = currentPageAuthors.value.map(a => a.articleCnt); // 纵轴数据
      const xAxis = currentPageAuthors.value.map(a => a.name); // 横轴数据
      chart.value.setOption({
        xAxis: { data: xAxis },
        series: [{ data }],
      });
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchAuthors();
      updateChart();
    };

    const goToArticleManagement = (authorId) => {
      // 使用 setup 中注入的 handleSelect 方法
      if (handleSelect) {
        handleSelect('article-management');
        authorsStore.setSelectedAuthorId(authorId); // 设置 selectedAuthorId
      }
    };

    onMounted(() => {
      // 初始化图表
      chart.value = echarts.init(document.getElementById('chart'));
      chart.value.setOption({
        title: { text: '文章发表统计', left: 'center' }, // 添加标题
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, // 工具提示
        grid: { left: '10%', right: '10%', bottom: '10%', containLabel: true }, // 网格布局
        xAxis: { 
          type: 'category', 
          name: '作者姓名', // 横轴标签
          axisLabel: { rotate: 45 } // 防止标签重叠
        },
        yAxis: { 
          type: 'value', 
          name: '文章数量' // 纵轴标签
        },
        series: [{ 
          type: 'bar', 
          label: { show: true, position: 'top' } // 显示柱形顶部数值
        }]
      });
      fetchAuthors();
    });

    return {
      handleSelect, // 将 handleSelect 暴露给模板和 methods 使用
      authors,
      currentPage,
      pageSize,
      totalAuthors,
      currentPageAuthors,
      handlePageChange,
      updateChart,
      fetchAuthors,
      goToArticleManagement,
      chart,
    };
  },
};
</script>