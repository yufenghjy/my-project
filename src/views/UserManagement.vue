<template>
  <div style="text-align: center;">
    <h1>用户管理</h1>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-form :inline="true" style="display: inline-block;">
        <el-form-item label="姓名">
          <el-input v-model="searchUser.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="users" style="width: 100%" height="500" :max-height="500">
      <el-table-column label="序号" width="100">
        <template #default="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="日期" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column label="地址">
        <template #default="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-block" style="margin-top: 20px;">
      <div class="demonstration"></div>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30]" :size="size" :disabled="disabled" :background="background"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <el-dialog title="用户信息" v-model="dialogVisible" width="30%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="form.province" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="邮政编码">
          <el-input v-model="form.zip" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { queryPageApi, addUserApi, updateUserApi, deleteUserApi } from '../api/user';
import type { ComponentSize } from 'element-plus'

const users = ref([]);
const total = ref(0); // 添加 total 变量

const pageSize = ref(10); // 初始化分页大小
const currentPage = ref(1); // 初始化当前页码
const dialogVisible = ref(false);
const searchUser = ref({ name: '' }); // 查询表单数据
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)

const form = ref({
  id: null,
  name: '',
  province: '',
  city: '',
  address: '',
  zip: ''
});

const handleAdd = () => {
  form.value = { id: null, name: '', province: '', city: '', address: '', zip: '' };
  dialogVisible.value = true;
};

const handleEdit = (index, row) => {
  form.value = { ...row };
  dialogVisible.value = true;
};

const handleDelete = async (row) => {
  // 实现删除逻辑
  await deleteUserApi(row.id);
  handleSearch(); // 刷新用户列表
};

const handleSave = async () => {
  if (form.value.id) {
    // 编辑用户
    await updateUserApi(form.value);
  } else {
    // 添加用户
    await addUserApi(form.value);
  }
  dialogVisible.value = false;
  handleSearch(); // 刷新用户列表
};

const handleSearch = async () => {
  console.log('Search:', searchUser.value)
  let result = await queryPageApi(searchUser.value.name, currentPage.value, pageSize.value);
  if (result.data.code) {
    users.value = result.data.data.rows
    total.value = result.data.data.total
  }
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  pageSize.value = val; // 更新分页大小
  handleSearch(); // 调用查询方法以重新获取数据
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val; // 更新当前页码
  handleSearch(); // 调用查询方法以重新获取数据
}

// 在组件挂载时调用 handleSearch 方法以获取数据
onMounted(() => {
  handleSearch();
});
</script>