import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect, Cascader } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
import options from '@/utils/cascader-address-options';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ paymentOrderManage }) => ({
  paymentOrderManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'paymentOrderManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD');
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD');
    }
    if (formQueryData.finishTime && formQueryData.finishTime.length) {
      formQueryData.finishTimeStart = moment(formQueryData.finishTime[0]).format('YYYY-MM-DD');
      formQueryData.finishTimeEnd = moment(formQueryData.finishTime[1]).format('YYYY-MM-DD');
    }
    if (formQueryData.location && formQueryData.location.length) {
      formQueryData.provinceCode = formQueryData.location[0];
      formQueryData.cityCode = formQueryData.location[1];
      formQueryData.districtCode = formQueryData.location[2];
    }
    delete formQueryData['createTime'];
    delete formQueryData['finishTime'];
    return formQueryData;
  };
  reset = () => {
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    this.props.dispatch({
      type: 'paymentOrderManage/getAllSelect',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'paymentOrderManage/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      paymentOrderManage,
    } = this.props;
    const {
      initData: { utmTypes, parentUtmTypes, useType, orderStatus },
    } = paymentOrderManage;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="购买订单号" {...formItemConfig}>
                  {getFieldDecorator('orderNo')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="银行流水号" {...formItemConfig}>
                  {getFieldDecorator('outOrderNo')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('buyerName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="楼盘地区" {...formItemConfig}>
                  {getFieldDecorator('location')(<Cascader options={options} />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="楼盘名称" {...formItemConfig}>
                  {getFieldDecorator('buildingName')(<Input />)}
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

              {/*<Col {...inputConfig}>*/}
              {/*  <FormItem label="渠道" {...formItemConfig}>*/}
              {/*    {getFieldDecorator('utmId')(*/}
              {/*      <Select allowClear>*/}
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
              {/* <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="服务类型" {...formItemConfig}>
                  {getFieldDecorator('returnAnytime')(
                    <Select allowClear>
                      <Option value={0}>无</Option>
                      <Option value={1}>随时退</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="购买车位数" {...formItemConfig}>
                  {getFieldDecorator('buyNum')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="支付金额" {...formItemConfig}>
                  {getFieldDecorator('payment')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="楼盘类型" {...formItemConfig}>
                  {getFieldDecorator('buildingType')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="产品类型" {...formItemConfig}>
                  {getFieldDecorator('productType')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>
                <FormItem label="销售顾问" {...formItemConfig}>
                  {getFieldDecorator('consultant')(
                    <Input />
                  )}
                </FormItem>
              </Col> */}
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="订单状态" {...formItemConfig}>
                  {getFieldDecorator('orderStatus')(
                    <Select allowClear>
                      {orderStatus &&
                        orderStatus.map(item => {
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
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="发起时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="完成时间" {...formItemConfig}>
                  {getFieldDecorator('finishTime')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="车位用途" {...formItemConfig}>
                  {getFieldDecorator('useType')(
                    <Select allowClear>
                      {useType &&
                        useType.map(item => {
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
