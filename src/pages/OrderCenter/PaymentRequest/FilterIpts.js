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
      type: 'paymentRequestManage/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD');
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD');
      delete formQueryData['createTime'];
    }
    if (formQueryData.updateTime && formQueryData.updateTime.length) {
      formQueryData.updateTimeStart = moment(formQueryData.updateTime[0]).format('YYYY-MM-DD');
      formQueryData.updateTimeEnd = moment(formQueryData.updateTime[1]).format('YYYY-MM-DD');
      delete formQueryData['updateTime'];
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
      type: 'paymentRequestManage/setSearchInfo',
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
                  <FormItem label="购买订单号" {...formItemConfig}>
                    {getFieldDecorator('orderId')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="银行流水号" {...formItemConfig}>
                    {getFieldDecorator('outOrderNo')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="支付订单号" {...formItemConfig}>
                    {getFieldDecorator('requestId')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="用户名" {...formItemConfig}>
                    {getFieldDecorator('userName')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="业务类型" {...formItemConfig}>
                    {getFieldDecorator('paymentType')(
                      <Select allowClear>
                        <Option value={1}>认购</Option>
                        <Option value={2}>车位交易支付</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="状态" {...formItemConfig}>
                    {getFieldDecorator('paymentStatus')(
                      <Select allowClear>
                        <Option value={0}>待支付</Option>
                        <Option value={1}>支付成功</Option>
                        <Option value={2}>支付失败</Option>
                        <Option value={3}>支付异常</Option>
                        <Option value={4}>支付超时</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                
                <Col  {...inputConfig}>
                  <FormItem label="发起时间" {...formItemConfig}>
                    {getFieldDecorator('createTime')(
                      <RangePicker />
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="完成时间" {...formItemConfig}>
                    {getFieldDecorator('updateTime')(
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
