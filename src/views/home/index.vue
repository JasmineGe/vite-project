<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" class="avatar">
      <div class="bottom">
        <h3 class="title">{{ getTime() + '好' + userStore.username }}</h3>
        <p class="subtitle">{{ setting.title }}</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon name="welcome" width="500px" height="500px"></svg-icon>
  </div>
</template>

<script setup lang='ts'>
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';
import setting from '@/setting';

let userStore = useUserStore()

</script>

<style scoped lang="scss">

.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}
.bottoms {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>