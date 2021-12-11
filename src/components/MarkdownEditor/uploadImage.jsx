import * as React from "react";
import { PluginComponent } from "react-markdown-editor-lite";
import Upload from "./UploadMarkImage";
import { _baseApi } from '@/defaultSettings.js';


export default class uploadImage extends PluginComponent {
  // 这里定义插件名称，注意不能重复
  static pluginName = "my-uploadImage";
  constructor(props) {
    super(props);
  }
  // 图片回调
  setImgUrl = (val) =>{
    let list = val || [];
    // 调用API，往编辑器中插入一个数字
    this.editor.insertMarkdown('image', {
      target: list[list.length - 1].name,
      imageUrl: list[list.length - 1].url,
    });
  }

  render() {
    return (
      <Upload
        url={`${_baseApi}${this.props.config.uploadImageUrl}`}
        size={5}
        fileList={[]}
        setIconUrl={(val) => this.setImgUrl(val)}
      />
    );
  }
}
