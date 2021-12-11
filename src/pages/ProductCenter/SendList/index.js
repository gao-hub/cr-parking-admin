import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import SendListDetail from './components/SendListDetail';
import MaturityReturn from './components/MaturityReturn';
import permission from '@/utils/PermissionWrapper';

@permission
export default class template extends PureComponent {
  constructor(props) {
    super(props)
  }
  state = {
    tabIndex: '1'
  }

  changeTabIndex = index => {
    this.setState({
      tabIndex: index,
    });
  };

  render() {
    const { permission } = this.props;
    return (
      <>
        { (permission.includes("chuangrong:issueRecord:list") || permission.includes("chuangrong:salecapitalRent:list")) &&
          <Tabs defaultActiveKey="1" onChange={this.changeTabIndex} tabBarStyle={{ marginBottom: 40 }}>
            { permission.includes("chuangrong:issueRecord:list") &&
              <TabPane tab="租金发放" key="1">
                <SendListDetail parkingId={this.props.location.query} tabIndex={this.state.tabIndex} />
              </TabPane>
            }
            { permission.includes("chuangrong:salecapitalRent:list") &&
              <TabPane tab="到期退货" key="2">
                <MaturityReturn parkingId={this.props.location.query} tabIndex={this.state.tabIndex} />
              </TabPane>
            }
          </Tabs>
        }
      </>
    );
  }
}
