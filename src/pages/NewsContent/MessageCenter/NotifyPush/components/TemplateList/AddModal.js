import React, { Component } from 'react';
import { Form, Input, Modal, Select, Radio, message } from 'antd';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const rules = {
  tplName: [{ required: true, message: '请填写模板名称' }],
  tplCode: [{ required: true, message: '请填写模板标识' }],
  tplTitle: [{ required: true, message: '请填写模板标题' }],
  tplContent: [{ required: true, message: '请填写模板内容' }],
  tplTypeId: [{ required: true, message: '请选择消息类别' }],
  openStatus: [{ required: true, message: '请选择状态' }],
};
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

@permission
@connect(({ notifyPush }) => ({
  notifyPush,
}))
@Form.create()
export default class AddModal extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    data: {},
    categoryList: [],
  };

  componentDidMount() {
    this.props.getAddChild(this);
  }

  setVisible = () => {
    const { visible } = this.state;
    const { actionId, actionType } = this.props;
    if (!visible) {
      actionType !== 'add' && this.getData({ id: actionId });
      this.getCategory();
    } else {
      this.props.form.resetFields();
      this.setState({
        data: {},
      });
    }
    this.setState({
      visible: !visible,
    });
  };

  getData = async payload => {
    let res = await this.props.dispatch({
      type: 'notifyPush/getTemplateInfo',
      payload,
    });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
      });
    } else message.error(res.statusDesc);
  };

  getCategory = async () => {
    let res = await this.props.dispatch({
      type: 'notifyPush/getCategorySelect',
      payload: {},
    });
    if (res && res.status === 1) {
      let { msgType = [] } = res.data;
      this.setState({
        categoryList: msgType,
      });
    } else {
      this.setState({
        categoryList: [],
      });
    }
  };

  handleOk = () => {
    const { actionId, actionType, dispatch, form, getList, currPage, pageSize, permission } = this.props;
    if (actionType === 'add' && !permission.includes('chuangrong:msgTemplate:add')) {
      return message.error('您没有模板新增的权限');
    } else if (actionType === 'edit' && !permission.includes('chuangrong:msgTemplate:update')) {
      return message.error('您没有模板编辑的权限');
    }
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (actionType === 'add') {
          res = await dispatch({
            type: 'notifyPush/setTemplate',
            payload: values
          })
        } else if (actionType === 'edit') {
          res = await dispatch({
            type: 'notifyPush/editTemplate',
            payload: {
              ...values,
              id: actionId
            }
          })
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
    const { data, categoryList } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={actionType === 'add' ? '添加' : '修改'}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.setVisible}
      >
        <Form>
          <FormItem label="模板名称" {...formConfig}>
            {getFieldDecorator('tplName', {
              rules: rules.tplName,
              initialValue: data && data.tplName,
            })(<Input maxLength={20} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="模板标识" {...formConfig}>
            {getFieldDecorator('tplCode', {
              rules: rules.tplCode,
              initialValue: data && data.tplCode,
            })(<Input maxLength={20} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="模板标题" {...formConfig}>
            {getFieldDecorator('tplTitle', {
              rules: rules.tplTitle,
              initialValue: data && data.tplTitle,
            })(<Input maxLength={20} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="模板内容" {...formConfig}>
            {getFieldDecorator('tplContent', {
              rules: rules.tplContent,
              initialValue: data && data.tplContent,
            })(<Input.TextArea maxLength={200} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="消息类别" {...formConfig}>
            {getFieldDecorator('tplTypeId', {
              rules: rules.tplTypeId,
              initialValue: data && data.tplTypeId,
            })(
              <Select placeholder="请输入">
                {categoryList.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('openStatus', {
              rules: rules.openStatus,
              initialValue: data && data.openStatus,
            })(
              <Radio.Group>
                {statusOption.map(item => (
                  <Radio key={item.value} value={item.value}>
                    {item.label}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="说明" {...formConfig}>
            {getFieldDecorator('tplDesc', {
              initialValue: data && data.tplDesc,
            })(<TextArea maxLength={200} rows={4} placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
