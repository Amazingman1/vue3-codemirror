<template>
  <div class="header-btn">
    <el-button style="color: #fff;" @click="formatCode" link size="small">帮助</el-button>
    <el-button style="color: #fff;" @click="formatCode" link size="small">格式代码</el-button>
  </div>
  <div class="code" ref="codeMirror">
  </div>
  <!-- <el-button @click="codeDuble">检测</el-button> -->
</template>
<script setup lang="ts">
import { onMounted, ref, defineExpose, defineEmits } from "vue";
import { EditorView, minimalSetup, basicSetup } from "codemirror";
import { EditorState, Text } from "@codemirror/state";
import { java } from "@codemirror/lang-java";
import { CompletionContext, completeFromList, autocompletion } from "@codemirror/autocomplete"
import { PlaceholderWidget } from "./kimExt";
import { hasParam, DEFINKEY, DEFINALL } from './cosnt'
import { oneDark } from '@codemirror/theme-one-dark'
import delMsg from './dialog'
import {
  MatchDecorator,
  WidgetType,
  Decoration,
  DecorationSet,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { tags } from '@lezer/highlight'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { hoverTooltip, Tooltip } from '@codemirror/tooltip';
import beautify from "js-beautify"

const hideBracketsDecoration = Decoration.mark({ class: 'hidden-text' });

function hideBracketsPlugin() {
  return EditorView.decorations.compute([EditorState.doc], state => {
    let decorations = [];
    let doc = state.doc;
    let regex = /\[\[\$(.*?)\]\]/g; // 匹配 [[$ ... ]] 格式
    let match;

    // 查找所有匹配的模式
    while ((match = regex.exec(doc.toString())) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // 创建装饰器来隐藏 "[[$" 和 "]]"
      decorations.push(hideBracketsDecoration.range(start, start + 3)); // 隐藏 "[[$"
      decorations.push(hideBracketsDecoration.range(end - 2, end)); // 隐藏 "]]"
    }

    return Decoration.set(decorations);
  });
}

const codeMirror = ref(null);
const changeTab = (val: any) => {
  addDocToFocus(val.apply)
  editor.focus();
}

defineExpose({
  changeTab
})

// 在光标位置插入内容
const addDocToFocus = (text: string | any[]) => {
  console.log('text', text)
  if (editor) {
    const insertText = typeof text === 'string' ? text : text.join('\n');
    editor.dispatch({
      changes: {
        from: editor.state.selection.main.head,
        to: editor.state.selection.main.head,
        insert: insertText,
      },
      // 光标位置放到插入内容的末尾
      selection: {
        anchor: editor.state.selection.main.head + insertText.length,
      },
    });
  }
};


/**
 * description：初始化编辑器视图，操作试图方法一般都在editor中
 */
let editor: EditorView;

const myCompletions = (context: { matchBefore: (arg0: RegExp) => any; explicit: any; }) => {
  console.log('context', context)
  // let wordKye = context.matchBefore()
  // console.log('word',wordKye, wordKye.text ,wordKye.text === '')
  let word = context.matchBefore(/\w*/)

  if (word.from == word.to && !context.explicit)
    return null
  return {
    from: word.from,
    options: DEFINALL
  }
}

const emit = defineEmits(['change'])
const regexp = /\[\[(.+?)\]\]/g
const codeDuble = () => {
  // replaceContentCopy()
  const result: any[] = []
  editor.state.doc.text.map((item: string) => {
    console.log('item粘贴近年来的代码', item)
    const match = item.match(regexp)
    if (match) {
      result.push(match)
    }
  })
  console.log('result', result.flat())
  result.flat().map(item => {
    console.log('item', item)
    // if(hasParam(item)) {
    replaceContent(item)
    // }
  })
}

function replaceContentCopy () {
  const currentContent = editor.state.doc.toString();

  console.log(editor.state.doc.toString(), '检测后的内容1111333')
  let updatedContent = currentContent.replace(currentContent, highlightVariables(currentContent)); // 替换内容

  // 使用事务来替换文档内容
  const transaction = editor.state.update({
    changes: { from: 0, to: currentContent.length, insert: updatedContent },
  });
  // 更新编辑器内容，但保持扩展和状态
  editor.dispatch(transaction);

}
// 重置编辑器内容
function replaceContent (item: string) {
  const currentContent = editor.state.doc.toString();
  const str = item.replace(regexp, '$1')
  let updatedContent
  if (hasParam(item)) {
    updatedContent = currentContent.replace(item, `[[!${str}]]`); // 替换内容
  } else {
    updatedContent = currentContent.replace(item, item.replace(/!/g, '')); // 替换去掉标记
  }
  // 使用事务来替换文档内容
  const transaction = editor.state.update({
    changes: { from: 0, to: currentContent.length, insert: updatedContent },
  });
  // 更新编辑器内容，但保持扩展和状态
  editor.dispatch(transaction);

  console.log(editor.state.doc.toString(), '检测后的内容')
}
const change = (value: Text) => {
  emit('change', value)
}
// 创建高亮样式自定义变量
const customHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: 'red' },  // 高亮关键字为红色
  { tag: tags.variableName, color: 'blue' },  // 高亮变量名为蓝色
  { tag: tags.string, color: 'green' },  // 高亮字符串为绿色
  { tag: tags.comment, color: 'gray' },  // 高亮注释为灰色
]);

