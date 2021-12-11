import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import RendListDetail from './components/RendListDetail';
import MaturityPlanList from './components/MaturityPlanList';
import permission from '@/utils/PermissionWrapper';
import MaturityReturn from '@/pages/ProductCenter/SendList/components/MaturityReturn';
import SendListDetail from '@/pages/ProductCenter/SendList/components/SendListDetail';

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
        { (permission.includes("chuangrong:parkingRent:list") || permission.includes("chuangrong:dueRenew:list")) &&
        <Tabs defaultActiveKey="1" onChange={this.changeTabIndex} tabBarStyle={{ marginBottom: 40 }}>
          { permission.includes("chuangrong:parkingRent:list") &&
            <TabPane tab="租金列表" key="1">
              <RendListDetail tabIndex={this.state.tabIndex} />
            </TabPane>
          }
          { permission.includes("chuangrong:dueRenew:list") &&
            <TabPane tab="出租到期" key="2">
              <MaturityPlanList tabIndex={this.state.tabIndex} />
            </TabPane>
          }
        </Tabs>
        }
      </>
    );
  }
}
