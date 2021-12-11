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
import { selfAdaption } from '@/utils/utils'
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
      type: 'activityManagement/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.startTime && formQueryData.startTime.length) {
      formQueryData.activityTimeStart = moment(formQueryData.startTime[0]).format('YYYY-MM-DD')
      formQueryData.activityTimeEnd = moment(formQueryData.startTime[1]).format('YYYY-MM-DD')
    }
    delete formQueryData['startTime']
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
      type: 'activityManagement/setSearchInfo',
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
                <FormItem label="活动名称" {...formItemConfig}>
                  {getFieldDecorator('activityName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('isUse')(
                    <Select allowClear>
                      <Option key={0} value={0}>禁用</Option>
                      <Option key={1} value={1}>启用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="活动时间" {...formItemConfig}>
                  {getFieldDecorator('startTime')(
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
