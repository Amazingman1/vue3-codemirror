<template>
  <el-tabs tab-position="left" style="height: 100%" class="demo-tabs">
    <el-tab-pane label="函数">
      <el-input
        v-model="filterFun"
        style="width: 240px"
        placeholder="Filter keyword"
      />
      <el-tree
        ref="javaFunRef"
        style="max-width: 600px"
        class="filter-tree"
        :highlight-current="true"
        :data="javaFun"
        default-expand-all
        :filter-node-method="filterNodeFun"
        @node-click="getCurrentKey"
      >
        <template #default="{ node, data }">
          <el-tooltip effect="dark" :content="data.detail" placement="right-end">
            <span style="width: 100%;">{{ node.label }}</span>
          </el-tooltip>
        </template>
      </el-tree>
    </el-tab-pane>
    <el-tab-pane label="变量">
      <el-input
        v-model="filterText"
        style="width: 240px"
        placeholder="Filter keyword"
      />
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        class="filter-tree"
        :highlight-current="true"
        :data="data"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="getCurrentKey"
      >
        <template #default="{ node, data }">
          <el-tooltip effect="dark" :content="node.label" placement="right-end">
            <span style="width: 100%;">{{ node.label }}</span>
          </el-tooltip>
        </template>
      </el-tree>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import type { TabsInstance } from 'element-plus';
import { CUSTOMVAR, DEFINFUN, PARAMVAR, COMPVAR, MODVAR, MATHFUN, DATEFUN, TEXTFUN, OTHERFUN } from './cosnt';
import { ref, watch, defineEmits } from 'vue';
import { ElTree } from 'element-plus';

interface Tree {
  [key: string]: any;
}

const emit = defineEmits(['getCurrentKey']);
const filterText = ref('');
const filterFun = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();
const javaFunRef = ref();
const defaultProps = {
  children: 'children',
  label: 'label',
};

watch(filterText, val => {
  treeRef.value!.filter(val);
});
watch(filterFun, val => {
  javaFunRef.value!.filter(val);
});
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
// {label: "if", type: "function", apply: "if( [[条件]] ){\n  [[方法体]] }" , detail: "判断函数"},
const filterNodeFun = (value: string, data: Tree) => {
  if (!value) return true;
  console.log(data, value);
  return data.label.includes(value);
};
// {label: "user.age", type: "variable", apply: "[[age]]", detail: "年龄"},
const getCurrentKey = (key: any) => {
  if(key.children)  return;
  emit('getCurrentKey', key);
};
const data: Tree[] = [
{
    id: 1,
    label: '变量',
    children: CUSTOMVAR,
    detail: '普通变量'
  },
  {
    id: 2,
    label: '参数',
    children: PARAMVAR,
    detail: '参数变量'
  },
  {
    id: 3,
    label: '模型',
    children: MODVAR,
    detail: '模型变量'
  },
  {
    id: 4,
    label: '组件',
    children: COMPVAR,
    detail: '组件变量'
  }

];

const javaFun = [
    {
    id: 1,
    label: '数值函数',
    children: MATHFUN,
    detail: '数值函数'

  },
  {
    id: 2,
    label: '日期函数',
    children: DATEFUN,
    detail: '日期函数'

  },
    {
    id: 3,
    label: '逻辑函数',
    children: DEFINFUN,
    detail: '逻辑函数'

  },
    {
    id: 4,
    label: '文本函数',
    children: TEXTFUN,
    detail: '文本函数'

  },
    {
    id: 5,
    label: '其他函数',
    children: OTHERFUN,
    detail: '其他函数'

  },
]
</script>

<style>

</style>
