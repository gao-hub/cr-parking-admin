import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { PostSend } from '../services/index';

@Form.create()
class Fahuo extends PureComponent {
  handleOk = () => {
    const { form, onCancel, id, getList } = this.props;
    form.validateFields(async (err, data) => {
      if (!err) {
        const result = await PostSend({
          deliveryId: data.deliveryId,
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

  handleValidator = (rule, value, callback) => {
    const regEn = /[`!@#$%^&*()_+<>?:"{},./;'[\]]/im;

    const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(value) || regCn.test(value)) {
      callback('不可输入特殊字符');
    }
    callback();
  };

  render() {
    const {
      visible,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;
    const { handleOk } = this;
    return (
      <Modal title="发货" visible={visible} onOk={handleOk} onCancel={onCancel} destroyOnClose>
        <Form>
          <Form.Item label="物流订单号">
            {getFieldDecorator('deliveryId', {
              rules: [
                { required: true, message: '请输入物流订单号!' },
                {
                  whitespace: true,
                  message: '物流订单号不能为空',
                },
                { validator: this.handleValidator, message: '不可输入特殊字符' },
              ],
            })(<Input placeholder="物流订单号" maxLength={30} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Fahuo;
