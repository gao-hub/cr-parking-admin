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
    value: 'seqNo',
  },
  {
    label: '用户名',
    value: 'username',
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
  {
    label: '银行卡号',
    value: 'bankCardNumber',
  },
  // {
  //   label: '联行号',
  //   value: 'unionBankNumber',
  // },
  // {
  //   label: '提现银行',
  //   value: 'bank',
  // },
  {
    label: '提现金额',
    value: 'money',
  },
  {
    label: '提现手续费',
    value: 'fee',
  },
  // {
  //   label: '出账金额',
  //   value: 'total',
  // },
  {
    label: '实际出账金额',
    value: 'balance',
  },
  {
    label: '提现状态',
    value: 'statusStr',
  },
  {
    label: '失败说明',
    value: 'remark',
  },
  {
    label: '发起时间',
    value: 'createTime',
  },
  {
    label: '完成时间',
    value: 'updateTime',
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
    dataIndex: 'seqNo',
  },
  {
    title: '用户名',
    dataIndex: 'username',
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
    title: '银行卡号',
    dataIndex: 'bankCardNumber',
  },

  // {
  //   title: '联行号',
  //   dataIndex: 'unionBankNumber',
  // },
  // {
  //   title: '提现银行',
  //   dataIndex: 'bank',
  // },
  {
    title: '提现金额',
    dataIndex: 'money',
  },
  {
    title: '提现手续费',
    dataIndex: 'fee',
  },
  // {
  //   title: '出账金额',
  //   dataIndex: 'total',
  // },
  {
    title: '实际出账金额',
    dataIndex: 'balance',
    width: '10%',
  },
  {
    title: '提现状态',
    dataIndex: 'statusStr',
  },
  {
    title: '失败说明',
    dataIndex: 'remark',
  },
  {
    title: '发起时间',
    dataIndex: 'createTime',
  },
  {
    title: '完成时间',
    dataIndex: 'updateTime',
  },
];

@permission
@connect(({ accountWithdrawManage, loading }) => ({
  accountWithdrawManage,
  loading:
    loading.effects['accountWithdrawManage/fetchList'] ||
    loading.effects['accountWithdrawManage/getModifyInfo'] ||
    loading.effects['accountWithdrawManage/asyncManage'],

  exportLoading: loading.effects['accountWithdrawManage/exportExcel'],
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
      'seqNo',
      'username',
      'spreadsUserName',
      'utmName',
      'accpUserno',
      'bankCardNumber',
      // 'unionBankNumber',
      // 'bank',
      'money',
      'fee',
      // 'total',
      'balance',
      'statusStr',
      'remark',
      'createTime',
      'updateTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const available =
            permission.includes('chuangrong:accountWithdraw:async') &&
            record &&
            (record.status == 3 || record.status == 0); // 3 失败 0初始
          return (
            <a
              className={available ? 'ant-dropdown-link' : 'ant-btn-link-disabled'}
              onClick={() => {
                available && this.asyncHandler(record.id);
              }}
              href="#"
            >
              同步 <Icon type="reload" />
            </a>
          );
          // const action = (
          //   <Menu>
          //     <Menu.Item onClick={() => this.asyncHandler(record.id)}>
          //       <Icon type="redo" />提现成功
          //     </Menu.Item>
          //   </Menu>
          // )
          // return (
          //   <Dropdown overlay={action}>
          //       <a className="ant-dropdown-link" href="#">
          //           操作<Icon type="down" />
          //       </a>
          //   </Dropdown>
          // )
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
      type: 'accountWithdrawManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.accountWithdrawManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {searchWholeState ? '合并' : '展开' + '详细搜索'}
        </Button>
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {permission.includes('chuangrong:accountWithdraw:export') ? (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
            导出
          </ExportLoading>
        ) : null}
      </Fragment>
    );
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();

    dispatch({
      type: 'accountWithdrawManage/exportExcel',
      payload: formData,
    });
  };
  // 同步
  async asyncHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要同步吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'accountWithdrawManage/asyncManage',
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
      accountWithdrawManage: { list },
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
        {permission.includes('chuangrong:accountWithdraw:view') ? (
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            {permission.includes('chuangrong:accountWithdraw:list') ? (
              <StandardTable {...values} />
            ) : null}
          </Card>
        ) : null}
        <ModifyForm
          getChildData={child => (this.modifyChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
      </PageHeaderWrapper>
    );
  }
}
