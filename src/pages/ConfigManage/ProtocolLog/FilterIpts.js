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
      type: 'protocolLogManage/setSearchInfo',
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
      type: 'protocolLogManage/setSearchInfo',
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
                  <FormItem label="版本号" {...formItemConfig}>
                    {getFieldDecorator('versionNumber')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>
                  <FormItem label="操作（0.创建1.修改2.删除）" {...formItemConfig}>
                    {getFieldDecorator('operation')(
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
