import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import permission from '@/utils/PermissionWrapper';
import CommonTable from './components/CommonTable'
import { connect } from 'dva';

@permission
@connect(({ iconManage }) => ({
  iconManage
}))
export default class template extends PureComponent {
    constructor(porps) {
        super(porps)
    }
    state = {
        tabIndex: '1'
    }
    componentDidMount() {
      let tabIndex = sessionStorage.getItem('iconManageTabIndex');
      if(tabIndex){
        this.setState({ tabIndex });
      }
    }
    // tab切换
    callback = tabIndex=> {
        this.setState({
            tabIndex
        })
      // 切换tab清除搜索条件
      this.props.dispatch({
        type:'iconManage/setSearchInfo',
        payload: {}
      })
      // 当前key存起来刷新用
      sessionStorage.setItem('iconManageTabIndex', tabIndex);
    }
    componentWillUnmount() {
      sessionStorage.removeItem('iconManageTabIndex');
    }
    render() {
      const { tabIndex } = this.state;
      const { permission } = this.props;
        return (
            <React.Fragment>
                <Tabs activeKey={tabIndex} onChange={this.callback} tabBarStyle={{ marginBottom: 40 }}>
                  { permission.includes('chuangrong:bottom:list') &&
                    <Tabs.TabPane tab="底部导航" key="1">
                      { tabIndex === '1' && <CommonTable tabIndex={this.state.tabIndex}/>}
                    </Tabs.TabPane>
                  }
                  { permission.includes('chuangrong:home:list') &&
                    <Tabs.TabPane tab="首页menu" key="2">
                      {tabIndex === '2' && <CommonTable tabIndex={this.state.tabIndex}/>}
                    </Tabs.TabPane>
                  }
                  { permission.includes('chuangrong:discovery:list') &&
                    <Tabs.TabPane tab="发现" key="3">
                      {tabIndex === '3' && <CommonTable tabIndex={this.state.tabIndex}/>}
                    </Tabs.TabPane>
                  }
                  { permission.includes('chuangrong:my:list') &&
                    <Tabs.TabPane tab="我的" key="4">
                      {tabIndex === '4' && <CommonTable tabIndex={this.state.tabIndex}/>}
                    </Tabs.TabPane>
                  }
                </Tabs>
            </React.Fragment>
        )
    }
}
