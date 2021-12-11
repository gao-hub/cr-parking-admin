import React, { PureComponent } from 'react';
import { Timeline } from 'antd';

export default class Wuliuxinxi extends PureComponent {
  render() {
    const { info, isShowMore } = this.props;

    return (
      <div
        style={{
          marginBottom: '20px',
        }}
      >
        {info === null || info.pollQuery === null || !info.pollQuery.data ? (
          <div>未查询到信息</div>
        ) : isShowMore ? (
          <Timeline>
            {info.pollQuery.data.map(item => (
              <Timeline.Item>{item.context}</Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <div
            style={{
              marginBottom: '20px',
            }}
          >
            {info.pollQuery.data[0].context}
          </div>
        )}
      </div>
    );
  }
}
