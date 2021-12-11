import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker, MonthPicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ sendManage }) => ({
  sendManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'sendManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.finishTime && formQueryData.finishTime.length) {
      formQueryData.finishTimeStart = moment(formQueryData.finishTime[0]).format('YYYY-MM-DD');
      formQueryData.finishTimeEnd = moment(formQueryData.finishTime[1]).format('YYYY-MM-DD');
    }
    if (formQueryData.rentTime) {
      formQueryData.rentTime = moment(formQueryData.rentTime).format('YYYY-MM');
    }
    delete formQueryData['finishTime'];
    return formQueryData;
  };
  reset = () => {
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    this.props.dispatch({
      type: 'sendManage/getAllSelect',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'sendManage/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      sendManage,
    } = this.props;
    const {
      initData: { utmTypes, parentUtmTypes },
    } = sendManage;

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
              {/*  <FormItem label="续约编号" {...formItemConfig}>*/}
              {/*    {getFieldDecorator('renewalNo')(*/}
              {/*      <Input />*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col {...inputConfig}>
                <FormItem label="车位订单号" {...formItemConfig}>
                  {getFieldDecorator('orderId')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="银行流水号" {...formItemConfig}>
                  {getFieldDecorator('rentId')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="车位号" {...formItemConfig}>
                  {getFieldDecorator('parkingCode')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="持有人" {...formItemConfig}>
                  {getFieldDecorator('buyerName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="租期" {...formItemConfig}>
                  {getFieldDecorator('rentTime')(<MonthPicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>

              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
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
              {/* 0待发放 1-发放成功-2发放失败-3已过期,4-发放中 */}
              <Col {...inputConfig}>
                <FormItem label="发放状态" {...formItemConfig}>
                  {getFieldDecorator('orderStatus')(
                    <Select allowClear>
                      <Option value={0}>待发放</Option>
                      <Option value={1}>发放成功</Option>
                      <Option value={2}>发放失败</Option>
                      <Option value={4}>发放中</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="付租时间" {...formItemConfig}>
                  {getFieldDecorator('finishTime')(<RangePicker />)}
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
