import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, formItemConfig } = selfAdaption();
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const statusOption = [
  {
    value: 1,
    label: '启用',
  },
  {
    value: 0,
    label: '禁用',
  },
];

@Form.create()
@connect(({ notifyPush }) => ({
  notifyPush,
}))
export default class FilterIpts extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getChild(this);
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'notifyPush/setCategorySearchInfo',
      payload: {},
    });
  }

  formSubmit = async () => {
    await this.props.dispatch({
      type: 'notifyPush/setCategorySearchInfo',
      payload: this.getFormData(),
    });
    this.props.getList(1, this.props.pageSize);
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

  reset = () => {
    this.props.form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="类别名称" {...formItemConfig}>
                  {getFieldDecorator('typeName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('openStatus')(
                    <Select allowClear>
                      {statusOption.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="更新时间" {...formItemConfig}>
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
