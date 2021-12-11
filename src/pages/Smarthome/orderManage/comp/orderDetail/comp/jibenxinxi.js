import React, { PureComponent, Fragment } from 'react';
import { Row, Col, message, Button } from 'antd';

const colConfig = {
  xxl: { span: 12 },
  xl: { span: 12 },
  lg: { span: 12 },
  md: { span: 12 },
  sm: { span: 16 },
  xs: { span: 20 },
};

const copy = value => {
  window.getSelection().removeAllRanges();
  const inputDom = document.createElement('input');
  document.body.appendChild(inputDom);
  inputDom.style.opacity = 0;
  inputDom.value = value;
  const range = document.createRange();
  range.selectNode(inputDom);
  window.getSelection().addRange(range);
  inputDom.select();
  inputDom.setSelectionRange(0, inputDom.value.length);
  const successful = document.execCommand('copy');
  const messageText = successful ? '复制成功！' : '复制失败！';
  message.info(messageText);
  window.getSelection().removeAllRanges();
  document.body.removeChild(inputDom);
};

export default class Jibenxinxi extends PureComponent {
  render() {
    const { info } = this.props;
    return (
      <Fragment>
        <Row>
          <Col {...colConfig}>
            <span>收货人信息</span>
            <span
              onClick={() => {
                copy(`${info?.receiveName},${info?.receivePhone},${info?.receiveAddress}`);
              }}
            >
              <Button type="link">复制</Button>
            </span>
          </Col>
          <Col {...colConfig}>
            <span>买家信息</span>
          </Col>
        </Row>
        <Row>
          <Col {...colConfig}>
            <span>收货人：</span>
            <span>{info?.receiveName}</span>
          </Col>
          <Col {...colConfig}>
            <span>买家：</span>
            <span>{info?.buyerName}</span>
          </Col>
        </Row>
        <Row>
          <Col {...colConfig}>
            <span>联系电话：</span>
            <span>{info?.receivePhone}</span>
          </Col>
          <Col {...colConfig}>
            <span>手机号：</span>
            <span>{info?.receivePhone}</span>
          </Col>
        </Row>
        <Row>
          <Col {...colConfig}>
            <span>收货地址：</span>
            <span>{info?.receiveAddress}</span>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
