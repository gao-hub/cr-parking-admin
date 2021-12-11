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
const statusOption = [
  {
    value: '1',
    label: '启用',
  },
  {
    value: '0',
    label: '禁用',
  },
];

@connect(({ helperCenter }) => ({
  helperCenter,
}))
@Form.create()
export default class FilterIpts extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    categorySelect: [],
  };

  componentDidMount() {
    this.props.getChild(this);
    this.getCategorySelect();
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'helperCenter/setQuestionSearchInfo', payload: {} });
  }

  getCategorySelect = async () => {
    let res = await this.props.dispatch({
      type: 'helperCenter/getCategorySelect',
      payload: {},
    });
    if (res && res.status === 1) {
      let {helpTypes = []} = res.data;
      this.setState({
        categorySelect: helpTypes
      });
    }
  };

  formSubmit = async () => {
    await this.props.dispatch({
      type: 'helperCenter/setQuestionSearchInfo',
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
    const { categorySelect } = this.state;
    const Option = Select.Option;
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="分类" {...formItemConfig}>
                  {getFieldDecorator('typeId')(
                    <Select allowClear>
                      {categorySelect.map(item => (
                        <Option key={item.key} value={item.key}>{item.title}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="问题名称" {...formItemConfig}>
                  {getFieldDecorator('helpName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('openStatus')(
                    <Select allowClear>
                      {statusOption.map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
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
