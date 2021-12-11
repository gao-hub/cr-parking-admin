import React, { PureComponent } from 'react';
import { Modal, Form, Input, Row, Col, Select, message, InputNumber } from 'antd';
import Dingdanxinxi from './dingdanxinxi';
import { Refund } from '../services/index';

const selectOption = [
  {
    id: 1,
    label: '通过',
  },
  {
    id: 2,
    label: '不通过',
  },
];

@Form.create()
class Chushen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showRefund: false,
    };
  }

  handleOk = () => {
    const { form, onCancel, id, getList } = this.props;
    form.validateFields(async (err, data) => {
      if (!err) {
        const result = await Refund({
          ...data,
          id,
        });
        if (result && result.status === 1) {
          message.success('操作成功');
          onCancel();
          getList();
        } else {
          message.error('操作失败');
        }
      }
    });
  };

  render() {
    const { visible, onCancel, form, recordData } = this.props;
    const { getFieldDecorator } = form;
    const { showRefund } = this.state;
    const { handleOk } = this;
    return (
      <Modal title="初审" visible={visible} onOk={handleOk} onCancel={onCancel}>
        <div>订单信息</div>
        <Dingdanxinxi data={recordData} type={2} />
        <div>初审</div>
        <Form>
          <Form.Item label="审核">
            {getFieldDecorator('refundType', {
              rules: [{ required: true, message: '请选择审核结果!' }],
            })(
              <Select
                allowClear
                Onchange={value => {
                  form.setFieldsValue({
                    refundType: value,
                  });
                  this.setState({
                    showRefund: true,
                  });
                }}
              >
                {selectOption.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {showRefund && (
            <Form.Item label="退款金额">
              {getFieldDecorator('refundPayment', {
                initialValue: recordData?.payment,
                rules: [{ required: true, message: '请输入退款金额!' }],
              })(<InputNumber placeholder="退款金额" max={recordData?.payment} />)}
            </Form.Item>
          )}
          <Form.Item label="备注">
            {getFieldDecorator('refundRemark', {
              rules: [],
            })(
              <Input.TextArea
                placeholder="备注"
                autoSize={{ minRows: 2, maxRows: 6 }}
                maxLength={250}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Chushen;
