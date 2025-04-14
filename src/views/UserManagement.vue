<template>
  <div style="text-align: center;">
    <h1>用户管理</h1>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加</el-button>
      <el-form :inline="true" style="display: inline-block;">
        <el-form-item label="姓名">
          <el-input v-model="searchUser.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询<el-icon><Search /></el-icon></el-button>
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
          {{ scope.row.province }} {{ scope.row.city }} {{ scope.row.address }}
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
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30]"
        :size="size" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="isEditing ? '编辑用户' : '添加用户'" v-model="dialogVisible" width="30%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="省份">
          <el-select v-model="form.province" placeholder="请选择省份">
            <el-option v-for="province in provinces" :key="province.value" :label="province.label"
              :value="province.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="form.city" placeholder="请选择城市" :key="form.province">
            <el-option v-for="city in cities" :key="city.value" :label="city.label" :value="city.value" />
          </el-select>
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
import { ref, onMounted, watch } from 'vue';
import { queryPageApi, addUserApi, updateUserApi, deleteUserApi } from '../api/user';
import type { ComponentSize } from 'element-plus'
import pca from 'area-data/pca'; // 引入省市区数据

const users = ref([]);
const total = ref(0); // 添加 total 变量

const pageSize = ref(10); // 初始化分页大小
const currentPage = ref(1); // 初始化当前页码
const dialogVisible = ref(false);
const isEditing = ref(false); // 新增状态变量来区分添加或编辑
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

const provinces = pca['86'] ? Object.entries(pca['86']).map(([code, name]) => ({ value: code, label: name })) : [];
const cities = ref([]);

const handleAdd = () => {
  form.value = { id: null, name: '', province: '', city: '', address: '', zip: '' };
  dialogVisible.value = true;
  isEditing.value = false; // 设置为添加状态
};

const handleEdit = (index, row) => {
  // 将省份名称转换为对应的省份代码
  const provinceCode = Object.keys(pca['86']).find(key => pca['86'][key] === row.province);
  form.value = { ...row, province: provinceCode || '' };
  dialogVisible.value = true;
  isEditing.value = true; // 设置为编辑状态
};

const handleDelete = async (row) => {
  // 实现删除逻辑
  await deleteUserApi(row.id);
  handleSearch(); // 刷新用户列表
};

const handleSave = async () => {
  const userToSave = { ...form.value };
  // 将城市代码转换为中文名称
  userToSave.city = pca[userToSave.province][userToSave.city] || '';
  // 将省份代码转换为中文名称
  userToSave.province = pca['86'][userToSave.province] || '';


  if (userToSave.id) {
    // 编辑用户
    await updateUserApi(userToSave);
  } else {
    // 添加用户
    await addUserApi(userToSave);
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

// 监听省份变化，更新城市选项
watch(
  () => form.value.province,
  (newProvince) => {
    if (newProvince) {
      cities.value = Object.entries(pca[newProvince] || {}).map(([code, name]) => ({
        value: code,
        label: name
      }));
    } else {
      cities.value = [];
      form.value.city = '';
    }
  }
);
</script>
