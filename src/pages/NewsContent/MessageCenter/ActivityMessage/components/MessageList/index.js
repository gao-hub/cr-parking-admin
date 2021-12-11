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
@connect(({ activityMessage, loading }) => ({
  activityMessage,
  loading: loading.effects['activityMessage/getMessageList'],
}))
export default class MessageList extends Component {
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
        title: '消息编号',
        dataIndex: 'msgNo',
      },
      {
        title: '推送对象',
        dataIndex: 'consumerUserTypeStr',
      },
      {
        title: '标题',
        dataIndex: 'msgTitle',
      },
      {
        title: '推送类型',
        dataIndex: 'sendTypeStr',
      },
      {
        title: '状态',
        dataIndex: 'statusStr',
        width: 100,
      },
      {
        title: '提交时间',
        dataIndex: 'updateTime',
      },
      {
        title: '推送时间',
        dataIndex: 'sendTime',
      },
    ],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const MenuItem = Menu.Item;
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:activityMessage:look') && (
                <MenuItem onClick={() => this.handleDetail(record)}>查看</MenuItem>
              )}
              {permission.includes('chuangrong:activityMessage:edit') && (
                <MenuItem onClick={() => this.handleEdit(record)}>修改</MenuItem>
              )}
              {permission.includes('chuangrong:activityMessage:delete') && (
                <MenuItem onClick={() => this.handleDelete(record)}>删除</MenuItem>
              )}
            </Menu>
          );
          const isShow =
            permission.includes('chuangrong:activityMessage:look') ||
            permission.includes('chuangrong:activityMessage:edit') ||
            permission.includes('chuangrong:activityMessage:delete');
          return (
            isShow && (
              <Dropdown overlay={action}>
                <a className="ant-dropdown-link" href="#">
                  操作
                  <Icon type="down" />
                </a>
              </Dropdown>
            )
          );
        },
      },
    ],
    templateId: '',
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
      type: 'activityMessage/getMessageList',
      payload: {
        currPage,
        pageSize,
        ...this.props.activityMessage.message.searchInfo,
      },
    });
  };

  handleDetail = data => {
    this.setState(
      {
        actionType: 'detail',
        actionId: data.id,
      },
      () => {
        this.addChild.setVisible();
      }
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
      const res = await this.props.dispatch({
        type: 'activityMessage/deleteMessage',
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

  handleAdd = () => {
    this.setState(
      {
        actionType: 'add',
        actionId: '',
      },
      () => {
        this.addChild.setVisible();
      }
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
      }
    );
  };

  getChild = ref => (this.child = ref);

  onPageChange = currPage => {
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(this.state.currPage, this.state.pageSize);
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
        this.getList(this.state.currPage, this.state.pageSize);
      }
    );
  };

  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:activityMessage:add') && (
          <Button style={{ marginBottom: '16px' }} onClick={this.handleAdd}>
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

  render() {
    const {
      permission,
      activityMessage: {
        message: { list, total },
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
          getChild={child => (this.addChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
          actionId={this.state.actionId}
          actionType={this.state.actionType}
        />
      </PageHeaderWrapper>
    );
  }
}
