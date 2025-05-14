<template>
  <el-form label-width="100px" class="demo-form-inline">
    <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="spuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
        <el-select v-model="spuParams.tmId">
            <el-option v-for="item in allTradeMark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请输入SPU描述" v-model="spuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
        <el-upload
            v-model:file-list="imgList"
            action="/api/admin/product/fileUpload"
            list-type="picture-card"
            :on-before-upload="beforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%;" />
        </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
        <div style="display: flex;">
            <el-select v-model="saleAttrIdAndValueName" :placeholder="unSelectSaleAttr.length ? `还有${unSelectSaleAttr.length}个未选择` : '暂无数据可选择'">
                <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`"></el-option>
            </el-select>
            <el-button @click="addSaleAttr" :disabled="!saleAttrIdAndValueName" style="margin-left: 10px;" type="primary" icon="Plus">添加属性</el-button> 
        </div>
        <el-table border style="margin: 10px 0;" :data="saleAttrList">
            <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
            <el-table-column label="属性名" width="100px" prop="saleAttrName"></el-table-column>
            <el-table-column label="属性值">
                <template #="{row}">
                    <el-tag
                        style="margin: 0 5px" 
                        v-for="(item, index) in row.spuSaleAttrValueList" 
                        :key="item.id" 
                        closable 
                        @close="row.spuSaleAttrValueList.splice(index, 1)"
                        :type="item.type">
                        {{ item.saleAttrValueName }}
                    </el-tag>
                    <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag" size="small" style="width: 100px;"></el-input>
                    <el-button v-else @click="toEdit(row)" type="success" size="small" icon="Plus"></el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100px">
                <template #="{$index}">
                    <el-button type="danger" size="small" icon="Delete" @click="saleAttrList.splice($index, 1)"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-form-item>
    <el-form-item>
        <el-button :disabled="!saleAttrList.length" type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import type { SaleAttrvalue, SpuData, SpuImg, SaleAttr, HasSaleAttr, TradeMark, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type';
import { reqAllTradeMark, reqSpuImgList, reqSpuHasSaleAttr, reqAllSpuSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu';
import { ElMessage } from 'element-plus';

let $emit = defineEmits(['changeScene'])
const cancel = () => {
    // 取消留在当前页
    $emit('changeScene', {flag: 0, params: 'update'})
}

let allTradeMark = ref<TradeMark[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttrList = ref<SaleAttr[]>([])
let allSaleAttrList = ref<HasSaleAttr[]>([])
let spuParams = ref<SpuData>({
    category3Id: '',
    description: '',
    spuName: '',
    spuImageList: [],
    tmId: '',
    spuSaleAttrList: []
})
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<any>('')
// 将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')

const initHasSpuData = async (spu: SpuData) => {
    spuParams.value = spu
    
    let result1: SpuHasImg = await reqSpuImgList(spu.id as number)
    let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
    let result3: HasSaleAttrResponseData = await reqAllSpuSaleAttr()
    let result: AllTradeMark = await reqAllTradeMark()
    
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    saleAttrList.value = result2.data
    allSaleAttrList.value = result3.data
    allTradeMark.value = result.data
}
const handlePictureCardPreview = (uploadFile: any) => {
    dialogVisible.value = true
    dialogImageUrl.value = uploadFile.url
}
const handleRemove = () => {

}
const beforeUpload = (file:any) => {
    if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
        ElMessage.error('上传文件格式务必PNG|JPEG|GIF!')
        return false
    } else if (file.size / 1024 / 1024 > 3) {
        ElMessage.error('上传文件大小应小于3MB!')
        return false
    }
    return true
}
let unSelectSaleAttr = computed(() => {
    let unSelectAttr= allSaleAttrList.value.filter(item => {
        return saleAttrList.value.every(item1 => {
            return item.name !== item1.saleAttrName
        })
    })
    return unSelectAttr
})
const addSaleAttr = () => {
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    saleAttrList.value.push(newSaleAttr)
    saleAttrIdAndValueName.value = ''
}
const toEdit = (row: SaleAttr) => {
    row.flag = true
    row.saleAttrValue = ''
}
const toLook = (row: SaleAttr) => {
    const { baseSaleAttrId, saleAttrValue } = row
    if (!saleAttrValue?.trim()) {
        ElMessage.error('属性值不能为空！')
        return
    }
    let repeat = row.spuSaleAttrValueList.find(item => item.saleAttrValueName === saleAttrValue)
    if(repeat) {
        ElMessage.error('属性值不能重复！')
        return
    }

    let newSaleAttrValue: SaleAttrvalue = {
        baseSaleAttrId,
        saleAttrValueName: saleAttrValue as string
    }
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    row.flag = false
}
const save = async () => {
    spuParams.value.spuImageList = imgList.value.map((item:any )=> {
        return {
            imgName: item.name,
            imgUrl: item.response?.data || item.url
        }
    })
    spuParams.value.spuSaleAttrList = saleAttrList.value
    let result:any = await reqAddOrUpdateSpu(spuParams.value)
    if (result.code === 200) {
        ElMessage.success(spuParams.value.id ? '更新成功！' : '添加成功')
        $emit('changeScene', {flag: 0, params: spuParams.value.id ? 'update' : 'add'})
    } else {
        ElMessage.error(spuParams.value.id ? '更新失败！' : '添加失败')
    }
}
const initAddSpuData = async (c3Id: number | string) => {
    // 清空数据
    Object.assign(spuParams.value, {
        category3Id: '',
        description: '',
        spuName: '',
        spuImageList: [],
        tmId: '',
        spuSaleAttrList: []
    })
    imgList.value = []
    saleAttrList.value = []
    saleAttrIdAndValueName.value = ''

    spuParams.value.category3Id = c3Id
    let result: AllTradeMark = await reqAllTradeMark()
    let result3: HasSaleAttrResponseData = await reqAllSpuSaleAttr()
    allTradeMark.value = result.data
    allSaleAttrList.value = result3.data
}
defineExpose({ initHasSpuData, initAddSpuData })
</script>

<style scoped>
.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>