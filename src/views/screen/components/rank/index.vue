<template>
  <div class="box">
    <div class="top">
      <p class="title">热门景区排行</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts'

let charts = ref()

onMounted(() => {
  let myChart = echarts.init(charts.value)
  myChart.setOption({
    xAxis: {
      type: 'category'

    },
    yAxis: {
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 20
    },
    series: [
      {
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60, 70],
        label: {
          show: true,
          position: 'insideTop'
        },
        showBackground: true,
        itemStyle: {
          borderRadius: [10, 10, 0, 0]
        }
      }
    ]
  })
})
</script>

<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-rt.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;
  .top {
    margin-left: 20px;
    .title {
        color: #fff;
        font-size: 20px;
    }
    .bg {
        width: 68px;
        height: 7px;
        background: url(../../images/dataScreen-title.png) no-repeat;
        background-size: 100% 100%;
        margin-top: 10px;
    }
  }
  .charts {
    height: calc(100% - 40px);
  }
}
</style>