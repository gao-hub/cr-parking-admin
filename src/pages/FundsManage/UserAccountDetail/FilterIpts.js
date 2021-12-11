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

@connect(({ userAccountDetailManage }) => ({
  userAccountDetailManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'userAccountDetailManage/setSearchInfo',
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
      type: 'userAccountDetailManage/initSelect',
      payload: {},
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'userAccountDetailManage/setSearchInfo',
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
      initData: { tradeTypes, tradeStatus, verifyStatus, utmTypes, parentUtmTypes },
    } = this.props.userAccountDetailManage;
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
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('userName')(<Input />)}
                </FormItem>
              </Col>
              {/* <Col  {...inputConfig}>
                  <FormItem label="订单号" {...formItemConfig}>
                    {getFieldDecorator('orderNo')(
                      <Input />
                    )}
                  </FormItem>
                </Col> */}
              {/* <Col  {...inputConfig}>
                  <FormItem label="银行流水号" {...formItemConfig}>
                    {getFieldDecorator('tlOrderNo')(
                      <Input />
                    )}
                  </FormItem>
                </Col> */}
              <Col {...inputConfig}>
                <FormItem label="交易类型" {...formItemConfig}>
                  {getFieldDecorator('tradeType')(
                    <Select allowClear>
                      {tradeTypes &&
                        tradeTypes.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="交易状态" {...formItemConfig}>
                  {getFieldDecorator('tradeStatus')(
                    <Select allowClear>
                      {tradeStatus &&
                        tradeStatus.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="对账状态" {...formItemConfig}>
                  {getFieldDecorator('verifyStatus')(
                    <Select allowClear>
                      {verifyStatus &&
                        verifyStatus.map(item => (
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

              {/* <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
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
                <FormItem label="操作时间" {...formItemConfig}>
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
