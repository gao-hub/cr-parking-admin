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
const {Option} = Select;

@connect(({ ExchangeOrders }) => ({
  ExchangeOrders,
}))
@Form.create()

export default class FilterIpts extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'ExchangeOrders/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 购买时间
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD 00:00:00');
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD 23:59:59');
      delete formQueryData['createTime'];
    }
    // 发货时间
    if (formQueryData.sendOrderTime && formQueryData.sendOrderTime.length) {
      formQueryData.sendOrderTimeStart = moment(formQueryData.sendOrderTime[0]).format('YYYY-MM-DD 00:00:00');
      formQueryData.sendOrderTimeEnd = moment(formQueryData.sendOrderTime[1]).format('YYYY-MM-DD 23:59:59');
      delete formQueryData['sendOrderTime'];
    }
    // 退款时间
    if (formQueryData.refundFinishTime && formQueryData.refundFinishTime.length) {
      formQueryData.refundFinishTimeStart = moment(formQueryData.refundFinishTime[0]).format('YYYY-MM-DD 00:00:00');
      formQueryData.refundFinishTimeEnd = moment(formQueryData.refundFinishTime[1]).format('YYYY-MM-DD 23:59:59');
      delete formQueryData['refundFinishTime'];
    }
    return formQueryData;
  };
  reset = async () => {
    await this.props.dispatch({
      type: 'ExchangeOrders/setSearchInfo',
      payload: {},
    });
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    const { dispatch } = this.props;
    dispatch({
      type: 'ExchangeOrders/getEquityName',
      payload: {},
    });
    dispatch({
      type: 'ExchangeOrders/parentUtmSelector',
      payload: {},
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'ExchangeOrders/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      ExchangeOrders: { equityNameData, channelSelectData }
    } = this.props;
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
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('productName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="姓名" {...formItemConfig}>
                  {getFieldDecorator('buyerName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="手机号" {...formItemConfig}>
                  {getFieldDecorator('receiverMobile')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="渠道" {...formItemConfig}>
                  {getFieldDecorator('parentUtmId')(
                    <Select placeholder={'请选择渠道'} allowClear>
                      {Array.isArray(channelSelectData) &&
                        channelSelectData.length && channelSelectData.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.utmName}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="权益名称" {...formItemConfig}>
                  {getFieldDecorator('orderStatus')(
                    <Select placeholder={'请选择状态'} allowClear>
                      {equityNameData.length &&
                        equityNameData.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="购买时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker format={dateFormat} />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="发货时间" {...formItemConfig}>
                  {getFieldDecorator('sendOrderTime')(<RangePicker format={dateFormat} />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="退款时间" {...formItemConfig}>
                  {getFieldDecorator('refundFinishTime')(<RangePicker format={dateFormat} />)}
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
