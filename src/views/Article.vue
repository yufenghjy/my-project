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
        <div ref="chart" style="width: 600px; height: 400px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getAuthorListApi } from '@/api/article';
import { ref, onMounted, inject } from 'vue'; // 导入 inject 和其他必要的 API

export default {
  setup() {
    // 使用 inject 获取父组件提供的 handleSelect 方法
    const handleSelect = inject('handleSelect');

    return {
      handleSelect // 将 handleSelect 暴露给模板和 methods 使用
    };
  },
  data() {
    return {
      authors: [], // 作者数据（需从API获取）
      currentPage: 1,
      pageSize: 10,
      totalAuthors: 0,
      chart: null
    };
  },
  computed: {
    currentPageAuthors() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.authors.slice(start, start + this.pageSize);
    }
  },
  mounted() {
    // 初始化图表
    this.chart = echarts.init(this.$refs.chart);
    this.chart.setOption({
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
    this.updateChart();
  },
  methods: {
    // 分页变化时更新图表
    handlePageChange(page) {
      this.currentPage = page;
      this.updateChart();
    },
    // 动态更新图表数据
    updateChart() {
      if (!this.currentPageAuthors || this.currentPageAuthors.length === 0) {
        console.warn('当前页作者数据为空，无法更新图表');
        return;
      }
      const data = this.currentPageAuthors.map(a => a.articleCnt); // 纵轴数据
      const xAxis = this.currentPageAuthors.map(a => a.name); // 横轴数据
      this.chart.setOption({
        xAxis: { data: xAxis },
        series: [{ data }]
      });
    },
    // 获取作者列表（调用后端接口）
    async fetchAuthors() {
      try {
        const response = await getAuthorListApi('', this.currentPage, this.pageSize);
        // 确保 authors 是一个数组
        this.authors = response.data.data.rows;
        this.totalAuthors = response.data.data.total;
        // 数据加载完成后更新图表
        this.updateChart();
      } catch (error) {
        console.error('获取作者列表失败:', error);
        // 如果接口异常，确保 authors 不会是 undefined
        this.authors = [];
        this.totalAuthors = 0;
      }
    },
    // 跳转作者文章管理页
    goToArticleManagement(authorId) {
      // 使用 setup 中注入的 handleSelect 方法
      if (this.handleSelect) {
        this.handleSelect('article-management');
      }
    }
  },
  created() {
    this.fetchAuthors();
  }
};
</script>