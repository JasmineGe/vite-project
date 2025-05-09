<template>
  <div class="box">
    <div class="top">
      <p class="title">男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="" srcset="">
      </div>
      <div class="woman">
        <img src="../../images/woman.png" alt="" srcset="">
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts'

let charts = ref()

onMounted(() => {
  let myCharts = echarts.init(charts.value)
  myCharts.setOption({
    title: {
      text: '男女比例',
      textStyle: {//主标题颜色
        color: 'skyblue'
      },
      left: '40%'
    },
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      type: 'category' 
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: 'rgb(48, 123, 246)',
          borderRadius: 20
        }
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        barGap: '-100%',
        itemStyle: {
          color: 'rgb(236, 90, 124)',
          borderRadius: 20
        }
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
    background: url(../../images/dataScreen-main-lc.png) no-repeat;
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
    .sex {
      display: flex;
      justify-content: center;
      .man {
        margin: 20px;
        width: 110px;
        height: 115px;
        background: url(../../images/man-bg.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .woman {
        margin: 20px;
        width: 110px;
        height: 115px;
        background: url(../../images/man-bg.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
    }
    .rate {
      display: flex;
      justify-content: space-between;
      color: #fff;
    }
    .charts {
      height: 100px;
    }
  }
</style>