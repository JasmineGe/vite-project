<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0;">
      <!-- v-if/v-show 都可实现切换，v-show只需要挂载一次 -->
      <div v-show="scene === 0">
        <el-button v-has="'btn.Spu.add'" type="primary" icon="Plus" :disabled="!categoryStore.c3Id" @click="addSpu">添加SPU</el-button>
        <el-table border style="margin: 10px 0;" :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template #="{row}">
              <el-button v-has="'btn.Spu.addsku'" size="small" type="primary" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button v-has="'btn.Spu.update'" size="small" type="warning" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
              <el-button v-has="'btn.Spu.skus'" size="small" type="info" icon="View" title="查看SKU列表" @click="findSku(row)"></el-button>
              <el-popconfirm :title="`确定要删除${row.spuName}吗?`" width="200px">
                <template #reference>
                  <el-button v-has="'btn.Spu.delete'" size="small" type="danger" icon="Delete" title="删除SPU" @click="deleteSpu(row)"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <SpuForm ref="spu" v-show="scene === 1" @changeScene="changeScene" />
      <SkuForm ref="sku" v-show="scene === 2" @changeScene="changeScene" />
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="sku名字" prop="skuName"></el-table-column>
          <el-table-column label="sku价格" prop="price"></el-table-column>
          <el-table-column label="sku重量" prop="weight"></el-table-column>
          <el-table-column label="sku图片">
            <template #="{row}">
              <img :src="row.skuDefaultImg" style="width:100px; height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { ref, watch, onBeforeUnmount } from 'vue';
import useCategoryStore from '@/store/modules/category';
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu';
import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type';
import SpuForm from './spuForm.vue';
import SkuForm from './skuForm.vue';
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore()
let scene = ref<number>(0) // 0:显示已有SPU列表；1:添加或修改已有SPU；2:添加SKU
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let records = ref<Records>([])
let total = ref<number>(0)
// 获取子组件实例
let spu = ref<any>()
let sku = ref<any>()
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

watch(() => categoryStore.c1Id, () => {
  records.value = []
})
watch(() => categoryStore.c2Id, () => {
  records.value = []
})
watch(() => categoryStore.c3Id, () => {
  if (!categoryStore.c3Id) return
  getHasSpu()
})
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
const changeSize = () => {
  getHasSpu()
}
const addSpu = () => {
  scene.value = 1
  spu.value.initAddSpuData(categoryStore.c3Id)
}
const changeScene = (obj:any) => {
  scene.value = obj.flag
  // 再次获取全部的已有SPU
  if (obj.params === 'update') {
    getHasSpu(pageNo.value)
  } else {
    getHasSpu()
  }
}
const updateSpu = (row: SpuData) => {
  scene.value = 1
  spu.value.initHasSpuData(row)
}
const addSku = (row: SpuData) => {
  scene.value = 2
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
const findSku = async (row: SpuData) => {
  let result:SkuInfoData = await reqSkuList(row.id as number)
  if (result.code === 200) {
    skuArr.value = result.data
    show.value = true
  }
}
const deleteSpu = async(row:SpuData) => {
  let result:any = await reqRemoveSpu(row.id as number)
  if (result.code === 200) {
    ElMessage.success('删除成功！')
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败！')
  }
}
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped>

</style>