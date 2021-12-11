import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import StandardTable from '@/components/StandardTable';
import { Card, Button, Icon, Menu, Dropdown, message } from 'antd';
import FilterInpts from './FilterIpts';
import AddModal from './AddModal';
import Swal from 'sweetalert2';

@permission
@connect(({ noticeMessage, loading }) => ({
  noticeMessage,
  loading: loading.effects['noticeMessage/getList'],
}))
export default class RechargeOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currPage: 1,
      pageSize: 10,
      searchWholeState: true,
      actionId: '',
      actionType: '',
      syncColumns: [],
      defcolumns: [
        { title: '序号', dataIndex: 'key', width: 80 },
        {
          title: '推送对象',
          dataIndex: 'consumerUserType',
          render: type => {
            let typeOption = { 1: '全部用户', 2: '已开户', 3: '已购买车位' };
            return <div>{typeOption[type]}</div>;
          },
        },
        {
          title: '推送位置',
          dataIndex: 'location',
          render: type => {
            let typeOption = {
              1: '首页',
              2: '我的',
            };
            return (
              <div>
                {type
                  ? type
                    .split(',')
                    .map(item => typeOption[item])
                    .join(',')
                  : ''}
              </div>
            );
          },
        },
        { title: '公告标题', dataIndex: 'title' },
        {
          title: '状态',
          dataIndex: 'status',
          render: status => {
            let statusOption = {
              1: '启用',
              0: '禁用',
            };
            return <div>{statusOption[status]}</div>;
          },
        },
        { title: '更新时间', dataIndex: 'updateTime' },
        { title: '开始时间', dataIndex: 'startTime' },
        { title: '结束时间', dataIndex: 'endTime' },
      ],
      staticColumns: [
        {
          title: '操作',
          render: record => {
            const MenuItem = Menu.Item;
            const { permission } = this.props;
            const action = (
              <Menu>
                {permission.includes('chuangrong:notice:info') && (
                  <MenuItem onClick={() => this.handleDetail(record)}>
                    <Icon type='eye' />
                    查看
                  </MenuItem>
                )}
                {permission.includes('chuangrong:notice:delete') && (
                  <MenuItem onClick={() => this.handleDelete(record)}>
                    <Icon type='close' />
                    删除
                  </MenuItem>
                )}
                {permission.includes('chuangrong:notice:update') && (
                  <MenuItem onClick={() => this.handleEdit(record)}>
                    <Icon type='edit' />
                    修改
                  </MenuItem>
                )}
              </Menu>
            );
            return (
              <Dropdown overlay={action}>
                <a className='ant-dropdown-link' href='#'>
                  操作
                  <Icon type='down' />
                </a>
              </Dropdown>
            );
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }

  getList = async (currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'noticeMessage/getList',
      payload: {
        currPage,
        pageSize,
        ...this.props.noticeMessage.searchInfo,
      },
    });
  };
  onChange = currPage => {
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(currPage, this.state.pageSize);
      },
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
      },
    );
  };
  getChild = ref => {
    this.child = ref;
  };
  handleAdd = () => {
    this.setState(
      {
        actionType: 'add',
        actionId: '',
      },
      () => {
        this.addChild.setVisible();
      },
    );
  };
  handleDetail = data => {
    this.setState(
      {
        actionType: 'detail',
        actionId: data.id,
      },
      () => {
        this.addChild.setVisible();
      },
    );
  };
  handleEdit = data => {
    this.setState(
      {
        actionType: 'edit',
        actionId: data.id,
      },
      () => {
        this.addChild.setVisible();
      },
    );
  };
  handleDelete = async data => {
    const confirmVal = await Swal.fire({
      text: '确定要删除吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'noticeMessage/deleteNotice',
        payload: {
          id: data.id,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else message.error(res.statusDesc);
    }
  };
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:notice:add') ? (
          <Button onClick={this.handleAdd}>推送公告</Button>
        ) : null}
        <Button onClick={() => window.location.reload()}>刷新</Button>
      </Fragment>
    );
  };
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      noticeMessage: { list, total },
    } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: { list: list },
      loading: this.props.loading,
      pagination: {
        showTotal: total => `共${total}条`,
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
        {permission.includes('chuangrong:notice:list') && (
          <Card bordered={false}>
            <FilterInpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
        )}
        <AddModal
          getChild={child => (this.addChild = child)}
          actionType={this.state.actionType}
          actionId={this.state.actionId}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
      </PageHeaderWrapper>
    );
  }
}
