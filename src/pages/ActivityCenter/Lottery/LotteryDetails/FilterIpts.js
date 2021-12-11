import React, { Component } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
  DatePicker,
  TreeSelect,
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

@connect(({ lotteryDetails, loading }) => ({
  lotteryDetails,
  loading:
    loading.effects['lotteryDetails/fetchList'] || loading.effects['lotteryDetails/statusChangeManage'] || loading.effects['lotteryDetails/downloadMember'],
}))

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'lotteryDetails/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.updateTime && formQueryData.updateTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.updateTime[0]).format('YYYY-MM-DD');
      formQueryData.createTimeEnd = moment(formQueryData.updateTime[1]).format('YYYY-MM-DD');
    }
    delete formQueryData['updateTime'];
    return formQueryData;
  };
  reset = () => {
    this.props.form.resetFields();
  };

  componentDidMount() {
    this.props.getChild(this);
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetails/getAllSelect',
      payload: {},
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'lotteryDetails/setSearchInfo',
      payload: {},
    });
  }

  render() {
    const { form: { getFieldDecorator }, lotteryDetails } = this.props;
    const { parentUtmTypes } = lotteryDetails;
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
                <FormItem label="姓名" {...formItemConfig}>
                  {getFieldDecorator('truename')(
                    <Input/>,
                  )}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="手机号" {...formItemConfig}>
                  {getFieldDecorator('userPhone')(
                    <Input/>,
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="渠道" {...formItemConfig}>
                  {getFieldDecorator('parentUtmId')(
                    <Select allowClear>
                      {parentUtmTypes && parentUtmTypes.map(item => {
                        return <Option key={item.key} value={item.value}>{item.title}</Option>;
                      })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="类型" {...formItemConfig}>
                  {getFieldDecorator('changeType')(
                    <Select allowClear>
                      <Option key={1} value={1}>获得次数</Option>
                      <Option key={2} value={2}>消耗次数</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="时间" {...formItemConfig}>
                  {getFieldDecorator('updateTime')(
                    <RangePicker></RangePicker>,
                  )}
                </FormItem>
              </Col>
              <Col {...searchConfig}>
                <FormItem {...formItemConfig}>
                  <Button onClick={this.formSubmit} type="primary">搜索</Button>
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
