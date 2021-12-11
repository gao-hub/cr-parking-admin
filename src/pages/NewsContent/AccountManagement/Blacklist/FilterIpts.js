import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form } from 'antd';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, formItemConfig, searchConfig } = selfAdaption();

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ accountManagement }) => ({
  accountManagement,
}))
@Form.create()
export default class FilterIpts extends Component {
  state = {};
  // 搜索
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'accountManagement/setSearchInfo',
      payload: this.props.form.getFieldsValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  // 清空
  reset = async () => {
    this.props.form.resetFields();
  };
  componentDidMount() {
    // 获取渠道下拉框
    this.props.dispatch({
      type: 'accountManagement/fetchSelect',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      accountManagement: { channelList },
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
                  {getFieldDecorator('username')(<Input placeholder="请输入用户名" />)}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="姓名" {...formItemConfig}>
                  {getFieldDecorator('trueName')(<Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="手机号" {...formItemConfig}>
                  {getFieldDecorator('mobile')(<Input placeholder="请输入手机号" />)}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="渠道" {...formItemConfig}>
                  {getFieldDecorator('parentUtmId')(
                    <Select allowClear placeholder={'请选择渠道'}>
                      {Array.isArray(channelList) &&
                        channelList.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
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
