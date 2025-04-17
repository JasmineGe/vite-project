<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup lang='ts'>
import {reqLogin} from './api/user'
import { onMounted } from 'vue';
onMounted(() => {
  reqLogin({
    username: 'admin',
    password: '111111'
  })
})
</script>

<style scoped>

</style>