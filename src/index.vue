<template>
  <div class="common-layout">
    <el-container style="height:100vh">
      <el-container>
        <el-aside width="40%" style="height:100%">
          <Tabs ref="tabs" @getCurrentKey="changeTab"></Tabs>
        </el-aside>
        <el-main>
          <EditorView ref="editorView" @change="changeCode"></EditorView>
        </el-main>
      </el-container>
      <el-aside width="30%" style="height:100%">
          <TestAside ref="testAside"></TestAside>
        </el-aside>
    </el-container>
  </div>


</template>

<script setup>
  import Tabs from './Tabs.vue'
  import EditorView from './EditViewCopy.vue'
  import TestAside from './TestAside.vue'
  import { reactive, ref} from 'vue'

  const tabs = ref(null)
  const editorView = ref(null)
  const testAside = ref(null)
  const changeCode = (code) => {
    if(testAside.value) {
      testAside.value.changeCode(code)
    }
  }
  // 将tabs节点信息传递到编辑器中
  const changeTab = (tab) => {
    if(editorView.value) {
      editorView.value.changeTab(tab)
    }
  }

</script>
