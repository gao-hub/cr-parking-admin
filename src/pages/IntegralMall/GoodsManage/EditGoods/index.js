import React, { PureComponent, Fragment } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';



import PermissionWrapper from '@/utils/PermissionWrapper';

import Physical from './Physical';
import Virtual from './Virtual';


const { TabPane } = Tabs;


@PermissionWrapper
@connect(({ GoodsManage }) => ({ GoodsManage }))
class IndexComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: '1'
    };
  }


  componentDidMount() {
    const {
      location,
      type
    } = this.props;
    const { goodsType } = location.query;
    if (goodsType - 0 === 1) {
      this.setState({
        tabIndex: "2",
      });
      return;
    }
    if (type === 'add') {
      this.setState({
        tabIndex: "1",
      });
    }
  }

  changeTabIndex = index => {
    this.setState({
      tabIndex: index,
    });
  };


  render() {
    const {
      permission,
      location
    } = this.props;
    const { tabIndex } = this.state;
    const { id, type, goodsType } = location.query;
    return (
      <Fragment>
        <div style={{
          background: '#fff',
          minHeight: '100%',
          padding: '20px'
        }}
        >
          <Tabs
            activeKey={tabIndex}
            onChange={this.changeTabIndex}
            tabBarStyle={{ marginBottom: 40 }}
          >
            {(permission.includes('chuangrong:integralGoods:info') || permission.includes('chuangrong:integralGoods:add')) &&
            (type === 'add' || goodsType - 0 === 0) ? (
              <TabPane tab="实物" key="1">
                {tabIndex === "1" && <Physical disabled={type === 'info'} id={id} type={type} />}
              </TabPane>
            ) : null}
            {(permission.includes('chuangrong:integralGoods:info') || permission.includes('chuangrong:integralGoods:add') )&& 
            (type === 'add' || goodsType - 0 === 1) ? (
              <TabPane tab="虚拟" key="2">
                {tabIndex === "2" && <Virtual disabled={type === 'info'} id={id} type={type} />}
              </TabPane>
            ) : null}
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

export default IndexComponent;
