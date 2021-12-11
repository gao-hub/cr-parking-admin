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

const Status = [
  {
    key: 0,
    value: 0,
    title: '初始',
  },
  {
    key: 1,
    value: 1,
    title: '充值中',
  },
  {
    key: 2,
    value: 2,
    title: '充值成功',
  },
  {
    key: 3,
    value: 3,
    title: '充值失败',
  },
  {
    key: 4,
    value: 4,
    title: '终止',
  },
];

@connect(({ accountRechargeManage }) => ({
  accountRechargeManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'accountRechargeManage/setSearchInfo',
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
      delete formQueryData['createTime'];
    }
    return formQueryData;
  };
  reset = () => {
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    const { dispatch } = this.props;
    dispatch({
      type: 'accountRechargeManage/initSelect',
      payload: {},
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'accountRechargeManage/setSearchInfo',
      payload: {},
    });
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
      initData: { rechargeTypes, rechargeStatus, utmTypes, parentUtmTypes },
    } = this.props.accountRechargeManage;
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="订单号" {...formItemConfig}>
                  {getFieldDecorator('orderNo')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="银行流水号" {...formItemConfig}>
                  {getFieldDecorator('seqNo')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('username')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="充值类型" {...formItemConfig}>
                  {getFieldDecorator('type')(
                    <Select allowClear>
                      {rechargeTypes &&
                        rechargeTypes.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="充值状态" {...formItemConfig}>
                  {getFieldDecorator('status')(
                    <Select allowClear>
                      {rechargeStatus &&
                        rechargeStatus.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
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

              {/* <Col {...inputConfig}>
                <FormItem label="渠道" {...formItemConfig}>
                  {getFieldDecorator('utmId')(
                    <Select allowClear>
                      {utmTypes &&
                        utmTypes.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col> */}
              <Col {...inputConfig}>
                <FormItem label="到账时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker />)}
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
