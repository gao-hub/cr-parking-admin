import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ smartHomeConfigManage }) => ({
  smartHomeConfigManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  state = {
    advertType: [
      {
        key: '1',
        value: 1,
        title: '首页banner',
      },
      {
        key: '2',
        value: 2,
        title: '金刚区',
      },
    ],
    stateRadio: [
      {
        key: '1',
        value: 1,
        title: '启用',
      },
      {
        key: '2',
        value: 0,
        title: '禁用',
      },
    ],
  };

  formSubmit = async e => {
    await this.props.dispatch({
      type: 'smartHomeConfigManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.dueTime && formQueryData.dueTime.length) {
      formQueryData.endTimeStart = moment(formQueryData.dueTime[0]).format('YYYY-MM-DD');
      formQueryData.endTimeEnd = moment(formQueryData.dueTime[1]).format('YYYY-MM-DD');
      delete formQueryData['dueTime'];
    }
    return formQueryData;
  };
  reset = async () => {
    await this.props.dispatch({
      type: 'smartHomeConfigManage/setSearchInfo',
      payload: {},
    });
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    const { dispatch } = this.props;
    dispatch({
      type: 'smartHomeConfigManage/getAdSpace',
      payload: {},
    });
    dispatch({
      type: 'smartHomeConfigManage/getAdPlatform',
      payload: {},
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'smartHomeConfigManage/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      smartHomeConfigManage: { adSpace = [], adPlatform = [] },
    } = this.props;
    const { advertType, stateRadio } = this.state;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              {/* <Col {...inputConfig}>
                <FormItem label="广告位" {...formItemConfig}>
                  {getFieldDecorator('advertType')(
                    <Select placeholder={'请选择广告位'}>
                      {Array.isArray(advertType) &&
                        advertType.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col> */}
              <Col {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('status')(
                    <Select placeholder={'请选择状态'}>
                      {Array.isArray(stateRadio) &&
                        stateRadio.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="到期时间" {...formItemConfig}>
                  {getFieldDecorator('dueTime')(<RangePicker format={dateFormat} />)}
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
