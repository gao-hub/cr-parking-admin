import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';
import { rechargeData } from '../EnterpriseAccount/services';

const FormItem = Form.Item;

@Form.create()
@connect(({ userAccountManage, loading }) => ({
  userAccountManage,
  submitLoading: loading.effects['userAccountManage/modifyManage'],
}))
export default class RechargeForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      infoData: {}, // 充值信息
      accountCode: "",
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'merchantAccountManage/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
    });
  };
  // handleOk = async () => {
  //   const {
  //     dispatch,
  //     form,
  //     userAccountManage: { modifyInfoData },
  //   } = this.props;
  //   form.validateFieldsAndScroll(async (err, values) => {
  //     if (!err) {
  //       const res = await dispatch({
  //         type: 'merchantAccountManage/rechargeData',
  //         payload: {
  //           ...values,
  //           id: this.props.userAccountManage.modifyInfoData.id,
  //         },
  //       });
  //       if (res && res.status === 1) {
  //         this.changeVisible(false);
  //         message.success(res.statusDesc);
  //         this.props.getList(this.props.currPage, this.props.pageSize);
  //       } else message.error(res.statusDesc);
  //     }
  //   });
  // };
  // 获取数据
  getData = async (accountCode) => {
    const {
      dispatch
    } = this.props;
    this.setState({
      accountCode
    });
    const res = await dispatch({
      type: 'merchantAccountManage/rechargeInfo',
      payload: {
        accountCode
      },
    });
    if (res && res.status === 1) {
      this.setState({
        infoData: res.data
      })
    } else message.error(res.statusDesc);
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const {
      form: { getFieldDecorator },
      // userAccountManage: { modifyInfoData },
    } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title="充值"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        // onOk={this.handleOk}
        onOk={() => this.changeVisible(false)}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="收款方户名" {...formConfig}>
            {this.state.infoData && this.state.infoData.bankAccountName}
          </FormItem>
          <FormItem label="收款方账户" {...formConfig}>
            {this.state.infoData && this.state.infoData.accountId}
          </FormItem>
          <FormItem label="收款行" {...formConfig}>
            {this.state.infoData && this.state.infoData.accountBank}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
