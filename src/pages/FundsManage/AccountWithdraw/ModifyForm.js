import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ accountWithdrawManage, loading }) => ({
  accountWithdrawManage,
  submitLoading: loading.effects['accountWithdrawManage/modifyManage']
}))
export default class Modify extends PureComponent {
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
        type: 'accountWithdrawManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, accountWithdrawManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        let res
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'accountWithdrawManage/modifyManage',
            payload: {
              ...values,
              id: this.props.accountWithdrawManage.modifyInfoData.id,
            }
          })
        } else {
          res = await dispatch({
            type: 'accountWithdrawManage/addManage',
            payload: values
          })
        }
        if (res && res.status === 1) {
          this.changeVisible(false)
          message.success(res.statusDesc)
          this.props.getList(this.props.currPage, this.props.pageSize)
        } else message.error(res.statusDesc)
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const { form: { getFieldDecorator }, accountWithdrawManage: { modifyInfoData } } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem
            label=""
            {...formConfig}
          >
            {getFieldDecorator('id', {
              rules: [{ required: true, message: '请输入' }],
              initialValue: modifyInfoData && modifyInfoData.id
            })(
              <Input placeholder={'请输入'} />
            )}
          </FormItem>
          <FormItem
            label="订单号"
            {...formConfig}
          >
            {getFieldDecorator('orderNo', {
              rules: [{ required: true, message: '请输入订单号' }],
              initialValue: modifyInfoData && modifyInfoData.orderNo
            })(
              <Input placeholder={'请输入订单号'} />
            )}
          </FormItem>
          <FormItem
            label="银行流水号"
            {...formConfig}
          >
            {getFieldDecorator('seqNo', {
              rules: [{ required: true, message: '请输入银行流水号' }],
              initialValue: modifyInfoData && modifyInfoData.seqNo
            })(
              <Input placeholder={'请输入银行流水号'} />
            )}
          </FormItem>
          <FormItem
            label="用户ID"
            {...formConfig}
          >
            {getFieldDecorator('userId', {
              rules: [{ required: true, message: '请输入用户ID' }],
              initialValue: modifyInfoData && modifyInfoData.userId
            })(
              <Input placeholder={'请输入用户ID'} />
            )}
          </FormItem>
          <FormItem
            label="用户名"
            {...formConfig}
          >
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名' }],
              initialValue: modifyInfoData && modifyInfoData.username
            })(
              <Input placeholder={'请输入用户名'} />
            )}
          </FormItem>
          <FormItem
            label="电子账户"
            {...formConfig}
          >
            {getFieldDecorator('accountId', {
              rules: [{ required: true, message: '请输入电子账户' }],
              initialValue: modifyInfoData && modifyInfoData.accountId
            })(
              <Input placeholder={'请输入电子账户'} />
            )}
          </FormItem>
          <FormItem
            label="银行卡号"
            {...formConfig}
          >
            {getFieldDecorator('bankCardNumber', {
              rules: [{ required: true, message: '请输入银行卡号' }],
              initialValue: modifyInfoData && modifyInfoData.bankCardNumber
            })(
              <Input placeholder={'请输入银行卡号'} />
            )}
          </FormItem>
          <FormItem
            label="联行号"
            {...formConfig}
          >
            {getFieldDecorator('unionBankNumber', {
              rules: [{ required: true, message: '请输入联行号' }],
              initialValue: modifyInfoData && modifyInfoData.unionBankNumber
            })(
              <Input placeholder={'请输入联行号'} />
            )}
          </FormItem>
          <FormItem
            label="提现银行"
            {...formConfig}
          >
            {getFieldDecorator('bank', {
              rules: [{ required: true, message: '请输入提现银行' }],
              initialValue: modifyInfoData && modifyInfoData.bank
            })(
              <Input placeholder={'请输入提现银行'} />
            )}
          </FormItem>
          <FormItem
            label="提现金额"
            {...formConfig}
          >
            {getFieldDecorator('money', {
              rules: [{ required: true, message: '请输入提现金额' }],
              initialValue: modifyInfoData && modifyInfoData.money
            })(
              <Input placeholder={'请输入提现金额'} />
            )}
          </FormItem>
          <FormItem
            label="手续费"
            {...formConfig}
          >
            {getFieldDecorator('fee', {
              rules: [{ required: true, message: '请输入手续费' }],
              initialValue: modifyInfoData && modifyInfoData.fee
            })(
              <Input placeholder={'请输入手续费'} />
            )}
          </FormItem>
          <FormItem
            label="出账金额"
            {...formConfig}
          >
            {getFieldDecorator('total', {
              rules: [{ required: true, message: '请输入出账金额' }],
              initialValue: modifyInfoData && modifyInfoData.total
            })(
              <Input placeholder={'请输入出账金额'} />
            )}
          </FormItem>
          <FormItem
            label="实际出账金额"
            {...formConfig}
          >
            {getFieldDecorator('credited', {
              rules: [{ required: true, message: '请输入实际出账金额' }],
              initialValue: modifyInfoData && modifyInfoData.credited
            })(
              <Input placeholder={'请输入实际出账金额'} />
            )}
          </FormItem>
          <FormItem
            label="提现状态:0:初始,1:提现中,2:提现成功,3:提现失败，4：银行失败"
            {...formConfig}
          >
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请输入提现状态:0:初始,1:提现中,2:提现成功,3:提现失败，4：银行失败' }],
              initialValue: modifyInfoData && modifyInfoData.status
            })(
              <Input placeholder={'请输入提现状态:0:初始,1:提现中,2:提现成功,3:提现失败，4：银行失败'} />
            )}
          </FormItem>
          <FormItem
            label="备注说明"
            {...formConfig}
          >
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入备注说明' }],
              initialValue: modifyInfoData && modifyInfoData.remark
            })(
              <Input placeholder={'请输入备注说明'} />
            )}
          </FormItem>
          <FormItem
            label="创建人ID"
            {...formConfig}
          >
            {getFieldDecorator('createBy', {
              rules: [{ required: true, message: '请输入创建人ID' }],
              initialValue: modifyInfoData && modifyInfoData.createBy
            })(
              <Input placeholder={'请输入创建人ID'} />
            )}
          </FormItem>
          <FormItem
            label="创建时间"
            {...formConfig}
          >
            {getFieldDecorator('createTime', {
              rules: [{ required: true, message: '请输入创建时间' }],
              initialValue: modifyInfoData && modifyInfoData.createTime
            })(
              <Input placeholder={'请输入创建时间'} />
            )}
          </FormItem>
          <FormItem
            label="更新人ID"
            {...formConfig}
          >
            {getFieldDecorator('updateBy', {
              rules: [{ required: true, message: '请输入更新人ID' }],
              initialValue: modifyInfoData && modifyInfoData.updateBy
            })(
              <Input placeholder={'请输入更新人ID'} />
            )}
          </FormItem>
          <FormItem
            label="更新时间"
            {...formConfig}
          >
            {getFieldDecorator('updateTime', {
              rules: [{ required: true, message: '请输入更新时间' }],
              initialValue: modifyInfoData && modifyInfoData.updateTime
            })(
              <Input placeholder={'请输入更新时间'} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
