import React, { Component } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
  DatePicker,
  TreeSelect,
  Cascader,
  InputNumber,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
import options from '@/utils/cascader-address-options';
import { number } from 'prop-types';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ renewalManage }) => ({
  renewalManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'renewalManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.renewDate && formQueryData.renewDate.length) {
      formQueryData.renewDateStart = moment(formQueryData.renewDate[0]).format('YYYY-MM-DD');
      formQueryData.renewDateEnd = moment(formQueryData.renewDate[1]).format('YYYY-MM-DD');
      delete formQueryData['renewDate'];
    }
    if (formQueryData.dueDate && formQueryData.dueDate.length) {
      formQueryData.dueDateStart = moment(formQueryData.dueDate[0]).format('YYYY-MM-DD');
      formQueryData.dueDateEnd = moment(formQueryData.dueDate[1]).format('YYYY-MM-DD');
      delete formQueryData['dueDate'];
    }
    return formQueryData;
  };
  reset = () => {
    this.props.form.resetFields();
  };

  componentDidMount() {
    this.props.getChild(this);
    this.props.dispatch({
      type: 'renewalManage/getAllSelect',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'renewalManage/setSearchInfo',
      payload: {},
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      renewalManage,
    } = this.props;
    const {
      initData: { utmTypes, parentUtmTypes, parkingOrderStatus, investMonth },
    } = renewalManage;
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
                <FormItem label="车位订单号" {...formItemConfig}>
                  {getFieldDecorator('parkingOrderNo')(<Input />)}
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
                <FormItem label="当前状态" {...formItemConfig}>
                  {getFieldDecorator('parkingOrderStatus')(
                    <Select allowClear>
                      {parkingOrderStatus &&
                        parkingOrderStatus.map(item => {
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
                <FormItem label="车位用途" {...formItemConfig}>
                  {getFieldDecorator('useType')(
                    <Select allowClear placeholder="请选择">
                      <Option key={0} value={0}>
                        委托出租
                      </Option>
                      <Option key={1} value={1}>
                        委托出售
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="代销周期" {...formItemConfig}>
                  {getFieldDecorator('investMonth')(
                    <Select allowClear>
                      {investMonth &&
                        investMonth.map(item => {
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

              <Col {...inputConfig}>
                <FormItem label="续约期次" {...formItemConfig}>
                  {getFieldDecorator('period')(
                    <InputNumber maxLength={2}  precision={0} />
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
                <FormItem label="续约时间" {...formItemConfig}>
                  {getFieldDecorator('renewDate')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="委托结束日" {...formItemConfig}>
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
