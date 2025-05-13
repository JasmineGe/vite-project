<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" alt="" srcset="">
    <el-button type="primary" class="btn" @click="goHome">首页</el-button>
  </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
let $router = useRouter()
const goHome = () => {
  $router.push('/home')
}
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  img {
    width: 800px;
    height: 400px;
  }
  .btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
</style>