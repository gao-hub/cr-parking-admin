import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

import SetColumns from '@/components/SetColumns';
import FilterIpts from './FilterIpts';
import RechargeForm from './RechargeForm';
import WithdrawForm from './WithdrawForm';
const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '子账户名称',
    value: 'accountName',
  },
  {
    label: '子账户代号',
    value: 'accountCode',
  },
  {
    label: '可用余额',
    value: 'availableBalance',
  },
  // {
  //   label: '冻结金额',
  //   value: 'frozenBalance',
  // },
  {
    label: '银行账户金额',
    value: 'bankAccountSum',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '子账户名称',
    dataIndex: 'accountName',
  },
  {
    title: '子账户代号',
    dataIndex: 'accountCode',
  },
  {
    title: '可用余额',
    dataIndex: 'availableBalance',
  },
  // {
  //   title: '冻结金额',
  //   dataIndex: 'frozenBalance',
  // },
  {
    title: '银行账户金额',
    dataIndex: 'bankAccountSum',
  },
];

@permission
@connect(({ merchantAccountManage, loading }) => ({
  merchantAccountManage,
  loading:
    loading.effects['merchantAccountManage/fetchList'] ||
    loading.effects['merchantAccountManage/getModifyInfo'],
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
      'accountName',
      'accountCode',
      'availableBalance',
      // 'frozenBalance',
      'bankAccountSum',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {/*<Menu.Item onClick={() => this.transferHandle(record.id)}>划拨</Menu.Item>*/}
              { permission.includes('chuangrong:paccountequest:recharge') && 
                <Menu.Item onClick={() => this.rechargeHandle(record.accountCode)}>充值</Menu.Item>
              }
              { permission.includes('chuangrong:pwithdrawrequest:update') && 
                <Menu.Item onClick={() => this.withdrawHandle(record.accountCode)}>提现</Menu.Item>
              }
              { permission.includes('chuangrong:paccountequest:async') && 
                <Menu.Item onClick={() => this.asyncData(record.accountCode)}>同步</Menu.Item>
              }
            </Menu>
          );
          return (
            <Dropdown disabled={false} overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作
                <Icon type="down" />
              </a>
            </Dropdown>
          );
        },
      },
    ],
    searchWholeState: true,
  };
  // 划拨
  transferHandle = id =>{
    return true
  }
  // 充值
  rechargeHandle = accountCode =>{
    this.rechargeForm.changeVisible(true)
    this.rechargeForm.getData(accountCode);
  }
  // 提现
  withdrawHandle = accountCode =>{
    this.withdrawForm.changeVisible(true)
    this.withdrawForm.getData(accountCode);
  }
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
    this.props.dispatch({
      type: 'merchantAccountManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.merchantAccountManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        {/* <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开') + '详细搜索'}</Button> */}
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
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
      merchantAccountManage: { list },
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
        {
          permission.includes('chuangrong:paccountequest:list') && <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
            <RechargeForm
              getChildData={(child) => this.rechargeForm = child}
              getList={this.getList}
              currPage={currPage}
              pageSize={pageSize}
            />
            <WithdrawForm
              getChildData={(child) => this.withdrawForm = child}
              getList={this.getList}
              currPage={currPage}
              pageSize={pageSize}
            />
            
          </Card>
        }
        
      </PageHeaderWrapper>
    );
  }
}
