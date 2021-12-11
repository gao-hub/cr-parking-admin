import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, message, Radio, Modal, Select, DatePicker } from 'antd';
import { _baseApi } from '@/defaultSettings.js';
import BraftEditor from '@/components/BraftEditor';
import Upload from '@/components/Upload';
import moment from 'moment';

const rules = {
  msgTitle: [{ required: true, message: '请填写标题' }],
  msgCover: [{ required: true, message: '请上传封面图' }],
  contentType: [{ required: true, message: '请填选择文章类型' }],
  msgContentLink: [{ required: true, message: '请填写页面地址' }],
  msgContent: [{ required: true, message: '请填写内容' }],
  consumerUserType: [{ required: true, message: '请选择推送对象' }],
  sendType: [{ required: true, message: '请选择推送类型' }],
  sendTime: [{ required: true, message: '请选择推送时间' }],
  status: [{ required: true, message: '请选择状态' }],
};
const typeOption = [
  {
    value: 1,
    label: '自定义编辑',
  },
  {
    value: 2,
    label: '指定跳转地址',
  },
];
const cusumerOption = [
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
const sendTypeOption = [
  {
    value: 1,
    label: '定时',
  },
  {
    value: 2,
    label: '实时',
  },
];
const statusOption = [
  {
    value: 1,
    label: '启用',
  },
  {
    value: 0,
    label: '禁用',
  },
];

@Form.create()
@connect(({ activityMessage, loading }) => ({
  activityMessage,
  loading: loading.effects['activityMessage/getMessageDetail'] ||
    loading.effects['activityMessage/addMessage'] ||
    loading.effects['activityMessage/editMessage'],
}))
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
    const { actionType } = this.props;
    if (visible) {
      this.setState({
        data: {},
      });
      // this.props.form.setFieldsValue();
    } else if (actionType !== 'add') {
      this.getData();
    }
    this.setState({
      visible: !visible,
    });
  };

  getData = async () => {
    const { actionId } = this.props;
    const res = await this.props.dispatch({
      type: 'activityMessage/getMessageDetail',
      payload: {
        id: actionId,
      },
    });
    if (res && res.status === 1) {
      let {data } = res;
      this.setState({
        data: {
          ...data,
          sendTime: data.sendType === 2 ? '' : data.sendTime
        },
      });
    }
  };

  changeContentType = e => {
    const { data } = this.state;
    this.setState({ data: { ...data, contentType: e.target.value } });
  };

  handleContentChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      msgContent: value === '<p></p>' ? '' : value,
    });
  };

  changeSendType = e => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        sendType: e.target.value,
      },
    });
  };

  disabledDate = current => {
    return current && current < moment().endOf('day');
  };

  handleOk = () => {
    let { form, actionType, dispatch, currPage, pageSize } = this.props;
    if (actionType === 'detail') {
      this.setVisible();
      return;
    }
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        values.sendTime && (values.sendTime = moment(values.sendTime).format('YYYY-MM-DD'));
        let res;
        if (actionType === 'add') {
          res = await dispatch({
            type: 'activityMessage/addMessage',
            payload: values,
          });
        } else {
          res = await dispatch({
            type: 'activityMessage/editMessage',
            payload: {
              ...values,
              id: this.props.actionId,
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setVisible();
          this.props.getList(currPage, pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };

  render() {
    const {
      actionType,
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { data } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const FormItem = Form.Item;
    const Option = Select.Option;
    const isView = actionType === 'detail';
    const isAdd = actionType === 'add';
    return (
      <Modal
        title={actionType === 'add' ? '新增' : actionType === 'edit' ? '修改' : '详情'}
        width='60%'
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        destroyOnClose
        onOk={this.handleOk}
        onCancel={this.setVisible}
        confirmLoading={loading}
      >
        <Form>
          <FormItem label='标题' {...formConfig}>
            {getFieldDecorator('msgTitle', {
              rules: rules.msgTitle,
              initialValue: data && data.msgTitle,
            })(<Input maxLength={20} disabled={isView} placeholder='请输入' />)}
          </FormItem>
          <FormItem
            label='封面图'
            {...formConfig}
            extra={
              <span style={{ fontSize: '10px' }}>(注：建议尺寸975*390像素，大小不超过2M)</span>
            }
          >
            {(actionType === 'add' || (actionType !== 'add' && data.msgCover)) &&
            getFieldDecorator('msgCover', {
              rules: rules.msgCover,
              initialValue: data && data.msgCover,
            })(
              <Upload
                defaultUrl={(data && data.msgCover) || ''}
                disabled={isView}
                uploadConfig={{
                  action: `${_baseApi}/activityMsgPlan/uploadCoverPicture`,
                  fileType: ['image'],
                  size: 2,
                  // imgSize: { width: 975, height: 390 },
                }}
                setIconUrl={url => {
                  this.props.form.setFieldsValue({ msgCover: url });
                }}
              />,
            )}
          </FormItem>
          <FormItem label='文章类型' {...formConfig}>
            {getFieldDecorator('contentType', {
              rules: rules.contentType,
              initialValue: data && data.contentType,
            })(
              <Radio.Group disabled={isView} onChange={this.changeContentType}>
                {typeOption.map(item => (
                  <Radio key={item.value} value={item.value}>
                    {item.label}
                  </Radio>
                ))}
              </Radio.Group>,
            )}
          </FormItem>
          {data.contentType === 1 && (
            <FormItem label='内容' {...formConfig}>
              {getFieldDecorator('msgContent', {
                rules: rules.msgContent,
                initialValue: data && data.msgContent,
              })(
                <BraftEditor
                  handleChange={val => this.handleContentChange(val)}
                  uploadImgUrl={`${_baseApi}/activityMsgPlan/uploadCoverPicture`}
                  content={data.msgContent}
                  placeholder='请输入文章内容'
                  disabled={isView}
                  image={true}
                  video={true}
                  minHeight='500px'
                />,
              )}
            </FormItem>
          )}
          {data.contentType === 2 && (
            <FormItem label='页面地址' {...formConfig}>
              {getFieldDecorator('actionUrl', {
                rules: rules.msgContentLink,
                initialValue: data && data.actionUrl,
              })(<Input maxLength={300} disabled={isView} placeholder='请输入页面地址' />)}
            </FormItem>
          )}
          <FormItem label='推送对象' {...formConfig}>
            {getFieldDecorator('consumerUserType', {
              rules: rules.consumerUserType,
              initialValue: data && data.consumerUserType,
            })(
              <Select disabled={isView} allowClear>
                {cusumerOption.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label='推送类型' {...formConfig}>
            {getFieldDecorator('sendType', {
              rules: rules.sendType,
              initialValue: data && data.sendType,
            })(
              <Radio.Group disabled={isView} onChange={this.changeSendType}>
                {sendTypeOption.map(item => (
                  <Radio key={item.value} value={item.value}>
                    {item.label}
                  </Radio>
                ))}
              </Radio.Group>,
            )}
          </FormItem>
          {data.sendType === 1 && (
            <FormItem label='推送时间' {...formConfig}>
              {getFieldDecorator('sendTime', {
                rules: rules.sendTime,
                initialValue: data.sendTime ? moment(data.sendTime) : '',
              })(<DatePicker disabled={isView} disabledDate={this.disabledDate} />)}
            </FormItem>
          )}

          <FormItem label='状态' {...formConfig}>
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
              </Radio.Group>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
