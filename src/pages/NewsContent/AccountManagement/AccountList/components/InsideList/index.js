import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';
import StandardTable from '@/components/StandardTable';
import { Card, Menu, Modal, Button, Icon, Dropdown, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterIpts from '../FilterIpts';
import AddModal from '../AddModal';
import Swal from 'sweetalert2';

@permission
@connect(({ accountManage, loading }) => ({
  accountManage,
  loading: loading.effects['accountManage/getInsideList'],
}))
export default class officialList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    searchWholeState: true,
    actionType: '',
    actionId: '',
    previewVisible: false,
    previewImg: '',
    syncColumns: [],
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
      },
      {
        title: '头像',
        dataIndex: 'userImg',
        render: (record, row) =>
          row.userImg ? (
            <Card
              hoverable
              style={{ width: 100 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.userImg)}
              cover={<img src={row.userImg} />}
            />
          ) : null,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (record, row) => {
          const statusOption = {
            0: '禁用',
            1: '启用',
          };
          return <div>{statusOption[record]}</div>;
        },
      },
      {
        title: '创建人',
        dataIndex: 'createUserName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '账号描述',
        dataIndex: 'remark',
      },
    ],
    staticColumns: [
      {
        title: '操作',
        width: 100,
        render: (record, row) => {
          const MenuItem = Menu.Item;
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:userArtAccount:update') && (
                <MenuItem onClick={() => this.setStatus(row)}>
                  {+row.status === 1 ? '禁用' : '启用'}
                </MenuItem>
              )}
              {permission.includes('chuangrong:userArtAccount:update') && (
                <MenuItem onClick={() => this.handleEdit(row)}>修改</MenuItem>
              )}
              {permission.includes('chuangrong:userArtAccount:delete') && (
                <MenuItem onClick={() => this.handleDelete(row)}>删除</MenuItem>
              )}
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
      type: 'accountManage/getInsideList',
      payload: {
        currPage,
        pageSize,
        accountType: 2,
        ...this.props.accountManage.inside.searchInfo,
      },
    });
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
        type: 'accountManage/deleteAccount',
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

  setStatus = async data => {
    let title = '启用',
      status = 1;
    if (data.status === 1) {
      title = '禁用';
      status = 0;
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
        type: 'accountManage/setStatus',
        payload: {
          id: data.id,
          status,
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

  previewImg = url => {
    this.setState({
      previewVisible: true,
      previewImg: url,
    });
  };

  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:userArtAccount:add') && (
          <Button style={{ marginBottom: '16px' }} onClick={this.handleAdd}>
            添加
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
      accountManage: {
        inside: { list, total },
      },
      tab,
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
          {permission.includes('chuangrong:userArtAccount:list') && (
            <>
              <FilterIpts
                getChild={this.getChild}
                getList={this.getList}
                pageSize={pageSize}
                tab={tab}
              />
              <StandardTable {...values} />
            </>
          )}
        </Card>
        <AddModal
          getChild={child => (this.addChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
          id={this.state.actionId}
          actionType={this.state.actionType}
          tab={tab}
        />
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() =>
            this.setState({
              previewVisible: false,
            })
          }
        >
          <img style={{ width: '100%' }} src={this.state.previewImg} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
