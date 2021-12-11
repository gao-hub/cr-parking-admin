import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, message, Radio, Modal } from 'antd';
import { _baseApi } from '@/defaultSettings.js';
import BraftEditor from '@/components/BraftEditor';
import Upload from '@/components/Upload';
import CropUpload from '@/pages/NewsContent/components/CropUpload';
import permission from '@/utils/PermissionWrapper';

const rules = {
  nickName: [{ required: true, message: '请填写昵称' },
    { min: 2, max: 10, message: '昵称长度限制为2-10' }],
  userImg: [{ required: true, message: '请上传头像' }],
  status: [{ required: true, message: '状态必填' }],
};
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

@permission
@Form.create()
@connect(({ accountManage }) => accountManage)
export default class AddAccount extends Component {
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
    if (actionType !== 'add' && !visible) {
      this.getData();
    } else {
      this.setState({
        data: {},
      });
    }
    this.setState({ visible: !visible });
  };

  getData = async () => {
    const { id } = this.props;
    const res = await this.props.dispatch({
      type: 'accountManage/getDetail',
      payload: {
        id: id,
      },
    });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
      });
    }
  };

  handleOk = () => {
    let { form, actionType, dispatch, currPage, pageSize, tab, permission } = this.props;
    if (actionType === 'detail') {
      this.setVisible();
      return;
    }
    if (actionType === 'add' && !permission.includes('chuangrong:userArtAccount:add')) {
      return message.error('您还没有新增权限');
    } else if (actionType === 'edit' && !permission.includes('chuangrong:userArtAccount:update')) {
      return message.error('您还没有编辑权限');
    }
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        let accountType = {
          official: 1,
          inside: 2,
        };
        values.accountType = accountType[tab];
        if (actionType === 'add') {
          res = await dispatch({
            type: 'accountManage/addAccount',
            payload: values,
          });
        } else {
          res = await dispatch({
            type: 'accountManage/editAccount',
            payload: {
              ...values,
              id: this.props.id,
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setVisible();
          this.props.getList(currPage, this.props.pageSize);
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
    const FormItem = Form.Item;
    const TextArea = Input;
    const titleOption = {
      add: '新增',
      edit: '修改',
    };
    return (
      <Modal
        title={titleOption[actionType]}
        width="60%"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        destroyOnClose
        onOk={this.handleOk}
        onCancel={this.setVisible}
      >
        <Form>
          <FormItem label="昵称" {...formConfig}>
            {getFieldDecorator('nickName', {
              rules: rules.nickName,
              initialValue: data && data.nickName,
            })(<Input maxLength={10} placeholder="请输入" />)}
          </FormItem>
          <FormItem
            label="头像"
            {...formConfig}
            extra={
              <span style={{ fontSize: '10px' }}>(注：建议上传1：1比例的图片，大小不超过2M)</span>
            }
          >
            {(actionType === 'add' || (actionType !== 'add' && data.userImg)) &&
              getFieldDecorator('userImg', {
                rules: rules.userImg,
                initialValue: data && data.userImg,
              })(
                <CropUpload
                  aspect={1 / 1}
                  defaultUrl={(data && data.userImg) || ''}
                  uploadConfig={{
                    action: `${_baseApi}/userArtAccount/upload`,
                    fileType: ['image'],
                    maxFileList: 1,
                    size: 2,
                  }}
                  setIconUrl={list => {
                    let url = Array.isArray(list) ? list[0] : list;
                    this.props.form.setFieldsValue({ userImg: url });
                  }}
                />
              )}
          </FormItem>
          <FormItem label="账号描述" {...formConfig}>
            {getFieldDecorator('remark', {
              initialValue: data && data.remark,
            })(<TextArea maxLength={200} />)}
          </FormItem>
          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('status', {
              rules: rules.status,
              initialValue: data && data.status,
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
    );
  }
}
