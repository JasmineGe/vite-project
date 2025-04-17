<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="12">
        <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到 Jasmine 运营</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" show-password type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login-btn" type="primary" size="default" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang='ts'>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import useUserStore from '@/store/modules/user.ts'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

let loading = ref(false)
let userStore = useUserStore()
let $router = useRouter()
let loginForm = reactive({username: 'admin', password: '111111'})
let loginForms = ref()
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('用户名长度至少5位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
}
const rules = {
  username: [
    // { required: true, min: 6, max: 10, message: '用户名长度为6至10位', trigger: 'change' }
    { trigger: 'change', validator: validatorUsername }
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '用户名长度为6至15位', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword }
  ]
}
const login = async () => {
  await loginForms.value.validate()

  loading.value = true
  try {
    await userStore.userLogin(loginForm)
    $router.push('/')
    ElNotification({
      title: 'Success',
      message: `Hi,${getTime()}好！`,
      type: 'success',
    })
    loading.value = false
  } catch (err) {
    loading.value = false
    ElNotification({
      title: 'Error',
      message: (err as Error).message,
      type: 'error',
    })
  }
}
</script>

<style scoped lang="scss">
.login-container{
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login-form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      font-size: 40px;
      color: #fff;
    }
    h2 {
      font-size: 20px;
      color: #fff;
      margin: 20px 0;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>