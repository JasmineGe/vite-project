<template>
  <div>
    <el-card>
      <el-button v-has="'btn.Trademark.add'" type="primary" size="default" icon="Plus" @click="addTradeMark">添加品牌</el-button>
      <el-table style="margin: 10px 0;" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称">
          <template #="{row}">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{row}">
            <img :src="row.logoUrl" alt="未有图片" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{row}">
            <el-button v-has="'btn.Trademark.update'" type="warning" size="small" icon="Edit" @click="updateTradeMark(row)"></el-button>
            <el-popconfirm :title="`您确定要删除${row.tmName}吗？`" width="250px" icon="Delete" @confirm="removeTradeMark(row.id)">
              <template #reference>
                <el-button v-has="'btn.Trademark.remove'" type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        @change="getHasTrademark"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      />
    </el-card>
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" width="500">
      <el-form style="width: 80%;" :rules="rules" :model="trademarkParams" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action:上传图片到服务器的路径 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';
import type { Records, TradeMarkReponseData, TradeMark } from '@/api/product/trademark/type';
import type { UploadProps } from 'element-plus'

let pageNo = ref<number>(1)
let limit = ref<number>(3)
let total = ref<number>(0)
let trademarkArr = ref<Records>([])
let dialogFormVisible = ref<boolean>(false)
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
// 获取el-form组件实例
let formRef = ref()

const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkReponseData = await reqHasTrademark(pageNo.value, limit.value)
  total.value = result.data.total
  trademarkArr.value = result.data.records
}
onMounted(() => {
  getHasTrademark()
})
const addTradeMark = () => {
  dialogFormVisible.value = true
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
  
  // 解决第一次点击时，form还没出现导致获取不到form
  // 第一种写法：ES6的可选链写法，问号语法
  // formRef.value?.clearValidate(['tmName', 'logoUrl'])
  // 第二种写法：nextTick()
  nextTick(() => {
    formRef.value.clearValidate(['tmName', 'logoUrl'])
  })
}
const updateTradeMark = async (row: TradeMark) => {
  // 清空校验规则错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate(['tmName', 'logoUrl'])
  })

  dialogFormVisible.value = true
  Object.assign(trademarkParams, row)
}
const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  // 发请求之前，对整个表单进行校验
  // 调用这个方法进行全部表单的校验，如果校验通过才可以后续代码的执行
  await formRef.value.validate()
  let result:any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code === 200) {
    dialogFormVisible.value = false
    ElMessage.success(trademarkParams.id ? '修改品牌成功！' : '添加品牌成功！')
    // 若是添加，回到第一页；若是修改，停在当前页
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage.error(trademarkParams.id ? '修改品牌失败！' : '添加品牌失败！')
    dialogFormVisible.value = false
  }
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 要求：上传文件格式jpeg|png|gif  4M
  if (!['image/png', 'image/jpeg', 'image/gif'].includes(rawFile.type)) {
    ElMessage.error('上传文件格式务必PNG|JPEG|GIF!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('上传文件大小应小于4MB!')
    return false
  }
  return true
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  trademarkParams.logoUrl = response.data
  // 图片上传成功，清楚对应的校验
  formRef.value.clearValidate('logoUrl')
}
const validatorTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('名称位数需大于等于2位！'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('LOGO图片务必上传！'))
  }
}
const rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl }
  ]
}
const removeTradeMark = async (id: number) => {
  let result:any = await reqDeleteTrademark(id)
  if (result.code === 200) {
    ElMessage.success('删除品牌成功！')
    // 删除成功之后立马再次获取已有品牌数据
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除品牌失败！')
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>