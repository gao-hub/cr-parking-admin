import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import FilterIpts from './FilterIpts';

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '活动名称',
    dataIndex: 'activityName',
  },
  {
    title: '兑换档位数',
    dataIndex: 'gradeNum',
  },
  {
    title: '奖品总数',
    dataIndex: 'prizeTotal',
  },
  {
    title: '兑换人数',
    dataIndex: 'exchangePeople',
  },
  {
    title: '兑换次数',
    dataIndex: 'exchangeTimes',
  },
  {
    title: '状态',
    dataIndex: 'isUse',
    render: record => (record === 0 ? '已禁用' : '已启用'),
  },
  {
    title: '创建人',
    dataIndex: 'createName',
  },
  {
    title: '活动开始时间',
    dataIndex: 'startTime',
  },
  {
    title: '活动结束时间',
    dataIndex: 'endTime',
  },
  {
    title: '活动兑换截止时间',
    dataIndex: 'exchangeEndTime',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

@permission
@connect(({ activityExchange, loading }) => ({
  activityExchange,
  loading: loading.effects['activityExchange/fetchList']
    || loading.effects['activityExchange/statusChangeManage'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (text, record) => {
          const { permission, dispatch } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:activityAccumPrize:list') ? (
                  <Menu.Item onClick={() => {
                    dispatch(
                      routerRedux.push({
                        pathname: `/activity/exchange/setPrize/${record.id}`,
                      }),
                    );
                  }
                  }>
                    奖品设置
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:activityAccum:update') ? (
                  <Menu.Item onClick={() => {
                    dispatch(
                      routerRedux.push({
                        pathname: `/activity/exchange/activityInfo/${record.id}`,
                      }),
                    );
                  }
                  }>
                    修改
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:activityAccum:delete') && !record.isStart ? (
                  <Menu.Item onClick={() => this.deleteData(record.id)}>
                    删除
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:activityAccum:status') ? (
                  <Menu.Item onClick={() => this.statusChangeHandler(record)}>
                    {record.isUse == 0 ? '启用' : '禁用'}
                  </Menu.Item>
                ) : null
              }
            </Menu>
          );
          return (
            <Dropdown overlay={action}>
              <a className='ant-dropdown-link' href='#'>
                操作<Icon type='down' />
              </a>
            </Dropdown>
          );
        },
      },
    ],
    searchWholeState: false,
  };
  //   页数改变时
  onChange = (currPage) => {
    this.setState({
      currPage,
    }, () => {
      this.getList(currPage, this.state.pageSize);
    });
  };
  onShowSizeChange = (currPage, pageSize) => {
    this.setState({
      currPage,
      pageSize,
    }, () => {
      this.getList(currPage, pageSize);
    });
  };
  getList = async (currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'activityExchange/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.activityExchange.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission, dispatch } = this.props;
    return (
      <Fragment>
        {
          permission.includes('chuangrong:activityAccum:add') ? <Button onClick={() => {
            dispatch(
              routerRedux.push({
                pathname: '/activity/exchange/activityInfo/add',
              }),
            );
          }} style={{ marginRight: 20 }}><Icon type='plus' />添加</Button> : null
        }
        <Button onClick={() => window.location.reload()}><Icon type='reload' />刷新</Button>
      </Fragment>
    );
  };

  //  删除数据
  deleteData = async (id) => {
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
        type: 'activityExchange/deleteData',
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
  };

  // 改变状态
  async statusChangeHandler(record) {
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
        type: 'activityExchange/statusChangeManage',
        payload: {
          id: record.id,
          isUse: record.isUse == 0 ? 1 : 0,
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

  getChild = ref => this.child = ref;

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
    const { permission, activityExchange: { list, total } } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: (total) => ('共 ' + total + ' 条'),
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
        <Card bordered={false}>
          {
            permission.includes('chuangrong:activityAccum:list') ? (
              <>
                <FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList}
                            getChild={this.getChild} pageSize={pageSize} />
                <StandardTable
                  {...values}
                />
              </>
            ) : null
          }
        </Card>
      </PageHeaderWrapper>
    );
  }
}
