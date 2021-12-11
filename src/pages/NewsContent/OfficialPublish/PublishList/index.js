import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Tabs, Icon, Menu, Dropdown, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterIpts from './FilterIpts';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import Swal from 'sweetalert2';

const { TabPane } = Tabs;
@permission
@connect(({ officialPublishList, loading }) => ({
  officialPublishList,
  loading: loading.effects['officialPublishList/fetchList'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    tabIndex: '1',
    searchWholeState: false,
    publishedColumns: [], // 已发布数据列
    releasedColumns: [], // 待发布数据列
    failColumns: [], // 未通过数据列
    // 已发布
    defPublishedCol: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '专栏',
        dataIndex: 'articleColumn',
        render: (record, row) => {
          if (record === 1) {
            return '智慧家居';
          } else if (record === 2) {
            return '智行旅途';
          } else if (record === 3) {
            return '智享车位';
          } else if (record === 4) {
            return '汽车服务';
          } else if (record === 5) {
            return '其他';
          } else if (record === 6) {
            return '健康养生';
          }
        },
      },
      {
        title: '关联类别',
        dataIndex: 'categoryName',
        render: (record, row) => {
          if (record === '' || record === null || record === undefined) {
            return '-';
          } else {
            return record;
          }
        },
      },
      {
        title: '文章标题',
        dataIndex: 'articleTitle',
      },
      {
        title: '状态',
        dataIndex: 'articleStatus',
        render: (record, row) => {
          if (record === 1) {
            return '启用';
          } else if (record === 0) {
            return '禁用';
          }
        },
      },
      {
        title: '用户昵称',
        dataIndex: 'nickName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        render: (record, row) => {
          if (record === 0) {
            return '初始';
          } else if (record === 1) {
            return '待发布';
          } else if (record === 2) {
            return '未通过';
          } else if (record === 3) {
            return '已发布';
          }
        },
      },
      {
        title: '获赞数',
        dataIndex: 'likeIt',
      },
      {
        title: '收藏数',
        dataIndex: 'collection',
      },
      {
        title: '审核人',
        dataIndex: 'auditName',
      },
      {
        title: '审核时间',
        dataIndex: 'auditTime',
      },
    ],
    // 待发布
    releasedCol: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '专栏',
        dataIndex: 'articleColumn',
        render: (record, row) => {
          if (record === 1) {
            return '智慧家居';
          } else if (record === 2) {
            return '智行旅途';
          } else if (record === 3) {
            return '智享车位';
          } else if (record === 4) {
            return '汽车服务';
          } else if (record === 5) {
            return '其他';
          } else if (record === 6) {
            return '健康养生';
          }
        },
      },
      {
        title: '关联类别',
        dataIndex: 'categoryName',
        render: (record, row) => {
          if (record === '' || record === null || record === undefined) {
            return '-';
          } else {
            return record;
          }
        },
      },
      {
        title: '文章标题',
        dataIndex: 'articleTitle',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        render: (record, row) => {
          if (record === 0) {
            return '初始';
          } else if (record === 1) {
            return '待发布';
          } else if (record === 2) {
            return '未通过';
          } else if (record === 3) {
            return '已发布';
          }
        },
      },
      {
        title: '审核人',
        dataIndex: 'auditName',
      },
      {
        title: '审核时间',
        dataIndex: 'auditTime',
      },
    ],
    // 未通过
    failsCol: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '专栏',
        dataIndex: 'articleColumn',
        render: (record, row) => {
          if (record === 1) {
            return '智慧家居';
          } else if (record === 2) {
            return '智行旅途';
          } else if (record === 3) {
            return '智享车位';
          } else if (record === 4) {
            return '汽车服务';
          } else if (record === 5) {
            return '其他';
          } else if (record === 6) {
            return '健康养生';
          }
        },
      },
      {
        title: '文章标题',
        dataIndex: 'articleTitle',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        render: (record, row) => {
          if (record === 0) {
            return '初始';
          } else if (record === 1) {
            return '待发布';
          } else if (record === 2) {
            return '未通过';
          } else if (record === 3) {
            return '已发布';
          }
        },
      },
      {
        title: '审核人',
        dataIndex: 'auditName',
      },
      {
        title: '审核时间',
        dataIndex: 'auditTime',
      },
      {
        title: '备注',
        dataIndex: 'auditRemark',
      },
    ],
    // 操作列
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:officialPublish:info') ? (
                <Menu.Item onClick={() => this.previewHandler(record, '')}>
                  <Icon type="edit" />
                  预览
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:officialPublish:audit') ? (
                <Menu.Item onClick={() => this.examineHandler(record)}>
                  <Icon type="edit" />
                  审核
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:officialPublish:delete') ? (
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
    currPage: 1,
    pageSize: 10,
  };
  // 预览
  previewHandler = async record => {
    this.props.history.push(
      `/newsContent/officialPublish/publishDetails/${record.id}/info?tabIndex=${
        this.state.tabIndex
      }`
    );
  };
  // 审核
  examineHandler = async record => {
    this.props.history.push(
      `/newsContent/officialPublish/publishDetails/${record.id}/edit?tabIndex=${
        this.state.tabIndex
      }`
    );
  };
  // 新增
  handleAdd = async () => {
    this.props.history.push(
      `/newsContent/officialPublish/publishDetails/0/edit?tabIndex=${this.state.tabIndex}`
    );
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
        type: 'officialPublishList/deleteList',
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
  // 切换tab
  callback = async index => {
    this.setState(
      {
        tabIndex: index,
      },
      async () => {
        this.child.reset();
        await this.props.dispatch({
          type: 'officialPublishList/setSearchInfo',
          payload: {},
        });
        this.getList(1, this.state.pageSize);
      }
    );
  };
  componentWillUnmount() {
    sessionStorage.removeItem('publishKey');
    this.props.dispatch({
      type: 'officialPublishList/setSearchInfo',
      payload: {},
    });
  }
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:officialPublish:add') && (
          <Button onClick={() => this.handleAdd()}>
            <Icon type="plus" />
            添加
          </Button>
        )}
        <Button
          style={{ marginBottom: 16 }}
          onClick={() => this.getList(this.state.currPage, this.state.pageSize)}
        >
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };
  // 获取列表数据
  getList = (currPage, pageSize) => {
    this.setState({ currPage, pageSize });
    let auditStatus = '';
    if (this.state.tabIndex === '1') {
      // 已发布
      auditStatus = 3;
    } else if (this.state.tabIndex === '2') {
      // 待发布
      auditStatus = 1;
    } else {
      // 未通过
      auditStatus = 2;
    }
    this.props.dispatch({
      type: 'officialPublishList/fetchList',
      payload: {
        auditStatus,
        currPage,
        pageSize,
        ...this.props.officialPublishList.searchInfo,
      },
    });
  };
  // 页数改变时
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
  // 一页加载数量改变时
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
  setPublisheListColumns = (array = []) => {
    this.setState({
      publishedColumns: array,
    });
  };
  setReleasedListColumns = (array = []) => {
    this.setState({
      releasedColumns: array,
    });
  };
  setFailListColumns = (array = []) => {
    this.setState({
      failColumns: array,
    });
  };
  componentDidMount() {
    let tabIndex = sessionStorage.getItem('publishKey') || '1';
    this.setState({ tabIndex }, () => {
      this.setPublisheListColumns([...this.state.defPublishedCol, ...this.state.staticColumns]);
      this.setReleasedListColumns([...this.state.releasedCol, ...this.state.staticColumns]);
      this.setFailListColumns([...this.state.failsCol, ...this.state.staticColumns]);
      this.getList(this.state.currPage, this.state.pageSize);
    });
  }
  render() {
    const {
      permission,
      officialPublishList: { list, total },
    } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.publishedColumns,
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
    const releasedValue = {
      columns: this.state.releasedColumns,
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
    const failValue = {
      columns: this.state.failColumns,
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
    return (
      <Fragment>
        <Tabs
          activeKey={this.state.tabIndex}
          onChange={this.callback}
          tabBarStyle={{ marginBottom: 40 }}
        >
          {permission.includes('chuangrong:officialPublish:publishedList') && (
            <TabPane tab="已发布" key="1">
              <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
                <Card bordered={false}>
                  <FilterIpts
                    searchWholeState={this.state.searchWholeState}
                    getList={this.getList}
                    getChild={ref => (this.child = ref)}
                    pageSize={pageSize}
                  />
                  <StandardTable {...values} />
                </Card>
              </PageHeaderWrapper>
            </TabPane>
          )}

          {permission.includes('chuangrong:officialPublish:releasedList') && (
            <TabPane tab="待发布" key="2">
              <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
                <Card bordered={false}>
                  <FilterIpts
                    searchWholeState={this.state.searchWholeState}
                    getList={this.getList}
                    getChild={ref => (this.child = ref)}
                    pageSize={pageSize}
                  />
                  <StandardTable {...releasedValue} />
                </Card>
              </PageHeaderWrapper>
            </TabPane>
          )}

          {permission.includes('chuangrong:officialPublish:failList') && (
            <TabPane tab="未通过" key="3">
              <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
                <Card bordered={false}>
                  <FilterIpts
                    searchWholeState={this.state.searchWholeState}
                    getList={this.getList}
                    getChild={ref => (this.child = ref)}
                    pageSize={pageSize}
                  />
                  <StandardTable {...failValue} />
                </Card>
              </PageHeaderWrapper>
            </TabPane>
          )}
        </Tabs>
      </Fragment>
    );
  }
}
