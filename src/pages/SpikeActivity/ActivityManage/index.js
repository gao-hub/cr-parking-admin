import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, message, Menu, Dropdown } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterIpts from './FilterIpts';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import Swal from 'sweetalert2';
// 添加/修改表单
import ModifyForm from './ModifyForm';
@permission
@connect(({ commodityManagement, loading }) => ({
  commodityManagement,
  loading: loading.effects['commodityManagement/fetchList'],
}))
export default class template extends PureComponent {
  state = {
    actionType: '', // add 新增 edit 编辑
    defcolumns: [
      {
        title: '活动封面',
        dataIndex: 'activityImg',
        render: record => {
          return <img style={{ width: '50%' }} src={record} />;
        },
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
      },
      {
        title: '活动进行状态',
        dataIndex: 'isStartStr',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
      },
      {
        title: '状态',
        dataIndex: 'isUseStr',
      },
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:seckill:update') ? (
                <Menu.Item onClick={() => this.handleEdit(record)}>修改</Menu.Item>
              ) : null}
              {permission.includes('chuangrong:seckill:info') ? (
                <Menu.Item onClick={() => this.commodityHandler(record)}>商品管理</Menu.Item>
              ) : null}
              {permission.includes('chuangrong:seckill:state') ? (
                <Menu.Item onClick={() => this.handleType(record)}>
                  {record.isUse == 1 ? '禁用' : '启用'}
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:seckill:delete') ? (
                <Menu.Item onClick={() => this.handleDelete(record.id)}>删除</Menu.Item>
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

  // 商品管理
  commodityHandler = record => {
    this.props.history.push({
      pathname: `/spikeActivity/commodityManage`,
      state: {
        id: record.id,
        activityName: record.activityName,
        isStartSeckill: record.isStartSeckill,
      },
    });
  };

  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:seckill:add') && (
          <Button onClick={() => this.handleAdd()}>
            <Icon type="plus" />
            创建活动
          </Button>
        )}
        <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  // 创建活动
  handleAdd = () => {
    this.setState(
      {
        actionType: 'add',
      },
      () => {
        this.modifyChild.changeVisible(true, {});
      }
    );
  };

  // 编辑
  handleEdit = data => {
    this.setState(
      {
        actionType: 'edit',
        data,
      },
      () => {
        this.modifyChild.changeVisible(true, data);
      }
    );
  };

  // 启用禁用
  handleType = async data => {
    const confirmVal = await Swal.fire({
      text: `确定要${data.isUse == 1 ? '禁用' : '启用'}此活动吗？`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      let isUse = data.isUse === 1 ? 0 : 1;
      let res = await this.props.dispatch({
        type: 'commodityManagement/changeStatus',
        payload: {
          id: data.id,
          isUse,
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

  // 删除
  handleDelete = async id => {
    const confirmVal = await Swal.fire({
      text: '是否删除此活动？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'commodityManagement/deleteActivity',
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

  // 获取列表
  getList = (currPage, pageSize) => {
    this.setState({ currPage });
    this.props.dispatch({
      type: 'commodityManagement/fetchList',
      payload: {
        currPage,
        pageSize,
        activityType: 4,
        ...this.props.commodityManagement.searchInfo,
      },
    });
  };

  componentDidMount() {
    this.getList(this.state.currPage, this.state.pageSize);
  }

  render() {
    const {
      permission,
      commodityManagement: { commodityList, total },
    } = this.props;
    const { currPage, pageSize, actionType } = this.state;

    const values = {
      columns: this.state.defcolumns,
      data: {
        list: commodityList,
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
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        {permission.includes('chuangrong:seckill:list') ? (
          <>
            <Card bordered={false}>
              <FilterIpts getList={this.getList} pageSize={pageSize} />
              <StandardTable {...values} />
            </Card>
            <ModifyForm
              getChildData={child => (this.modifyChild = child)}
              actionType={actionType}
              getList={this.getList}
              currPage={currPage}
              pageSize={pageSize}
            />
          </>
        ) : null}
      </PageHeaderWrapper>
    );
  }
}
