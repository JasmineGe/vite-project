<template>
  <el-card style="height: 80px;">
    <el-form inline class="form">
      <el-form-item label="角色名称">
        <el-input placeholder="请输入角色名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" :disabled="!keyword">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button v-has="'btn.Role.add'" type="primary" @click="addRole" icon="Plus">添加角色</el-button>
    <el-table :data="roleArr" border style="margin: 10px 0;">
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template #="{row, $index}">
          <el-button v-has="'btn.Role.assign'" type="primary" icon="User" size="small" @click="setPermission(row)">分配权限</el-button>
          <el-button v-has="'btn.Role.update'" type="warning" icon="Edit" size="small" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.roleName}吗?`" width="200px" @confirm="deleteRole(row)">
            <template #reference>
              <el-button v-has="'btn.Role.remove'" size="small" type="danger" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasRole"
      @size-change="getHasRole"
    />
  </el-card>
  <el-dialog v-model="dialogVisible" :title="roleParams.id ? '更新角色' : '添加角色'">
    <el-form inline :model="roleParams" :rules="rules" ref="roleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="请输入角色名称" v-model="roleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <el-tree
        style="max-width: 600px"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectedArr"
        :props="defaultProps"
        ref="treeRef"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang='ts'>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission, reqRemoveRole } from '@/api/acl/role'
import type { Records, RoleResponseData, Role, MenuResponseData, MenuList } from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

let keyword = ref<string>('')
let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let roleArr = ref<Records>([])
let layoutSettingStore = useLayoutSettingStore()
let dialogVisible = ref<boolean>(false)
let roleParams = reactive<Role>({
  roleName: ''
})
let roleForm = ref()
let drawer = ref<boolean>(false)
let menuArr = ref<MenuList>([])
const defaultProps = {
  children: 'children',
  label: 'name',
}
let treeRef = ref()
let selectedArr = ref([])

onMounted(() => {
  getHasRole()
})
const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  roleArr.value = result.data.records
  total.value = result.data.total
}
const search = () => {
  getHasRole()
  keyword.value = ''
}
const reset = () => {
  keyword.value = ''
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
const addRole = () => {
  dialogVisible.value = true
  Object.assign(roleParams, {
    roleName: ''
  })
  nextTick(() => {
    roleForm.value.clearValidate('roleName')
  })
}
const setPermission = async (row: Role) => {
  drawer.value = true
  Object.assign(roleParams, row)
  let result: MenuResponseData = await reqAllMenuList(row.id as number)
  menuArr.value = result.data
  selectedArr.value = filterSelectArr(menuArr.value, [])
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((ele: any) => {
    if (ele.select && !ele.children.length) {
      initArr.push(ele.id)
    }
    if (ele.children.length) {
      filterSelectArr(ele.children, initArr)
    }
  });
  return initArr
}
const updateRole = (row: Role) => {
  dialogVisible.value = true
  Object.assign(roleParams, row)
  nextTick(() => {
    roleForm.value.clearValidate('roleName')
  })
}
const deleteRole = async (row: Role) => {
  let result: any = await reqRemoveRole(row.id as number)
  if (result.code === 200) {
    ElMessage.success('删除角色成功！')
    getHasRole(roleArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.success('删除角色失败！')
  }
}
const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length < 2) {
    callback(new Error('角色名称至少2位'))
  } else {
    callback()
  }
}
const rules = {
  roleName: [
    { required: true, trigger: 'blur', validator: validateRoleName },
  ]
}
const save = async () => {
  await roleForm.value.validate()
  let result: any = await reqAddOrUpdateRole(roleParams)
  if (result?.code === 200) {
    ElMessage.success(roleParams.id ? '更新成功！' : '添加成功！')
    dialogVisible.value = false
    getHasRole(roleParams.id ? pageNo.value : 1)
    // window.location.reload()
  } else {
    ElMessage.error(roleParams.id ? '更新失败！' : '添加失败！')
  }
}
const confirm = async () => {
  let checked = treeRef.value.getCheckedKeys()
  let roleId = roleParams.id as number
  let result: any = await reqSetPermission(roleId, checked)
  if (result.code === 200) {
    ElMessage.success('分配角色成功！')
    drawer.value = false
  } else {
    ElMessage.success('分配角色失败！')
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>