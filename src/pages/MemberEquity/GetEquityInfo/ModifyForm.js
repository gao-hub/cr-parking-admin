import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ ExchangeOrders, loading, user }) => ({
  user,
  ExchangeOrders,
  submitLoading: loading.effects['ExchangeOrders/modifyManage'],
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      loading: false
    };
  }

  componentDidMount() {
    
  }

  //  修改物流单号
  handleOk = async () => {
    const {
      dispatch,
      form,
      onCancel,
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { ExchangeOrders = {}, getList, currPage, pageSize } = this.props;
        this.setState({ loading: true });
        const res = await dispatch({
          type: 'ExchangeOrders/modifyDeliverId',
          payload: {
            ...values,
            id: ExchangeOrders.modifyInfoData.id,
          },
        });
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setState({ loading: false });
          getList(currPage, pageSize);
          onCancel();
        } else message.error(res.statusDesc);
      }
    });
  };

  handleCancel = () => {
    const {
      onCancel,
    } = this.props;
    onCancel();
  }

  render() {
    const {
      form = {},
      ExchangeOrders: { modifyInfoData },
    } = this.props;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const {
      visible = false,
      loading
    } = this.state;

    return (
      <Modal
        title="修改物流编号"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form>
          <FormItem label="当前物流单号" {...formConfig}>
            {
              modifyInfoData && modifyInfoData.deliveryId
            }
          </FormItem>

          <FormItem label="新物流单号" {...formConfig}>
            {getFieldDecorator('deliveryId', {
              rules: [{ required: true, message: '请输入新物流单号' }],
              // initialValue: modifyInfoData && modifyInfoData.deliveryId,
            })(<Input placeholder="请输入新物流单号" maxLength={50} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Modify;
