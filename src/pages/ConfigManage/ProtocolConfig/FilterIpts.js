import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
  DatePicker,
  TreeSelect
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import {selfAdaption} from '@/utils/utils'
const {inputConfig,timeConfig,formItemConfig,searchConfig,colConfig} = selfAdaption()

const FormItem = Form.Item
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
const Option = Select.Option;

@connect()

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'protocolTemplateManage/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    return formQueryData;
  }
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount() {
    this.props.getChild(this)
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'protocolTemplateManage/setSearchInfo',
      payload: {},
    })
  }
  render() {
    const { form: { getFieldDecorator }, searchWholeState } = this.props
    const formConfig = {
      labelCol:  { span: 7 },
      wrapperCol: { span: 17 }
    }
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
                <Col  {...inputConfig}>
                  <FormItem label="id" {...formItemConfig}>
                    {getFieldDecorator('id')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="协议id" {...formItemConfig}>
                    {getFieldDecorator('protocolId')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="协议模板名称" {...formItemConfig}>
                    {getFieldDecorator('protocolName')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="前台显示名称" {...formItemConfig}>
                    {getFieldDecorator('displayName')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="协议类型" {...formItemConfig}>
                    {getFieldDecorator('protocolType')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="协议版本号(当前协议使用的版本号)" {...formItemConfig}>
                    {getFieldDecorator('versionNumber')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="状态(0.协议不显示1.协议显示)" {...formItemConfig}>
                    {getFieldDecorator('status')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="协议路径(当前协议显示路径)" {...formItemConfig}>
                    {getFieldDecorator('protocolUrl')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="pdf图片路径地址" {...formItemConfig}>
                    {getFieldDecorator('imgUrl')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="备注(当前协议)" {...formItemConfig}>
                    {getFieldDecorator('remarks')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="是否在帮助中心显示（0不显示，1显示）" {...formItemConfig}>
                    {getFieldDecorator('isShow')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="删除标志（0代表存在 1代表删除）" {...formItemConfig}>
                    {getFieldDecorator('delFlag')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="创建者" {...formItemConfig}>
                    {getFieldDecorator('createBy')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="创建时间" {...formItemConfig}>
                    {getFieldDecorator('createTime')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="更新者" {...formItemConfig}>
                    {getFieldDecorator('updateBy')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="更新时间" {...formItemConfig}>
                    {getFieldDecorator('updateTime')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col {...searchConfig}>
                  <FormItem {...formItemConfig}>
                    <Button onClick={this.formSubmit} type="primary">搜索</Button>
                    <Button onClick={this.reset} style={{ marginLeft: 8 }}>清空</Button>
                  </FormItem>
                </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}
