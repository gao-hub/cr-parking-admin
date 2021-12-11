import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Modal, Tabs } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import PermissionWrapper from '@/utils/PermissionWrapper';
// import ExportLoading from '@/components/ExportLoading'

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import ModifyForm from './ModifyForm';
import TabModifyForm from './TabModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';
import TabFilterIpts from './tabFilterIpts';

const { TabPane } = Tabs;

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
    value: 'updateName',
  },
  {
    label: '创建时间',
    value: 'createTime',
  },
];

@PermissionWrapper
@connect(({ smartHomeConfigManage, loading }) => ({
  smartHomeConfigManage,
  loading:
    loading.effects['smartHomeConfigManage/fetchList'] ||
    loading.effects['smartHomeConfigManage/getModifyInfo'] ||
    loading.effects['smartHomeConfigManage/fetchTabList'] ||
    loading.effects['smartHomeConfigManage/getTabModifyInfo'],
  exportLoading: loading.effects['orderManage/exportExcel'],
}))
class template extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currPage: 1,
      tabCurrPage: 1,
      pageSize: 10,
      tabPageSize: 10,
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
          title: '广告名称',
          dataIndex: 'advertName',
        },
        {
          title: '广告位',
          dataIndex: 'advertType',
          render: (record, row) => {
            if (row.advertType - 0 == 1) {
              return '首页banner';
            }
            if (row.advertType - 0 == 2) {
              return '金刚区';
            }
          },
        },
        {
          title: '广告缩略图',
          dataIndex: 'imageUrl',
          render: (record, row) =>
            row.imageUrl ? (
              <Card
                hoverable
                style={{ width: 100 }}
                bodyStyle={{ padding: 0 }}
                onClick={() => this.previewImg(row.imageUrl)}
                cover={<img src={row.imageUrl} />}
              />
            ) : null,
        },
        {
          title: '排序',
          dataIndex: 'sorted',
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: (record, row) => {
            if (row.status - 0 == 0) {
              return '已禁用';
            }
            if (row.status - 0 == 1) {
              return '已启用';
            }
          },
        },
        {
          title: '更新人',
          dataIndex: 'updateName',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        {
          title: '到期时间',
          dataIndex: 'endTime',
        },
      ],
      tabDefcolumns: [
        {
          title: '序号',
          dataIndex: 'key',
        },
        {
          title: 'tab标签标题',
          dataIndex: 'title',
        },
        {
          title: '商品类型',
          dataIndex: 'commodityType',
          render: (record, row) => {
            if (row.commodityType) {
              let typeArr = row.commodityType.split(',');
              typeArr = typeArr.map(item => {
                if (item === '5') {
                  return '国内游';
                } else {
                  return '周边游';
                }
              });
              return typeArr.join(',');
            } else {
              return '';
            }
          },
        },
        {
          title: '排序',
          dataIndex: 'sorted',
          // sorter: (a, b) => b.sorted - a.sorted,
          // defaultSortOrder: 'descend',
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: (record, row) => {
            if (row.status - 0 == 0) {
              return '已禁用';
            }
            if (row.status - 0 == 1) {
              return '已启用';
            }
          },
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
        },
        // {
        //   title: '到期时间',
        //   dataIndex: 'updateTime'
        // }
      ],

      syncColumns: [],
      syncTabColumns: [],
      staticColumns: [
        {
          title: '操作',
          render: record => {
            const { permission } = this.props;
            const action = (
              <Menu>
                {permission.includes('chuangrong:homeAdvert:update') ? (
                  <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                    <Icon type="edit" />
                    修改
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeAdvert:update') ? (
                  <Menu.Item onClick={() => this.updateStatusHandler(record)}>
                    <Icon type="edit" />
                    {record.status == 0 ? '启用' : '禁用'}
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeAdvert:delete') ? (
                  <Menu.Item onClick={() => this.deleteHandler(record.id)}>
                    <Icon type="close" />
                    删除
                  </Menu.Item>
                ) : null}
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(
                    permission.includes('chuangrong:homeAdvert:update') ||
                    permission.includes('chuangrong:homeAdvert:delete')
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
      tabStaticColumns: [
        {
          title: '操作',
          render: record => {
            const { permission } = this.props;
            const action = (
              <Menu>
                {permission.includes('chuangrong:travelTab:update') ? (
                  <Menu.Item onClick={() => this.tabModifyHandler(record.id)}>
                    <Icon type="edit" />
                    修改
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:travelTab:update') ? (
                  <Menu.Item onClick={() => this.updateTabStatusHandler(record)}>
                    <Icon type="edit" />
                    {record.status == 0 ? '启用' : '禁用'}
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:travelTab:delete') ? (
                  <Menu.Item onClick={() => this.tabDeleteHandler(record.id)}>
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
      tabIndex: '1',
      modifyChildVisible: false,
    };
  }

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.syncChangeTabColumns([...this.state.tabDefcolumns, ...this.state.tabStaticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }

  previewImg = url => {
    this.setState({
      previewVisible: true,
      previewImg: url,
    });
  };

  //   广告位页数改变时
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

  //   tab页数改变时
  onTabChange = currPage => {
    this.setState(
      {
        tabCurrPage: currPage,
      },
      () => {
        this.getTabList(currPage, this.state.tabPageSize);
      }
    );
  };

  // 广告位
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

  // tab页
  onTabShowSizeChange = (currPage, pageSize) => {
    this.setState(
      {
        tabCurrPage: currPage,
        tabPageSize: pageSize,
      },
      () => {
        this.getTabList(currPage, pageSize);
      }
    );
  };

  // 广告位获取列表数据
  getList = (currPage, pageSize) => {
    this.setState({ currPage, pageSize });
    this.props.dispatch({
      type: 'smartHomeConfigManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.smartHomeConfigManage.searchInfo,
      },
    });
  };

  // tab页获取列表数据
  getTabList = (currPage, pageSize) => {
    this.setState({ tabCurrPage: currPage, tabPageSize: pageSize });
    this.props.dispatch({
      type: 'smartHomeConfigManage/fetchTabList',
      payload: {
        currPage,
        pageSize,
        ...this.props.smartHomeConfigManage.searchInfo,
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
        type: 'smartHomeConfigManage/updateStatus',
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

  updateTabStatusHandler = async record => {
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
        type: 'smartHomeConfigManage/updateTabStatus',
        payload: {
          id: record.id,
          status: record.status == 0 ? 1 : 0,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getTabList(this.state.tabCurrPage, this.state.tabPageSize);
      } else {
        message.error(res.statusDesc);
      }
    }
  };

  // 广告位
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {/* <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开' )+ '详细搜索'}</Button> */}
        {/* <SetColumns
          plainOptions={plainOptions}
          defcolumns={this.state.defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        /> */}
        {permission.includes('chuangrong:homeAdvert:add') ? (
          <Button
            onClick={() =>
              this.setState({
                modifyChildVisible: true,
              })
            }
          >
            <Icon type="plus" />
            添加
          </Button>
        ) : null}
        <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
        {/* <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> */}
      </Fragment>
    );
  };

  // tab标签
  tabRenderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {/* <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开' )+ '详细搜索'}</Button> */}
        {/* <SetColumns
          plainOptions={plainOptions}
          defcolumns={this.state.defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        /> */}
        {permission.includes('chuangrong:travelTab:add') ? (
          <Button onClick={() => this.tabModifyChild.changeVisible(true)}>
            <Icon type="plus" />
            添加
          </Button>
        ) : null}
        <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
        {/* <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> */}
      </Fragment>
    );
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    const formData = this.child.getFormValue();

    dispatch({
      type: 'smartHomeConfigManage/exportExcel',
      payload: formData,
    });
  };

  // 广告位修改
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'smartHomeConfigManage/getModifyInfo',
      payload: {
        id,
      },
    });
    if (res && res.status === 1) {
      this.setState({
        modifyChildVisible: true,
      });
    } else {
      message.error(res.statusDesc);
    }
  };

  // tab修改
  tabModifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'smartHomeConfigManage/getTabModifyInfo',
      payload: {
        id,
      },
    });
    if (res && res.status === 1) {
      this.tabModifyChild.changeVisible(true);
    } else {
      message.error(res.statusDesc);
    }
  };

  // 广告删除
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
        type: 'smartHomeConfigManage/deleteManage',
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

  // tab删除
  async tabDeleteHandler(id) {
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
        type: 'smartHomeConfigManage/tabDeleteManage',
        payload: {
          id,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getTabList(this.state.tabCurrPage, this.state.tabPageSize);
      } else {
        message.error(res.statusDesc);
      }
    }
  }

  getChild = ref => (this.child = ref);

  getChild2 = ref => (this.child2 = ref);

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  syncChangeTabColumns = (array = []) => {
    this.setState({
      syncTabColumns: array,
    });
  };

  callback = async index => {
    this.setState({
      tabIndex: index,
    });
    if (this.child) {
      await this.child.reset();
    }
    if (this.child2) {
      await this.child2.reset();
    }
    if (index == 1) {
      // this.getList(this.state.currPage, this.state.pageSize);
      this.getList(1, 10);
    } else {
      // this.getTabList(this.state.tabCurrPage, this.state.tabPageSize);
      this.getTabList(1, 10);
    }
  };

  render() {
    const {
      permission,
      smartHomeConfigManage: { list, total, tabList, tabTotal },
    } = this.props;
    const {
      currPage,
      pageSize,
      tabCurrPage,
      tabPageSize,
      data,
      selectedRows,
      modifyChildVisible,
    } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => `共 ${total} 条`,
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
    const tabValues = {
      columns: this.state.syncTabColumns,
      data: {
        list: tabList,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: tabTotal => `共 ${tabTotal} 条`,
        current: tabCurrPage,
        pageSize: tabPageSize,
        total: tabTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onTabChange,
        onShowSizeChange: this.onTabShowSizeChange,
      },
    };
    return permission.includes('chuangrong:homeAdvert:view') ? (
      <Fragment>
        {/* <Tabs defaultActiveKey="1" onChange={this.callback} tabBarStyle={{ marginBottom: 40 }}>
          <TabPane tab="广告位管理" key="1"> */}
        <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
          {permission.includes('chuangrong:homeAdvert:list') ? (
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
          {modifyChildVisible && (
            <ModifyForm
              onCancel={() => {
                this.setState({ modifyChildVisible: false });
              }}
              getList={this.getList}
              currPage={currPage}
              pageSize={pageSize}
            />
          )}
          <Modal
            visible={this.state.previewVisible}
            footer={null}
            onCancel={() => this.setState({ previewVisible: false })}
          >
            <img style={{ width: '100%' }} src={this.state.previewImg} />
          </Modal>
        </PageHeaderWrapper>
        {/* </TabPane> */}
        {/* <TabPane tab="tab标签管理" key="2">
            <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.tabRenderBtn}>
              {permission.includes('chuangrong:travelTab:view') &&
              permission.includes('chuangrong:travelTab:list') ? (
                <Card bordered={false}>
                  <TabFilterIpts
                    searchWholeState={this.state.searchWholeState}
                    getList={this.getTabList}
                    getChild={this.getChild2}
                    pageSize={pageSize}
                  />
                  <StandardTable {...tabValues} />
                </Card>
              ) : null}
              <TabModifyForm
                getChildData={child => (this.tabModifyChild = child)}
                getList={this.getTabList}
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
          </TabPane> */}
        {/* </Tabs> */}
      </Fragment>
    ) : null;
  }
}

export default template;
