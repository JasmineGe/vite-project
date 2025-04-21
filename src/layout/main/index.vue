<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <component :is="Component" v-if="flag"/>
        </transition>
    </router-view>
</template>

<script setup lang='ts'>
import { watch, ref, nextTick } from 'vue';
import useLayoutSettingStore from '@/store/modules/setting'; 

let flag = ref(true)
let layoutSettingStore = useLayoutSettingStore()
watch(() => layoutSettingStore.refresh, () => {
    // 点击刷新按钮，路由组件销毁
    flag.value = false
    nextTick(() => {
        flag.value = true 
    })
})
</script>

<style scoped>
.fade-enter-from {
    opacity: 0;
    transform: scale(0);
}
.fade-enter-active {
    transition: all .3s;
}
.fade-enter-to {
    opacity: 1;
    transform: scale(1);
}
</style>