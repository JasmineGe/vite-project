<template>
  <div class="box">
    <div class="top">
      <p class="title">预约渠道数据统计</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
// import * as echarts from 'echarts'
import echarts from '@/utils/echarts.ts';

let charts = ref()

onMounted(() => {
  let myChart = echarts.init(charts.value)
  let option = {
    legend: {
      data: ['Allocated Budget', 'Actual Spending']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 20
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 }
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending'
          }
        ]
      }
    ]
  };
  myChart.setOption(option)
})
</script>

<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-rb.png) no-repeat;
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