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

@connect(({ bankcardManage, loading }) => ({
  bankcardManage,
  loading:
    loading.effects['bankcardManage/fetchList'] || loading.effects['bankcardManage/statusChangeManage'] || loading.effects['bankcardManage/downloadMember'],
}))

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'bankcardManage/setSearchInfo',
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
      delete formQueryData.createTime
    }else{
      formQueryData.createTimeStart = undefined;
      formQueryData.createTimeEnd = undefined;
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
      type: 'bankcardManage/initSelect',
      payload: {}
    })
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'bankcardManage/setSearchInfo',
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
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('userName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="当前手机号" {...formItemConfig}>
                  {getFieldDecorator('userMobile')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="姓名" {...formItemConfig}>
                  {getFieldDecorator('userTrueName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="银行卡号" {...formItemConfig}>
                  {getFieldDecorator('cardNo')(
                    <Input />
                  )}
                </FormItem>
              </Col>
            <Col {...inputConfig}>
              <FormItem label="绑卡时间" {...formItemConfig}>
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
