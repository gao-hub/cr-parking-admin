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

@connect(({ parkingOrderManage }) => ({
  parkingOrderManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'parkingOrderManage/setSearchInfo',
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

  currentSelect = (arr,arrNext)=>{
    // leaseSaleParkingOrderStatus  车位订单
    // selfParkingOrderStatus 自用订单
    // leaseSaleUseType  租售车位用途
    // selfUseType 自用车位用途

    const { tabIndex } = this.props
    let list = tabIndex === '1' ? arr : arrNext
    return (
      <Select allowClear>
          {list &&
            list.map(item => {
              return (
                <Option key={item.key} value={item.value}>
                  {item.title}
                </Option>
              );
            })}
      </Select>
    )
  }

  reset = () => {
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    this.props.dispatch({
      type: 'parkingOrderManage/getAllSelect',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'parkingOrderManage/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      parkingOrderManage,
      tabIndex
    } = this.props;
    const {
      initData: { 
        investMonths,
        leaseSaleParkingOrderStatus,
        selfParkingOrderStatus,
        leaseSaleUseType,
        selfUseType,
        parkingOrderStatus,
        utmTypes, 
        parentUtmTypes,
        useType },
    } = parkingOrderManage;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              {/*<Col {...inputConfig}>*/}
              {/*  <FormItem label="购买订单号" {...formItemConfig}>*/}
              {/*    {getFieldDecorator('orderNo')(*/}
              {/*      <Input />*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col {...inputConfig}>
                <FormItem label="车位订单号" {...formItemConfig}>
                  {getFieldDecorator('parkingOrderNo')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="车位号" {...formItemConfig}>
                  {getFieldDecorator('parkingCode')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('buyerName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="姓名" {...formItemConfig}>
                  {getFieldDecorator('buyerTrueName')(<Input />)}
                </FormItem>
              </Col>
              {/* <Col {...inputConfig}>
                <FormItem label="推荐人" {...formItemConfig}>
                  {getFieldDecorator('spreadsUserName')(<Input />)}
                </FormItem>
              </Col> */}
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
              {/*<Col {...inputConfig}>*/}
              {/*  <FormItem label="服务类型" {...formItemConfig}>*/}
              {/*    {getFieldDecorator('returnAnytime')(*/}
              {/*      <Select allowClear>*/}
              {/*        <Option value={0}>无服务</Option>*/}
              {/*        <Option value={1}>随时退</Option>*/}
              {/*      </Select>*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col {...inputConfig}>
                <FormItem label="当前状态" {...formItemConfig}>
                  { 
                    getFieldDecorator('parkingOrderStatus')(    
                        this.currentSelect(leaseSaleParkingOrderStatus,selfParkingOrderStatus)
                    )         
                             
                  }
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
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="下单时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="付款时间" {...formItemConfig}>
                  {getFieldDecorator('finishTime')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label={ this.props.tabIndex === '1'?'车位用途':'车位类型'} {...formItemConfig}>
                  {getFieldDecorator('useType')(
                      this.currentSelect(leaseSaleUseType,selfUseType)      
                  )}
                </FormItem>
              </Col>
              {
                  this.props.tabIndex === '1' ?(
                    <Col {...inputConfig}>
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
                ):null
              }
              
              {
                this.props.tabIndex === '2' ? (
                  <Col {...inputConfig}>
                  <FormItem label="发票发送给用户" {...formItemConfig}>
                    {getFieldDecorator('invoicePushFlag')(
                      <Select allowClear>
                            <Option key={1} value={1}>
                              是
                            </Option>
                            <Option key={0} value={0}>
                              否
                            </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                ):null
              }             
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
