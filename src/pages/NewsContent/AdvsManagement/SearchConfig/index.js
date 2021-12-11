import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import permission from '@/utils/PermissionWrapper';
import CommonTable from './components/CommonTable'
import { connect } from 'dva';

@permission
@connect(({ searchManage }) => ({
  searchManage
}))
export default class template extends PureComponent {
    constructor(porps) {
        super(porps)
    }
    state = {
        tabIndex: '1'
    }
    componentDidMount() {
      let tabIndex = sessionStorage.getItem('searchManageTabIndex');
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
        type:'searchManage/setSearchInfo',
        payload: {}
      })
      // 当前key存起来刷新用
      sessionStorage.setItem('searchManageTabIndex', tabIndex);
    }
    componentWillUnmount() {
      sessionStorage.removeItem('searchManageTabIndex');
    }
    render() {
      const { tabIndex } = this.state;
      const { permission } = this.props;
        return (
            <React.Fragment>
                <Tabs activeKey={tabIndex} onChange={this.callback} tabBarStyle={{ marginBottom: 40 }}>
                  { permission.includes('chuangrong:hotSearchConfig:list') &&
                    <Tabs.TabPane tab="热门搜索" key="1">
                      { tabIndex === '1' && <CommonTable tabIndex={this.state.tabIndex}/>}
                    </Tabs.TabPane>
                  }
                  { permission.includes('chuangrong:searchConfig:list') &&
                    <Tabs.TabPane tab="搜索提示文案" key="2">
                      {tabIndex === '2' && <CommonTable tabIndex={this.state.tabIndex}/>}
                    </Tabs.TabPane>
                  }
                </Tabs>
            </React.Fragment>
        )
    }
}
