import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Input, Button, Form, DatePicker, Select } from 'antd';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, formItemConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
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

@connect(({ activityMessage, loading }) => ({
  activityMessage,
}))
@Form.create()
export default class FilterIpts extends Component {
  componentDidMount() {
    this.props.getChild(this);
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'activityMessage/setRecordSearchInfo',
      payload: {},
    });
  }

  formSubmit = async e => {
    await this.props.dispatch({
      type: 'activityMessage/setRecordSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };

  getFormValue = () => {
    let formData = this.props.form.getFieldsValue();
    if (formData.planUpdateTime && formData.planUpdateTime.length) {
      formData.planUpdateTimeStart = moment(formData.planUpdateTime[0]).format(dateFormat);
      formData.planUpdateTimeEnd = moment(formData.planUpdateTime[1]).format(dateFormat);
    }
    delete formData.planUpdateTime;
    return formData;
  };

  reset = () => {
    this.props.form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
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
                <FormItem label="标题" {...formItemConfig}>
                  {getFieldDecorator('msgTitle')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="消息编号" {...formItemConfig}>
                  {getFieldDecorator('msgNo')(<Input />)}
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
                  {getFieldDecorator('planUpdateTime')(<RangePicker />)}
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
