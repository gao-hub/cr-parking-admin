import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption, filterEmptyObject } from '@/utils/utils';
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ duePlanManage }) => ({
  duePlanManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'duePlanManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.dueDate && formQueryData.dueDate.length) {
      formQueryData.dueDateStart = moment(formQueryData.dueDate[0]).format('YYYY-MM-DD');
      formQueryData.dueDateEnd = moment(formQueryData.dueDate[1]).format('YYYY-MM-DD');
    }
    delete formQueryData['dueDate'];
    return filterEmptyObject(formQueryData);
  };
  reset = () => {
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    this.props.dispatch({
      type: 'duePlanManage/getAllSelect',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'duePlanManage/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      duePlanManage,
    } = this.props;
    const {
      initData: { utmTypes, parentUtmTypes, orderStatus, investMonths, saleCapitals, expireTypes },
    } = duePlanManage;
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
                <FormItem label="持有人" {...formItemConfig}>
                  {getFieldDecorator('buyerName')(<Input />)}
                </FormItem>
              </Col>
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
              <Col {...inputConfig}>
                <FormItem label="推荐人" {...formItemConfig}>
                  {getFieldDecorator('spreadsUserName')(<Input />)}
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

              <Col {...inputConfig}>
                <FormItem label="续约状态" {...formItemConfig}>
                  {getFieldDecorator('autoRenew')(
                    <Select allowClear>
                      {saleCapitals &&
                        saleCapitals.map(item => {
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
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('statusCaptial')(
                    <Select allowClear>
                      {expireTypes &&
                        expireTypes.map(item => {
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
                <FormItem label="代销结束日" {...formItemConfig}>
                  {getFieldDecorator('dueDate')(<RangePicker />)}
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
