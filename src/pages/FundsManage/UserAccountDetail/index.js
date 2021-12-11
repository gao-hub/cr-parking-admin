import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';

import SetColumns from '@/components/SetColumns';

//   检索条件
import FilterIpts from './FilterIpts';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '订单号',
    value: 'orderNo',
  },
  {
    label: '银行流水号',
    value: 'outOrderNo',
  },
  {
    label: '用户名',
    value: 'userName',
  },
  {
    label: '推荐人',
    value: 'spreadsUserName',
  },
  {
    label: '一级渠道',
    value: 'parentUtmName',
  },
  // {
  //   label: '渠道',
  //   value: 'utmName',
  // },
  {
    label: 'ACCP用户编号',
    value: 'accpUserno',
  },

  // {
  //   label: '楼盘名称',
  //   value: 'buildingName',
  // },
  // {
  //   label: '支付方式',
  //   value: 'paymentWayName',
  // },
  {
    label: '收支类型',
    value: 'paymentTypeStr',
  },
  {
    label: '交易类型',
    value: 'tradeTypeStr',
  },
  // {
  //   label: '交易方式',
  //   value: 'tradeWayStr',
  // },
  // {
  //   label: '交易银行',
  //   value: 'bankStr',
  // },
  // {
  //   label: '手续费',
  //   value: 'commission',
  // },
  {
    label: '交易金额',
    value: 'actualAmount',
  },
  {
    label: '可用金额',
    value: 'userBalance',
  },
  {
    label: '交易状态',
    value: 'tradeStatus',
  },
  // {
  //   label: '对账状态',
  //   value:'verifyStatusStr'
  // },
  {
    label: '说明',
    value: 'remarks',
  },
  {
    label: '操作时间',
    value: 'createTime',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
  },
  {
    title: '银行流水号',
    dataIndex: 'outOrderNo',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '推荐人',
    dataIndex: 'spreadsUserName',
  },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
  },
  // {
  //   title: '渠道',
  //   dataIndex: 'utmName',
  // },
  {
    title: 'ACCP用户编号',
    dataIndex: 'accpUserno',
  },
  {
    title: '收支类型',
    dataIndex: 'paymentTypeStr',
  },
  // {
  //   title: '楼盘名称',
  //   dataIndex: 'buildingName',
  // },
  // {
  //   title: '支付方式',
  //   dataIndex: 'paymentWayName',
  // },

  {
    title: '交易类型',
    dataIndex: 'tradeTypeStr',
  },
  // {
  //   title: '交易方式',
  //   dataIndex: 'tradeWayStr',
  // }, {
  //   title: '交易银行',
  //   dataIndex: 'bankStr',
  // },{
  //   title: '手续费',
  //   dataIndex: 'commission',
  // },
  {
    title: '交易金额',
    dataIndex: 'actualAmount',
  },
  {
    title: '可用金额',
    dataIndex: 'userBalance',
  },
  {
    title: '交易状态',
    dataIndex: 'tradeStatus',
    render: (record, row) => {
      if (row.tradeStatus - 0 == 0) {
        return '初始化';
      }
      if (row.tradeStatus - 0 == 1) {
        return '成功';
      }
      if (row.tradeStatus - 0 == 2) {
        return '失败';
      }
    },
  },
  // {
  //   title: '对账状态',
  //   dataIndex: 'verifyStatusStr'
  // },
  {
    title: '说明',
    dataIndex: 'remarks',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
  },
];

@permission
@connect(({ userAccountDetailManage, loading }) => ({
  userAccountDetailManage,
  loading:
    loading.effects['userAccountDetailManage/fetchList'] ||
    loading.effects['userAccountDetailManage/getModifyInfo'],
  exportLoading: loading.effects['orderManage/exportExcel'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    selectedRowKeys: [],
    initColumns: [
      'key',
      'orderNo',
      'userName',
      'outOrderNo',
      'utmName',
      'accpUserno',
      'accountId',
      'spreadsUserName',
      // 'buildingName',
      // 'paymentWayName',
      'paymentTypeStr',
      'tradeTypeStr',
      'tradeWay',
      'bankId',
      'userBalance',
      // 'commission',
      'actualAmount',
      'tradeStatus',
      'verifyStatusStr',
      'remarks',
      'createTime',
    ],
    syncColumns: [],
    staticColumns: [
      // {
      //   title: '操作',
      //   render: (record) => {
      //     const action = (
      //       <Menu>
      //          <Menu.Item onClick={()=>this.asyncData(record.id)}>
      // 					同步
      // 				</Menu.Item>
      //       </Menu>
      //     )
      //     return (
      //       <Dropdown overlay={action}>
      //           <a className="ant-dropdown-link" href="#">
      //               操作<Icon type="down" />
      //           </a>
      //       </Dropdown>
      //     )
      //   }
      // }
    ],
    searchWholeState: false,
  };

  //  同步数据
  asyncData = async id => {
    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'merchantAccountManage/asyncData',
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
      type: 'userAccountDetailManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.userAccountDetailManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {(searchWholeState ? '合并' : '展开') + '详细搜索'}
        </Button>
        {/*<SetColumns*/}
        {/*  plainOptions={plainOptions}*/}
        {/*  defcolumns={defcolumns}*/}
        {/*  initColumns={this.state.initColumns}*/}
        {/*  staticColumns={this.state.staticColumns}*/}
        {/*  syncChangeColumns={this.syncChangeColumns}*/}
        {/*/>*/}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  getChild = ref => (this.child = ref);
  componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };
  // 选择调整部门的员工
  onSelectChange = selectedRowKeys => {
    let staffIds = [];
    selectedRowKeys.map(item => {
      staffIds.push(item.userId);
    });
    console.log(staffIds, 'departmentId');
    this.setState({
      selectedRowKeys,
      staffIds,
    });
  };

  render() {
    const {
      permission,
      userAccountDetailManage: { list },
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list: list.records,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize,
        total: list.total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
      // selectedRows: this.state.selectedRowKeys,
      // onSelectRow:this.onSelectChange,
      // multiSelect: true,
      // multiOperate: (
      //   <Fragment>
      //     <a onClick={this.synchronous} style={{ marginLeft: 24 }}>同步</a>
      //     <a onClick={this.deleteHandler} style={{ marginLeft: 24 }}>删除</a>
      //   </Fragment>
      // ),
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        {permission.includes('chuangrong:userAccountDetail:view') ? (
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            {permission.includes('chuangrong:userAccountDetail:list') ? (
              <StandardTable {...values} />
            ) : null}
          </Card>
        ) : null}
      </PageHeaderWrapper>
    );
  }
}
