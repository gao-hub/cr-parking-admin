import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PermissionWrapper from '@/utils/PermissionWrapper';
import { connect } from 'dva';
import { Card, Button, Icon, Menu, Dropdown, Tabs, Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import ExportLoading from '@/components/ExportLoading';
import FilterIpts from './FilterIpts';
import { changeSale, changeRecommend } from './services/index';

const { TabPane } = Tabs;

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 80,
  },
  {
    title: '产品编号',
    dataIndex: 'productNo',
    width: 130,
  },
  {
    title: '产品名称',
    dataIndex: 'storeName',
    width: 130,
  },
  {
    title: '产品缩略图',
    dataIndex: 'thumbnail',
    width: 130,
    render: record => (
      <img style={{ width: '60px', height: '60px' }} src={record} alt="产品缩略图" />
    ),
  },
  {
    title: '所属类目',
    dataIndex: 'categorName',
    width: 100,
  },
  {
    title: '应用场景',
    dataIndex: 'sceneName',
    width: 100,
  },
  {
    title: '成本价',
    dataIndex: 'costStr',
    width: 100,
  },
  {
    title: '售价',
    dataIndex: 'otPriceStr',
    width: 100,
  },
  {
    title: '运费',
    dataIndex: 'postage',
    width: 100,
    render: record => {
      switch (record) {
        case 0:
          return '免运费';
        default:
          return record;
      }
    },
  },
  {
    title: '是否推荐',
    dataIndex: 'isGood',
    render: record => {
      switch (record) {
        case 0:
          return '--';
        case 1:
          return '推荐中';
        default:
          return '';
      }
    },
    width: 100,
  },
  {
    title: '库存',
    dataIndex: 'stock',
    width: 100,
    // sorter: (a, b) => a.stock - b.stock,
  },
  {
    title: '销量',
    dataIndex: 'sales',
    width: 100,
    // sorter: (a, b) => a.sales - b.sales,
  },
  {
    title: '上架时间',
    dataIndex: 'showTime',
    render: record => (record != null ? record : '--'),
    width: 100,
  },
  {
    title: '下架时间',
    dataIndex: 'hideTime',
    render: record => (record != null ? record : '--'),
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100,
  },
];

