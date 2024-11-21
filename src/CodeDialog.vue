<template>

  <el-dialog
    :modelValue="dialogVisible"
    :title="props.title"
    width="500"
    align-center
  >
  <el-input v-model="inputKey" @input="handleInput" placeholder="Please input" />
  <el-table
    ref="singleTableRef"
    :data="tableData"
    highlight-current-row
    style="width: 100%"
    @current-change="handleCurrentChange"
  >
    <el-table-column type="index" width="50" />
    <el-table-column property="label" label="来源" width="120" />
    <el-table-column property="detail" label="描述" />
  </el-table>
    <template #footer>
      <div class="dialog-footer">
        <!-- <el-button @click="props.onHandleClose()">取消</el-button>
        <el-button type="primary" @click="props.onHandleConfirm(data)">
          确定
        </el-button> -->
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, defineProps,  } from 'vue'
import { ElDialog, ElButton, ElTable, ElTableColumn, ElInput} from 'element-plus'
import {VARLIST } from './cosnt.js'

import 'element-plus/dist/index.css'
const props = defineProps({
  title: {
    type: String,
    default: '温馨提示'
  },
  delContent: {
    type: String,
    default: ''
  },
  dialogVisible: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  onHandleConfirm: {
    type: Function,
    default: () => {}
  },
  onHandleClose: {
    type: Function,
    default: () => {}
  }
})

interface TableDataItem {
  apply: string
  detail: string
  type: string
  label: string
}
const regexp = /\[\[(.+?)\]\]/g
const data = ref<TableDataItem>({ apply: '', detail: '', type: '', label: ''})
const inputKey = ref('')
const handleCurrentChange = (val: any) => {
  data.value.apply = val.apply
  props.onHandleConfirm(data.value)
}
const varListTable = VARLIST.map(item => {
  return {
    label: item.label,
    apply: item.apply.replace('@', ''),
    detail: item.detail
  }
})
const tableData = ref( props.delContent === '' ? varListTable: varListTable.filter(item => {
  return item.apply.replace(regexp, '$1') === props.delContent
}))

const handleInput = (val: string) => {
  tableData.value = VARLIST.filter(item => {
    return item.apply.replace(regexp, '$1').includes(val)
  })
}

</script>
