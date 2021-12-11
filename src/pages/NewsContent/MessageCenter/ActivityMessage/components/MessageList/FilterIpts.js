import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, formItemConfig } = selfAdaption();
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const typeOption = [
  {
    value: 1,
    label: '定时发送',
  },
  {
    value: 2,
    label: '实时发送',
  },
];

@connect(({ activityMessage }) => ({
  activityMessage,
}))
@Form.create()
export default class FilterIpts extends Component {
  constructor(props) {
    super(props);
  }

  state = {};

  componentDidMount() {
    this.props.getChild(this);
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'activityMessage/setMessageSearchInfo', payload: {} });
  }

  formSubmit = async () => {
    await this.props.dispatch({
      type: 'activityMessage/setMessageSearchInfo',
      payload: this.getFormData(),
    });
    this.props.getList(1, this.props.pageSize);
  };

  reset = () => {
    this.props.form.resetFields();
  };

  getFormData = () => {
    let formData = this.props.form.getFieldsValue();
    if (formData.updateTime && formData.updateTime.length) {
      formData.updateTimeStart = moment(formData.updateTime[0]).format(dateFormat);
      formData.updateTimeEnd = moment(formData.updateTime[1]).format(dateFormat);
    }
    delete formData.updateTime;
    return formData;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const Option = Select.Option;
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="标题" {...formItemConfig}>
                  {getFieldDecorator('msgTitle')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="推送类型" {...formItemConfig}>
                  {getFieldDecorator('sendType')(
                    <Select allowClear>
                      {typeOption.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="提交时间" {...formItemConfig}>
                  {getFieldDecorator('updateTime')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
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
