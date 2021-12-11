import React, { Component } from 'react'
import {
  Row,
  Col,
  Input,
  InputNumber,
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

@connect(({ winningRecord, loading }) => ({
  winningRecord,
  loading:
    loading.effects['winningRecord/fetchList'] || loading.effects['winningRecord/statusChangeManage'] || loading.effects['winningRecord/downloadMember'],
}))

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'winningRecord/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD')
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD')
    }
    delete formQueryData.createTime;
    return formQueryData;
  }
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount() {
    this.props.getChild(this)
    const { dispatch } = this.props;
    dispatch({
      type: 'winningRecord/getAllSelect',
      payload: {}
    })
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'winningRecord/setSearchInfo',
      payload: {},
    })
  }
  render() {
    const { form: { getFieldDecorator }, winningRecord } = this.props
    const {parentUtmTypes} = winningRecord
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
                <FormItem label="中奖编号" {...formItemConfig}>
                  {getFieldDecorator('id')(
                    <InputNumber style={{width: '100%'}} min={0} max={999999999} />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="姓名" {...formItemConfig}>
                  {getFieldDecorator('truename')(
                    <Input />
                  )}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="手机号" {...formItemConfig}>
                  {getFieldDecorator('userPhone')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="渠道" {...formItemConfig}>
                  {getFieldDecorator('parentUtmId')(
                    <Select allowClear>
                      {parentUtmTypes && parentUtmTypes.map(item=>{
                        return <Option key={item.key} value={item.value}>{item.title}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="中奖时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(
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
