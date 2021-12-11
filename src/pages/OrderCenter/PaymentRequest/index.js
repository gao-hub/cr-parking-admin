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
import { formatNumber } from '@/utils/utils';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  // , {
  //       label: '自增id',
  //       value: 'id',
  //     }
  {
    label: '订单号',
    value: 'orderId',
  },
  {
    label: '支付订单号',
    value: 'requestId',
  },
  {
    label: '银行流水号',
    value: 'outOrderNo',
  },
  {
    label: '业务类型',
    value: 'paymentTypeName',
  },
  {
    label: '用户名',
    value: 'userName'
  },
  // {
  //   label: '支付状态',
  //   value: 'paymentStatusName',
  // },
  // , {
  //       label: '银行返回异常描述',
  //       value: 'paymentDesc',
  //     }
  {
    label: '支付金额',
    value: 'payment',
  },
  {
    label: '支付渠道',
    value: 'paymentUtmName',
  },
  {
    label: '支付方式',
    value: 'paymentWayName',
  },
  {
    label: '支付状态',
    value: 'paymentStatusName',
  },
  // , {
  //       label: '是否显示',
  //       value: 'showStatus',
  //     }
  // {
  //   label: '创建人',
  //   value: 'createByName',
  // },
  {
    label: '发起时间',
    value: 'createTime',
  },
  // {
  //   label: '更新人',
  //   value: 'updateByName',
  // },
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
  // , {
  //       title: '自增id',
  //       dataIndex: 'id',
  //     }
  {
    title: '订单号',
    dataIndex: 'orderId',
  },
  {
    title: '支付订单号',
    dataIndex: 'requestId',
  },
  {
    title: '银行流水号',
    dataIndex: 'outOrderNo',
  },
  {
    title: '业务类型',
    dataIndex: 'paymentTypeName'
  },
  {
    title: '用户名',
    dataIndex: 'userName'
  },
  {
    title: '支付金额',
    dataIndex: 'payment',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '支付渠道',
    dataIndex: 'paymentUtmName',
  },

  {
    title: '支付方式',
    dataIndex: 'paymentWayName',
  },
  {
    title: '支付状态',
    dataIndex: 'paymentStatusName',
  },
  // , {
  //       title: '银行返回异常描述',
  //       dataIndex: 'paymentDesc',
  //     }
  // {
  //   title: '支付类型',
  //   dataIndex: 'paymentTypeName',
  // },

  // , {
  //       title: '是否显示',
  //       dataIndex: 'showStatus',
  //       render: record => record === 0 ? '否' : record === 1 ? '是' : ''
  //     }
  // {
  //   title: '创建人',
  //   dataIndex: 'createByName',
  // },
  {
    title: '发起时间',
    dataIndex: 'createTime',
  },
  // {
  //   title: '更新人',
  //   dataIndex: 'updateByName',
  // },
  {
    title: '完成时间',
    dataIndex: 'updateTime',
  },
];

@permission
@connect(({ paymentRequestManage, loading }) => ({
  paymentRequestManage,
  loading:
    loading.effects['paymentRequestManage/fetchList'] ||
    loading.effects['paymentRequestManage/getModifyInfo'],
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
    initColumns: [
      'key',
      'orderId',
      'requestId',
      'outOrderNo',
      'paymentTypeName',
      'userName',
      'payment',
      'paymentUtmName',
      'paymentWayName',
      'paymentStatusName',
      'createTime',
      'updateTime',
    ],
    syncColumns: [],
    staticColumns: [
      // {
      //   title: '操作',
      //   render: (record) => {
      //     const action = (
      //       <Menu>
      //           <Menu.Item onClick={() => this.modifyHandler(record.id)}>
      //           <Icon type="edit" />修改
      //           </Menu.Item>
      //           <Menu.Item onClick={() => this.deleteHandler(record.id)}>
      //           <Icon type="close" />删除
      //           </Menu.Item>
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
  getList = (currPage, pageSize) => {
    this.props.dispatch({
      type: 'paymentRequestManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.paymentRequestManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {searchWholeState ? '合并' : '展开' + '详细搜索'}
        </Button>
        {/*<SetColumns*/}
        {/*  plainOptions={plainOptions}*/}
        {/*  defcolumns={defcolumns}*/}
        {/*  initColumns={this.state.initColumns}*/}
        {/*  staticColumns={this.state.staticColumns}*/}
        {/*  syncChangeColumns={this.syncChangeColumns}*/}
        {/*/>*/}
        {/* <Button onClick={() => this.modifyChild.changeVisible(true)}><Icon type="plus" />添加</Button>
        <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
          导出
        </ExportLoading>
        */}
      </Fragment>
    );
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();

    dispatch({
      type: 'paymentRequestManage/exportExcel',
      payload: formData,
    });
  };
  // 修改
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'paymentRequestManage/getModifyInfo',
      payload: {
        id,
      },
    });
    if (res && res.status === 1) {
      this.modifyChild.changeVisible(true);
    } else {
      message.error(res.statusDesc);
    }
  };
  // 删除
  async deleteHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要删除角色吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'paymentRequestManage/deleteManage',
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

  render() {
    const {
      permission,
      paymentRequestManage: { list, total },
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
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        <Card bordered={false}>
          {permission.includes('chuangrong:paymentrequest:list') ? (
            <>
              <FilterIpts
                searchWholeState={this.state.searchWholeState}
                getList={this.getList}
                getChild={this.getChild}
                pageSize={pageSize}
              />
              <StandardTable {...values} />
            </>
          ) : null}
        </Card>
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
