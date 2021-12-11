import React from 'react';
import { message } from 'antd';
import { myValidateFn } from '@/utils/utils';
// 引入富文本编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from './index.less';

export default class BraftEditors extends React.Component {
  state = {};
  handleChange = content => {
    //    将数据格式化以后返回
    // this.props.handleChange(content.toHTML().replace(/\s+([^<>]+)(?=<)/g, function (match) { return match.replace(/\s/g, '&nbsp;'); }))
    /** 前端页面做样式处理
     * import 'braft-editor/dist/output.css'
     * 外层html中添加class braft-output-content
     * 加css属性white-space: pre;
     */
    this.props.handleChange(content.toHTML());
  };
  componentDidMount() {
    if (this.props.instance) this.props.instance(this.editorInstance);
  }
  render() {
    const {
      uploadImgUrl,
      content = '',
      image = true,
      video = false,
      minHeight = '500px',
      placeholder = '',
      disabled = false,
      excludeControls=['emoji'],
      height,
      externals = {
        image: true,
        video: true,
        audio: true,
        embed: true
      }
    } = this.props;
    const uploadFn = param => {
      const serverURL = uploadImgUrl;
      const xhr = new XMLHttpRequest();
      const fd = new FormData();

      // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
      // console.log(param.libraryId)

      const successFn = response => {
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
        if (JSON.parse(xhr.responseText).status === 1) {
          const url = JSON.parse(xhr.responseText).data;
          param.success({
            url,
            meta: {
              controls: true, // 指定音视频是否显示控制栏
              poster: url + '?x-oss-process=video/snapshot,t_50,f_jpg,w_0,h_0', // 指定视频播放器的封面
            },
          });
        } else {
          message.error(JSON.parse(xhr.responseText).statusDesc);
          return;
        }
      };

      const progressFn = event => {
        // 上传进度发生变化时调用param.progress
        param.progress((event.loaded / event.total) * 100);
      };

      const errorFn = response => {
        // 上传发生错误时调用param.error
        param.error({
          msg: JSON.parse(xhr.responseText).statusDesc,
        });
      };

      xhr.upload.addEventListener('progress', progressFn, false);
      xhr.addEventListener('load', successFn, false);
      xhr.addEventListener('error', errorFn, false);
      xhr.addEventListener('abort', errorFn, false);

      fd.append('file', param.file);
      xhr.open('POST', serverURL, true);
      xhr.send(fd);
    };
    let defaultValue = {};
    if (content) {
      defaultValue = {
        defaultValue: BraftEditor.createEditorState(content),
      };
    }
    const editorProps = {
      contentFormat: 'html',
      excludeControls: excludeControls,
      onChange: this.handleChange,
      // onBlur: this.handleChange,
      placeholder: placeholder,
      disabled,
      media: {
        allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        accepts: {
          image, // 开启图片插入功能
          video, // 开启视频插入功能
          audio: false, // 开启音频插入功能
        },
        validateFn: myValidateFn, // 指定本地校验函数，说明见下文
        uploadFn: uploadFn, // 指定上传函数，说明见下文
        removeConfirmFn: null, // 指定删除前的确认函数，说明见下文
        onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
        onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
        onInsert: null, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
        externalMedias: {
          image: true,
          audio: false,
          video: false,
          embed: false,
        },
        externals: externals
      },
      lineHeights: [1, 1.2, 1.25, 1.4, 1.5, 1.75, 2, 2.5, 3],
    };
    return (
      <BraftEditor
        {...editorProps}
        {...defaultValue}
        className={disabled ? styles.braftEditorDisabled : ''}
        ref={instance => (this.editorInstance = instance)}
        contentStyle={{ height: height ?? '390px', overflowY: 'auto' }}
      />
    );
  }
}
