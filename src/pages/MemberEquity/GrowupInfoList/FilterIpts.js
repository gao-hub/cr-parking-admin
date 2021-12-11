import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, formItemConfig, searchConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ GrowupInfoList }) => ({
  GrowupInfoList,
}))
@Form.create()
export default class FilterIpts extends Component {
  state = {

  };

  formSubmit = async e => {
    await this.props.dispatch({
      type: 'GrowupInfoList/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD 00:00:00');
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD 23:59:59');
      delete formQueryData['createTime'];
    }
    return formQueryData;
  };
  reset = async () => {
    await this.props.dispatch({
      type: 'GrowupInfoList/setSearchInfo',
      payload: {},
    });
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    const { dispatch } = this.props;
    dispatch({
      type: 'GrowupInfoList/parentUtmSelector',
      payload: {},
    });
    dispatch({
      type: 'GrowupInfoList/growupTypeSelector',
      payload: {},
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'GrowupInfoList/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      GrowupInfoList: { selectData, growupTypeData },
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
                  {getFieldDecorator('mobile')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="渠道" {...formItemConfig}>
                  {getFieldDecorator('parentUtmId')(
                    <Select placeholder={'请选择渠道'} allowClear>
                      {Array.isArray(selectData) &&
                        selectData.length && selectData.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.utmName}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="成长值类型" {...formItemConfig}>
                  {getFieldDecorator('growthTypeName')(
                    <Select placeholder={'请选择成长值类型'} allowClear>
                      {Array.isArray(growupTypeData) &&
                        growupTypeData.length && growupTypeData.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker format={dateFormat} />)}
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
