import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Modal, Form, Input, Row, Col, Select, Table, Icon, Button } from 'antd';
import ShopDetail from './comp/shopDetail';
import Jibenxinxi from './comp/jibenxinxi';
import Wuliuxinxi from './comp/wuliuxinxi';
import Shouhouxinxi from './comp/shouhouxinxi';

const colConfig = {
  xxl: { span: 12 },
  xl: { span: 12 },
  lg: { span: 12 },
  md: { span: 12 },
  sm: { span: 16 },
  xs: { span: 20 },
};

@connect(({ SmarthomeOrderManage }) => ({
  orderInfo: SmarthomeOrderManage.orderInfo,
}))
class OrderDetail extends PureComponent {
  state = {
    isShowMore: false,
  };

  componentWillMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.id) {
      dispatch({
        type: 'SmarthomeOrderManage/getOrderInfo',
        payload: {
          id: query.id,
        },
      });
    }
  }

  handleOrderStatus = value => {
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

  render() {
    const {
      orderInfo,
      location: { query },
    } = this.props;
    const { isShowMore } = this.state;
    const { handleOrderStatus } = this;

    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '5px',
        }}
      >
        {(query.id && orderInfo !== null) || query.edit ? (
          <>
            <Button
              type="primary"
              style={{
                float: 'right',
                zIndex: 10,
              }}
              onClick={() => {
                router.goBack();
              }}
            >
              返回
            </Button>
            <Row
              style={{
                marginBottom: '20px',
              }}
            >
              <Col span={8}>
                <span>订单编号：</span>
                <span>{orderInfo?.orderNo}</span>
              </Col>
              <Col span={8}>
                <span>下单时间：</span>
                <span>{orderInfo?.createTime}</span>
              </Col>
              <Col span={8}>
                <span>订单状态：</span>
                <span>{handleOrderStatus(orderInfo?.orderStatus)}</span>
              </Col>
            </Row>
            <Jibenxinxi info={orderInfo} />
            <ShopDetail info={orderInfo} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '20px',
                marginBottom: '20px',
              }}
            >
              <div>物流信息</div>
              <Button
                type="link"
                onClick={() => {
                  this.setState({ isShowMore: !isShowMore });
                }}
              >
                查看更多
                {isShowMore ? <Icon type="down" /> : <Icon type="up" />}
              </Button>
            </div>
            <Wuliuxinxi isShowMore={isShowMore} info={orderInfo} />
            <div
              style={{
                marginBottom: '20px',
              }}
            >
              售后信息
            </div>
            <Shouhouxinxi info={orderInfo} />
          </>
        ) : null}
      </div>
    );
  }
}

export default OrderDetail;
