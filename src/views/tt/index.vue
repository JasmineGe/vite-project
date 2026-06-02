<template>
    <div class="virtual-scroll" ref="container" @scroll="handleScroll">
      <!-- 占位元素，撑开滚动区域 -->
      <!-- <div class="scroll-phantom" :style="{ height: totalHeight + 'px' }"></div> -->
      <!-- 实际渲染的列表 -->
      <div class="scroll-content" :style="{ transform: `translateY(${offset}px)`, height: totalHeight + 'px' }">
        <div 
          v-for="item in visibleData" 
          :key="item.id"
          class="item"
          :style="{ height: itemHeight + 'px' }"
        >
          {{ item.content }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  
  const itemHeight = 60 // 每项高度
  const totalCount = 1000000 // 总数据量
  
  // 生成模拟数据
  const allData = Array.from({ length: totalCount }, (_, i) => ({
    id: i,
    content: `Item ${i + 1}`
  }))
  
  const container = ref<any>(null)
  const containerHeight = ref<number>(0)
  const startIndex = ref<number>(0)
  const offset = ref<number>(0)
  const visibleCount = ref<number>(0)

  // 计算属性
  const totalHeight = computed(() => allData.length * itemHeight)
  const endIndex = computed(() => Math.min(allData.length - 1, startIndex.value + visibleCount.value + 10)) // 下缓冲10条
  const visibleData = computed(() => allData.slice(startIndex.value, endIndex.value))
  
  // 初始化
  onMounted(() => {
    containerHeight.value = container.value.clientHeight
    visibleCount.value = Math.ceil(containerHeight.value / itemHeight) + 1
  })
  
  /* 
    滚动处理
    requestAnimationFrame：保证渲染节奏和屏幕刷新率一致，避免卡顿。
    滚动时重新计算可见范围，并触发重新渲染。 
  */
  function handleScroll() {
    requestAnimationFrame(() => {
      const scrollTop = container.value.scrollTop
      startIndex.value = Math.max(0, Math.floor(scrollTop / itemHeight) - 5) // 上缓冲5条
      // offset.value = scrollTop - (scrollTop % itemHeight)
      offset.value = startIndex.value * itemHeight
    })
  }
  </script>
  
  <style scoped lang="scss">
    .virtual-scroll {
        width: 100vw;
        height: 100vh;
        overflow: auto;
        position: relative;
        .scroll-phantom {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            z-index: -1;
        }
        .scroll-content {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            .item {
                display: flex;
                align-items: center;
                padding: 0 16px;
                border-bottom: 1px solid #eee;
                box-sizing: border-box;
            }
        }
    }
  </style>