import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import Swal from 'sweetalert2';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PermissionWrapper from '@/utils/PermissionWrapper';
import { connect } from 'dva';
import { Card, Button, Icon, Menu, Dropdown, Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import ExportLoading from '@/components/ExportLoading';
import FilterIpts from './FilterIpts';
import { deleteNew, updateStatusNew } from './service';

@PermissionWrapper
@connect(({ Articlemanagement, loading }) => ({
  Articlemanagement,
  loading: loading.effects['Articlemanagement/fetchList'],
}))
class Articlemanagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currPage: 1,
      pageSize: 10,
      defcolumns: [
        {
          title: '序号',
          dataIndex: 'key',
          width: 80,
        },
        {
          title: '文章标题',
          dataIndex: 'newsTitle',
          width: 150,
        },
        {
          title: '关联产品',
          dataIndex: 'storeName',
          width: 150,
          render: record => {
            if (record) {
              return record;
            }
            return '--';
          },
        },
        {
          title: '产品编号',
          dataIndex: 'productNo',
          // width: 150,
          render: record => {
            if (record) {
              return record;
            }
            return '--';
          },
        },
        {
          title: '所属模块',
          dataIndex: 'newsType',
          // width: 150,
          render: record => {
            switch (record) {
              case 1:
                return '智慧家居';
              case 2:
                return '智慧旅游';
              default:
                return '';
            }
          },
        },
        {
          title: '置顶状态',
          dataIndex: 'newsTop',
          // width: 150,
          render: record => {
            switch (record) {
              case 0:
                return '非置顶';
              case 1:
                return '置顶';
              default:
                return '';
            }
          },
        },
        {
          title: '状态',
          dataIndex: 'newsStatus',
          // width: 150,
          render: record => {
            switch (record) {
              case 1:
                return '已启用';
              case 0:
                return '已禁用';
              default:
                return '';
            }
          },
        },
        {
          title: '更新人',
          dataIndex: 'updateName',
          // width: 150,
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          // width: 150,
        },
        {
          title: '操作',
          render: record => {
            const { permission } = this.props;
            const action = (
              <Menu>
                {permission.includes('chuangrong:homeNews:info') ? (
                  <Menu.Item
                    onClick={() => {
                      router.push({
                        pathname: '/articlemanagement/info',
                        query: {
                          id: record.id,
                        },
                      });
                    }}
                  >
                    详情
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeNews:update') ? (
                  <Menu.Item
                    onClick={() => {
                      router.push({
                        pathname: '/articlemanagement/info',
                        query: {
                          edit: true,
                          id: record.id,
                        },
                      });
                    }}
                  >
                    修改
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeNews:update') ? (
                  <Menu.Item
                    onClick={async () => {
                      const confirmVal = await Swal.fire({
                        text: '确定要执行本次操作吗？',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                      });
                      if (confirmVal.value) {
                        const { currPage, pageSize } = this.state;
                        const res = await updateStatusNew({
                          id: record.id,
                          newsStatus: record.newsStatus === 0 ? 1 : 0,
                        });
                        if (res && res.status === 1) {
                          message.success(res.statusDesc);
                          this.getList(currPage, pageSize);
                        } else {
                          message.error(res.statusDesc);
                        }
                      }
                    }}
                  >
                    {record.newsStatus === 1 ? '禁用' : '启用'}
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeNews:delete') ? (
                  <Menu.Item
                    onClick={async () => {
                      const confirmVal = await Swal.fire({
                        text: '确定要删除吗？',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                      });
                      if (confirmVal.value) {
                        const { currPage, pageSize } = this.state;
                        const res = await deleteNew({
                          id: record.id,
                        });
                        if (res && res.status === 1) {
                          message.success(res.statusDesc);
                          this.getList(currPage, pageSize);
                        } else {
                          message.error(res.statusDesc);
                        }
                      }
                    }}
                  >
                    删除
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:homeNews:update') ? (
                  <Menu.Item
                    onClick={() => {
                      Modal.confirm({
                        title: '置顶',
                        content: `是否要${record.newsTop === 1 ? '取消' : ''}置顶该篇文章吗？`,
                        okText: '确定',
                        cancelText: '取消',
                        onCancel: () => {},
                        onOk: async () => {
                          const { currPage, pageSize } = this.state;
                          const res = await updateStatusNew({
                            id: record.id,
                            newsTop: record.newsTop === 1 ? 0 : 1,
                          });
                          if (res && res.status === 1) {
                            message.success(res.statusDesc);
                            this.getList(currPage, pageSize);
                          } else {
                            message.error(res.statusDesc);
                          }
                        },
                      });
                    }}
                  >
                    {record.newsTop === 0 ? '置顶' : '取消置顶'}
                  </Menu.Item>
                ) : null}
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(
                    permission.includes('chuangrong:homeNews:update') ||
                    permission.includes('chuangrong:homeNews:delete')
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
          // width: 150,
        },
      ],
    };
  }

  componentDidMount() {
    const { currPage, pageSize } = this.state;
    this.getList(currPage, pageSize);
  }

  renderBtn = () => {
    const { permission, exportLoading, dispatch } = this.props;
    return (
      <Fragment>
        {/* {permission.includes('chuangrong:travelOrder:export') && (
          <ExportLoading exportLoading={exportLoading} exportExcel={this.exportExcel}>
            导出
          </ExportLoading>
        )} */}
        {permission.includes('chuangrong:homeNews:add') && (
          <Button
            onClick={async () => {
              await dispatch({
                type: 'Articlemanagement/setInfoData',
                payload: null,
              });
              router.push({
                pathname: '/articlemanagement/info',
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
        )}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
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

  getList = (currPage = 1, pageSize = 10) => {
    const {
      Articlemanagement: { searchInfo },
      dispatch,
    } = this.props;
    this.setState({ currPage, pageSize });
    const paraFilter = searchInfo || {};
    dispatch({
      type: 'Articlemanagement/fetchList',
      payload: {
        currPage,
        pageSize,
        ...paraFilter,
      },
    });
  };

  render() {
    const {
      permission,
      loading,
      Articlemanagement: { list, total },
    } = this.props;
    const { currPage, pageSize, defcolumns } = this.state;
    const values = {
      columns: defcolumns,
      data: {
        list,
      },
      loading,
      pagination: {
        showTotal: totalarg => `共${totalarg}条`,
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
        {permission.includes('chuangrong:homeNews:view') ? (
          <PageHeaderWrapper renderBtn={this.renderBtn}>
            <Card bordered={false}>
              {permission.includes('chuangrong:homeNews:list') ? (
                <>
                  <FilterIpts getList={this.getList} pageSize={pageSize} />
                  <StandardTable {...values} />
                </>
              ) : null}
            </Card>
          </PageHeaderWrapper>
        ) : null}
      </Fragment>
    );
  }
}

export default Articlemanagement;
