import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import permission from '@/utils/PermissionWrapper';

import OpenScreen from './components/OpenScreen';
import CommonTable from './components/CommonTable';
import { connect } from 'dva';

@permission
@connect(({ advertManage }) => ({
  advertManage,
}))
export default class template extends PureComponent {
  constructor(porps) {
    super(porps);
  }
  state = {
    tabIndex: '1',
  };
  componentDidMount() {
    let tabIndex = sessionStorage.getItem('advertManageTabIndex');
    if (tabIndex) {
      this.setState({ tabIndex });
    }
  }

  // tab切换
  callback = tabIndex => {
    this.setState({
      tabIndex,
    });
    // 切换tab清除搜索条件
    this.props.dispatch({
      type: 'advertManage/setSearchInfo',
      payload: {},
    });
    // 当前key存起来刷新用
    sessionStorage.setItem('advertManageTabIndex', tabIndex);
  };
  componentWillUnmount() {
    sessionStorage.removeItem('advertManageTabIndex');
  }

  render() {
    const { tabIndex } = this.state;
    const { permission } = this.props;
    return (
      <React.Fragment>
        <Tabs activeKey={tabIndex} onChange={this.callback} tabBarStyle={{ marginBottom: 40 }}>
          {permission.includes('chuangrong:advert:frontPageList') && (
            <Tabs.TabPane tab="首页" key="1">
              {tabIndex === '1' && <CommonTable tabIndex={this.state.tabIndex} />}
            </Tabs.TabPane>
          )}
          {permission.includes('chuangrong:advert:bannerList') && (
            <Tabs.TabPane tab="发现banner" key="2">
              {tabIndex === '2' && <CommonTable tabIndex={this.state.tabIndex} />}
            </Tabs.TabPane>
          )}
          {permission.includes('chuangrong:advert:openScreenList') && (
            <Tabs.TabPane tab="开屏广告" key="3">
              {tabIndex === '3' && <OpenScreen tabIndex={this.state.tabIndex} />}
            </Tabs.TabPane>
          )}
          {permission.includes('chuangrong:advert:tablePlaqueList') && (
            <Tabs.TabPane tab="插屏广告" key="4">
              {tabIndex === '4' && <CommonTable tabIndex={this.state.tabIndex} />}
            </Tabs.TabPane>
          )}
          {permission.includes('chuangrong:advert:floatingWindowList') && (
            <Tabs.TabPane tab="活动悬浮窗" key="5">
              {tabIndex === '5' && <CommonTable tabIndex={this.state.tabIndex} />}
            </Tabs.TabPane>
          )}
        </Tabs>
      </React.Fragment>
    );
  }
}
