<template>
  <div class="box">
    <div class="top">
      <p class="title">年龄比例</p>
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
  let myCharts = echarts.init(charts.value)
  myCharts.setOption(
    {
      tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 40,
      right: 30,
      orient: 'vertical',
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: '#fff'
        },
        labelLine: {
          show: false
        },data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '娱乐' },
          { value: 484, name: '财经' },
          { value: 300, name: '直播' }
        ]
      }
    ],
    grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
  })
})
</script>

<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
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
    }
    .charts {
      height: 260px;

    }
</style>