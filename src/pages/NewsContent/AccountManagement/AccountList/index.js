import React, { Component, Fragment } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';

import permission from '@/utils/PermissionWrapper';
import OfficialList from './components/OfficialList';
import InsideList from './components/InsideList';

@permission
@connect(({ accountManage }) => ({
  accountManage,
}))
export default class accountManage extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    tab: 'official',
  };

  componentDidMount() {
    let tab = sessionStorage.getItem('accountListTab') || 'official';
    this.tabChange(tab);
  }

  componentWillUnmount() {
    sessionStorage.removeItem('accountListTab');
  }

  tabChange(tab) {
    sessionStorage.setItem('accountListTab', tab);
    this.setState({
      tab,
    });
  }

  render() {
    const { TabPane } = Tabs;
    const { permission } = this.props;
    const ispermTabs = permission.includes('chuangrong:userArtAccount:list');
    return (
      <Fragment>
        {ispermTabs && (
          <Tabs
            activeKey={this.state.tab}
            defaultActiveKey="official"
            tabBarStyle={{ marginBottom: 40 }}
            onChange={tab => this.tabChange(tab)}
          >
            {permission.includes('chuangrong:userArtAccount:list') && (
              <TabPane tab="官方账号" key="official">
                <OfficialList query={this.props.location.query} tab={this.state.tab} />
              </TabPane>
            )}
            {permission.includes('chuangrong:userArtAccount:list') && (
              <TabPane tab="小马甲" key="inside">
                <InsideList query={this.props.location.query} tab={this.state.tab} />
              </TabPane>
            )}
          </Tabs>
        )}
      </Fragment>
    );
  }
}
