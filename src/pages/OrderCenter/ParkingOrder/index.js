import React, { Component } from 'react';
import { Tabs } from 'antd';
import permission from '@/utils/PermissionWrapper';
import OrderTable from './components/OrderTable'


import { connect } from 'dva';

@permission
@connect(({ parkingOrderManage }) => ({
    parkingOrderManage,
}))

export default class template extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        tabIndex: '1',
        orderNo: null
    }
    callback = async tabIndex => {
        this.setState({
            tabIndex
        })
        await this.props.dispatch({
            type: 'parkingOrderManage/setSearchInfo',
            payload: {
            },
        });
        sessionStorage.setItem('orderTabIndex', tabIndex);
        this.getList(1, 10, tabIndex)
    }

    async componentDidMount() {
        const orderTabIndex = sessionStorage.getItem('orderTabIndex')
        let tabkey = this.props.location.params?.tabkey
        let orderNo = this.props.location.params?.orderNo
       
        setTimeout(async () => {
                    if (this.props.permission.includes('chuangrong:parkingorder:selfUseList') &&
                    !this.props.permission.includes('chuangrong:parkingorder:list')
                    ) {
                        this.setState({
                            tabIndex: '2'
                        })   
                    }        
                    if (orderTabIndex) {
                        this.setState({
                            tabIndex: orderTabIndex
                        })
                    }
                    if (tabkey) {
                        this.setState({
                            tabIndex: tabkey,
                            orderNo
                        })
                        await this.props.dispatch({
                            type: 'parkingOrderManage/setSearchInfo',
                            payload: {
                                orderNo,
                            },
                        });
                    }
             
            this.getList(1, 10, this.state.tabIndex);
        }, 0);


    }
    componentWillUnmount() {
        sessionStorage.removeItem('orderTabIndex');
    }
    getList = async (currPage, pageSize, tabIndex) => {
        let orderUseType = tabIndex === '1' ? 0 : 1
        this.props.dispatch({
            type: 'parkingOrderManage/fetchList',
            payload: {
                currPage,
                pageSize,
                orderUseType,
                ...this.props.parkingOrderManage.searchInfo,
            },
        });
    };
    render() {
        const { tabIndex } = this.state
        const { permission, location: { state } } = this.props

        return (
            <React.Fragment>
                <Tabs
                    defaultActiveKey={
                        permission.includes('chuangrong:parkingorder:list') &&
                            !permission.includes('chuangrong:parkingorder:selfUseList') ?
                            '1' : '2'
                    }
                    activeKey={
                        tabIndex
                    }
                    onChange={this.callback}
                    tabBarStyle={{ marginBottom: 40 }}
                >
                    {
                        permission.includes('chuangrong:parkingorder:list') &&
                        (<Tabs.TabPane tab='车位订单' key='1'>
                            {
                                tabIndex === '1' && <OrderTable tabIndex={tabIndex} orderNo={state?.orderNo} />
                            }
                        </Tabs.TabPane>
                        )
                    }


                    {
                        permission.includes('chuangrong:parkingorder:selfUseList') &&
                        (<Tabs.TabPane tab='自用订单' key='2'>
                            {
                                tabIndex === '2' && <OrderTable tabIndex={tabIndex} orderNo={state?.orderNo} />
                            }
                        </Tabs.TabPane>)
                    }




                </Tabs>
            </React.Fragment>
        )
    }
}