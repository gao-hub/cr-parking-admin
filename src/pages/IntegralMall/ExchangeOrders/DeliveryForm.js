import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { connect } from 'dva';


const FormItem = Form.Item;


const formConfig = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@Form.create()
@connect(({ ExchangeOrders, loading }) => ({
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

  handleOk = async () => {
    const {
      dispatch,
      form,
      onCancel,
      salesId
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { getList, currPage, pageSize } = this.props;
        this.setState({ loading: true });
        const res = await dispatch({
          type: 'ExchangeOrders/onDelivery',
          payload: {
            ...values,
            id: salesId,
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

  handleCancel = async() => {
    const { onCancel } = this.props;
    onCancel();
  }


  render() {
    const {
      form = {},
    } = this.props;
    const { getFieldDecorator } = form;

    const {
      visible = false,
      loading
    } = this.state;

    return (
      <Modal
        title="发货"
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
          <div style={{ padding: '0 20px 20px' }}>确认发货后，点击发货，订单状态由待处理变为已完成。</div>
          <FormItem label="物流订单号" {...formConfig}>
            {getFieldDecorator('deliveryId', {
              rules: [{ required: true, message: '请输入物流订单号' }]
            })(<Input placeholder="请输入物流订单号" maxLength={50} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Modify;
