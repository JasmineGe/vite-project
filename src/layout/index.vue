<template>
  <div class="layout_container">
    <div class="layout_slider" >
        <Logo></Logo>
        <el-scrollbar class="scrollbar">
            <el-menu :default-active="$route.path" background-color="$base-menu-background" text-color="#fff" :collapse="layoutSettingStore.fold" unique-opened>
                <Menu :menuList="userStore.menuRoutes"></Menu>
            </el-menu>
        </el-scrollbar>
    </div>
    <div class="layout_tabbar" :class="{fold:layoutSettingStore.fold}">
        <Tabbar></Tabbar>
    </div>
    <div class="layout_main" :class="{fold:layoutSettingStore.fold}">
        <Main></Main>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router';
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import useUserStore from '@/store/modules/user';
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import useLayoutSettingStore from '@/store/modules/setting';

let layoutSettingStore = useLayoutSettingStore()
defineOptions({name: 'Layout'})
let $route = useRoute()
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;
    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        transition: all .3s;
        background-color: $base-menu-background;
        color: #fff;
        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height);
            .el-menu {
                border-right: none
            }
        }
    }
    .layout_tabbar {
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        transition: all .3s;
        position: fixed;
        top: 0;
        left: $base-menu-width;
        &.fold {
            width: calc(100% - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }
    .layout_main {
        position: absolute;
        left: $base-menu-width;
        top: $base-tabbar-height;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        transition: all .3s;
        padding: 20px;
        overflow: auto;
        &.fold {
            width: calc(100% - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }
}
</style>