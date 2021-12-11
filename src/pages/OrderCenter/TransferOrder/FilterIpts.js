import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
  DatePicker,
  TreeSelect,
  Cascader
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import options from '@/utils/cascader-address-options'
import tableStyles from '@/style/TableList.less';
import {selfAdaption} from '@/utils/utils'
const {inputConfig,timeConfig,formItemConfig,searchConfig,colConfig} = selfAdaption()

const FormItem = Form.Item
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
const Option = Select.Option;

@connect(({ orderManage }) => ({
  orderManage
}))

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'orderManage/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.positon && formQueryData.positon.length) {
      formQueryData.districtCode = formQueryData.positon[2]
    }
    // 发起日期
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format(dateFormat)
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format(dateFormat)
    }
    delete formQueryData['createTime']
    return formQueryData;
  }
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount() {
    this.props.getChild(this)
    const { dispatch } = this.props;
    dispatch({
      type: 'orderManage/initSelect',
      payload: {}
    })
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'orderManage/setSearchInfo',
      payload: {},
    })
  }
  render() {
    const { form: { getFieldDecorator }, searchWholeState } = this.props
    const formConfig = {
      labelCol:  { span: 7 },
      wrapperCol: { span: 17 }
    }
    const { initData: { transoOrderStatus } } = this.props.orderManage;
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
                <Col {...inputConfig}>
                  <FormItem label="楼盘名称" {...formItemConfig}>
                    {getFieldDecorator('buildingName')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col {...inputConfig}>
                  <FormItem label="所在地" {...formItemConfig}>
                    {getFieldDecorator('positon')(
                      <Cascader options={options}></Cascader>
                    )}
                  </FormItem>
                </Col>
                {/* <Col {...inputConfig}>
                  <FormItem label="开发商" {...formItemConfig}>
                    {getFieldDecorator('developerName')(
                      <Input />
                    )}
                  </FormItem>
                </Col> */}
                <Col {...inputConfig}>
                  <FormItem label="车位号" {...formItemConfig}>
                    {getFieldDecorator('parkingNo')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col {...inputConfig}>
                  <FormItem label="发起人" {...formItemConfig}>
                    {getFieldDecorator('transferUserName')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col style={searchWholeState ? {}: { display: 'none' } } {...inputConfig}>
                  <FormItem label="状态" {...formItemConfig}>
                    {getFieldDecorator('orderStatus')(
                      <Select allowClear>
                        {
                          transoOrderStatus && transoOrderStatus.map(item => <Option key={item.key} value={item.value}>{item.title}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col style={searchWholeState ? {} : { display: 'none' } } {...inputConfig}>
                  <FormItem label="发起时间" {...formItemConfig}>
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
