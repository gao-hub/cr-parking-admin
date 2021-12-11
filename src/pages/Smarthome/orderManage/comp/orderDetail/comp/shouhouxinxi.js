import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';

export default class Shouhouxinxi extends PureComponent {
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
    const { info } = this.props;
    const { handleDeliverStatus, handleServiceType } = this;
    return (
      <div>
        {info?.refundList.map(item => (
          <div
            style={{
              marginBottom: '20px',
            }}
          >
            <Row>
              <Col span={8}>
                <span>售后类型：</span>
                <span>{item.serviceType === 0 ? '仅退款' : '退货退款'}</span>
              </Col>
              <Col span={8}>
                <span>申请售后时间：</span>
                <span>{item.createTime}</span>
              </Col>
              <Col span={8}>
                <span>发起人：</span>
                <span>{item.refundSponsor === 1 ? '平台' : '用户'}</span>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <span>初审：</span>
                <span>
                  {item.refundType === 0 ? '待审核' : item.refundType === 1 ? '通过' : '不通过'}
                </span>
              </Col>
              {item.refundSponsor === 1 && (
                <Col span={8}>
                  <span>发货状态：</span>
                  <span>{handleDeliverStatus(item.deliverStatus)}</span>
                </Col>
              )}
              {item.refundSponsor === 1 && (
                <Col span={8}>
                  <span>售后形式：</span>
                  <span>{handleServiceType(item.serviceType)}</span>
                </Col>
              )}
              <Col span={8}>
                <span>退款金额：</span>
                <span>{item.refundPayment}元</span>
              </Col>
              <Col span={8}>
                <span>备注：</span>
                <span>{item.refundType === 1 ? item.reviewRemark : item.refundRemark}</span>
              </Col>
            </Row>
            <Row>
              {item.refundType === 1 && (
                <Col span={8}>
                  <span>复审：</span>
                  <span>
                    {item.reviewType === 0
                      ? '未进行退款'
                      : item.reviewType === 1
                        ? '通过'
                        : '不通过'}
                  </span>
                </Col>
              )}
              {item.refundType === 1 && (
                <Col span={8}>
                  <span>复审备注：</span>
                  <span>{item.reviewRemark}</span>
                </Col>
              )}
              {item.reviewType === 1 && (
                <Col span={8}>
                  <span>退款时间：</span>
                  <span>{item.refundFinishTime}</span>
                </Col>
              )}
            </Row>
          </div>
        ))}
      </div>
    );
  }
}
