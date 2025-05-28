<template>
  <div class="box">
    <div class="top">
        <p class="title">实时游客统计</p>
        <p class="bg"></p>
        <p class="right">可预约总量<span>9999</span></p>
    </div>
    <div class="number">
        <span v-for="(item, idx) in people" :key="idx">{{ item }}</span>
    </div>
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
// import * as echarts from 'echarts'
import echarts from '@/utils/echarts.ts';
import 'echarts-liquidfill'

let people = ref('216908人')
let charts = ref()

onMounted(() => {
    let myCharts = echarts.init(charts.value)
    myCharts.setOption({
        title: {
            text: '水球图'
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            type: 'liquidFill',
            data: [0.6, 0.4, 0.2],
            waveAnimation: true,
            animationDuration: 3,
            animationDurationUpdate: 0,
            radius: '100%'
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
    background: url(../../images/dataScreen-main-lt.png) no-repeat;
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
        .right {
            float: right;
            font-size: 20px;
            color: #fff;
            span {
                color: yellowgreen;
            }
        }
    }
    .number {
        display: flex;
        margin-top: 30px;
        padding: 10px;
        span {
            flex: 1;
            background: url(../../images/total.png) no-repeat;
            background-size: 100% 100%;
            height: 97px;
            text-align: center;
            line-height: 97px;
            color: #29fcff;
            font-size: 30px;
        }
    }
    .charts {
        width: 100%;
        height: 250px;
    }
}
</style>