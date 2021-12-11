import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, InputNumber, message } from 'antd';
import Dingdanxinxi from './dingdanxinxi';
import { updateOne } from '../services/index';

const selectOption = [
  {
    id: 1,
    label: '通过',
  },
  {
    id: 0,
    label: '不通过',
  },
];

@Form.create()
class Shouhou extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOk = () => {
    const { form, onCancel, id, getList } = this.props;
    form.validateFields(async (err, data) => {
      if (!err) {
        const result = await updateOne({
          ...data,
          id,
        });
        if (result && result.status === 1) {
          message.success('操作成功');
          onCancel();
          getList();
        } else {
          message.error(result.statusDesc);
        }
      }
    });
  };

  render() {
    const {
      visible,
      onCancel,
      form: { getFieldDecorator },
      recordData,
    } = this.props;
    const { handleOk } = this;

    return (
      <Modal title="售后" visible={visible} onOk={handleOk} onCancel={onCancel} width="50%">
        <div>订单信息</div>
        <Dingdanxinxi data={recordData} type={3} />
        <Form>
          <Form.Item label="发货状态">
            {getFieldDecorator('deliverStatus', {
              rules: [{ required: true, message: '请选择发货状态!' }],
            })(
              <Radio.Group>
                <Radio value={1}>未发货</Radio>
                <Radio value={2}>已发货用户未收到货</Radio>
                <Radio value={3}>已收货</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="售后形式">
            {getFieldDecorator('serviceType', {
              rules: [{ required: true, message: '请选择售后形式!' }],
            })(
              <Radio.Group>
                <Radio value={1}>退款退货</Radio>
                <Radio value={0}>仅退款</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="退款金额">
            {getFieldDecorator('refundPayment', {
              rules: [{ required: true, message: '请输入退款金额!' }],
              initialValue: recordData?.payment,
            })(
              <InputNumber
                placeholder="退款金额"
                style={{ width: '100%' }}
                max={recordData?.payment}
              />
            )}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('refundRemark', {
              rules: [],
            })(<Input.TextArea placeholder="备注" autoSize={{ minRows: 2, maxRows: 6 }} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Shouhou;
