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
    label: '渠道编号',
    value: 'utmId',
  },
  {
    label: '一级渠道',
    value: 'parentUtmName',
  },
  // {
  //   label: '二级渠道',
  //   value: 'utmName',
  // },
  // {
  //   label: '渠道负责人',
  //   value: 'utmLeaderName',
  // },
  {
    label: '提前退货违约金比例',
    value: 'utmLeaderName',
  },
  // {
  //   label: '推广链接',
  //   value: 'spreadsUrl',
  // },
  // {
  //   label: '员工注册链接',
  //   value: 'staffUrl',
  // },
  {
    label: '备注',
    value: 'remark',
  },
  {
    label: '状态',
    value: 'statusStr',
  },
  {
    label: '创建时间',
    value: 'createTime',
  },
  {
    label: '创建人',
    value: 'creator',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '渠道编号',
    dataIndex: 'utmId',
  },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
  },
  // {
  //   title: '二级渠道',
  //   dataIndex: 'utmName',
  // },
  // {
  //   title: '渠道负责人',
  //   dataIndex: 'utmLeaderName',
  // },
  {
    title: '提前退货违约金比例',
    dataIndex: 'breachRate',
    render: (record, row) => {
      if(row.breachRate||row.breachRate==0) {
        return `${row.breachRate}%`;
      }else{
        return ''
      }

    },
  },
  // {
  //   title: '推广链接',
  //   dataIndex: 'spreadsUrl',
  // },
  // {
  //   title: '员工注册链接',
  //   dataIndex: 'staffUrl',
  // },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '状态',
    dataIndex: 'statusStr',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '创建人',
    dataIndex: 'creator',
  },
];

@permission
@connect(({ channelManage, loading }) => ({
  channelManage,
  loading:
    loading.effects['channelManage/fetchList'] || loading.effects['channelManage/getModifyInfo'],
  exportLoading: loading.effects['channelManage/exportExcel'],
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
              <Menu.Item
                disabled={!permission.includes('chuangrong:utm:update') || !permission.includes('chuangrong:utm:info')}
                onClick={() => this.modifyHandler(record.id)}
              >
                <Icon type="edit" />
                修改
              </Menu.Item>
              <Menu.Item
                disabled={!permission.includes('chuangrong:utm:delete')}
                onClick={() => this.deleteHandler(record.id)}
              >
                <Icon type="close" />
                删除
              </Menu.Item>
              <Menu.Item
                disabled={!permission.includes('chuangrong:utm:update')}
                onClick={() => this.updateStatusHandler(record)}
              >
                <Icon type="edit" />
                {record.status == 0 ? '启用' : '禁用'}
              </Menu.Item>
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
      type: 'channelManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.channelManage.searchInfo,
      },
    });
  };

  /**
   * 启用&&禁用操作
   * */
  updateStatusHandler = async record => {
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
        type: 'channelManage/updateStatus',
        payload: {
          id: record.id,
          status: record.status == 0 ? 1 : 0,
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

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:utm:add') && (
          <Button onClick={() => this.modifyHandler(-1)}>
            <Icon type="plus" />
            添加
          </Button>
        )}
        {permission.includes('chuangrong:utm:export') && (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
            导出
          </ExportLoading>
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
      type: 'channelManage/exportExcel',
      payload: formData,
    });
  };
  // 修改&新增&
  modifyHandler = async id => {
    if (id == -1) {
      const res = await this.props.dispatch({
        type: 'channelManage/getDefaultInfo',
        payload: {},
      });
      this.modifyChild.changeVisible(true);
    } else {
      const res = await this.props.dispatch({
        type: 'channelManage/getModifyInfo',
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

  // 删除
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
        type: 'channelManage/deleteManage',
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
      channelManage: { list, total },
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
        {permission.includes('chuangrong:utm:list') && permission.includes('chuangrong:utm:view') && (
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
        )}

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
