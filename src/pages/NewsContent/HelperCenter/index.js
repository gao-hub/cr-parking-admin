import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import permission from '@/utils/PermissionWrapper';
import CategoryList from './components/CategoryList';
import QuestionList from './components/QuestionList';

@permission
@connect(({ helperCenter }) => ({
  helperCenter,
}))
export default class HelperCenter extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    tab: 'category',
  };

  componentDidMount() {
    let tab = sessionStorage.getItem('helperCenterTab') || 'category';
    this.tabChange(tab);
  }

  tabChange = tab => {
    this.setState({
      tab,
    });
  };

  render() {
    const { TabPane } = Tabs;
    const { permission } = this.props;
    return (
      <Fragment>
        <Tabs
          activeKey={this.state.tab}
          tabBarStyle={{ marginBottom: 40 }}
          onChange={tab => this.tabChange(tab)}
        >
          {permission.includes('chuangrong:helpType:tree') && (
            <TabPane tab='分类管理' key='category'>
              {this.state.tab === 'category' && (<CategoryList />)}
            </TabPane>
          )}
          {permission.includes('chuangrong:helpInfo:list') && (
            <TabPane tab='全部问题' key='question'>
              {this.state.tab === 'question' && (<QuestionList />)}
            </TabPane>
          )}
        </Tabs>
      </Fragment>
    );
  }
}
