import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption, filterEmptyObject } from '@/utils/utils';
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ SmartCommunity }) => ({
  SmartCommunity,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'SmartCommunity/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 更新时间
    if (formQueryData.updateTime && formQueryData.updateTime.length) {
      formQueryData.updateTimeStart = moment(formQueryData.updateTime[0]).format('YYYY-MM-DD');
      formQueryData.updateTimeEnd = moment(formQueryData.updateTime[1]).format('YYYY-MM-DD');
    }
    delete formQueryData['updateTime'];
    return filterEmptyObject(formQueryData);
  };
  reset = () => {
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    this.props.dispatch({
      type: 'SmartCommunity/getTypeSelect'
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'SmartCommunity/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      SmartCommunity: { typeList = [] },
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
                <FormItem label="功能名称" {...formItemConfig}>
                  {getFieldDecorator('productName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="关联类型" {...formItemConfig}>
                  {getFieldDecorator('groupsId')(
                    <Select allowClear>
                      {typeList.map(item => {
                          return (
                            <Option key={item.id} value={item.id}>
                              {item.groupsName}
                            </Option>
                          );
                        })}
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
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('productState')(
                    <Select allowClear>
                      <Option value={0}>
                        启用
                      </Option>
                      <Option value={1}>
                        禁用
                      </Option>
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
