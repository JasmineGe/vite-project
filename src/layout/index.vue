<template>
  <div class="layout_container">
    <div class="layout_slider">
        <Logo></Logo>
        <el-scrollbar class="scrollbar">
            <el-menu background-color="$base-menu-background" text-color="#fff">
                <Menu :menuList="userStore.menuRoutes"></Menu>
            </el-menu>
        </el-scrollbar>
    </div>
    <div class="layout_tabbar">456</div>
    <div class="layout_main">
        <Main></Main>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import useUserStore from '@/store/modules/user';
import Main from './main/index.vue'

let userStore = useUserStore()
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;
    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
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
        position: fixed;
        top: 0;
        left: $base-menu-width;
        background-color: cyan;
    }
    .layout_main {
        position: absolute;
        left: $base-menu-width;
        top: $base-tabbar-height;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        background-color: yellowgreen;
        padding: 20px;
        overflow: auto;
    }
}
</style>