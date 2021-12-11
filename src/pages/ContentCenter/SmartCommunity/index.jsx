import React, { PureComponent } from 'react';
import { 
  Tabs, 
} from 'antd';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';

//   功能管理
import FuntionManage from './cpmponents/FuntionManage'
//   类型管理
import TypeManage from './cpmponents/TypeManage'

const { TabPane } = Tabs;

@permission
@connect(({ SmartCommunity, loading }) => ({
  SmartCommunity
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      permission
    } = this.props;
    return (
      <div style={{ backgroundColor: '#fff' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="功能管理" key="1">
            {
              permission.includes('chuangrong:community:list') && <FuntionManage />
            }
          </TabPane>

          <TabPane tab="类型管理" key="2">
            {
              permission.includes('chuangrong:communityGroups:list') && <TypeManage />
            }
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
