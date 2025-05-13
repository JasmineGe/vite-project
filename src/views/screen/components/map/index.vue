<template>
  <div class="box" ref="map">
map
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts'
import chinaJSON from './china.json'

 let map = ref()
 echarts.registerMap('china', chinaJSON as any);
 onMounted(() => {
    let myChart = echarts.init(map.value)
    myChart.setOption({
        geo: [{
            map: 'china',
            top: 66,
            left: 66,
            right: 66,
            label: {
                show: true,
                color: '#fff',
                fontSize: 14
            },
            emphasis: {
                itemStyle: {
                    color: 'cyan'
                }
            },
            itemStyle: {
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
            },
        }],
        series: {
            type: 'lines',
            data: [
              {
                coords: [
                  [116.405285,39.904989],  // 起点
                  [113.280637,23.125178]   // 终点
                ],
                lineStyle: {
                  color: 'white',
                  width: 5
                },
              },
              {
                coords: [
                  [111.045704,33.169849],  // 起点
                  [113.280637,23.125178]   // 终点
                ],
                lineStyle: {
                  color: 'white',
                  width: 5
                },
              },
              {
                coords: [
                  [87.617733,43.792818],  // 起点
                  [113.280637,23.125178]   // 终点
                ],
                lineStyle: {
                  color: 'white',
                  width: 5
                },
              },
              {
                coords: [
                  [126.642464,45.756967],  // 起点
                  [91.132212,29.660361]   // 终点
                ],
                lineStyle: {
                  color: 'white',
                  width: 5
                },
              }
            ],
            effect: {
                show: true,
                symbol: 'arrow',
                symbolSize: 15,
                color: '#fff'
            }
        }
    })
 })
</script>

<style scoped lang="scss">

</style>