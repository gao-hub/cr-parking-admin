import React, { PureComponent } from 'react';
import { Modal, Form, Input, Row, Col, Select, message } from 'antd';
import { connect } from 'dva';
import Dingdanxinxi from './dingdanxinxi';
import { Review } from '../services/index';

const colConfig = {
  xxl: { span: 12 },
  xl: { span: 12 },
  lg: { span: 12 },
  md: { span: 12 },
  sm: { span: 16 },
  xs: { span: 20 },
};

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
@connect(({ SmarthomeOrderManage }) => ({
  orderInfo: SmarthomeOrderManage.orderInfo,
}))
class Fushen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOk = () => {
    const { form, onCancel, id, getList } = this.props;
    form.validateFields(async (err, data) => {
      if (!err) {
        const result = await Review({
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

  // 发货状态0 默认1未发货2已发货未收货3已收货
  handleDeliverStatus = value => {
    switch (value) {
      case 1:
        return '未发货';
      case 2:
        return '已发货未收货';
      case 3:
        return '已收货';
      default:
        return '';
    }
  };

  // 售后类型0仅退款1退货退款
  handleServiceType = value => {
    switch (value) {
      case 0:
        return '仅退款';
      case 1:
        return '退货退款';

      default:
        return '';
    }
  };

  render() {
    const {
      visible,
      onCancel,
      recordData,
      orderInfo,
      form: { getFieldDecorator },
    } = this.props;

    const { handleOk, handleDeliverStatus, handleServiceType } = this;

    console.log(orderInfo.refundList[0]?.refundRemark);

    return (
      <Modal title="复审" visible={visible} onOk={handleOk} onCancel={onCancel} width="50%">
        <div>订单信息</div>
        <Dingdanxinxi data={recordData} type={2} />
        <div>初审结果</div>
        {orderInfo.refundList[0]?.refundSponsor === 0 && (
          <>
            <Row>
              <Col {...colConfig}>
                <span>初审：</span>
                <span>通过</span>
              </Col>
              <Col {...colConfig}>
                <span>退款金额：</span>
                <span>{orderInfo.refundList[0]?.refundPayment}元</span>
              </Col>
            </Row>
            <Row>
              <Col {...colConfig}>
                <span>备注：</span>
                <span>{orderInfo.refundList[0]?.refundRemark}</span>
              </Col>
            </Row>
          </>
        )}
        {orderInfo.refundList[0]?.refundSponsor === 1 && (
          <>
            <Row>
              <Col {...colConfig}>
                <span>发货状态：</span>
                <span>{handleDeliverStatus(orderInfo.refundList[0]?.deliverStatus)}</span>
              </Col>
              <Col {...colConfig}>
                <span>售后形式：</span>
                <span>{handleServiceType(orderInfo.refundList[0]?.serviceType)}</span>
              </Col>
            </Row>
            <Row>
              <Col {...colConfig}>
                <span>退款金额：</span>
                <span>{orderInfo.refundList[0]?.refundPayment}元</span>
              </Col>
              <Col {...colConfig}>
                <span>备注：</span>
                <span>{orderInfo.refundList[0]?.refundRemark}</span>
              </Col>
            </Row>
          </>
        )}
        <div
          style={{
            marginTop: '20px',
          }}
        >
          复审
        </div>
        <Form>
          <Form.Item label="审核">
            {getFieldDecorator('reviewType', {
              rules: [{ required: true, message: '请选择审核结果!' }],
            })(
              <Select allowClear>
                {selectOption.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="备注">
            {getFieldDecorator('reviewRemark', {
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

export default Fushen;
