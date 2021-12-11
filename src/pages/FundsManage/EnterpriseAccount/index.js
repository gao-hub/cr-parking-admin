/**
 * 企业账户管理列表
 */
import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

import SetColumns from '@/components/SetColumns';
import FilterIpts from './FilterIpts';
const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '用户名',
    value: 'userName',
  },
  {
    label: '企业名称',
    value: 'businessName',
  },
  {
    label: 'ACCP用户编号',
    value: 'oidUserno',
  },
  {
    label: '可用金额',
    value: 'balance',
  },
  // {
  //   label: '冻结金额',
  //   value: 'frozenBalance',
  // },
  {
    label: '银行账户金额',
    value: 'bankBalance',
  },
  {
    label: '免密总额度',
    value: 'monthlyLimit',
  },
  {
    label: '当月剩余免密额度',
    value: 'surplusMonthlyLimit',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '企业名称',
    dataIndex: 'businessName',
  },
  {
    title: 'ACCP用户编号',
    dataIndex: 'oidUserno',
  },
  {
    title: '可用金额',
    dataIndex: 'balance',
  },
  // {
  //   title: '冻结金额',
  //   dataIndex: 'frozenBalance',
  // },
  {
    title: '银行账户金额',
    dataIndex: 'bankBalance',
  },
  {
    title: '免密总额度',
    dataIndex: 'monthlyLimit',
  },
  {
    title: '当月剩余免密额度',
    dataIndex: 'surplusMonthlyLimit',
  },
];

@permission
@connect(({ enterpriseAccountManage, loading }) => ({
  enterpriseAccountManage,
  loading:
    loading.effects['enterpriseAccountManage/fetchList'] ||
    loading.effects['enterpriseAccountManage/getModifyInfo'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    initColumns: [
      'key',
      'userName',
      'businessName',
      'oidUserno',
      'balance',
      // 'frozenBalance',
      'bankBalance',
      'monthlyLimit',
      'surplusMonthlyLimit',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const available = permission.includes('chuangrong:businessAccount:async')
          return (
              <a className={available? "ant-dropdown-link" : "ant-btn-link-disabled"} onClick={() => available && this.asyncData(record.id)} href="#">
                更新  <Icon type="reload" />
              </a>
          );
          // const action = (
          //   <Menu>
          //     {/*<Menu.Item onClick={() => this.transferHandle(record.id)}>划拨</Menu.Item>
          //     <Menu.Item onClick={() => this.rechargeHandle(record.id)}>充值</Menu.Item>
          //     <Menu.Item onClick={() => this.withdrawHandle(record.id)}>提现</Menu.Item>*/}
          //     <Menu.Item onClick={() => this.asyncData(record.id)}>同步</Menu.Item>
          //   </Menu>
          // );
          // return (
          //   <Dropdown disabled={false} overlay={action}>
          //     <a className="ant-dropdown-link" href="#">
          //       操作
          //       <Icon type="down" />
          //     </a>
          //   </Dropdown>
          // );
          return null;
        },
      },
    ],
    searchWholeState: true,
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
        type: 'enterpriseAccountManage/asyncData',
        payload: {
          id,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc)
        this.getList(this.state.currPage, this.state.pageSize)
      } else {
        message.error(res.statusDesc)
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
    console.log(this.props.enterpriseAccountManage.searchInfo)
    this.props.dispatch({
      type: 'enterpriseAccountManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.enterpriseAccountManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        {/* <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开') + '详细搜索'}</Button> */}
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

  render() {
    const {
      permission,
      enterpriseAccountManage: { list },
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
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
      { permission.includes('chuangrong:businessAccount:list') &&
        <Card bordered={false}>
          <FilterIpts
            searchWholeState={this.state.searchWholeState}
            getList={this.getList}
            getChild={this.getChild}
            pageSize={pageSize}
          />
          <StandardTable {...values} />
        </Card>
      }

      </PageHeaderWrapper>
    );
  }
}
