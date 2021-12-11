import * as React from "react";
import { PluginComponent } from "react-markdown-editor-lite";
import ChooseGoods from "../ChooseGoods";
import { Icon } from 'antd';


export default class GoodsChoose extends PluginComponent  {
  constructor(props) {
    super(props);
    this.state = {
      visible: 0
    };
  }
  // 这里定义插件名称，注意不能重复
  static pluginName = "goods-choose";
  // 图片回调
  addGoods = (item) =>{
    this.setState({ visible: 0 })
    let json = JSON.parse(JSON.stringify(item[0]));
    let dom = `<div style='margin: 10px 0; position: relative;'><div style='display: flex; justify-content: space-between; padding: 10px; box-sizing: border-box; border: 1px solid #e8e8e8;"><div style="width: 100%; display: flex; line-height: 20px !important;'><img style='display: inline-block; height: 100px; width: 100px;' src=${json.image} /><div style='display: inline-block; margin-left: 20px; display: flex; flex-direction: column; justify-content: space-between;'><div><div style='font-size: 18px; line-height: 20px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; word-break: break-all; text-overflow: ellipsis; margin-bottom: 10px;'>${json.title}</div><div><span style='font-size: 18px; line-height: 20px; color: #da865e; margin-right: 10px;'>${json.discountPrice ? json.discountPrice : ''}</span><span style='font-size: 18px; line-height: 20px; text-decoration: line-through;'>${json.otPrice ? json.otPrice : ''}</span></div></div><div style='display: flex; align-items: center;'><div style='font-size: 18px; line-height: 20px; margin-right: 40px;'>${json.sold}</div><button style='line-height: 32px; color: #fff; background-color: #1890ff; height: 32px; border: none; width: 50px;'>购买</button></div></div></div></div></div>`;
    // 调用API，往编辑器中插入商品的dom
    this.editor.insertText(dom, true);
  }

  render() {
    return (
      <div className="button button-type-clear">
        <Icon type="select" onClick={()=>{
          this.setState({ visible: 1 })
        }} />
        {
          this.state.visible === 1 &&
          <ChooseGoods
            visible={this.state.visible}
            handleCancel={()=>this.setState({ visible: 0 })}
            handleOk={this.addGoods}
            onlyOne={true}
          />
        }
      </div>
    );
  }
}
