import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Button } from 'antd';
import router from 'umi/router';
import Table1 from './Table1';
import Table2 from './Table2';

@connect(({ parkingConversionModel }) => ({
  info: parkingConversionModel.info,
}))
class Info extends PureComponent {
  componentDidMount() {
    const {
      location: { query },
    } = this.props;

    this.props.dispatch({
      type: 'parkingConversionModel/fetchInfo',
      payload: {
        id: query.id,
      },
    });
  }

  render() {
    const { info } = this.props;
    return (
      info && (
        <Card
          title="车位统计"
          extra={
            <Button
              type="link"
              onClick={() => {
                router.goBack();
              }}
            >
              返回
            </Button>
          }
          style={{ width: '100%' }}
        >
          <Card title="转化信息" style={{ width: '100%' }}>
            <Row>
              <Col span={12}>
                楼盘名称：
                {info.buildingName}
              </Col>
              <Col span={12}>
                车位编号：
                {info.parkingCode}
              </Col>
            </Row>
            <Row
              style={{
                marginTop: '20px',
              }}
            >
              <Col span={12}>
                车位价格：
                {info.parkingPrice}
              </Col>
              <Col span={12}>
                转化次数：
                {info.tranferTimes}
              </Col>
            </Row>
            <Row
              style={{
                marginTop: '20px',
              }}
            >
              <Col span={12}>
                资金成本：佣金：
                {info.commission}； 溢价/租金：
                {info.rent}
              </Col>
              <Col span={12}>
                总计：
                {info.total}
              </Col>
            </Row>
          </Card>
          <Card title="转化详情" style={{ width: '100%', marginTop: '20px' }}>
            {info.financeParkingOrderDetailList.map(
              (item, index) =>
                item.useType === 0 || item.useType === 1 ? (
                  <Card
                    title={`第${index + 1}次转化`}
                    key={item.id}
                    bordered={false}
                    style={{ width: '100%' }}
                  >
                    <Table1
                      dataSource={[item]}
                      refresh={() => {
                        this.props.dispatch({
                          type: 'parkingConversionModel/fetchInfo',
                          payload: {
                            id: this.props.location.query.id,
                          },
                        });
                      }}
                    />
                  </Card>
                ) : (
                  <Card
                    title={`第${index + 1}次转化`}
                    key={item.id}
                    bordered={false}
                    style={{ width: '100%' }}
                  >
                    <Table2
                      dataSource={[item]}
                      refresh={() => {
                        this.props.dispatch({
                          type: 'parkingConversionModel/fetchInfo',
                          payload: {
                            id: this.props.location.query.id,
                          },
                        });
                      }}
                    />
                  </Card>
                )
            )}
          </Card>
        </Card>
      )
    );
  }
}

export default Info;
