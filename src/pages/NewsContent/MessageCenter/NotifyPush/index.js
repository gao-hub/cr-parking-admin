import React, { Component, Fragment } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';

import permission from '@/utils/PermissionWrapper';
import RecordList from './components/RecordList';
import TemplateList from './components/TemplateList';
import CategoryList from './components/CategoryList';

@permission
@connect(({ notifyPush }) => ({
  notifyPush,
}))
export default class NotifyPush extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    tab: 'record',
  };

  componentDidMount() {
    let tab = sessionStorage.getItem('notifyPushTab') || 'record';
    this.tabChange(tab);
  }

  componentWillUnmount() {
    sessionStorage.removeItem('notifyPushTab');
  }

  tabChange(tab) {
    sessionStorage.setItem('notifyPushTab', tab)
    this.setState({
      tab,
    });
  }

  render() {
    const { TabPane } = Tabs;
    const { permission } = this.props;
    return (
      <Fragment>
        <Tabs
          activeKey={this.state.tab}
          defaultActiveKey="record"
          tabBarStyle={{ marginBottom: 40 }}
          onChange={tab => this.tabChange(tab)}
        >
          {permission.includes('chuangrong:msgLog:list') && (
            <TabPane tab="消息记录" key="record">
              <RecordList query={this.props.location.query} tab={this.state.tab} />
            </TabPane>
          )}
          {permission.includes('chuangrong:msgTemplate:list') && (
            <TabPane tab="消息模板" key="template">
              <TemplateList query={this.props.location.query} tab={this.state.tab} />
            </TabPane>
          )}
          {permission.includes('chuangrong:msgTemplateType:list') && (
            <TabPane tab="消息类别" key="category">
              <CategoryList query={this.props.location.query} tab={this.state.tab} />
            </TabPane>
          )}
        </Tabs>
      </Fragment>
    );
  }
}
