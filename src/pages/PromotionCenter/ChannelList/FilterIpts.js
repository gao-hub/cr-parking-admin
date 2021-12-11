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
      type: 'channelManage/setSearchInfo',
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
      type: 'channelManage/setSearchInfo',
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
                  <FormItem label="渠道编号" {...formItemConfig}>
                    {getFieldDecorator('utmId')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col  {...inputConfig}>
                  <FormItem label="一级渠道" {...formItemConfig}>
                    {getFieldDecorator('parentUtmName')(<Input />)}
                  </FormItem>
                </Col>
                {/*<Col  {...inputConfig}>*/}
                {/*  <FormItem label="二级渠道" {...formItemConfig}>*/}
                {/*    {getFieldDecorator('utmName')(<Input />)}*/}
                {/*  </FormItem>*/}
                {/*</Col>*/}
                {/*<Col  style={searchWholeState ? { display: 'none' } : {}}  {...inputConfig}>*/}
                {/*  <FormItem label="渠道负责人" {...formItemConfig}>*/}
                {/*    {getFieldDecorator('utmLeaderName')(*/}
                {/*      <Input />*/}
                {/*    )}*/}
                {/*  </FormItem>*/}
                {/*</Col>*/}
                <Col {...inputConfig}>
                  <FormItem label="状态" {...formItemConfig}>
                    {getFieldDecorator('status')(
                      <Select allowClear>
                        <Option value={0}>已禁用</Option>
                        <Option value={1}>已启用</Option>
                      </Select>
                    )}
                  </FormItem>
              </Col>
                <Col {...inputConfig}>
                  <FormItem label="创建时间" {...formItemConfig}>
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
