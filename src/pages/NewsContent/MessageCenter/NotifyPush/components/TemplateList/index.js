import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';
import StandardTable from '@/components/StandardTable';
import { Card, Menu, Modal, Button, Icon, Dropdown, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterIpts from './FilterIpts';
import AddModal from './AddModal';
import Swal from 'sweetalert2';

@permission
@connect(({ notifyPush, loading }) => ({
  notifyPush,
  loading: loading.effects['notifyPush/getTemplateList'],
}))
export default class TemplateList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    searchWholeState: true,
    actionType: '',
    actionId: '',
    syncColumns: [],
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: 80,
      },
      {
        title: '模板名称',
        dataIndex: 'tplName',
      },
      {
        title: '模板标示',
        dataIndex: 'tplCode',
      },
      {
        title: '模板标题',
        dataIndex: 'tplTitle',
      },
      {
        title: '消息类别',
        dataIndex: 'tplTypeStr',
      },
      {
        title: '模板内容',
        dataIndex: 'tplContent',
      },
      {
        title: '状态',
        dataIndex: 'openStatusStr',
        width: 80,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '说明',
        dataIndex: 'tplDesc',
      },
    ],
    staticColumns: [
      {
        title: '操作',
        width: 100,
        render: record => {
          const MenuItem = Menu.Item;
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:msgTemplate:status') && (
                <MenuItem onClick={() => this.setDataStatus(record)}>
                  {record.openStatus === 1 ? '禁用' : '启用'}
                </MenuItem>
              )}
              {permission.includes('chuangrong:msgTemplate:update') && (
                <MenuItem onClick={() => this.handleEdit(record)}>修改</MenuItem>
              )}
              {permission.includes('chuangrong:msgTemplate:delete') && (
                <MenuItem onClick={() => this.handleDelete(record)}>删除</MenuItem>
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

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }

  syncChangeColumns = array => {
    this.setState({
      syncColumns: array,
    });
  };

  getList = (currPage, pageSize) => {
    this.setState({
      currPage,
      pageSize
    })
    this.props.dispatch({
      type: 'notifyPush/getTemplateList',
      payload: {
        currPage,
        pageSize,
        ...this.props.notifyPush.template.searchInfo,
      },
    });
  };

  setDataStatus = async data => {
    let title = '启用';
    if (data.openStatus === 1) {
      title = '禁用';
    }
    const confirmVal = await Swal.fire({
      title,
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });

    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'notifyPush/setTemplateStatus',
        payload: {
          id: data.id,
          openStatus: data.openStatus === 1 ? 0 : 1,
        },
      });
      if (res && res.status) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else message.error(res.statusDesc);
    }
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
        type: 'notifyPush/deleteTemplate',
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

  getChild = ref => (this.child = ref);

  onPageChange = currPage => {
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(this.state.currPage, this.state.pageSize);
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
        this.getList(this.state.currPage, this.state.pageSize);
      },
    );
  };

  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:msgTemplate:add') && (
          <Button style={{ marginBottom: '16px' }} onClick={this.handleAdd}>
            添加
          </Button>
        )}
        <Button style={{ marginBottom: '16px' }} onClick={() => window.location.reload()}>
          <Icon type='reload' />
          刷新
        </Button>
      </Fragment>
    );
  };

  render() {
    const {
      permission,
      notifyPush: {
        template: { list, total },
      },
    } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => `共${total}条`,
        current: currPage,
        pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onPageChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
        <Card bordered={false}>
          <FilterIpts getChild={this.getChild} getList={this.getList} pageSize={pageSize} />
          <StandardTable {...values} />
        </Card>
        <AddModal
          getAddChild={child => (this.addChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
          actionType={this.state.actionType}
          actionId={this.state.actionId}
        />
      </PageHeaderWrapper>
    );
  }
}
