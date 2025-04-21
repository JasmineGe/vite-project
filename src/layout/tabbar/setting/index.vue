<template>
  <el-button type="primary" size="small" icon="Refresh" circle @click="updateRefresh"/>
  <el-button type="primary" size="small" icon="FullScreen" circle @click="fullScreen" />
  <el-button type="primary" size="small" icon="Setting" circle />
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
import useLayoutSettingStore from '@/store/modules/setting'; 
import useUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';

let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()
let layoutSettingStore = useLayoutSettingStore()
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
</script>

<style scoped>

</style>