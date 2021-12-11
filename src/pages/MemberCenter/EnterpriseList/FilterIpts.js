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

@connect(({ enterpriseManage, loading }) => ({
  enterpriseManage,
  loading:
    loading.effects['enterpriseManage/fetchList'] || loading.effects['enterpriseManage/statusChangeManage'] || loading.effects['enterpriseManage/downloadMember'],
}))

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'enterpriseManage/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.openTime && formQueryData.openTime.length) {
      formQueryData.openTimeStart = moment(formQueryData.openTime[0]).format('YYYY-MM-DD')
      formQueryData.openTimeEnd = moment(formQueryData.openTime[1]).format('YYYY-MM-DD')
      delete formQueryData.openTime
    }else{
      formQueryData.openTimeStart = undefined;
      formQueryData.openTimeEnd = undefined;
    }
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
      type: 'enterpriseManage/initSelect',
      payload: {}
    })
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'enterpriseManage/setSearchInfo',
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
              {/*
                <Col {...inputConfig}>
                  <FormItem label="用户名" {...formItemConfig}>
                    {getFieldDecorator('username')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              */}
              <Col {...inputConfig}>
                <FormItem label="企业名称" {...formItemConfig}>
                  {getFieldDecorator('businessName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="手机号" {...formItemConfig}>
                  {getFieldDecorator('mobile')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              {/*
              <Col {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('openStatus')(
                    <Select allowClear>
                      <Option value={0}>启用</Option>
                      <Option value={1}>禁用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            */}
            <Col {...inputConfig}>
              <FormItem label="提交时间" {...formItemConfig}>
                {getFieldDecorator('createTime')(
                  <RangePicker></RangePicker>
                )}
              </FormItem>
            </Col>
              <Col {...inputConfig}>
                <FormItem label="开户时间" {...formItemConfig}>
                  {getFieldDecorator('openTime')(
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