@PermissionWrapper
@connect(({ productsManage, loading }) => ({
  productsManage,
  loading: loading.effects['productsManage/fetchList'],
  exportLoading: loading.effects['productsManage/exportFile'],
  tableIndex: productsManage.tableIndex,
}))
class template extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: '1',
      currPage: 1,
      pageSize: 10,
      syncColumns: [],
      ref1: null,
      ref2: null,
      isFirstReceive: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { permission, tableIndex } = nextProps;
    const { isFirstReceive } = this.state;
    if (isFirstReceive) {
      if (tableIndex) {
        this.changeTabIndex(tableIndex);
      } else if (permission.includes('chuangrong:homeStoreProduct:onSale')) {
        this.changeTabIndex('1');
      } else if (permission.includes('chuangrong:homeStoreProduct:list')) {
        this.changeTabIndex('2');
      }
    }
    this.setState({
      isFirstReceive: false,
    });
  }

  changeTabIndex = index => {
    const { dispatch } = this.props;
    const { ref1, ref2 } = this.state;
    dispatch({
      type: 'productsManage/setTableIndex',
      payload: index,
    });
    this.setState(
      {
        tabIndex: index,
      },
      async () => {
        const { pageSize, currPage } = this.state;
        const diffColumns = {
          title: '操作',
          render: record => {
            const { permission } = this.props;
            const rid = record.id;
            const action = (
              <Menu>
                {permission.includes('chuangrong:homeStoreProduct:info') ? (
                  <Menu.Item
                    onClick={() => {
                      router.push({
                        pathname: '/smarthome/products/add',
                        query: {
                          id: rid,
                        },
                      });
                    }}
                  >
                    详情
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeStoreProduct:update') ? (
                  <Menu.Item
                    onClick={() => {
                      router.push({
                        pathname: '/smarthome/products/add',
                        query: {
                          edit: true,
                          id: rid,
                        },
                      });
                    }}
                  >
                    修改
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeStoreProduct:sale') ? (
                  <Menu.Item
                    onClick={() => {
                      const text = record.isShow === 0 ? '上架' : '下架';
                      Modal.confirm({
                        title: text,
                        content: `是否要${text}该产品？`,
                        okText: '确定',
                        cancelText: '取消',
                        onCancel: () => {},
                        onOk: async () => {
                          const result = await changeSale({
                            id: rid,
                            isShow: record.isShow === 0 ? 1 : 0,
                          });
                          if (result && result.status === 1) {
                            message.success('操作成功');
                            this.getList(currPage, pageSize);
                          } else {
                            message.warn(result.statusDesc);
                          }
                        },
                      });
                    }}
                  >
                    {record.isShow === 0 ? '上架' : '下架'}
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeStoreProduct:recommend') ? (
                  <Menu.Item
                    onClick={() => {
                      const text = record.isGood === 1 ? '取消推荐' : '推荐';
                      Modal.confirm({
                        title: text,
                        content: `是否要${text}该产品？`,
                        okText: '确定',
                        cancelText: '取消',
                        onCancel: () => {},
                        onOk: async () => {
                          const result = await changeRecommend({
                            id: rid,
                            isGood: record.isGood === 0 ? 1 : 0,
                          });
                          if (result && result.status === 1) {
                            message.success('操作成功');
                            this.getList(currPage, pageSize);
                          } else {
                            message.warn('操作失败');
                          }
                        },
                      });
                    }}
                  >
                    {record.isGood === 1 ? '取消推荐' : '推荐'}
                  </Menu.Item>
                ) : null}
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(
                    permission.includes('chuangrong:homeStoreProduct:info') ||
                    permission.includes('chuangrong:homeStoreProduct:update') ||
                    permission.includes('chuangrong:homeStoreProduct:sale') ||
                    permission.includes('chuangrong:homeStoreProduct:recommend')
                  )
                }
              >
                <a className="ant-dropdown-link">
                  操作
                  <Icon type="down" />
                </a>
              </Dropdown>
            );
          },
          width: 100,
          fixed: 'right',
        };
        // 切换tab清除搜索条件
        await dispatch({
          type: 'productsManage/setSearchInfo',
          payload: {},
        });

        if (ref1) {
          ref1.reset();
        }

        if (ref2) {
          ref2.reset();
        }

        if (index === '1') {
          if (defcolumns[8].title === '在架状态') {
            defcolumns.splice(8, 1);
          }
          this.syncChangeColumns([...defcolumns, diffColumns]);
          this.getList(1, pageSize, 1);
        } else {
          if (defcolumns[8].title !== '在架状态') {
            defcolumns.splice(8, 0, {
              title: '在架状态',
              dataIndex: 'isShow',
              render: record => {
                switch (record) {
                  case 0:
                    return '仓库中';
                  case 1:
                    return '在架';
                  default:
                    return '';
                }
              },
              width: 100,
            });
          }
          this.syncChangeColumns([...defcolumns, diffColumns]);
          this.getList(1, pageSize, 2);
        }
      }
    );
  };

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  exportFile = () => {
    const {
      dispatch,
      productsManage: { searchInfo },
    } = this.props;
    const { tabIndex } = this.state;
    if (tabIndex === '1') {
      return dispatch({
        type: 'productsManage/exportFile',
        payload: { ...searchInfo, isShow: 1 },
      });
    }
    return dispatch({
      type: 'productsManage/exportFile',
      payload: { ...searchInfo },
    });
  };

  renderBtn = () => {
    const { permission, exportLoading, dispatch } = this.props;
    return permission.includes('chuangrong:homeStoreProduct:view') ? (
      <Fragment>
        {permission.includes('chuangrong:homeStoreProduct:export') && (
          <ExportLoading exportLoading={exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        )}
        {permission.includes('chuangrong:homeStoreProduct:add') ? (
          <Button
            onClick={async () => {
              await dispatch({
                type: 'productsManage/setInfoData',
                payload: null,
              });
              router.push({
                pathname: '/smarthome/products/add',
                query: {
                  edit: true,
                  add: true,
                },
              });
            }}
          >
            <Icon type="plus" />
            新增
          </Button>
        ) : null}

        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    ) : null;
  };

  onChange = currPage => {
    const { pageSize } = this.state;
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(currPage, pageSize);
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

  getList = (currPage = 1, pageSize = 10, type) => {
    const {
      productsManage: { searchInfo = {} },
      dispatch,
    } = this.props;
    const { tabIndex } = this.state;
    this.setState({ currPage, pageSize });
    if (type === 1 || tabIndex === '1') {
      dispatch({
        type: 'productsManage/fetchList',
        payload: {
          currPage,
          pageSize,
          ...searchInfo,
          isShow: 1,
        },
      });
    } else {
      dispatch({
        type: 'productsManage/fetchList',
        payload: {
          currPage,
          pageSize,
          ...searchInfo,
        },
      });
    }
  };

  render() {
    const {
      permission,
      loading,
      productsManage: { list, total },
    } = this.props;
    const { syncColumns, currPage, pageSize, tabIndex } = this.state;

    const values = {
      columns: syncColumns,
      data: {
        list,
      },
      loading,
      pagination: {
        showTotal: totalarg => `共 ${totalarg} 条`,
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
      <Fragment>
        {permission.includes('chuangrong:homeStoreProduct:view') ? (
          <Tabs
            activeKey={tabIndex}
            // defaultActiveKey={tabIndex}
            onChange={this.changeTabIndex}
            tabBarStyle={{ marginBottom: 40 }}
          >
            {permission.includes('chuangrong:homeStoreProduct:onSale') ? (
              <TabPane tab="在架" key="1">
                <PageHeaderWrapper renderBtn={this.renderBtn}>
                  <Card bordered={false}>
                    <FilterIpts
                      getList={this.getList}
                      pageSize={pageSize}
                      getRef1={value => {
                        this.state.ref1 = value;
                      }}
                    />
                    <StandardTable {...values} />
                  </Card>
                </PageHeaderWrapper>
              </TabPane>
            ) : null}
            {permission.includes('chuangrong:homeStoreProduct:list') ? (
              <TabPane tab="产品库" key="2">
                <PageHeaderWrapper renderBtn={this.renderBtn}>
                  <Card bordered={false}>
                    <FilterIpts
                      getList={this.getList}
                      pageSize={pageSize}
                      isShowShow
                      getRef2={value => {
                        this.state.ref2 = value;
                      }}
                    />
                    <StandardTable {...values} />
                  </Card>
                </PageHeaderWrapper>
              </TabPane>
            ) : null}
          </Tabs>
        ) : null}
      </Fragment>
    );
  }
}

export default template;
