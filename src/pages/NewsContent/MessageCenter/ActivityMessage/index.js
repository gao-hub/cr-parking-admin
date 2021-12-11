import React, { Component, Fragment } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';

import permission from '@/utils/PermissionWrapper';
import RecordList from './components/RecordList';
import MessageList from './components/MessageList';

@permission
@connect(({ activityMessage }) => ({
  activityMessage,
}))
export default class NotifyPush extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    tab: 'message',
  };

  componentDidMount() {
    let tab = sessionStorage.getItem('activityMessageTab') || 'message';
    this.tabChange(tab);
  }

  componentWillUnmount() {
    sessionStorage.removeItem('activityMessageTab');
  }

  tabChange(tab) {
    sessionStorage.setItem('activityMessageTab', tab);
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
          defaultActiveKey="message"
          tabBarStyle={{ marginBottom: 40 }}
          onChange={tab => this.tabChange(tab)}
        >
          {permission.includes('chuangrong:activityMessage:list') && (
            <TabPane tab="活动消息" key="message">
              <MessageList query={this.props.location.query} tab={this.state.tab} />
            </TabPane>
          )}
          {permission.includes('chuangrong:activityMessageRecord:list') && (
            <TabPane tab="活动消息记录" key="record">
              <RecordList query={this.props.location.query} tab={this.state.tab} />
            </TabPane>
          )}
        </Tabs>
      </Fragment>
    );
  }
}
