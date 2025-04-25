<template>
  <el-card>
    <el-table border style="margin: 10px 0;" :data="skuArr">
      <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="150px">
        <template #="{row, $index}">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{row, $index}">
          <el-button :type="`row.isSale ? info : success`" size="small" :icon="`row.isSale ? Bottom : Top`" @click="updateSale(row)"></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
          <el-button type="info" size="small" icon="InfoFilled" @click="findSku"></el-button>
          <el-button type="danger" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />
    <el-button type="info" size="small" icon="InfoFilled" @click="findSku"></el-button>
    <el-drawer
      v-model="drawer"
      direction="rtl">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="18">34</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="18">34</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="18">34</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in 6" :key="item" style="margin: 5px;">123</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px;">123</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in 6" :key="item">
                <h3 text="2xl" justify="center">{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
        
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { reqSkuList, reqSaleSku, reqCancelSaleSku } from '@/api/product/sku';
import type { SkuResponseData, SkuData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
let drawer = ref<boolean>(false)

onMounted(() => {
  getHasSku()
})
let getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
const handler = (pageSize: number) => {
  getHasSku()
}
const updateSale = async (row: SkuData) => {
  if (row.isSale) {
    await reqSaleSku(row.id as number)
    ElMessage.success('上架成功！')
  } else {
    await reqCancelSaleSku(row.id as number)
    ElMessage.success('下架成功！')
  }
  getHasSku(pageNo.value)
}
const updateSku = () => {
  ElMessage.success('程序员在努力更新中...')
}
const findSku = () => {
  drawer.value = true
}
</script>

<style scoped>
.el-row {
  margin: 10px 0
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>