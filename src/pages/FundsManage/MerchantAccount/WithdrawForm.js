// 提现操作
import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { connect } from 'dva';

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
      value: undefined,
      accountCode: '',
      infoData: ''
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
      form
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await dispatch({
          type: 'merchantAccountManage/withdrawSubmit',
          payload: {
            ...values,
          },
        });
        if (res && res.status === 1) {
          this.changeVisible(false);
          message.success(res.statusDesc);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };
  // 获取提现信息
  getData = async (accountCode)=>{
    const {
      dispatch
    } = this.props
    this.setState({
      accountCode
    })
    const res = await dispatch({
      type: 'merchantAccountManage/withdrawInfo',
      payload: {
        accountCode
      },
    });
    if (res && res.status === 1) {
      this.setState({
        infoData: res.data
      })
    } else message.error(res.statusDesc);
  }
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
        title="提现"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="提现账户" {...formConfig}>
            {this.state.infoData && this.state.infoData.bankAccountName}
          </FormItem>
          <FormItem label="提现银行卡" {...formConfig}>
            {this.state.infoData && this.state.infoData.bankCard}
            {this.state.infoData && getFieldDecorator('cardNo',{
              initialValue: this.state.infoData.bankCard
            })(
              <Input type="hidden"/>
            )}
          </FormItem>
          <FormItem
            label="提现金额"
            {...formConfig}
          >
            {getFieldDecorator('amount', {
              rules: [{ required: true, message: '请输入提现金额' }]
            })(
              <Input placeholder={'请输入提现金额'} />
            )}
          </FormItem>
          <FormItem>
            {this.state.infoData && getFieldDecorator('accountCode',{
              initialValue: this.state.infoData.accountCode
            })(
              <Input type="hidden"/>
            )}
          </FormItem>
          
        </Form>
      </Modal>
    );
  }
}
