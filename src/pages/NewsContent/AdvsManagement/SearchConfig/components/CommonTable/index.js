import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Modal, Form, Select, Radio } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';

@permission
@connect(({ searchManage, loading }) => ({
  searchManage,
  loading:
    loading.effects['searchManage/fetchList'] || loading.effects['searchManage/getModifyInfo']
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '词条名称',
        dataIndex: 'name',
      },
      {
        title: '标签位置',
        dataIndex: 'searchType',
        render: (record, row) => {
          if (record === 1) {
            return '热门搜索';
          }
          if (record === 2) {
            return '搜索提示文案';
          }
        },
      },
      {
        title: '排序',
        dataIndex: 'sortId',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (record, row) => {
          if (row.status == 0) {
            return '禁用';
          }
          if (row.status == 1) {
            return '启用';
          }
        },
      },
      {
        title: '更新人',
        dataIndex: 'updateUserName',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      }
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:searchConfig:update') ? (
                <Menu.Item onClick={() => this.modifyHandler(record)}>
                  <Icon type="edit" />
                  修改
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:hotSearchConfig:open') ? (
                <Menu.Item onClick={() => this.updateStatusHandler(record)}>
                  <Icon type="edit" />
                  {record.status == 0 ? '启用' : '禁用'}
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:searchConfig:delete') ? (
                <Menu.Item onClick={() => this.deleteHandler(record.id)}>
                  <Icon type="close" />
                  删除
                </Menu.Item>
              ) : null}
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
    this.setState({ currPage, pageSize });
    await this.props.dispatch({
      type: 'searchManage/fetchList',
      payload: {
        searchType: this.props.tabIndex,
        currPage,
        pageSize,
        ...this.props.searchManage.searchInfo,
      },
    });
  };
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
        type: 'searchManage/updateStatus',
        payload: {
              status:record.status == 0 ? 1 :0,
              id: record.id,
              searchType: this.props.tabIndex
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
        {permission.includes('chuangrong:searchConfig:add') ? (
          <Button onClick={() => this.modifyChild.changeVisible(true)}>
            <Icon type="plus" />
            添加
          </Button>
        ) : null}
        <Button style={{ marginBottom: 16}} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };
  // 修改
  modifyHandler = async record => {
    const { searchManage: { modifyInfoData } } = this.props;
    await this.props.dispatch({
      type: 'searchManage/setModifyInfo',
      payload: record,
    });
    this.modifyChild.changeVisible(true);
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
        type: 'searchManage/deleteManage',
        payload: {
          id,
          searchType: this.props.tabIndex
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
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
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
      searchManage: { list, total },
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
        current: currPage,
        pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn} hiddenBreadcrumb={true}>
        <Card bordered={false}>
          <FilterIpts
            tabIndex={this.props.tabIndex}
            searchWholeState={this.state.searchWholeState}
            getList={this.getList}
            getChild={this.getChild}
            pageSize={pageSize}
          />
          <StandardTable {...values} />
        </Card>
        <ModifyForm
          tabIndex={this.props.tabIndex}
          getChildData={child => (this.modifyChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
       </PageHeaderWrapper>
    );
  }
}
