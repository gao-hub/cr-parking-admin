import React, { Component } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@Form.create()
@connect(({ redRecord }) => ({
  redRecord,
}))
export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'redRecord/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 中奖纪录领取时间 格式化
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.getTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD 00:00:00');
      formQueryData.getTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD 23:59:59');
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
      type: 'activityManagement/setSearchInfo',
      payload: {},
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      redRecord: {
        channelOption = [],
      },
    } = this.props;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type='flex'>
              <Col {...inputConfig}>
                <FormItem label='姓名' {...formItemConfig}>
                  {getFieldDecorator('truename')(
                    <Input />,
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label='手机号' {...formItemConfig}>
                  {getFieldDecorator('userPhone')(
                    <Input />,
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label='渠道' {...formItemConfig}>
                  {getFieldDecorator('parentUtmId')(
                    <Select allowClear>
                      {
                        channelOption.map(item => (
                          <Option key={item.value} value={item.value}>{item.title}</Option>
                        ))
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              
              <Col {...inputConfig}>
                <FormItem label="领取状态" {...formItemConfig}>
                  {getFieldDecorator('deliveryStatus')(
                    <Select allowClear>
                     
                        <Option key={0} value={0}>未领取</Option>
                        <Option key={1} value={1}>已领取</Option>

                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label='领取时间' {...formItemConfig}>
                  {getFieldDecorator('createTime')(
                    <RangePicker/>,
                  )}
                </FormItem>
              </Col>
              <Col {...searchConfig}>
                <FormItem {...formItemConfig}>
                  <Button onClick={this.formSubmit} type='primary'>搜索</Button>
                  <Button onClick={this.reset} style={{ marginLeft: 8 }}>清空</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
