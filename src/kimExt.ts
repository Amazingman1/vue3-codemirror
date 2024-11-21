// 此处为 import { PlaceholderWidget } from "./index"; 的index 文件
import {
    WidgetType,
  } from "@codemirror/view";
  import delMsg from './dialog.js'


  const domToColor = (name: string):string => {
    const colors = {
      '!': 'pink', // 重复变量
      '$': 'lightblue', // 参数变量
      '#': 'green', // 组件变量
      '^': 'yellow' // 模型变量
    }
    if(name.includes('!')) {
      return 'pink';
    } else if(name.includes('$') ) {
      return '#C7635E';
    } else if(name.includes('#')) {
      return '#76935a';
    } else if(name.includes('^')) {
      return '#ffb703';
    } else {
      return '#00b4d8';
    }

  }
  export class PlaceholderWidget extends WidgetType {
    name: any;
    constructor(name:any) {
      super();
      this.name = name;
    }
    eq(other:any) {
      return this.name == other.name;
    }
    toDOM() {
      let elt = document.createElement("span");
      if(this.name.includes('!')) {
        elt.style.cssText = `
          border: 1px solid red;
          border-radius: 4px;
          padding: 0 3px;
          background: pink;`;
        elt.style.cursor = 'pointer';
        elt.textContent = this.name;
        elt.addEventListener('click', (e) => {
          console.log('click', e.clientX);
          delMsg.show({title:'弹窗',delContent:this.name,confirm:(val) =>{
            console.log('确认事件触发', val);
            elt.textContent = val.apply as string;
            elt.style.cssText = `
              border: 1px solid blue;
              border-radius: 4px;
              padding: 0 3px;
              background: lightblue;`;
            delMsg.hide();
          }})
        })
        return elt;
      } else {
        elt.style.cssText = `
          border: 1px solid ${domToColor(this.name)};
          border-radius: 4px;
          padding: 0 3px;
          color: #fff;
          background: ${domToColor(this.name)};`;
          elt.textContent = this.name;
        return elt;
      }

    }
    ignoreEvent() {
      return false;
    }
  }
