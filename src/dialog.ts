import CuDialog from './CodeDialog.vue';
import { createApp } from 'vue'

let app:any = null;
let div: any = null;
interface DelMsgType {
  show: (options: ShowOptionType) => void;
  hide: () => void;
}
interface ShowOptionType {
  title: string,
  delContent: string,
  confirm: (val: { apply: string | any[] }) => void
  autoClose?: boolean,
  close?: () => void
}
const delMsg:DelMsgType = {
  /**
   * @param {Object} props
   * @param {String} title 弹窗的标题，不传默认 ‘温馨提示’
   * @param {String} delContent 弹窗的内容，不传默认 ‘确定要删除所选记录吗？’
   * @param {Boolean} autoClose 取消事件是否需要特殊处理，设置false需要手动调用hide方法，不传默认true
   * @param {Function} confirm 弹窗确认事件
   * @param {Function} close 弹窗关闭事件
   */

  show: function (props:ShowOptionType) {
    const { title = '温馨提示', delContent, autoClose = true, confirm, close } = props;
    div = document.createElement('div');
    div.setAttribute('id', 'cu-dialog-id');
    document.body.appendChild(div);
    app = createApp(CuDialog, {
      title,
      dialogVisible: true,
      showClose: true,
      delContent:delContent.replace(/!/g, ''),
      onHandleClose: () => {
        close && close();
        console.log('触发函数内取消事件');
        // 如果需要默认关闭，不做任何逻辑处理请将autoClose设置为true（默认就是true）
        if (autoClose) {
          app.unmount();
          div.remove();
        }
      },
      onHandleConfirm: (val:any) => {
        confirm && confirm(val);
        console.log('触发函数内确认事件');
      }
    });
    app.mount(div);
  },
  hide: function () {
    app.unmount();
    div.remove();
  }
};

export default delMsg;
