import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message, Modal, Table } from 'antd';
import { connect } from 'dva';

import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import permission from '@/utils/PermissionWrapper';
import ModifyForm from './ModifyForm';

@permission
@connect(({ setPrize, loading }) => ({
  setPrize,
  loading: loading.effects['setPrize/fetchList'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    previewVisible: false,
    previewImg: '',
    actionType: '',
    actionId: '',
    activityId: '',
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (text, record) => {
          const { permission, dispatch } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:activityAccumPrize:list') && !record.isStart ? (
                  <Menu.Item onClick={() => this.handleEdit(record)}>
                    修改
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:activityAccumPrize:list') && !record.isStart ? (
                  <Menu.Item onClick={() => this.deleteData(record.id)}>
                    删除
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
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '档位名称',
        dataIndex: 'activityGradeName',
      },
      {
        title: '奖品名称',
        dataIndex: 'prizeName',
      },
      {
        title: '奖品类型',
        dataIndex: 'prizeTypeStr',
      },
      {
        title: '图片',
        dataIndex: 'prizeImg',
        render: (record, row) =>
          row.prizeImg ? (
            <Card
              hoverable
              style={{ width: 100 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.prizeImg)}
              cover={<img src={row.prizeImg} />}
            />
          ) : null,
      },
      {
        title: '成本价',
        dataIndex: 'costPrice',
      },
      {
        title: '已兑换数量',
        dataIndex: 'exchangeNum',
      },
      {
        title: '排序',
        dataIndex: 'sortId',
      },
    ],
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
      type: 'setPrize/fetchList',
      payload: {
        id: this.state.activityId,
      },
    });
  };
  previewImg = url => {
    this.setState({
      previewVisible: true,
      previewImg: url,
    });
  };

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission, setPrize: {isStart} } = this.props;
    return (
      <Fragment>
        {
          permission.includes('chuangrong:activityAccumPrize:list') && !isStart &&
          <Button onClick={() => this.handleAdd()} style={{ marginRight: 20 }}><Icon type='plus' />添加</Button>
        }
        <Button onClick={() => window.location.reload()}><Icon type='reload' />刷新</Button>
      </Fragment>
    );
  };

  handleAdd = () => {
    this.setState({
      actionType: 'add',
    }, () => {
      this.modelChild.setVisible();
    });
  };

  handleEdit = data => {
    this.setState({
      actionType: 'edit',
      actionId: data.id,
    }, () => {
      this.modelChild.setVisible();
    });
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
        type: 'setPrize/deletePrize',
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

  getChild = ref => this.child = ref;

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.setState({
      activityId: id,
    });
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList();
    this.props.dispatch({
      type: 'setPrize/getPrizeSelect',
      payload: {
        activityId: id,
      },
    });
    this.props.dispatch({
      type: 'setPrize/getDefaultImage',
      payload: {},
    });
  }

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const { permission, setPrize: { list } } = this.props;
    const { currPage, pageSize, actionType, actionId, activityId } = this.state;
    const values = {
      columns: this.state.syncColumns,
      dataSource: list,
      loading: this.props.loading,
      pagination: false,
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        <Card bordered={false}>
          {
            permission.includes('chuangrong:activityAccumPrize:list') ? (
              <Table
                {...values}
              />
            ) : null
          }
        </Card>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img style={{ width: '100%' }} src={this.state.previewImg} />
        </Modal>
        <ModifyForm
          getChild={child => this.modelChild = child}
          actionType={actionType}
          actionId={actionId}
          activityId={activityId}
          getList={this.getList}
        />
      </PageHeaderWrapper>
    );
  }
}
