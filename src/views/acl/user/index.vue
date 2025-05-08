<template>
  <el-card style="height: 80px;">
    <el-form inline class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" @click="addUser">添加</el-button>
    <el-button type="danger" :disabled="!selectUser.length" @click="deleteSelectUser">批量删除</el-button>
    <el-table style="margin: 10px 0;" border :data="userArr" @selection-change="selectChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{row, $index}">
          <el-button type="primary" icon="User" size="small" @click="setRole(row)">分配角色</el-button>
          <el-button type="warning" icon="Edit" size="small" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.username}吗?`" width="200px" @confirm="deleteUser(row)">
            <template #reference>
              <el-button size="small" type="danger" icon="Delete">删除</el-button>
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
      @current-change="getHasUser"
      @size-change="getHasUser"
    />
  </el-card>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!userParams.id" label="用户密码" prop="password">
          <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色用户</h4>
    </template>
    <template #default>
      <el-form :model="userParams">
        <el-form-item label="用户姓名">
          <el-input disabled v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
            <el-checkbox v-for="item in allRoles" :value="item" :label="item" :key="item">
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelSetRole">取消</el-button>
        <el-button type="primary" @click="confirmSetRole">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang='ts'>
import { ref, onMounted, reactive, nextTick} from 'vue';
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqRemoveUser, reqRemoveAllUser } from '@/api/acl/user';
import type { UserResponseData, Records, User, AllRole, AllRoleResponseData, SetRoleData} from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let userArr = ref<Records>([])
let total = ref<number>(0)
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let userParams = reactive<User>({
  username: '',
  password: '',
  name: '',
})
let formRef = ref<any>()
let checkAll = ref<boolean>(false)
let isIndeterminate = ref<boolean>(true)
let checkedRoles = ref<AllRole>([])
let allRoles = ref<AllRole>([])
let selectUser = ref<Records>([])
let keyword = ref<string>('')
let layoutSettingStore = useLayoutSettingStore()

const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  userArr.value = result.data.records
  total.value = result.data.total
}
onMounted(() => {
  getHasUser()
})
const addUser = () => {
  drawer.value = true
  userParams.id = 0
  // 重置表单项，将其值重置为初始值，并移除校验结果
  Object.assign(userParams, {
    username: '',
    password: '',
    name: '',
  })
  nextTick(() => {
    formRef.value.clearValidate(['username', 'name', 'password'])
  })
}
const updateUser = (row: User) => {
  drawer.value = true
  userParams.id = row.id
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate(['username', 'name', 'password'])
  })
}
const cancel = () => {
  drawer.value = false
}
const confirm = async () => {
  // 保证表单验证通过，才可发请求
  await formRef.value.validate()
  let result:any = await reqAddOrUpdateUser(userParams)
  if (result?.code === 200) {
    ElMessage.success(userParams.id ? '更新成功！' : '添加成功！')
    drawer.value = false
    // getHasUser(userParams.id ? pageNo.value : 1)
    window.location.reload()
  } else {
    ElMessage.error(userParams.id ? '更新失败！' : '添加失败！')
  }
}
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length < 5) {
    callback(new Error('用户名字至少5位'))
  } else {
    callback()
  }
}
const validateName = (rule: any, value: any, callback: any) => {
  if (value.trim().length < 5) {
    callback(new Error('用户昵称至少5位'))
  } else {
    callback()
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length < 6) {
    callback(new Error('用户密码至少6位'))
  } else {
    callback()
  }
}
const rules = {
  username: [
    { required: true, trigger: 'blur', validator: validateUsername },
  ],
  name: [
    { required: true, trigger: 'blur', validator: validateName },
  ],
  password: [
    { required: true, trigger: 'blur', validator: validatePassword },
  ]
}
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  allRoles.value = result.data.allRolesList
  checkedRoles.value = result.data.assignRoles
  drawer1.value = true
}
const handleCheckAllChange = (val: boolean) => {
  checkedRoles.value = val ? allRoles.value : []
  isIndeterminate.value = false
}
const handleCheckedRolesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRoles.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRoles.value.length
}
const cancelSetRole = () => {
  drawer1.value = false
}
const confirmSetRole = async () => {
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: checkedRoles.value.map(item => item.id as number)
  }
  let result: any = await reqSetUserRole(data)
  if (result.code === 200) {
    ElMessage.success('分配角色成功！')
    drawer1.value = false
    getHasUser(pageNo.value)
  } else {
    ElMessage.success('分配角色失败！')
  }
}
const deleteUser = async (row: User) => {
  let result: any = await reqRemoveUser(row.id as number)
  if (result.code === 200) {
    ElMessage.success('删除成功！')
    getHasUser(userArr.value.length > 1 ? pageNo.value : 1)
  } else {
    ElMessage.success('删除失败！')
  }
}
const selectChange = (value: any) => {
  selectUser.value = value
}
const deleteSelectUser = async () => {
  let idList: any = selectUser.value.map(item => item.id)
  let result: any = await reqRemoveAllUser(idList)
  if (result.code === 200) {
    ElMessage.success('删除成功！')
    getHasUser(userArr.value.length > 1 ? pageNo.value : 1)
  } else {
    ElMessage.success('删除失败！')
  }
}
const search = () => {
  getHasUser()
  keyword.value = ''
}
const reset = () => {
  keyword.value = ''
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>