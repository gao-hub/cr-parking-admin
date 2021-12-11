import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
const useCartOption = [
  {
    label: '委托出售',
    value: 1,
  },
  {
    label: '委托出租',
    value: 0,
  },
  {
    label: '标准版',
    value: 2,
  },
  {
    label: '保价版',
    value: 3,
  },
];
const typeOption = [
  {
    label: '获得额度',
    value: 1,
  },
  {
    label: '消耗额度',
    value: 2,
  },
];

@Form.create()
@connect(({ unifiedLotteryActivityUserDetails }) => ({
  unifiedLotteryActivityUserDetails,
}))
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'unifiedLotteryActivityUserDetails/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format(dateFormat);
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format(dateFormat);
    }
    delete formQueryData['createTime'];
    return formQueryData;
  };
  reset = () => {
    this.props.form.resetFields();
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'unifiedLotteryActivityUserDetails/setSearchInfo',
      payload: {},
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      unifiedLotteryActivityUserDetails: { channelOption = [] },
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
                  {getFieldDecorator('userName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="姓名" {...formItemConfig}>
                  {getFieldDecorator('truename')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="手机号" {...formItemConfig}>
                  {getFieldDecorator('userPhone')(<Input />)}
                </FormItem>
              </Col>
              {/* <Col {...inputConfig}>
                <FormItem label="渠道" {...formItemConfig}>
                  {getFieldDecorator('parentUtmId')(
                    <Select allowClear>
                      {channelOption.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col> */}
              {/* <Col {...inputConfig}>
                <FormItem label="类型" {...formItemConfig}>
                  {getFieldDecorator('changeType')(
                    <Select allowClear>
                      {typeOption.map(item => (
                        <Option key={item.value} vlaue={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col> */}
              {/* <Col {...inputConfig}>
                <FormItem label="车位用途" {...formItemConfig}>
                  {getFieldDecorator('useType')(
                    <Select allowClear>
                      {useCartOption.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col> */}
              {/* <Col {...inputConfig}>
                <FormItem label="时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker />)}
                </FormItem>
              </Col> */}
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
