import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
// import ExportLoading from '@/components/ExportLoading'

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
    label: '展示平台',
    value: 'typeStr',
  },
  {
    label: '广告名称',
    value: 'posterName',
  },
  {
    label: '广告位',
    value: 'posterType',
  },
  {
    label: '广告缩略图',
    value: 'posterUrl',
  },
  {
    label: '排序',
    value: 'sort',
  },
  {
    label: '状态',
    value: 'posterStatus',
  },
  {
    label: '更新人',
    value: 'updateBy',
  },
  {
    label: '创建时间',
    value: 'createTime',
  },
];

@permission
@connect(({ posterManage, loading }) => ({
  posterManage,
  loading:
    loading.effects['posterManage/fetchList'] || loading.effects['posterManage/getModifyInfo'],
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
    previewImg: '',
    initColumns: [
      'key',
      'typeStr',
      'posterName',
      'posterType',
      'posterUrl',
      'sort',
      'posterStatus',
      'updateBy',
      'createTime',
    ],
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '展示平台',
        dataIndex: 'typeStr',
      },
      {
        title: '广告名称',
        dataIndex: 'posterName',
      },
      {
        title: '广告位',
        dataIndex: 'posterType',
      },
      {
        title: '广告缩略图',
        dataIndex: 'posterUrl',
        render: (record, row) => {
          return row.posterUrl ? (
            <Card
              hoverable
              style={{ width: 100 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.posterUrl)}
              cover={<img src={row.posterUrl} />}
            />
          ) : null;
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
      },
      {
        title: '状态',
        dataIndex: 'posterStatus',
        render: (record, row) => {
          if (row.posterStatus - 0 == 0) {
            return '禁用';
          }
          if (row.posterStatus - 0 == 1) {
            return '启用';
          }
        },
      },
      {
        title: '更新人',
        dataIndex: 'updateByName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      // {
      //   title: '到期时间',
      //   dataIndex: 'updateTime'
      // }
    ],

    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:poster:update') ? (
                <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                  <Icon type="edit" />
                  修改
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:poster:update') ? (
                <Menu.Item onClick={() => this.updateStatusHandler(record)}>
                  <Icon type="edit" />
                  {record.posterStatus == 0 ? '启用' : '禁用'}
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:poster:delete') ? (
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

  previewImg = url => {
    this.setState({
      previewVisible: true,
      previewImg: url,
    });
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
    this.setState({ currPage, pageSize });
    this.props.dispatch({
      type: 'posterManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.posterManage.searchInfo,
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
        type: 'posterManage/updateStatus',
        payload: {
          id: record.id,
          posterStatus: record.posterStatus == 0 ? 1 : 0,
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
        {/* <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开' )+ '详细搜索'}</Button> */}
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={this.state.defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {permission.includes('chuangrong:poster:add') ? (
          <Button onClick={() => this.modifyChild.changeVisible(true)}>
            <Icon type="plus" />
            添加
          </Button>
        ) : null}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
        {/* <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> */}
      </Fragment>
    );
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();

    dispatch({
      type: 'posterManage/exportExcel',
      payload: formData,
    });
  };
  // 修改
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'posterManage/getModifyInfo',
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
        type: 'posterManage/deleteManage',
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
      posterManage: { list, total },
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
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        {permission.includes('chuangrong:poster:view') &&
        permission.includes('chuangrong:poster:list') ? (
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
        ) : null}
        <ModifyForm
          getChildData={child => (this.modifyChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img style={{ width: '100%' }} src={this.state.previewImg} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
