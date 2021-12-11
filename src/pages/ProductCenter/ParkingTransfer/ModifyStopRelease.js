import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Radio } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload'

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ parkingTransferManage, loading }) => ({
  parkingTransferManage,
  submitLoading: loading.effects['parkingTransferManage/modifyManage']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      fileList: []
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'parkingTransferManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, parkingTransferManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res
          res = await dispatch({
            type: 'parkingTransferManage/modifyManage',
            payload: {
              ...values,
              updateType:'stop',
              id: this.props.parkingTransferManage.modifyInfoData.id,
            }
          })
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
    const { form: { getFieldDecorator }, parkingTransferManage: { modifyInfoData } } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={'终止发布'}
        // title={modifyInfoData.id ? '修改' : '添加'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        okText={'终止发布'}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="楼盘名称" {...formConfig}>
            <span>{modifyInfoData.buildingName}</span>
          </FormItem>
          <FormItem label="车位号" {...formConfig}>
            <span>{modifyInfoData.parkingCode}</span>
          </FormItem>
          <FormItem label="姓名" {...formConfig}>
            <span>{modifyInfoData.trueName}</span>
          </FormItem>
          <FormItem label="手机号" {...formConfig}>
            <span>{modifyInfoData.mobile}</span>
          </FormItem>
          <FormItem label="购买价款" {...formConfig}>
            <span>{modifyInfoData.originalPriceStr}元</span>
          </FormItem>
          <FormItem label="实际支付" {...formConfig}>
            <span>{modifyInfoData.paymentStr}元</span>
          </FormItem>
          <FormItem label="服务费" {...formConfig}>
            <span>{modifyInfoData.serviceChargeStr}元</span>
          </FormItem>
          <FormItem label="期望售价" {...formConfig}>
            <span>{modifyInfoData.expectedPriceStr}元</span>
          </FormItem>
          <FormItem label="备注" {...formConfig}>
            {getFieldDecorator('remark', {
              // initialValue: modifyInfoData && modifyInfoData.remark,
            })(<TextArea maxLength={100} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
