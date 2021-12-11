import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker } from 'antd';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
import moment from 'moment';
const { inputConfig, formItemConfig, searchConfig } = selfAdaption();
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
@connect(({ commodityManagement }) => ({
  commodityManagement,
}))
@Form.create()
export default class FilterIpts extends Component {
  state = {
    progressList: [
      // 活动进行状态
      {
        key: 0,
        title: '未开始',
      },
      {
        key: 1,
        title: '预告中',
      },
      {
        key: 2,
        title: '进行中',
      },
      {
        key: 3,
        title: '已结束',
      },
    ],
    stateList: [
      // 状态
      {
        key: 1,
        title: '启用',
      },
      {
        key: 0,
        title: '禁用',
      },
    ],
  };

  // 搜索
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'commodityManagement/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };

  // 获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.activityTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD');
      formQueryData.activityTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD');
    }
    delete formQueryData['createTime'];
    formQueryData.activityType = 4;
    return formQueryData;
  };

  // 清空
  reset = async () => {
    this.props.form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { progressList, stateList } = this.state;
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="活动名称" {...formItemConfig}>
                  {getFieldDecorator('activityName')(<Input placeholder="请输入活动名称" />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="活动进行状态" {...formItemConfig}>
                  {getFieldDecorator('activityIng')(
                    <Select allowClear placeholder={'请选择活动进行状态'}>
                      {progressList.map(item => (
                        <Option key={item.key} value={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('isUse')(
                    <Select allowClear placeholder={'请选择状态'}>
                      {stateList.map(item => (
                        <Option key={item.key} value={item.key}>
                          {item.title}
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
