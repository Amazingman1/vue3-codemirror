<script lang="ts" setup>
import { ref, defineComponent, type Ref, inject, watch, onMounted } from 'vue';
import CodeMirror from 'vue-codemirror6';
import type { LanguageSupport } from '@codemirror/language';
import type { Extension } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';
import { EditorState } from "@codemirror/state";
//增加自动补全包
import {CompletionContext,completeFromList,autocompletion} from "@codemirror/autocomplete"
//自定义引入java包，从npmjs官网下载
import {java} from "@codemirror/lang-java"
//自定义装饰块
import { MatchDecorator, WidgetType, EditorView } from "@codemirror/view";
import { PlaceholderWidget } from "./kimExt";
import {Decoration, DecorationSet, ViewPlugin, keymap } from "@codemirror/view";

//此代码暂无太多作用，用于定义editor的值
const value: Ref<string> = ref('');
const dark: Ref<boolean> = ref(
  window.matchMedia('(prefers-color-scheme: dark)').matches
);
// 注入选中的代码
const currCode = inject('codeText')

watch(currCode, (newValue, oldValue) => {

  const { codeText } = currCode

  value.value = value.value+codeText.apply

})
/**add by kim
自定义的变量，支持自动补全
**/
const selfParam = [
  {label: "user.age", type: "variable", apply: "[[age]]", detail: "年龄"},
  {label: "user.sex", type: "variable", apply: "[[sex]]", detail: "性别"},
  {label: "user.name", type: "variable", apply: "[[name]]", detail: "姓名"},
  {label: "model.credit_score", type: "variable", apply: "[[credit_score]]", detail: "信用分"},
  {label: "user.credit_limit", type: "variable", apply: "[[credit_limit]]", detail: "额度"}
]

/**add by kim
java支持，查阅lang-java的index.js第40行
本方法支持支持高亮显示、但不支持自动补全
**/
const lang : LanguageSupport = java();

/**add by kim
增加了java关键词的自动补全
**/
function definJavaParam(){
  var javaParam = []
  let javakey = ["abstract","assert","boolean","break","byte","case","catch","char","class","const"];
  javakey = javakey.concat(["continue","default","do","double","else","enum","extends","final","finally","float"]);
  javakey = javakey.concat(["for","goto","if","implements","import","instanceof","int","interface","long","native"]);
  javakey = javakey.concat(["new","package","private","protected","public","record","return","strictfp","short","static"]);
  javakey = javakey.concat(["super","switch","synchronized","this","throw","throws","transient","try","void","volatile"]);
  javakey = javakey.concat(["while","String"]);
  for(var i= 0; i < javakey.length; i++){
    var param = {label: javakey[i], type: "keyword"};
    javaParam.push(param);
  }
  return javaParam;
}
const javaParam = definJavaParam();

/**add by kim
增加了java的函数
**/
function definJavaFun(){
  var javaFun = [];
  javaFun = javaFun.concat({label: "if", type: "function", apply: "if( [[条件]] ){\n  [[方法体]] }" , detail: "判断函数"});
  javaFun = javaFun.concat({label: "try", type: "function", apply: "try{\n  [[方法体]] }\n catch(Exception e){\n [[异常处置]]}" , detail: "异常捕捉函数"});
  return javaFun;
}
const javaFun = definJavaFun();
/**add by kim
注册了扩展事件
**/
function myCompletions(context) {
  let word = context.matchBefore(/\w*/)

  console.log('word',word)
  if (word.from == word.to && !context.explicit)
    return null
  return {
    from: word.from,
    options: selfParam.concat(javaParam).concat(javaFun)
  }
}

/**add by kim
超级坑的方法，源码与文档中都没有写全
通过自定义的kimext控制样式
通过[[var]]打上装饰
**/
const placeholderMatcher = new MatchDecorator({
  regexp: /\[\[(.+?)\]\]/g,
  decoration: match => Decoration.replace({
    widget: new PlaceholderWidget(match[1]),
  })
})

const placeholders = ViewPlugin.fromClass(class {
  placeholders: DecorationSet
  constructor(view: EditorView) {
    this.placeholders = placeholderMatcher.createDeco(view)
  }
  update(update: ViewUpdate) {
    this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders)

  }
}, {
    decorations: instance => instance.placeholders,
    provide: plugin => EditorView.atomicRanges.of(view => {
    return view.plugin(plugin)?.placeholders || Decoration.none
  })
})
//注册插件
const extensions = [
  autocompletion({ override: [myCompletions] }),
  placeholders
]
const save = () => {
  console.log(value.value, '结果')
}
const change = (value: string) => {
  console.log(value, 'change')
}

</script>

<template>
  <code-mirror
    v-model="value"
    basic
    :dark="dark"
    :lang="lang"
    :extensions="extensions"
    @change="change"
  />
  <button @click="save">保存</button>
</template>
