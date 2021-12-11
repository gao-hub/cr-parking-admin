import React, { Component } from 'react';
import { Form, Input, Modal, Select, Radio, message, Checkbox, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const rules = {
  title: [{ required: true, message: '请填写公告标题' }],
  content: [{ required: true, message: '请填写内容' }],
  consumerUserType: [{ required: true, message: '请选择推送对象' }],
  location: [{ required: true, message: '请选择推送位置' }],
  status: [{ required: true, message: '请选择状态' }],
  time: [{ required: true, message: '请选择推送时间' }],
};
const objOption = [
  {
    value: 1,
    label: '全部用户',
  },
  {
    value: 2,
    label: '已开户用户',
  },
  {
    value: 3,
    label: '已购买车位用户',
  },
];
const locationOption = [
  {
    label: '首页',
    value: 1,
  },
  {
    label: '我的',
    value: 2,
  },
];
const statusOption = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '禁用',
    value: 0,
  },
];

@connect(({ noticeMessage }) => ({
  noticeMessage,
}))
@Form.create()
export default class AddModal extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    data: {},
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  setVisible = () => {
    const { visible } = this.state;
    const { actionType, actionId } = this.props;
    if (visible) {
      // this.props.form.resetFields();
      this.setState({
        data: {},
      });
    } else if (actionType !== 'add') {
      this.getData({ id: actionId });
    }
    this.setState({
      visible: !visible,
    });
  };

  getData = async payload => {
    let res = await this.props.dispatch({
      type: 'noticeMessage/getNotice',
      payload,
    });
    if (res && res.status === 1) {
      this.setState({
        data: {
          ...res.data,
          time: [moment(res.data.startTime), moment(res.data.endTime)],
          location: res.data.location.split(',').map(item => +item),
        },
      });
    } else message.error(res.statusDesc);
  };

  // 禁止选中时间
  disabledDateTime = current => {
    return current && current < moment().subtract(1, 'days');
  }

  handleOk = () => {
    const {
      actionId,
      actionType,
      dispatch,
      form,
      getList,
      currPage,
      pageSize,
    } = this.props;
    if (actionType === 'detail') {
      this.setVisible();
      return;
    }
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (actionType === 'edit') {
          values.id = actionId;
        }
        if (values.time && values.time.length) {
          values.startTime = moment(values.time[0]).format(dateFormat);
          values.endTime = moment(values.time[1]).format(dateFormat);
        }
        if (values.location && values.location.length) {
          values.location = values.location.join(',');
        }
        delete values.time;
        let res;
        if (actionType === 'add') {
          res = await dispatch({
            type: 'noticeMessage/addNotice',
            payload: values,
          });
        } else if (actionType === 'edit') {
          res = await dispatch({
            type: 'noticeMessage/editNotice',
            payload: values,
          });
        }
        if (res && res.status === 1) {
          this.setVisible();
          message.success(res.statusDesc);
          getList(currPage, pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };

  render() {
    const {
      actionType,
      form: { getFieldDecorator },
    } = this.props;
    const { data } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const isEdit = actionType === 'edit';
    // 查看
    const isView = actionType === 'detail';
    return (
      <Modal
        title="推送公告"
        visible={this.state.visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOk}
        onCancel={this.setVisible}
      >
        <Form>
          <FormItem label="公告标题" {...formConfig}>
            {getFieldDecorator('title', {
              rules: rules.title,
              initialValue: data && data.title,
            })(<Input maxLength={20} disabled={isView} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="内容" {...formConfig}>
            {getFieldDecorator('content', {
              rules: rules.content,
              initialValue: data && data.content,
            })(<TextArea rows={4} disabled={isView} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="推送对象" {...formConfig}>
            {getFieldDecorator('consumerUserType', {
              rules: rules.consumerUserType,
              initialValue: data && data.consumerUserType,
            })(
              <Select placeholder="请输入" disabled={isView}>
                {objOption.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="推送位置" {...formConfig}>
            {getFieldDecorator('location', {
              rules: rules.location,
              initialValue: data && data.location,
            })(
              <Checkbox.Group disabled={isView}>
                {locationOption.map(item => (
                  <Checkbox key={item.value} value={item.value}>
                    {item.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            )}
          </FormItem>
          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('status', {
              rules: rules.status,
              initialValue: data && data.status,
            })(
              <Radio.Group disabled={isView}>
                {statusOption.map(item => (
                  <Radio key={item.value} value={item.value}>
                    {item.label}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="推送时间" {...formConfig}>
            {getFieldDecorator('time', {
              rules: rules.time,
              initialValue: data && data.time,
            })(<RangePicker disabledDate={this.disabledDateTime} disabled={isView} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
