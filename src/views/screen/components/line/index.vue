<template>
  <div class="box">
    <div class="top">
        <p class="title">未来7天游客数量趋势图</p>
        <p class="bg"></p>
    </div>
    <div class="map" ref="line">

    </div>
  </div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue';

let line = ref()
onMounted(() => {
  let myChart = echarts.init(line.value)
  myChart.setOption({
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: false
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      }
    },
    yAxis: {
      splitLine: {
        show: false
      }, 
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      }
    },
    grid: {
      left: 40,
      right: 20,
      top: 20,
      bottom: 20
    },
    series: [
      {
        type: 'line',
        data: [120, 2240, 360, 1699, 120, 1890, 500],
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
                {
                    offset: 0, color: 'rgb(13, 43, 93)' // 0% 处的颜色
                }, 
                {
                    offset: 1, color: 'rgb(61, 127, 175)' // 100% 处的颜色
                }
            ],
            global: false // 缺省为 false
          }
        }
      }
    ]
  })
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;
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
  .map {
    height: calc(100% - 40px);
  }
}
</style>