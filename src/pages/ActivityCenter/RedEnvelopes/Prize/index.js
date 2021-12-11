import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';


const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '奖品名称',
    dataIndex: 'prizeName',
  },
  {
    title: '奖品金额',
    dataIndex: 'rewardAmount',
  },

  {
    title: '发放主体',
    dataIndex: 'businessAccountIdStr',
  },
  {
    title: '已发放数量',
    dataIndex: 'sendNum',
  },
  {
    title: '已发放总额',
    dataIndex: 'sendRewardAmount',
  },
  {
    title: '中奖概率',
    dataIndex: 'winningProbabilityNum',
  }
];

@permission
@connect(({ prizeManage, loading }) => ({
  prizeManage,
  loading:
    loading.effects['prizeManage/fetchList'] || loading.effects['prizeManage/getModifyInfo']

}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    Modify:false,
    currPage: 1,
    pageSize: 10,
    title: '添加',
    initColumns: [
      'key',
      'id',
      'parentUtmName',
      'utmId',
      'utmName',
      'utmLeaderName',
      'spreadsUrl',
      'staffUrl',
      'remark',
      'statusStr',
      'createTime',
      'creator',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const {permission} = this.props;
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:redprize:update') && record.isStart === 0   && (
                  <Menu.Item
                  onClick={() => this.modifyHandler(record.id)}
                >
                  <Icon type="edit" />
                  编辑
                </Menu.Item>
                )
              }
              {
                permission.includes('chuangrong:redprize:delete')  && record.isStart === 0  && (
                  <Menu.Item
                    onClick={() => this.deleteHandler(record.id)}
                  >
                  <Icon type="close" />
                  删除
                </Menu.Item> 
                )
              }
             
            </Menu>
          );
          return (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作
                <Icon type="down" />
              </a>
            </Dropdown>
          );
        },
      },
    ],
    searchWholeState: false,
  };
  //   页数改变时
  onChange = currPage => {
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(currPage, this.state.pageSize);
      }
    );
  };
  onShowSizeChange = (currPage, pageSize) => {
    this.setState(
      {
        currPage,
        pageSize,
      },
      () => {
        this.getList(currPage, pageSize);
      }
    );
  };
  getList = async (currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize,
    });
   
    this.props.dispatch({
      type: 'prizeManage/fetchList',
      payload: {
        currPage,
        pageSize,
        activityId: this.props.match.params.id,
        ...this.props.prizeManage.searchInfo,
      },
    });
  };

 

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission, match: { params:{ isStart} } } = this.props;

    return (
      <Fragment>
        {(permission.includes('chuangrong:redprize:add') && isStart === '0') && (
          <Button onClick={() => this.modifyHandler(-1)}>
            <Icon type="plus" />
            添加
          </Button>
        )}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();

    dispatch({
      type: 'prizeManage/exportExcel',
      payload: formData,
    });
  };
  // 修改&新增 奖品 
  modifyHandler = async id => {

    if (id == -1) {  
      // 新增
      this.modifyChild.changeVisible(true);
    } else {
      // 修改
      const res = await this.props.dispatch({
        type: 'prizeManage/getModifyInfo',
        payload: {
          id,
        },
      });
      if (res && res.status === 1) {
        this.modifyChild.changeVisible(true);
      } else {
        message.error(res.statusDesc);
      }
    }
  };

  // 删除 奖品
  async deleteHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要删除吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'prizeManage/deleteManage',
        payload: {
          id,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else {
        message.error(res.statusDesc);
      }
    }
  }

  getChild = ref => (this.child = ref);

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
    this.props.dispatch({
      type: 'prizeManage/getPrizeSelect',
      payload: {},
    });
  }

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      prizeManage: { list, total },
      match: {
        params: { id },
      }
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        defaultCurrent: currPage,
        defaultPageSize: pageSize,
        current: currPage,
        pageSize,
        total: total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        {permission.includes('chuangrong:redprize:list')  && (
          <Card bordered={false}>
            {/* <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            /> */}
            <StandardTable {...values} />
          </Card>
        )}
     <ModifyForm
        getChildData={child => (this.modifyChild = child)}
        getList={this.getList}
        activityId={id}
        currPage={currPage}
        pageSize={pageSize}
     />
        
      </PageHeaderWrapper>
    );
  }
}
