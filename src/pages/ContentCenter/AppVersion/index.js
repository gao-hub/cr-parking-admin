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
    label: '系统名称',
    value: 'type',
  },
  {
    label: '版本号',
    value: 'version',
  },
  {
    label: '更新地址',
    value: 'url',
  },
  {
    label: '更新内容',
    value: 'content',
  },
  {
    label: '更新方式',
    value: 'isUpdate',
  },
  {
    label: '更新时间',
    value: 'updateTime',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '系统名称',
    dataIndex: 'type',
    render: text =>
      text === 1 ? 'wechat' : text === 2 ? 'Android' : text === 3 ? 'IOS' : '小程序',
  },
  {
    title: '版本号',
    dataIndex: 'version',
  },
  {
    title: '更新地址',
    dataIndex: 'url',
  },
  {
    title: '更新内容',
    dataIndex: 'content',
  },
  {
    title: '更新方式',
    dataIndex: 'isUpdate',
    render: text => (text === 0 ? '必须强制更新' : text === 1 ? '可更新可不更新' : '不需要更新'),
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
];

@permission
@connect(({ appVersionManage, loading }) => ({
  appVersionManage,
  loading:
    loading.effects['appVersionManage/fetchList'] ||
    loading.effects['appVersionManage/getModifyInfo'],
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
    initColumns: ['key', 'type', 'version', 'url', 'content', 'isUpdate', 'updateTime'],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:appVersion:update') && (
                <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                  <Icon type="edit" />
                  修改
                </Menu.Item>
              )}
              {permission.includes('chuangrong:appVersion:update') && (
                <Menu.Item onClick={() => this.deleteHandler(record.id)}>
                  <Icon type="close" />
                  删除
                </Menu.Item>
              )}
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
  getList = (currPage, pageSize) => {
    this.setState({ currPage });
    this.props.dispatch({
      type: 'appVersionManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.appVersionManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { permission } = this.props;
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        {/* <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {searchWholeState ? '合并' : '展开' + '详细搜索'}
        </Button> */}
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {permission.includes('chuangrong:appVersion:add') && (
          <Button onClick={() => this.modifyChild.changeVisible(true)}>
            <Icon type="plus" />
            添加
          </Button>
        )}

        {/* <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
          导出
        </ExportLoading> */}
      </Fragment>
    );
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();

    dispatch({
      type: 'appVersionManage/exportExcel',
      payload: formData,
    });
  };
  // 修改
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'appVersionManage/getModifyInfo',
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
      text: '确定要删除吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'appVersionManage/deleteManage',
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
      appVersionManage: { list, total },
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
        current: currPage,
        defaultPageSize: pageSize,
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
        {permission.includes('chuangrong:appVersion:list') && (
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
