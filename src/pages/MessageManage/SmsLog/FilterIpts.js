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
      type: 'smsLogManage/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format(dateFormat)
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format(dateFormat)
    }
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
      type: 'smsLogManage/setSearchInfo',
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
                  <FormItem label="手机号" {...formItemConfig}>
                    {getFieldDecorator('smsMobile')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="模板名称" {...formItemConfig}>
                    {getFieldDecorator('tplName')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                {/* <Col  {...inputConfig}>
                  <FormItem label="短信内容" {...formItemConfig}>
                    {getFieldDecorator('smsContent')(
                      <Input />
                    )}
                  </FormItem>
                </Col> */}
                <Col {...inputConfig}>
                  <FormItem label="提交时间" {...formItemConfig}>
                    {getFieldDecorator('createTime')(
                      <RangePicker />
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
