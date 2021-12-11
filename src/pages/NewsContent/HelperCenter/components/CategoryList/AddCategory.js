import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';
import { Form, message, Modal, Radio, Input } from 'antd';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';

const rules = {
  typeName: [{ required: true, message: '请输入分类名称' }, {
    validator: (rule, value, callback) => {
      if (value && !/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
        callback('请输入正确的中文、英文以及数字');
      } else callback();
    }
  }],
  typePic: [{ required: true, message: '请上传app图标' }],
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

@Form.create()
@permission
@connect(({ helperCenter }) => ({
  helperCenter,
}))
export default class addCategory extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    visible: false,
    data: {
      openStatus: 1, // 状态默认启用
    },
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  setVisible = () => {
    let { visible } = this.state;
    let { actionType, actionId } = this.props;
    if (visible) {
      // this.props.form.resetFields();
      this.setState({
        data: {
          openStatus: 1
        },
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
      type: 'helperCenter/getCategory',
      payload,
    });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
      });
    } else message.error(res.statusDesc);
  };

  handleOk = () => {
    const { form, dispatch, currPage, pageSize, actionType, actionId, permission } = this.props;
    if (actionType === 'add' && !permission.includes('chuangrong:helpType:add')) {
      return message.error('您还没有分类添加权限');
    } else if (actionType === 'edit' && !permission.includes('chuangrong:helpType:update')) {
      return message.error('您还没有分类编辑权限');
    }
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (actionType === 'add') {
          res = await dispatch({
            type: 'helperCenter/addCategory',
            payload: values,
          });
        } else {
          res = await dispatch({
            type: 'helperCenter/editCategory',
            payload: {
              ...values,
              id: actionId,
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setVisible();
          this.props.getList(currPage, pageSize);
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };

  render() {
    const FormItem = Form.Item;
    const { form = {}, actionType } = this.props;
    const { data, visible } = this.state;
    const { getFieldDecorator } = form;
    const formConfig = { labelCol: { span: 5 }, wrapperCol: { span: 18 } };
    return (
      <Fragment>
        <Modal
          title={actionType === 'add' ? '添加分类' : '编辑分类'}
          visible={visible}
          width="50%"
          destroyOnClose
          onOk={this.handleOk}
          onCancel={this.setVisible}
        >
          <Form>
            <FormItem label="请输入分类名称" {...formConfig}>
              {getFieldDecorator('typeName', {
                rules: rules.typeName,
                initialValue: data && data.typeName,
              })(<Input maxLength={6} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="app图标" {...formConfig}>
              {(actionType === 'add' || (actionType !== 'add' && data.typePic)) &&
                visible &&
                getFieldDecorator('typePic', {
                  rules: rules.typePic,
                  initialValue: data && data.typePic,
                })(
                  <Upload
                    defaultUrl={data && data.typePic}
                    uploadConfig={{
                      action: `${_baseApi}/helpType/upload`,
                      fileType: ['image'],
                      size: 2,
                    }}
                    setIconUrl={url => form.setFieldsValue({ typePic: url })}
                  />
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
          </Form>
        </Modal>
      </Fragment>
    );
  }
}
