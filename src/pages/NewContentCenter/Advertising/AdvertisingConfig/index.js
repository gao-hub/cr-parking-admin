import React, { PureComponent, Fragment } from 'react';
import { Tabs, Button, Icon, Modal } from 'antd';
import { connect } from 'dva'

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import permission from '@/utils/PermissionWrapper';

import OpenScreen from './components/OpenScreen'


@permission
export default class template extends PureComponent {
    constructor(porps) {
        super(porps)
    }
    state = {
        tabIndex:1
    }
    // tab切换
    callback = tabIndex=> {
        this.setState({
            tabIndex
        })
    }
    render() {
        return (
            <React.Fragment>
                    <Tabs defaultActiveKey="1" onChange={this.callback} tabBarStyle={{ marginBottom: 40 }}>
                        <Tabs.TabPane tab="开屏广告" key="1">
                            <OpenScreen tabIndex={this.state.tabIndex}/>
                        </Tabs.TabPane>
                    </Tabs>
            </React.Fragment>

        )
    }
}