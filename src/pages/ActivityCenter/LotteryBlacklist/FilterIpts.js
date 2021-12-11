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

@connect(({ lotteryBlacklist, loading }) => ({
  lotteryBlacklist,
  loading:
    loading.effects['lotteryBlacklist/fetchList'] || loading.effects['lotteryBlacklist/statusChangeManage'] || loading.effects['lotteryBlacklist/downloadMember'],
}))

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'lotteryBlacklist/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.regTime && formQueryData.regTime.length) {
      formQueryData.regTimeStart = moment(formQueryData.regTime[0]).format('YYYY-MM-DD')
      formQueryData.regTimeEnd = moment(formQueryData.regTime[1]).format('YYYY-MM-DD')
    }
    return formQueryData;
  }
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount() {
    this.props.getChild(this)
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryBlacklist/getAllSelect',
      payload: {}
    })
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'lotteryBlacklist/setSearchInfo',
      payload: {},
    })
  }
  render() {
    const { form: { getFieldDecorator }, lotteryBlacklist } = this.props
    const { parentUtmTypes } = lotteryBlacklist
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
