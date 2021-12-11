import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import permission from '@/utils/PermissionWrapper';
import { Icon, Button, Card, Menu, Dropdown, Modal, message } from 'antd';
import FilterIpts from './FilterIpts';
import StandardTable from '@/components/StandardTable';
import AddModal from './AddModal';
import Swal from 'sweetalert2';

@permission
@connect(({ notifyPush, loading }) => ({
  notifyPush,
  loading: loading.effects['notifyPush/getCategoryList'],
}))
export default class CategoryList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    searchWholeState: true,
    previewImg: '',
    previewVisible: false,
    actionType: '',
    actionId: '',
    syncColumns: [],
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '消息类别',
        dataIndex: 'typeName',
      },
      {
        title: '图标',
        dataIndex: 'typePic',
        render: (record, row) =>
          row.typePic ? (
            <Card
              hoverable
              style={{ width: 50 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.typePic)}
              cover={<img src={row.typePic} />}
            />
          ) : null,
      },
      // {
      //   title: '排序',
      //   dataIndex: 'sortId',
      // },
      {
        title: '状态',
        dataIndex: 'openStatusStr',
      },
      {
        title: '更新人',
        dataIndex: 'updateUserName',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
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
              {permission.includes('chuangrong:msgTemplateType:status') && (
                <MenuItem onClick={() => this.setDataStatus(record)}>
                  {record.openStatus === 0 ? '启用' : '禁用'}
                </MenuItem>
              )}
              {permission.includes('chuangrong:msgTemplateType:update') && (
                <MenuItem onClick={() => this.handleEdit(record)}>修改</MenuItem>
              )}
              {permission.includes('chuangrong:msgTemplateType:delete') && (
                <MenuItem onClick={() => this.handleDelete(record)}>删除</MenuItem>
              )}
            </Menu>
          );

          return (
            <Dropdown overlay={action}>
              <a href="#" className="ant-dropdown-link">
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
      type: 'notifyPush/getCategoryList',
      payload: {
        currPage,
        pageSize,
        ...this.props.notifyPush.category.searchInfo,
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
        type: 'notifyPush/setCategoryStatus',
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
        type: 'notifyPush/deleteCategory',
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

  handleAdd = () => {
    this.setState(
      {
        actionId: '',
        actionType: 'add',
      },
      () => {
        this.addChild.setVisible();
      }
    );
  };

  handleEdit = data => {
    this.setState(
      {
        actionId: data.id,
        actionType: 'edit',
      },
      () => {
        this.addChild.setVisible();
      }
    );
  };

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
        {permission.includes('chuangrong:msgTemplateType:add') && (
          <Button onClick={this.handleAdd}>添加</Button>
        )}
        <Button style={{ marginBottom: '16px' }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  render() {
    const {
      notifyPush: {
        category: { list, total },
      },
    } = this.props;
    const { currPage, pageSize, actionType, actionId } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: { list },
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
      <Fragment>
        <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
          <AddModal
            getAddChild={child => (this.addChild = child)}
            getList={this.getList}
            currPage={currPage}
            pageSize={pageSize}
            actionId={actionId}
            actionType={actionType}
          />
          {/* 图片预览 */}
          <Modal
            visible={this.state.previewVisible}
            footer={null}
            onCancel={() => this.setState({ previewVisible: false })}
          >
            <img style={{ width: '100%' }} src={this.state.previewImg} />
          </Modal>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}
