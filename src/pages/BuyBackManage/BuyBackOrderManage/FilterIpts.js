import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ buybackOrderManage }) => ({
  buybackOrderManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'buybackOrderManage/setSearchInfo',
      payload: await this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format(dateFormat);
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format(dateFormat);
    }
    if (formQueryData.updateTime && formQueryData.updateTime.length) {
      formQueryData.finishTimeStart = moment(formQueryData.updateTime[0]).format(dateFormat);
      formQueryData.finishTimeEnd = moment(formQueryData.updateTime[1]).format(dateFormat);
    }
    // delete formQueryData['createTime']
    // delete formQueryData['updateTime']
    return formQueryData;
  };
  reset = () => {
    this.props.form.resetFields();
    const { dispatch } = this.props;
    dispatch({
      type: 'buybackOrderManage/setSearchInfo',
      payload: {},
    });
  };
  onChange = () => {};
  onBlur = () => {};
  onFocus = () => {};
  onSearch = () => {};
  componentDidMount() {
    this.props.getChild(this);
    const { dispatch } = this.props;
    dispatch({
      type: 'buybackOrderManage/initSelect',
      payload: {},
    });
  }
  componentWillUnmount() {
    if (!this.props.staySearchInfo) {
      this.props.dispatch({
        type: 'buybackOrderManage/setSearchInfo',
        payload: {},
      });
    }
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
    } = this.props;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const {
      initData: { returnOrderStatus, investMonths,useType, utmTypes, parentUtmTypes },
      searchInfo,
    } = this.props.buybackOrderManage;
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="退货订单号" {...formItemConfig}>
                  {getFieldDecorator('orderNo', {
                    initialValue: searchInfo.orderNo || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="车位订单号" {...formItemConfig}>
                  {getFieldDecorator('parkingOrderNo', {
                    initialValue: searchInfo.parkingOrderNo || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="银行流水号" {...formItemConfig}>
                  {getFieldDecorator('tlOrderNo', {
                    initialValue: searchInfo.tlOrderNo || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('returnUserName', {
                    initialValue: searchInfo.returnUserName || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="车位号" {...formItemConfig}>
                  {getFieldDecorator('parkingNo', {
                    initialValue: searchInfo.parkingNo || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              {/*
                  <Col  style={searchWholeState ? {}: { display: 'none' }}  {...inputConfig}>
                    <FormItem label="服务类型" {...formItemConfig}>
                      {getFieldDecorator('returnAnytime')(
                        <Select allowClear>
                          <Option key={0} value={0}>无</Option>
                          <Option key={1} value={1}>随时退</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                */}
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('orderStatus', {
                    initialValue: searchInfo.orderStatus || undefined,
                  })(
                    <Select allowClear>
                      {returnOrderStatus &&
                        returnOrderStatus.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="发起时间" {...formItemConfig}>
                  {getFieldDecorator('createTime', {
                    initialValue: searchInfo.createTime || undefined,
                  })(<RangePicker />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="完成时间" {...formItemConfig}>
                  {getFieldDecorator('updateTime', {
                    initialValue: searchInfo.updateTime || undefined,
                  })(<RangePicker />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="车位用途" {...formItemConfig}>
                  {getFieldDecorator('useType')(
                    <Select allowClear>
                      {
                        useType && 
                        useType.map(item=>{
                          return (
                            <Option value={item.value} key={item.key}>{item.title}</Option>
                          )
                        })
                      }
                      {/* <Option value={0}>委托出租</Option>
                      <Option value={1}>委托出售</Option>
                      <Option value={2}>基础</Option>
                      <Option value={3}>回购</Option> */}
                      
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="代销周期" {...formItemConfig}>
                  {getFieldDecorator('investMonth')(
                    <Select allowClear>
                      {investMonths &&
                        investMonths.map(item => {
                          return (
                            <Option key={item.key} value={item.value}>
                              {item.title}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="一级渠道" {...formItemConfig}>
                  {getFieldDecorator('parentUtmId')(
                    <Select allowClear>
                      {parentUtmTypes &&
                        parentUtmTypes.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>

              {/*<Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>*/}
              {/*  <FormItem label="渠道" {...formItemConfig}>*/}
              {/*    {getFieldDecorator('utmId')(*/}
              {/*      <Select allowClear showSearch optionFilterProp="children">*/}
              {/*        {utmTypes &&*/}
              {/*          utmTypes.map(item => {*/}
              {/*            return (*/}
              {/*              <Option key={item.key} value={item.value}>*/}
              {/*                {item.title}*/}
              {/*              </Option>*/}
              {/*            );*/}
              {/*          })}*/}
              {/*      </Select>*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col {...searchConfig}>
                <FormItem {...formItemConfig}>
                  <Button onClick={this.formSubmit} type="primary">
                    搜索
                  </Button>
                  <Button onClick={this.reset} style={{ marginLeft: 8 }}>
                    清空
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