// 创建自动补全与悬浮提示
function tooltipExtension () {

  return [hoverTooltip((view, pos, side) => {
    const word = getVariableAt(view.state, pos);  // 获取变量名称
    if (word) {
      // 返回悬浮提示内容，假设 word 是我们检测到的变量名
      return {
        pos,
        end: pos + word.length,
        dom: createTooltip(word) // 创建并返回 Tooltip DOM 元素
      };
    }
    return null;  // 没有找到变量时不显示提示
  })
  ]

}

// 获取光标下的变量名（简化版本）
function getVariableAt (state: any, pos: number) {
  const word = state.doc.sliceString(pos - 10, pos);  // 获取当前位置前10个字符
  if (/\w+/.test(word)) {  // 如果匹配到字母或数字，认为是一个变量
    return word;
  }
  return null;
}
// 创建提示内容
function createTooltip (word: any) {
  const div = document.createElement("div");
  div.className = "tooltip";  // 你可以为它加样式
  div.textContent = `Variable: ${word}`; // 显示变量名称，当然你可以做更复杂的提示
  return div;
}
// 创建一个正则表达式来匹配变量名
function highlightVariables (code: string) {

  const keywords = new Set(DEFINKEY());
  // 定义一个正则表达式来匹配变量名
  const variableRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
  // 使用正则表达式替换代码中的所有变量
  return code.replace(variableRegex, (match: any) => {
    if (keywords.has(match) || match.startsWith('[[') && match.endsWith(']]')) {
      return match;
    }
    // 你可以在这里自定义你想要的标记形式
    return `[[${match}]]`;  // 用 {{variableName}} 包裹变量名
  });
}
// 输入@显示变量搜索框选择变量插入
const insertVariable = (update: ViewUpdate) => {
  const changes = update.changes;
  changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
    // `inserted` 是一个插入的文本内容
    if (inserted.length > 0) {
      console.log("当前插入的内容:", inserted);
      if (inserted.toString() === '@') {
        delMsg.show({
          title: '弹窗', delContent: '', confirm: (val: { apply: string | any[]; }) => {
            addDocToFocus(val.apply);
            delMsg.hide();
          }
        })
      }
    }
  });
}
// 用于格式化代码并保持 `[[...]]` 内的内容不变
function formatCodeWithPreservedVariables(code: string) {
  // 使用正则表达式匹配 `[[...]]` 内的内容
  const regex = /\[\[([^\]]+)\]\]/g;

  // 创建一个映射来存储占位符和原始内容
  const placeholders:any[] = [];

  // 临时替换所有 `[[...]]` 内的内容为占位符
  let codeWithPlaceholders = code.replace(regex, (match, p1) => {
    const placeholder = `__PLACEHOLDER_${placeholders.length}__`;
    placeholders.push({ placeholder, content: match });
    return placeholder;
  });

  // 格式化代码
  const formattedCode = beautify.js(codeWithPlaceholders, {
    indent_size: 2,
    space_in_empty_paren: true
  });

  // 恢复占位符为原始的 `[[...]]` 内容
  let finalCode = formattedCode;
  placeholders.forEach(item => {
    const regexPlaceholder = new RegExp(item.placeholder, 'g');
    finalCode = finalCode.replace(regexPlaceholder, item.content);
  });

  return finalCode;
}
// 格式化代码js模拟java
function formatCode() {
  const code = editor.state.doc.toString();  // 获取编辑器中的 Java 代码
  const formattedCode = formatCodeWithPreservedVariables(code)
  editor.dispatch({
    changes: { from: 0, to: code.length, insert: formattedCode }
  });
}

onMounted(() => {
  const placeholderMatcher = new MatchDecorator({
    regexp, //支持中文
    decoration: (match) =>
      Decoration.replace({
        widget: new PlaceholderWidget(match[1]),
        // widget: match[1],
      }),
  });
  const placeholders = ViewPlugin.fromClass(
    class {
      placeholders: DecorationSet;
      constructor(view: EditorView) {
        this.placeholders = placeholderMatcher.createDeco(view);
      }
      update (update: ViewUpdate) {
        this.placeholders = placeholderMatcher.updateDeco(
          update,
          this.placeholders
        );
      }
    },
    {
      decorations: (instance) => instance.placeholders,
      provide: (plugin) =>
        EditorView.atomicRanges.of((view) => {
          return view.plugin(plugin)?.placeholders || Decoration.none;
        }),
    }
  );

  if (codeMirror.value) {
    const baseTheme = EditorView.baseTheme({
      ".cm-mywidget": {
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingTop: "3px",
        paddingBottom: "3px",
        marginLeft: "3px",
        marginRight: "3px",
        backgroundColor: "#ffcdcc",
        borderRadius: "4px",
      },
    });
    editor = new EditorView({
      state: EditorState.create({
        doc: "",
        extensions: [
          placeholders,
          baseTheme,
          basicSetup,
          oneDark,
          // tooltipExtension(),
          autocompletion({ override: [myCompletions] }), // 添加自动补全扩展
          java(),
          // hideBracketsPlugin(),
          // syntaxHighlighting(customHighlightStyle),
          // customHighlightStyle,
          EditorView.updateListener.of((update) => {
            // 更新内容
            if (update.docChanged) {
              console.log('修改了22', update.state.doc.toString())
              change(update.state.doc)
              insertVariable(update)
            }
          })
        ],
      }),
      parent: codeMirror.value,
    })
    // editor.setSize('auto', "100px");
  }
});
</script>

<style>
.code {
  width: 100%;
  height: 300px;
}

.cm-editor {
  height: 60vh !important;
}
.header-btn{
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background-color: #292c33;
  width: 100%;
  box-sizing: border-box;
}

.tooltip {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  position: absolute;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
