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

export default class PlanFilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'rentManage/setPlanSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 委托结束日
    if (formQueryData.dueDate && formQueryData.dueDate.length) {
      formQueryData.dueDateStart = moment(formQueryData.dueDate[0]).format('YYYY-MM-DD')
      formQueryData.dueDateEnd = moment(formQueryData.dueDate[1]).format('YYYY-MM-DD')
    }
    delete formQueryData['dueDate'];
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
      type: 'rentManage/setPlanSearchInfo',
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
                <FormItem label="续约编号" {...formItemConfig}>
                  {getFieldDecorator('renewNo')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="车位订单号" {...formItemConfig}>
                  {getFieldDecorator('parkingOrderNo')(
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
                <FormItem label="续约状态" {...formItemConfig}>
                  {getFieldDecorator('autoRenew')(
                    <Select allowClear placeholder="请选择">
                      <Option value={1}>是</Option>
                      <Option value={0}>否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="委托结束日" {...formItemConfig}>
                  {getFieldDecorator('dueDate')(
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
