import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ renewalManage, loading }) => ({
  renewalManage,
  submitLoading: loading.effects['renewalManage/modifyManage']
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
        type: 'renewalManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, renewalManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        let res
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'renewalManage/modifyManage',
            payload: {
              ...values,
              id: this.props.renewalManage.modifyInfoData.id,
            }
          })
        } else {
          res = await dispatch({
            type: 'renewalManage/addManage',
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
    const { form: { getFieldDecorator }, renewalManage: { modifyInfoData } } = this.props;
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
            label="自增id"
            {...formConfig}
          >
            {getFieldDecorator('id', {
              rules: [{ required: true, message: '请输入自增id' }],
              initialValue: modifyInfoData && modifyInfoData.id
            })(
              <Input placeholder={'请输入自增id'} />
            )}
          </FormItem>
          <FormItem
            label="业务订单关联ID"
            {...formConfig}
          >
            {getFieldDecorator('orderId', {
              rules: [{ required: true, message: '请输入业务订单关联ID' }],
              initialValue: modifyInfoData && modifyInfoData.orderId
            })(
              <Input placeholder={'请输入业务订单关联ID'} />
            )}
          </FormItem>
          <FormItem
            label="银行请求id"
            {...formConfig}
          >
            {getFieldDecorator('requestId', {
              rules: [{ required: true, message: '请输入银行请求id' }],
              initialValue: modifyInfoData && modifyInfoData.requestId
            })(
              <Input placeholder={'请输入银行请求id'} />
            )}
          </FormItem>
          <FormItem
            label="银行流水号"
            {...formConfig}
          >
            {getFieldDecorator('outOrderNo', {
              rules: [{ required: true, message: '请输入银行流水号' }],
              initialValue: modifyInfoData && modifyInfoData.outOrderNo
            })(
              <Input placeholder={'请输入银行流水号'} />
            )}
          </FormItem>
          <FormItem
            label="支付状态：0-待支付，1-支付成功，2-支付失败，3-支付异常，4支付超时"
            {...formConfig}
          >
            {getFieldDecorator('paymentStatus', {
              rules: [{ required: true, message: '请输入支付状态：0-待支付，1-支付成功，2-支付失败，3-支付异常，4支付超时' }],
              initialValue: modifyInfoData && modifyInfoData.paymentStatus
            })(
              <Input placeholder={'请输入支付状态：0-待支付，1-支付成功，2-支付失败，3-支付异常，4支付超时'} />
            )}
          </FormItem>
          <FormItem
            label="银行返回异常描述"
            {...formConfig}
          >
            {getFieldDecorator('paymentDesc', {
              rules: [{ required: true, message: '请输入银行返回异常描述' }],
              initialValue: modifyInfoData && modifyInfoData.paymentDesc
            })(
              <Input placeholder={'请输入银行返回异常描述'} />
            )}
          </FormItem>
          <FormItem
            label="支付类型：0-租金支付，1-回购支付，2-车位交易支付"
            {...formConfig}
          >
            {getFieldDecorator('paymentType', {
              rules: [{ required: true, message: '请输入支付类型：0-租金支付，1-回购支付，2-车位交易支付' }],
              initialValue: modifyInfoData && modifyInfoData.paymentType
            })(
              <Input placeholder={'请输入支付类型：0-租金支付，1-回购支付，2-车位交易支付'} />
            )}
          </FormItem>
          <FormItem
            label="支付渠道（1:通联，2:线下）"
            {...formConfig}
          >
            {getFieldDecorator('paymentUtm', {
              rules: [{ required: true, message: '请输入支付渠道（1:通联，2:线下）' }],
              initialValue: modifyInfoData && modifyInfoData.paymentUtm
            })(
              <Input placeholder={'请输入支付渠道（1:通联，2:线下）'} />
            )}
          </FormItem>
          <FormItem
            label="支付方式（1:pos，2:转账）"
            {...formConfig}
          >
            {getFieldDecorator('paymentWay', {
              rules: [{ required: true, message: '请输入支付方式（1:pos，2:转账）' }],
              initialValue: modifyInfoData && modifyInfoData.paymentWay
            })(
              <Input placeholder={'请输入支付方式（1:pos，2:转账）'} />
            )}
          </FormItem>
          <FormItem
            label="是否显示 0否，1是"
            {...formConfig}
          >
            {getFieldDecorator('showStatus', {
              rules: [{ required: true, message: '请输入是否显示 0否，1是' }],
              initialValue: modifyInfoData && modifyInfoData.showStatus
            })(
              <Input placeholder={'请输入是否显示 0否，1是'} />
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
