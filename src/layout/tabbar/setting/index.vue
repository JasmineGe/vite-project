<template>
  <el-button type="primary" size="small" icon="Refresh" circle @click="updateRefresh"/>
  <el-button type="primary" size="small" icon="FullScreen" circle @click="fullScreen" />
  <el-popover placement="bottom" title="主题设置" :width="200" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker size="small" v-model="color" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch @change="changeDark" size="small" v-model="dark" inline-prompt active-icon="MoonNight" inactive-icon="Sunny" />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button type="primary" size="small" icon="Setting" circle @click="" />
    </template>
  </el-popover>
  <img :src="userStore.avatar" style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%;">
  <el-dropdown>
    <span class="el-dropdown-link">
      {{userStore.username}}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import useLayoutSettingStore from '@/store/modules/setting'; 
import useUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';

let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()
let layoutSettingStore = useLayoutSettingStore()
let dark = ref<boolean>(false)
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
const fullScreen = () => {
  // DOM对象的一个属性，判断当前是否为全屏，是返回true，不是返回false
  let full = document.fullscreenElement
  if (!full) {
    // 实现全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
const logout = async () => {
  /* 
    1.向服务器发请求（暂时没有）
    2.仓库当中关于用户相关的数据清空[token|username|avatar]
    3.跳转到登录页面 
  */
  await userStore.userLogout()
  $router.push({
    path: '/login',
    query: {
      redirect: $route.path
    }
  })
}
const changeDark = () => {
  let html = document.documentElement
  dark.value ? html.className = 'dark' : html.className=''
}
</script>

<style scoped>

</style>