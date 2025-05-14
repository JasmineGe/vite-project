<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0;">
      <div v-show="scene === 0">
        <el-button v-has="'btn.Attr.add'" @click="addAttr" type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id">添加属性</el-button>
        <el-table border style="margin: 10px 0;" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{row}">
              <el-tag style="margin: 5px;" v-for="item in row.attrValueList" :key="item.id">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{row}">
              <el-button v-has="'btn.Attr.update'" type="warning" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <el-popconfirm :title="`您确定要删除${row.attrName}吗？`" width="250px" icon="Delete" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button v-has="'btn.Attr.remove'" type="danger" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <el-form inline>
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="Plus" :disabled="!attrParams.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性值">
            <template #="{row, $index}">
              <el-input :ref="(vc:any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)" size="small" placeholder="请输入属性值" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{$index}">
              <el-button type="danger" size="small" icon="Delete" @click="attrParams.attrValueList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="!attrParams.attrValueList[0]?.valueName">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import useCategoryStore from '@/store/modules/category';
import { reqAttr, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus';

// let attrArr = ref<AttrList>([]) 两种写法均可
let attrArr = ref<Attr[]>([])
let categoryStore = useCategoryStore()
let scene = ref<number>(0)
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '', // 三级分类ID
  categoryLevel: 3 // 代表三级分类
})
// 准备一个数组，将来存储对应的组件实例 el-input
let inputArr = ref<any>([])

watch(() => categoryStore.c3Id, () => {
  attrArr.value = []
  if (!categoryStore.c3Id) return
  getAttr()
})
const getAttr = async() => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result:AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}
const addAttr = () => {
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id, // 三级分类ID
    categoryLevel: 3 // 代表三级分类
  })
  scene.value = 1
}
const updateAttr = (row:Attr) => {
  scene.value = 1
  // 需要使用深拷贝，否则点击取消按钮，数据仍展示在 scene=0 的场景表格中
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
const cancel = () => {
  scene.value = 0
}
const addAttrValue = async () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true // 控制每个属性值的编辑与查看模式
  })
  await nextTick()
  inputArr.value[attrParams.attrValueList.length - 1].focus()
}
const save = async () => {
  let result:any = await reqAddOrUpdateAttr(attrParams)
  if (result.code === 200) {
    scene.value = 0
    ElMessage.success(attrParams.id ? '修改成功！': '添加成功！')
    //获取全部已有的属性与属性值
    getAttr();
  } else {
    ElMessage.error(attrParams.id ? '修改失败！': '添加失败！')
  }
}
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况1：不能为空
  if (row.valueName.trim() === '') {
    // 删除属性值为空的行
    attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能为空！')
  }
  // 非法情况2：不能重复
  let repeat = attrParams.attrValueList.find(item => item.valueName === row.valueName && item !== row)
  if (repeat) {
    // 删除属性值重复的行
    attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能重复！')
  }

  row.flag = false
}
const toEdit = async (row: AttrValue, $index:number) => {
  row.flag = true
  // nextTick：响应式数据 flag 发生变化，获取更新的DOM或组件实例
  // 以下两种写法
  // nextTick(() => {
  //   inputArr.value[$index].focus()
  // })
  await nextTick()
  inputArr.value[$index].focus()
}
const deleteAttr = async (attrId:number) => {
  let result:any = await reqDeleteAttr(attrId)
  if (result.code === 200) {
    ElMessage.success('删除成功！')
    getAttr()
  } else
  ElMessage.error('删除失败！')
}
// 路由组件销毁的时候，把仓库中的分类相关的数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped>

</style>