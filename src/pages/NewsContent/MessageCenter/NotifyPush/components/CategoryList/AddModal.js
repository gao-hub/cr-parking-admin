import React, { Component, Fragment } from 'react';
import { Form, Input, Modal, Select, Radio, message } from 'antd';
import Upload from '@/components/Upload';
import { connect } from 'dva';
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const rules = {
  typeName: [
    {
      required: true,
      message: '请输入类别名称',
    },
  ],
  typePic: [
    {
      required: true,
      message: '请上传图标',
    },
  ],
  sortId: [
    {
      required: true,
      message: '请输入排序',
    },
  ],
  openStatus: [
    {
      required: true,
      message: '请选择状态',
    },
  ],
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

@Form.create()
@connect(({ notifyPush }) => ({
  notifyPush,
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
    this.props.getAddChild(this);
  }

  setVisible = () => {
    const { visible } = this.state;
    const { actionId, actionType } = this.props;
    if (!visible && actionType !== 'add') {
      this.getData({ id: actionId });
    }
    if (visible) {
      this.setState({
        data: {},
      });
      this.props.form.resetFields();
    }

    this.setState({
      visible: !visible,
    });
  };

  getData = async payload => {
    const res = await this.props.dispatch({
      type: 'notifyPush/getCategoryInfo',
      payload,
    });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
      });
    } else message.error(res.statusDesc);
  };

  handleOk = () => {
    const { actionId, actionType, dispatch, form, getList, currPage, pageSize } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (actionType === 'add') {
          res = await dispatch({
            type: 'notifyPush/addCategory',
            payload: values,
          });
        } else if (actionType === 'edit') {
          res = await dispatch({
            type: 'notifyPush/editCategory',
            payload: {
              ...values,
              id: actionId,
            },
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
    const { actionType, form = {} } = this.props;
    const { getFieldDecorator } = form;
    const { data, visible } = this.state;
    const isEdit = actionType === 'edit';
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={isEdit ? '修改' : '新增'}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.setVisible}
      >
        <Form>
          <FormItem label="类别名称" {...formConfig}>
            {getFieldDecorator('typeName', {
              rules: rules.typeName,
              initialValue: data && data.typeName,
            })(<Input maxLength={20} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="图标" {...formConfig}>
            {(actionType === 'add' || (actionType !== 'add' && data.typePic)) &&
              visible &&
              getFieldDecorator('typePic', {
                rules: rules.typePic,
                initialValue: data && data.typePic,
              })(
                <Upload
                  defaultUrl={data && data.typePic}
                  uploadConfig={{
                    action: `${_baseApi}/msgTemplateType/upload`,
                    fileType: ['image'],
                    size: 2,
                  }}
                  setIconUrl={url => form.setFieldsValue({ typePic: url })}
                />
              )}
            {actionType !== 'add' && !data.typePic &&
            visible &&
            getFieldDecorator('typePic', {
              rules: rules.typePic,
              initialValue: data && data.typePic,
            })(
              <Upload
                defaultUrl={data && data.typePic}
                uploadConfig={{
                  action: `${_baseApi}/msgTemplateType/upload`,
                  fileType: ['image'],
                  size: 2,
                }}
                setIconUrl={url => form.setFieldsValue({ typePic: url })}
              />
            )}
          </FormItem>
          {/*<FormItem label="排序" {...formConfig}>*/}
          {/*  {getFieldDecorator('sortId', {*/}
          {/*    rules: rules.sortId,*/}
          {/*    initialValue: data && data.sortId,*/}
          {/*  })(<Input placeholder="请输入" />)}*/}
          {/*</FormItem>*/}
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
            {getFieldDecorator('remark', {
              initialValue: data && data.remark,
            })(<TextArea maxLength={200} rows={4} placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
