<template>
  <el-tabs style="height: 100%" class="demo-tabs">
    <el-tab-pane label="测试">
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item v-for="(item, index) in form.formTable" :key="item" :label="item.key">
          <el-input v-model="item.value" placeholder="请输入" />
        </el-form-item>
        <el-divider />
        <el-form-item label="预测结果">
          <el-input v-model="form.result" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">测试</el-button>
          <!-- <el-button>保存测试用例</el-button> -->
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="测试用例" id="test" >
      <el-button type="primary" @click="dialogVisible = true">open</el-button>

    </el-tab-pane>
  </el-tabs>
  <teleport defer to="#test">
    <el-dialog v-model="dialogVisible" title="小范围遮罩" width="50%" :close-on-click-modal="false"
      custom-class="custom-dialog">
      <p>这是一个弹窗内容。</p>
    </el-dialog>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits, defineExpose } from 'vue';

const emit = defineEmits([]);

let codeStr = ''
let oldArr: any[] = []
let newArr: any[] = []
const dialogVisible = ref(false)
// const
const changeCode = (code: any) => {
  if (codeStr !== code.toString()) {
    codeStr = code.toString()
    const regexp = /\[\[(.+?)\]\]/g
    const result: any[] = []
    code.text.map((item: any) => {
      const match = item.match(regexp)
      if (match) {
        result.push(match)
      }
    })
    // form.formTable = result.flat().map(item => {
    //   return {
    //     key: item.replace(regexp, '$1'),
    //     value: ''
    //   }
    // })
    newArr = result.flat().map(item => item.replace(regexp, '$1'))
    const diff = newArr.filter((item) => !oldArr.includes(item))
    const diff2 = oldArr.filter((item) => !newArr.includes(item))
    oldArr = newArr
    form.formTable = form.formTable.filter((item) => !diff2.includes(item.key)).concat(diff.map((item) => {
      return {
        key: item,
        value: ''
      }
    }))
  }
}
defineExpose({
  changeCode
})
type FormTable = {
  key: string,
  value: string
}
const form = reactive<{ formTable: FormTable[], result: string }>({
  formTable: [],
  result: ''
})

const onSubmit = () => {
  console.log('submit!', form.formTable)
}
</script>

<style scoped>

:deep(.el-overlay){
    position: absolute !important;
  }
:deep(.el-overlay-dialog){
    position: absolute !important;
  }
</style>
