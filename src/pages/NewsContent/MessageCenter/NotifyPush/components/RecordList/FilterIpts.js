import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Input, Button, Form, DatePicker } from 'antd';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, formItemConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@connect(({ notifyPush, loading }) => ({
  notifyPush,
}))
@Form.create()
export default class FilterIpts extends Component {
  componentDidMount() {
    this.props.getChild(this);
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'notifyPush/setRecordSearchInfo',
      payload: {},
    });
  }

  formSubmit = async e => {
    await this.props.dispatch({
      type: 'notifyPush/setRecordSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };

  getFormValue = () => {
    let formData = this.props.form.getFieldsValue();
    if (formData.createTime && formData.createTime.length) {
      formData.createTimeStart = moment(formData.createTime[0]).format(dateFormat);
      formData.createTimeEnd = moment(formData.createTime[1]).format(dateFormat);
    }
    delete formData.createTime;
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
                <FormItem label="模板名称" {...formItemConfig}>
                  {getFieldDecorator('tplName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="消息标题" {...formItemConfig}>
                  {getFieldDecorator('tplTitle')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="手机号" {...formItemConfig}>
                  {getFieldDecorator('userMobile')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="推送成功时间" {...formItemConfig}>
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
