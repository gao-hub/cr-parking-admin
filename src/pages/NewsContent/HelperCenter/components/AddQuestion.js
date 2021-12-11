import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, message, Radio, Modal } from 'antd';
import { _baseApi } from '@/defaultSettings.js';
import BraftEditor from '@/components/BraftEditor';
import permission from '@/utils/PermissionWrapper';

const rules = {
  helpName: [{ required: true, message: '请填写问题名称' }],
  helpContent: [{ required: true, message: '请填写问题答案' },
    {
      validator: (rule, value, callback) => {
        if (value && !value.replace(/<p>\x20+<\/p>/, '')) {
          callback("请正确填写问题答案");
        } else callback();
      }
    }],
  isMajor: [{ required: true, message: '请选择是否属于常见问题' }],
  openStatus: [{ required: true, message: '请选择状态' }],
};
const isCommOption = [
  {
    value: 1,
    label: '是',
  },
  {
    value: 0,
    label: '否',
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

@permission
@Form.create()
@connect(({ helperCenter }) => helperCenter)
export default class AddQuestion extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    data: {
      openStatus: 1, // 状态默认为启用
    },
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  setVisible = () => {
    const { visible } = this.state;
    const { actionType, actionId } = this.props;
    this.setState({
      visible: !visible,
    });
    if (visible) {
      // this.props.form.resetFields();
      this.setState({
        data: {
          openStatus: 1
        },
      });
    } else if (actionType === 'edit') {
      this.getData({ id: actionId });
    }
  };

  getData = async payload => {
    let res = await this.props.dispatch({
      type: 'helperCenter/getQuestion',
      payload,
    });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
      });
    } else message.error(res.statusDesc);
  };

  handleOk = () => {
    let { form, actionType, actionId, dispatch, currPage, pageSize, typeId, permission } = this.props;
    if (actionType === 'add' && !permission.includes('chuangrong:helpInfo:add')) {
      return message.error('您还没有问题的新增权限');
    } else if (actionType === 'edit' && !permission.includes('chuangrong:helpInfo:update')) {
      return message.error('您还没有问题的编辑权限');
    }
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (actionType === 'add') {
          res = await dispatch({
            type: 'helperCenter/addQuestion',
            payload: {
              ...values,
              typeId,
            },
          });
        } else {
          res = await dispatch({
            type: 'helperCenter/editQuestion',
            payload: {
              ...values,
              id: actionId,
              typeId: this.state.data.typeId
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

  handleChange = value => {
    console.log('change-value');
    const { form } = this.props;
    form.setFieldsValue({ helpContent: value === '<p></p>' ? '' : value });
  };

  render() {
    const {
      form: { getFieldDecorator },
      actionType
    } = this.props;
    const { data } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const FormItem = Form.Item;
    const titleOption = {
      add: '添加',
      edit: '修改'
    }
    return (
      <Modal
        title={titleOption[actionType]}
        width="80%"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        destroyOnClose
        onOk={this.handleOk}
        onCancel={this.setVisible}
      >
        <Form>
          <FormItem label="问题名称" {...formConfig}>
            {getFieldDecorator('helpName', {
              rules: rules.helpName,
              initialValue: data && data.helpName,
            })(<Input maxLength={40} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="答案" {...formConfig}>
            {getFieldDecorator('helpContent', {
              rules: rules.helpContent,
              initialValue: data && data.helpContent,
            })(
              <BraftEditor
                handleChange={this.handleChange}
                uploadImgUrl={`${_baseApi}/helpType/upload`}
                content={data.helpContent}
                placeholder="请输入答案"
                image={true}
                video={false}
                minHeight="500px"
              />
            )}
          </FormItem>
          <FormItem label="是否属于常见问题" {...formConfig}>
            {getFieldDecorator('isMajor', {
              rules: rules.isMajor,
              initialValue: data && data.isMajor,
            })(
              <Radio.Group>
                {isCommOption.map(item => (
                  <Radio key={item.value} value={item.value}>
                    {item.label}
                  </Radio>
                ))}
              </Radio.Group>
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
    );
  }
}
