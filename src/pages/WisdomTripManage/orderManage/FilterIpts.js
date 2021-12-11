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
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils'
import options from '@/utils/cascader-address-options'

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption()

const FormItem = Form.Item
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
const Option = Select.Option;

@connect(({tripOrderManage})=>({
  tripOrderManage
}))

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'tripOrderManage/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.tripTime && formQueryData.tripTime.length) {
      formQueryData.tripTimeStart = moment(formQueryData.tripTime[0]).format('YYYY-MM-DD')
      formQueryData.tripTimeEnd = moment(formQueryData.tripTime[1]).format('YYYY-MM-DD')
    }
    if (formQueryData.finishTime && formQueryData.finishTime.length) {
      formQueryData.finishTimeStart = moment(formQueryData.finishTime[0]).format('YYYY-MM-DD')
      formQueryData.finishTimeEnd = moment(formQueryData.finishTime[1]).format('YYYY-MM-DD')
    }
    if (formQueryData.location && formQueryData.location.length) {
      formQueryData.provinceCode = formQueryData.location[0]
      formQueryData.cityCode = formQueryData.location[1]
      formQueryData.districtCode = formQueryData.location[2]
    }
    delete formQueryData['tripTime']
    delete formQueryData['finishTime']
    return formQueryData;
  }
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount() {
    this.props.getChild(this)
    this.props.dispatch({
      type:'tripOrderManage/getAllSelect',
    })
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'tripOrderManage/setSearchInfo',
      payload: {},
    })

  }
  render() {
    const { form: { getFieldDecorator }, searchWholeState,tripOrderManage } = this.props
    const {initData: { orderStatus, utmTypes }} = tripOrderManage
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    }
    const reviewStatus=[{
      value:'1',
      label:'已退款'
    },{
      value:'2',
      label:'审核中'
    },{
      value:'3',
      label:'待审核'
    }]

    const classifyStatus=[{
      id:5,
      label:'国内游'
    },{
      id:6,
      label:'周边游'
    }]
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="订单号" {...formItemConfig}>
                  {getFieldDecorator('orderNo')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="产品名称" {...formItemConfig}>
                  {getFieldDecorator('productName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="旅游类型" {...formItemConfig}>
                  {getFieldDecorator('classifyId')(
                    <Select allowClear>
                      {classifyStatus && classifyStatus.map((item,index)=>{
                        return <Option key={index} value={item.id}>{item.label}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('buyerName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="当前状态" {...formItemConfig}>
                  {getFieldDecorator('orderStatus')(
                    <Select allowClear>
                    {orderStatus && orderStatus.map(item=>{
                      return <Option key={item.key} value={item.value}>{item.title}</Option>
                    })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="退款状态" {...formItemConfig}>
                  {getFieldDecorator('reviewType')(
                    <Select allowClear>
                      {reviewStatus && reviewStatus.map((item,index)=>{
                        return <Option key={index} value={item.value}>{item.label}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              {/*<Col {...inputConfig}>*/}
              {/*  <FormItem label="二级渠道" {...formItemConfig}>*/}
              {/*    {getFieldDecorator('utmId')(*/}
              {/*      <Select allowClear>*/}
              {/*        {utmTypes && utmTypes.map(item=>{*/}
              {/*          return <Option key={item.key} value={item.value}>{item.title}</Option>*/}
              {/*        })}*/}
              {/*      </Select>*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="购买时间" {...formItemConfig}>
                  {getFieldDecorator('finishTime')(
                    <RangePicker></RangePicker>
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="使用时间" {...formItemConfig}>
                  {getFieldDecorator('tripTime')(
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
