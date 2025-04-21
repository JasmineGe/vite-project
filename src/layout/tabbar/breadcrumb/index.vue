<template>
    <el-icon style="margin-right: 10px;" @click="changeIcon">
        <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, idx) in $route.matched" :key="idx" :to="item.path" v-show="item.meta.title">
            <el-icon>
                <component :is="item.meta.icon"/>
            </el-icon>
            <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang='ts'>
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'

let $route = useRoute()
let layoutSettingStore = useLayoutSettingStore()
const changeIcon = () => {
    layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>

<style scoped>
.el-icon{
    top: 2px
}
</style>