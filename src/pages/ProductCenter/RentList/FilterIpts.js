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
import { selfAdaption, filterEmptyObject } from '@/utils/utils'
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption()

const FormItem = Form.Item
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
const Option = Select.Option;

@connect()

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'rentManage/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.holdTime && formQueryData.holdTime.length) {
      formQueryData.holdTimeStart = moment(formQueryData.holdTime[0]).format('YYYY-MM-DD')
      formQueryData.holdTimeEnd = moment(formQueryData.holdTime[1]).format('YYYY-MM-DD')
    }
    // 注册时间
    if (formQueryData.mustTime && formQueryData.mustTime.length) {
      formQueryData.mustTimeStart = moment(formQueryData.mustTime[0]).format('YYYY-MM-DD')
      formQueryData.mustTimeEnd = moment(formQueryData.mustTime[1]).format('YYYY-MM-DD')
    }
    delete formQueryData['holdTime']
    delete formQueryData['mustTime']
    return filterEmptyObject(formQueryData);
  }
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount() {
    this.props.getChild(this)
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'rentManage/setSearchInfo',
      payload: {},
    })
  }
  render() {
    const { form: { getFieldDecorator }, searchWholeState } = this.props
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    }
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="车位订单号" {...formItemConfig}>
                  {getFieldDecorator('orderId')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="当前持有人" {...formItemConfig}>
                  {getFieldDecorator('buyerName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="楼盘名称" {...formItemConfig}>
                  {getFieldDecorator('buildingName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="车位号" {...formItemConfig}>
                  {getFieldDecorator('parkingCode')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="当前产品类型" {...formItemConfig}>
                  {getFieldDecorator('rentType')(
                    <Select allowClear>
                      <Option value={1}>无忧退货</Option>
                      <Option value={0}>无服务</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="持有时间" {...formItemConfig}>
                  {getFieldDecorator('holdTime')(
                    <RangePicker></RangePicker>
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="应付时间" {...formItemConfig}>
                  {getFieldDecorator('mustTime')(
                    <RangePicker></RangePicker>
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
