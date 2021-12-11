// 划拨 暂时作废 后期开启
import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ userAccountManage, loading }) => ({
  userAccountManage,
  submitLoading: loading.effects['userAccountManage/modifyManage'],
}))
export default class Transfer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'userAccountManage/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const {
      dispatch,
      form,
      userAccountManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'userAccountManage/modifyManage',
            payload: {
              ...values,
              id: this.props.userAccountManage.modifyInfoData.id,
            },
          });
        } else {
          res = await dispatch({
            type: 'userAccountManage/addManage',
            payload: values,
          });
        }
        if (res && res.status === 1) {
          this.changeVisible(false);
          message.success(res.statusDesc);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const {
      form: { getFieldDecorator },
      userAccountManage: { modifyInfoData },
    } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title="划拨"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="自账户名称" {...formConfig}>
            <span>847291847192031</span>
          </FormItem>
          <FormItem label="划拨至账户" {...formConfig}>
            {getFieldDecorator('account', {
              rules: [{ required: true, message: '请选择目标账户' }],
              initialValue: modifyInfoData && modifyInfoData.id,
            })(<Input placeholder={'请选择目标账户'} />)}
          </FormItem>
          <FormItem label="划拨金额" {...formConfig}>
            {getFieldDecorator('price', {
              rules: [{ required: true, message: '请输入划拨金额' }],
              initialValue: modifyInfoData && modifyInfoData.userId,
            })(<Input placeholder={'请输入划拨金额'} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
