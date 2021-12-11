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
@connect(({ iconManage, loading }) => ({
  iconManage,
  loading:
    loading.effects['iconManage/fetchList'] || loading.effects['iconManage/getModifyInfo']
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    isFirst: true,
    currPage: 1,
    pageSize: 10,
    title: '添加',
    previewImg: '',
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: 'icon名称',
        dataIndex: 'name',
      },
      {
        title: 'icon位置',
        dataIndex: 'locationStr'
      },
      {
        title: 'icon图标-选中样式',
        dataIndex: 'iconUrl',
        render: (record, row) => {
          return row.iconUrl ? (
            <Card
              hoverable
              style={{ width: 100 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.iconUrl)}
              cover={<img src={row.iconUrl} />}
            />
          ) : null;
        },
      },
      {
        title: 'icon图标-未选中样式',
        dataIndex: 'iconUrlTwo',
        render: (record, row) => {
          return row.iconUrlTwo ? (
            <Card
              hoverable
              style={{ width: 100 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.iconUrlTwo)}
              cover={<img src={row.iconUrlTwo} />}
            />
          ) : null;
        },
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
        dataIndex: 'updateByTrueName',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      }
    ],
    defcolumns2: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: 'icon名称',
        dataIndex: 'name',
      },
      {
        title: 'icon位置',
        dataIndex: 'locationStr'
      },
      {
        title: 'icon图标',
        dataIndex: 'iconUrl',
        render: (record, row) => {
          return row.iconUrl ? (
            <Card
              hoverable
              style={{ width: 100 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.iconUrl)}
              cover={<img src={row.iconUrl} />}
            />
          ) : null;
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
            return '已禁用';
          }
          if (row.status == 1) {
            return '已启用';
          }
        },
      },
      {
        title: '更新人',
        dataIndex: 'updateByTrueName',
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
              {permission.includes('chuangrong:icon:update') ? (
                <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                  <Icon type="edit" />
                  修改
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:icon:disable') ? (
                <Menu.Item onClick={() => this.updateStatusHandler(record)}>
                  <Icon type="edit" />
                  {record.status == 0 ? '启用' : '禁用'}
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:icon:delete') ? (
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
  getList = async (currPage, pageSize) => {
    this.setState({ currPage, pageSize });
    await this.props.dispatch({
      type: 'iconManage/fetchList',
      payload: {
        location: this.props.tabIndex,
        currPage,
        pageSize,
        ...this.props.iconManage.searchInfo,
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
        type: 'iconManage/updateStatus',
        payload: {
              status:record.status == 0 ? 1 :0,
              id: record.id
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
        {permission.includes('chuangrong:icon:add') ? (
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
  modifyHandler = async id => {
    const { iconManage: { modifyInfoData } } = this.props;
    const res = await this.props.dispatch({
      type: 'iconManage/getModifyInfo',
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
        type: 'iconManage/deleteManage',
        payload: {
          id
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
    let arr = this.props.tabIndex === '1' ? this.state.defcolumns : this.state.defcolumns2;
    this.syncChangeColumns([...arr, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
    if(this.props.tabIndex === '1'){
      // 获取字典
      this.getAllSelect();
    }
  }
  // 获取首页顶部启用
  getAllSelect = async () => {
    const res = await this.props.dispatch({
      type: 'iconManage/getAllSelect',
      payload: {},
    });
  };
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      iconManage: { list, total },
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
