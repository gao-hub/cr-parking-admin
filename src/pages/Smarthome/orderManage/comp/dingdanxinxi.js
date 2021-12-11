import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';

const colConfig = {
  xxl: { span: 12 },
  xl: { span: 12 },
  lg: { span: 12 },
  md: { span: 12 },
  sm: { span: 16 },
  xs: { span: 20 },
};

const handleOrderStatus = value => {
  switch (value) {
    case 1:
      return '待付款';
    case 2:
      return '待发货';
    case 3:
      return '待收货';
    case 4:
      return '已完成';
    case 5:
      return '已关闭';
    case 6:
      return '已退款';
    default:
      return '';
  }
};

export default class Dingdanxinxi extends PureComponent {
  render() {
    const { data, type } = this.props;
    return (
      <div
        style={{
          marginBottom: '20px',
        }}
      >
        <Row>
          <Col {...colConfig}>
            <span>产品名称：</span>
            <span>{data?.storeName}</span>
          </Col>
          <Col {...colConfig}>
            <span>产品规格：</span>
            <span>{data?.productSpecs}</span>
          </Col>
        </Row>
        <Row>
          <Col {...colConfig}>
            <span>购买数量：</span>
            <span>{data?.orderCount}</span>
          </Col>
          <Col {...colConfig}>
            <span>实际支付：</span>
            <span>{data?.payment}元</span>
          </Col>
        </Row>
        <Row>
          <Col {...colConfig}>
            <span>订单类型：</span>
            <span>{ data?.orderType === 0 ? '普通订单' : data?.orderType === 1 ? '活动订单' : '' }</span>
          </Col>
          <Col {...colConfig}>
            <span>订单状态：</span>
            <span>{handleOrderStatus(data.orderStatus)}</span>
          </Col>
        </Row>
        {type !== 3 && (
          <Row>
            <Col {...colConfig}>
              <span>购买时间：</span>
              <span>{data?.createTime}</span>
            </Col>
            <Col {...colConfig}>
              <span>申请售后时间：</span>
              <span>{data?.refundSubmitTime}</span>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}
