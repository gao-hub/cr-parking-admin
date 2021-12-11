import React, { PureComponent, Fragment } from 'react';
import { Button, Table, Menu, Icon, Dropdown, message, Tabs, Card } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PermissionWrapper from '@/utils/PermissionWrapper';
import StandardTable from '@/components/StandardTable';

import AddCategory from './AddCategory';
import AddApp from './AddApp';
import AddChildrenCategory from './AddChildrenCategory';
import FilterIpts from './FilterIpts';

import { deleteCategory, updateSort, deleteScene, updateStatusScene } from './services/index';

const { TabPane } = Tabs;

async function showToast(title) {
  const value = await Swal.fire({
    text: title,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  });

  return value;
}

@PermissionWrapper
@connect(({ goodsCategoryManage, loading }) => ({
  goodsCategoryManage,
  total: goodsCategoryManage.total,
  tableIndex: goodsCategoryManage.tableIndex,
  searchInfo: goodsCategoryManage.searchInfo,
  loading: loading.effects['goodsCategoryManage/fetchList'],
}))
class template extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '类目ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '类目',
          dataIndex: 'cateName',
          key: 'cateName',
        },
        {
          title: '类型示意图',
          dataIndex: 'pic',
          key: 'pic',
          render: record =>
            record === '' ? (
              '无'
            ) : (
              <img style={{ width: '60px', height: '60px' }} src={record} alt="类型示意图" />
            ),
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: record => (record === 0 ? '禁用' : '启用'),
        },
        {
          title: '操作',
          render: record => {
            const { permission, total } = this.props;
            const { pageSize, currPage } = this.state;

            const totalPages = Math.ceil(total / pageSize);
            const action = (
              <Menu>
                {permission.includes('chuangrong:homeCategory:update') ? (
                  <Menu.Item onClick={() => this.modifyMenu(record)}>
                    <Icon type="edit" /> 编辑
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeCategory:add') &&
                record.pid === 0 &&
                record.status !== 0 ? (
                  <Menu.Item onClick={() => this.addSubMenu(record)}>
                    <Icon type="plus" /> 添加子类目
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeCategory:delete') ? (
                  <Menu.Item onClick={() => this.deleteMenu(record)}>
                    <Icon type="delete" /> 删除
                  </Menu.Item>
                ) : null}
                {record.isShowSort &&
                (record.pid === 0
                  ? record.isOutShowUpSort || currPage !== 1
                  : record.isShowUpSort) &&
                permission.includes('chuangrong:homeCategory:sort') ? (
                  <Menu.Item
                    onClick={async () => {
                      const res = await updateSort({
                        id: record.id,
                        sortId: -1,
                      });
                      if (res && res.status === 1) {
                        message.success('操作成功');
                        this.getCategoryList();
                      } else {
                        message.error('操作失败');
                      }
                    }}
                  >
                    <Icon type="up" />
                    排序
                  </Menu.Item>
                ) : null}

                {record.isShowSort &&
                (record.pid === 0
                  ? record.isOutShowDownSort || currPage !== totalPages
                  : record.isShowDownSort) &&
                permission.includes('chuangrong:homeCategory:sort') ? (
                  <Menu.Item
                    onClick={async () => {
                      const res = await updateSort({
                        id: record.id,
                        sortId: 1,
                      });
                      if (res && res.status === 1) {
                        message.success('操作成功');
                        this.getCategoryList();
                      } else {
                        message.error('操作失败');
                      }
                    }}
                  >
                    <Icon type="down" />
                    排序
                  </Menu.Item>
                ) : null}
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(
                    permission.includes('chuangrong:homeCategory:update') ||
                    permission.includes('chuangrong:homeCategory:delete') ||
                    permission.includes('chuangrong:homeCategory:add') ||
                    permission.includes('chuangrong:homeCategory:sort')
                  )
                }
              >
                <a className="ant-dropdown-link" href="#">
                  操作
                  <Icon type="down" />
                </a>
              </Dropdown>
            );
          },
        },
      ],
      appColumns: [
        {
          title: '序号',
          dataIndex: 'key',
          width: 80,
        },
        {
          title: '标签名称',
          dataIndex: 'sceneName',
          width: 120,
        },
        {
          title: '标签位置',
          dataIndex: 'location',
        },
        {
          title: '排序',
          dataIndex: 'sortId',
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: record => (record === 0 ? '禁用' : '启用'),
        },
        {
          title: '更新人',
          dataIndex: 'updateByTrueName',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
        },
        {
          title: '操作',
          render: record => {
            const { permission } = this.props;
            const action = (
              <Menu>
                {permission.includes('chuangrong:homeStoreScene:update') ? (
                  <Menu.Item
                    onClick={() => {
                      this.setState({ isShowAppAdd: true, infoData: record });
                    }}
                  >
                    <Icon type="edit" /> 修改
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeStoreScene:changeStatus') && (
                  <Menu.Item
                    onClick={async () => {
                      const confirmVal = await showToast(
                        `确定要${record.status === 0 ? '启用' : '禁用'}吗？`
                      );
                      if (confirmVal.value) {
                        const res = await updateStatusScene({
                          id: record.id,
                          status: record.status === 0 ? 1 : 0,
                        });
                        if (res && res.status === 1) {
                          message.success(res.statusDesc);
                          this.getAppList();
                        } else {
                          message.error(res.statusDesc);
                        }
                      }
                    }}
                  >
                    <Icon type="edit" /> {record.status === 0 ? '启用' : '禁用'}
                  </Menu.Item>
                )}
                {permission.includes('chuangrong:homeStoreScene:delete') ? (
                  <Menu.Item
                    onClick={async () => {
                      const confirmVal = await showToast('确定要删除吗？');
                      if (confirmVal.value) {
                        const res = await deleteScene({
                          id: record.id,
                        });
                        if (res && res.status === 1) {
                          message.success(res.statusDesc);
                          this.getAppList();
                        } else {
                          message.error(res.statusDesc);
                        }
                      }
                    }}
                  >
                    <Icon type="delete" /> 删除
                  </Menu.Item>
                ) : null}
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(
                    permission.includes('chuangrong:homeStoreScene:update') ||
                    permission.includes('chuangrong:homeStoreScene:delete') ||
                    permission.includes('chuangrong:homeStoreScene:changeStatus')
                  )
                }
              >
                <a className="ant-dropdown-link" href="#">
                  操作
                  <Icon type="down" />
                </a>
              </Dropdown>
            );
          },
        },
      ],
      currPage: 1,
      pageSize: 10,
      appCurrPage: 1,
      appPageSize: 10,
      isShowAdd: false,
      isShowAppAdd: false,
      isShowChildren: false,
      record: null,
      infoData: null,
      tabIndex: '1',
      ref1: null,
    };
  }

  componentDidMount() {
    const { tableIndex } = this.props;

    if (tableIndex) {
      this.changeTabIndex(tableIndex);
    } else {
      this.changeTabIndex('1');
    }
  }

  // 上方新增按钮
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:homeCategory:add') && (
          <Button
            onClick={() => {
              this.addSubMenu(0);
            }}
          >
            新增类目
          </Button>
        )}
      </Fragment>
    );
  };

  // 上方新增按钮
  appRenderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:homeStoreScene:add') && (
          <Button
            onClick={() => {
              this.setState({ isShowAppAdd: true });
            }}
          >
            新增
          </Button>
        )}
        {
          <Button
            onClick={() => {
              window.reload();
            }}
          >
            刷新
          </Button>
        }
      </Fragment>
    );
  };

  // 编辑按钮
  modifyMenu = record => {
    if (record.pid === 0) {
      this.setState({ infoData: record, isShowAdd: true, record: null });
    } else {
      this.setState({ infoData: record, isShowChildren: true, record: record.parentRef });
    }
  };

  // 添加类目
  addSubMenu = value => {
    if (value === 0) {
      this.setState({ isShowAdd: true, infoData: null, record: null });
    } else {
      this.setState({ isShowChildren: true, record: value, infoData: null });
    }
  };

  // 删除
  deleteMenu = async record => {
    const res = await deleteCategory({ id: record.id });
    if (res && res.status === 1) {
      message.success('操作成功');
      this.getCategoryList();
    } else {
      message.error(res.statusDesc);
    }
  };

  // 获取类目列表
  getCategoryList = async () => {
    const { dispatch } = this.props;
    const { currPage, pageSize } = this.state;
    await dispatch({
      type: 'goodsCategoryManage/fetchList',
      payload: {
        currPage,
        pageSize,
      },
    });
  };

  // 获取场景列表
  getAppList = async () => {
    const { dispatch, searchInfo } = this.props;
    const { appCurrPage, appPageSize } = this.state;
    await dispatch({
      type: 'goodsCategoryManage/fetchAppList',
      payload: {
        currPage: appCurrPage,
        pageSize: appPageSize,
        ...searchInfo,
      },
    });
  };

  onChange = currPage => {
    this.setState(
      {
        currPage,
      },
      () => {
        this.getCategoryList();
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
        this.getCategoryList();
      }
    );
  };

  onAppChange = currPage => {
    this.setState(
      {
        appCurrPage: currPage,
      },
      () => {
        this.getAppList();
      }
    );
  };

  onAppShowSizeChange = (currPage, pageSize) => {
    this.setState(
      {
        appCurrPage: currPage,
        appPageSize: pageSize,
      },
      () => {
        this.getAppList();
      }
    );
  };

  // 类目展开按钮
  expandIcon = props => {
    if (props.record.children) {
      if (props.expanded) {
        return (
          <Icon
            style={{ marginRight: '5px' }}
            type="caret-down"
            onClick={e => props.onExpand(props.record, e)}
          />
        );
      }
      return (
        <Icon
          style={{ marginRight: '5px' }}
          type="caret-right"
          onClick={e => props.onExpand(props.record, e)}
        />
      );
    }
    return <i style={{ marginRight: '20px' }} onClick={e => props.onExpand(props.record, e)} />;
  };

  changeTabIndex = index => {
    const { dispatch } = this.props;

    this.setState({ tabIndex: index });
    dispatch({
      type: 'goodsCategoryManage/setTableIndex',
      payload: index,
    });

    if (index === '1') {
      this.getCategoryList();
    } else {
      this.getAppList();
    }
  };

  render() {
    const {
      columns,
      currPage,
      pageSize,
      isShowAppAdd,
      isShowAdd,
      isShowChildren,
      record,
      infoData,
      tabIndex,
      appCurrPage,
      appPageSize,
      appColumns,
    } = this.state;
    const { getCategoryList } = this;
    const {
      goodsCategoryManage: { list, total, appList, appTotal },
      loading,
      permission,
    } = this.props;
    const values = {
      columns: appColumns,
      data: {
        list: appList,
      },
      loading,
      pagination: {
        showTotal: totalarg => `共 ${totalarg} 条`,
        current: appCurrPage,
        pageSize: appPageSize,
        total: appTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onAppChange,
        onShowSizeChange: this.onAppShowSizeChange,
      },
    };
    return permission.includes('chuangrong:smartgoodslabel:view') ? (
      <Fragment>
        <Tabs
          activeKey={tabIndex}
          onChange={this.changeTabIndex}
          tabBarStyle={{ marginBottom: 40 }}
        >
          {permission.includes('chuangrong:homeCategory:list') ? (
            <TabPane tab="类目" key="1">
              <PageHeaderWrapper renderBtn={this.renderBtn}>
                {permission.includes('chuangrong:homeCategory:list') ? (
                  <Table
                    expandIcon={props => this.expandIcon(props)}
                    columns={columns}
                    dataSource={list}
                    loading={loading}
                    rowKey={record1 => record1.id}
                    pagination={{
                      showTotal: totalarg => `共 ${totalarg} 条`,
                      current: currPage,
                      pageSize,
                      total,
                      showQuickJumper: true,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '30', '40'],
                      onChange: this.onChange,
                      onShowSizeChange: this.onShowSizeChange,
                    }}
                  />
                ) : null}

                <AddCategory
                  visible={isShowAdd}
                  getList={getCategoryList}
                  onCancel={() => {
                    this.setState({ isShowAdd: false, infoData: null });
                  }}
                  infoData={infoData}
                />

                <AddChildrenCategory
                  visible={isShowChildren}
                  getList={getCategoryList}
                  fData={record}
                  onCancel={() => {
                    this.setState({ isShowChildren: false, infoData: null });
                  }}
                  infoData={infoData}
                />
              </PageHeaderWrapper>
            </TabPane>
          ) : null}
          {permission.includes('chuangrong:homeStoreScene:list') ? (
            <TabPane tab="应用场景" key="2">
              <PageHeaderWrapper renderBtn={this.appRenderBtn}>
                <Card bordered={false}>
                  {permission.includes('chuangrong:homeStoreProduct:list') ? (
                    <>
                      <FilterIpts
                        getList={() => {
                          this.onAppChange(1);
                        }}
                        getRef={value => {
                          this.state.ref1 = value;
                        }}
                      />
                      <StandardTable {...values} />
                    </>
                  ) : null}
                  <AddApp
                    visible={isShowAppAdd}
                    getList={this.getAppList}
                    onCancel={() => {
                      this.setState({ isShowAppAdd: false, infoData: null });
                    }}
                    infoData={infoData}
                  />
                </Card>
              </PageHeaderWrapper>
            </TabPane>
          ) : null}
        </Tabs>
      </Fragment>
    ) : null;
  }
}

export default template;
