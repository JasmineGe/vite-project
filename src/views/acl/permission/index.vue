<template>
  <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="code" label="权限值" />
    <el-table-column prop="updateTime" label="修改时间" />
    <el-table-column prop="address" label="操作">
      <template #="{row, $index}">
        <el-button v-has="'btn.Permission.add'" type="primary" size="small" @click="addPermission(row)" :disabled="row.level === 4">{{ row.level === 3 ? '添加功能' : '添加菜单' }}</el-button>
        <el-button v-has="'btn.Permission.update'" type="warning" size="small" @click="updatePermission(row)" :disabled="row.level === 1">编辑</el-button>
        <el-popconfirm :title="`确定要删除${row.name}吗?`" width="200px" @confirm="deletePermission(row)">
            <template #reference>
              <el-button v-has="'btn.Permission.remove'" type="danger" size="small" :disabled="row.level === 1">删除</el-button>
            </template>
          </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'" width="500">
    <el-form label-width="80px" :rules="rules">
      <el-form-item label="名称">
        <el-input placeholder="请输入菜单名称" v-model="menuData.name"/>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请输入菜单权限值" v-model="menuData.code"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue';
import { reqAllPermission, reqAddOrUpdatePermission, reqRemovePermission} from '@/api/acl/menu';
import type { MenuResponseData, MenuList, MenuData, MenuParams } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';

let permissionArr = ref<MenuList>([])
let dialogVisible = ref<boolean>(false)
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0
})

onMounted(() => {
  getHasPermission()
})
const getHasPermission = async () => {
  let result: MenuResponseData = await reqAllPermission()
  permissionArr.value = result.data
}
const addPermission = (row: MenuData) => {
  Object.assign(menuData, {
    code: '',
    level: 0,
    name: '',
    pid: 0
  })
  dialogVisible.value = true
  menuData.level = row.level + 1
  menuData.pid = row.id
}
const updatePermission = (row: MenuData) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}
const deletePermission = async (row: MenuData) => {
  let result: any = await reqRemovePermission(row.id)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getHasPermission()
  } else {
    ElMessage.success('删除失败！')
  }
}
const confirm = async () => {
  let result: any = await reqAddOrUpdatePermission(menuData)
  if (result.code === 200) {
    ElMessage.success(menuData.id ? '更新菜单成功！' : '添加菜单成功！')
    dialogVisible.value = false
    getHasPermission()
  } else {
    ElMessage.success(menuData.id ? '更新菜单失败！' : '添加菜单失败！')
  }
}
const rules = {

}
</script>

<style scoped>

</style>