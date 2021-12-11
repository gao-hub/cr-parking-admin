import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, formItemConfig } = selfAdaption();
const FormItem = Form.Item;
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
    let type = 'accountManage/setOfficialSearchInfo';
    if (this.props.tab === 'inside') {
      type = 'accountManage/setInsideSearchInfo';
    }
    await this.props.dispatch({
      type,
      payload: this.getFormData(),
    });
    this.props.getList(1, this.props.pageSize);
  };

  reset = () => {
    this.props.form.resetFields();
  };

  getFormData = () => {
    let formData = this.props.form.getFieldsValue();
    if (formData.createTime && formData.createTime.length) {
      formData.createTimeStart = moment(formData.createTime[0]).format(dateFormat);
      formData.createTimeEnd = moment(formData.createTime[1]).format(dateFormat);
    }
    delete formData.createTime;
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
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('status')(
                    <Select allowClear>
                      {statusOption.map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="创建时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker />)}
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
