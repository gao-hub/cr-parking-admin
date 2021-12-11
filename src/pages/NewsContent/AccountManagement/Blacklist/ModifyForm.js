import React, { PureComponent, Fragment } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';

const FormItem = Form.Item;

@Form.create()
@connect(({ accountManagement }) => ({
  accountManagement,
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {
    this.props.getChildData(this);
  }

  changeVisible = visible => {
    this.setState({
      visible,
    });
    this.props.dispatch({
      type: 'accountManagement/setUserInfo',
      payload: null,
    });
  };
  // 提交
  handleOk = async () => {
    const {
      form,
      dispatch,
      getList,
      currPage,
      pageSize,
      accountManagement: { userInfo },
    } = this.props;

    if (userInfo === null || userInfo === undefined || Object.keys(userInfo).length === 0) {
      message.error('请填写正确用户名且查询信息');
      return false;
    }

    form.validateFieldsAndScroll(async (err, values) => {
      const obj = { ...userInfo, ...values };
      if (!err) {
        let res = await dispatch({
          type: 'accountManagement/addBlackUser',
          payload: obj,
        });
        if (res && res.status === 1) {
          this.changeVisible(false);
          message.success(res.statusDesc);
          getList(currPage, pageSize);
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };

  // 根据用户名查询信息
  searchQuery = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        dispatch({
          type: 'accountManagement/getUserByUserName',
          payload: {
            username: form.getFieldValue('username'),
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      accountManagement: { userInfo },
    } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title="添加"
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="用户名" {...formConfig}>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名' }],
              initialValue: '',
            })(
              <div>
                <Input
                  maxLength={20}
                  placeholder={'请输入用户名'}
                  width={50}
                  style={{ width: '235px' }}
                />{' '}
                <Button type="primary" onClick={this.searchQuery}>
                  查询
                </Button>
              </div>
            )}
          </FormItem>
          {userInfo !== null &&
            Object.keys(userInfo).length !== 0 && (
              <div>
                <FormItem label="用户昵称" {...formConfig}>
                  {userInfo.nickName}
                </FormItem>
                <FormItem label="姓名" {...formConfig}>
                  {userInfo.trueName}
                </FormItem>
                <FormItem label="手机号" {...formConfig}>
                  {userInfo.mobile}
                </FormItem>
                <FormItem label="渠道" {...formConfig}>
                  {userInfo.utmName}
                </FormItem>
              </div>
            )}
          <FormItem label="备注" {...formConfig}>
            {getFieldDecorator('remark', {
              initialValue: '',
            })(<TextArea maxLength={500} placeholder={'请输入备注'} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
