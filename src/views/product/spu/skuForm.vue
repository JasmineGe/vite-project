<template>
    <el-form label-width="100px">
      <el-form-item label="sku名称">
        <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(克)">
        <el-input placeholder="重量(克)" type="number" v-model="skuParams.weight"></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性" placeholder="平台属性">
        <el-form inline  class="demo-form-inline attr" label-width="50px">
          <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName" >
            <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
              <el-option :value="`${item.id}:${attrValue.id}`" v-for="attrValue in item.attrValueList" :key="attrValue.id" :label="attrValue.valueName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性" placeholder="销售属性">
        <el-form inline  class="demo-form-inline" label-width="50px">
          <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
            <el-select placeholder="请选择" v-model="item.saleAttrIdAndValueId">
              <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for="saleAttrValue in item.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称" placeholder="图片名称">
        <el-table border :data="imgArr" ref="table">
          <el-table-column type="selection" align="center" width="80px"></el-table-column>
          <el-table-column label="图片">
            <template #="{row}">
              <img :src="row.imgUrl" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #="{row}">
              <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
</template>

<script setup lang='ts'>
import { reqAttr } from '@/api/product/attr';
import { reqSpuImgList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu';
import type { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

let $emits = defineEmits(['changeScene'])
const cancel = () => {
  $emits('changeScene', {flag: 0, params: ''})
}

let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])
let skuParams = reactive<SkuData>({
    category3Id: '',
    spuId: '',
    tmId: '',
    skuName: '',
    price: '',
    weight: '',
    skuDesc: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: ''
})
let table = ref<any>()

const initSkuData = async (c1Id: number |string, c2Id: number | string, spu: any) => {
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId

  let result:any = await reqAttr(c1Id, c2Id, spu.category3Id)
  let result1:any = await reqSpuHasSaleAttr(spu.id)
  let result2:any = await reqSpuImgList(spu.id)
  
  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}
const handler = (row:any) => {
  //  点击的时候，全部图片的复选框不勾选
  imgArr.value.array.forEach((item:any) => {
    table.value.toggleRowSelection(item, false)
  });
  // 选中的图片才勾选
  table.value.toggleRowSelection(row, true)
  
  skuParams.skuDefaultImg = row.imgUrl
}
const save = async () => {
  skuParams.skuAttrValueList = attrArr.value.reduce((prev:any, cur:any) => {
    if (cur.attrIdAndValueId) {
      let [attrId, valueId] = cur.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId
      })
    }
    return prev
  }, [])
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev:any, cur:any) => {
    if (cur.saleAttrIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = cur.saleAttrIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId
      })
    }
    return prev
  }, [])
  let result:any = await reqAddSku(skuParams)
  if (result.code === 200) {
    ElMessage.success('添加SKU成功！')
    $emits('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage.error('添加SKU失败！')
  }
}
defineExpose({
  initSkuData
})
</script>

<style scoped>
.demo-form-inline.attr .el-form-item {
  margin-top: 10px;
}
.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>