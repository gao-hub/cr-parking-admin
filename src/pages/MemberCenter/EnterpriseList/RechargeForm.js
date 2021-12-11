import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ enterpriseManage, loading }) => ({
  enterpriseManage,
  submitLoading: loading.effects['enterpriseManage/modifyManage'],
}))
export default class RechargeForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userId: '',
      infoData: {},
    };
  }
  changeVisible = visible => {
    // if (!visible) {
    //   this.props.dispatch({
    //     type: 'enterpriseManage/setModifyInfo',
    //     payload: {},
    //   });
    // }
    this.setState({
      visible,
    });
  };
  // handleOk = async () => {
  //   const {
  //     dispatch,
  //     form,
  //     enterpriseManage: { modifyInfoData },
  //   } = this.props;
  //   form.validateFieldsAndScroll(async (err, values) => {
  //     if (!err) {
  //       const res = await dispatch({
  //         type: 'merchantAccountManage/rechargeData',
  //         payload: {
  //           ...values,
  //           id: this.props.enterpriseManage.modifyInfoData.id,
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
  getData = async userId => {
    this.setState({
      userId,
    });
    const { dispatch, form } = this.props;
    const res = await dispatch({
      type: 'enterpriseManage/rechargeInfo',
      payload: {
        userId,
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
      // enterpriseManage: { modifyInfoData },
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
            {this.state.infoData && this.state.infoData.userName}
          </FormItem>
          <FormItem label="收款方账户" {...formConfig}>
            {this.state.infoData && this.state.infoData.bankAccount}
          </FormItem>
          <FormItem label="收款行" {...formConfig}>
            {this.state.infoData && this.state.infoData.bankName}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
