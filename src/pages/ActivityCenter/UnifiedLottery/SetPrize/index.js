import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message, Modal, Table } from 'antd';
import { connect } from 'dva';

import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import permission from '@/utils/PermissionWrapper';
import ModifyForm from './ModifyForm';

@permission
@connect(({ unifiedLotteryActivitySetPrize, loading }) => ({
  unifiedLotteryActivitySetPrize,
  loading: loading.effects['unifiedLotteryActivitySetPrize/fetchList'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,

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
              {permission.includes('chuangrong:activityCodePrize:update') && !record.isStart ? (
                <Menu.Item onClick={() => this.handleEdit(record)}>修改</Menu.Item>
              ) : null}
              {permission.includes('chuangrong:activityCodePrize:delete') && !record.isStart ? (
                <Menu.Item onClick={() => this.deleteData(record.id)}>删除</Menu.Item>
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
    searchWholeState: false,
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '奖品名称',
        dataIndex: 'prizeName',
      },
      {
        title: '奖品金额',
        dataIndex: 'rewardAmount',
      },
      {
        title: '发放主体',
        dataIndex: 'businessAccountIdStr',
      },
      {
        title: '已发放数量',
        dataIndex: 'exchangeNum',
      },
      {
        title: '已发放总额',
        dataIndex: 'allRewardAmount',
      },
      {
        title: '奖品数量',
        render: record => {
            
          // totalNum
         return record.numLimit === 0? '--':record.totalNum+'个'
        },
        
      },
      {
        title: '中奖限制',
        dataIndex: 'winningLimitNum',
      },
    ],
  };
  //   页数改变时
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
  getList = async (currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'unifiedLotteryActivitySetPrize/fetchList',
      payload: {
        activityId: this.state.activityId,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const {
      permission,
      unifiedLotteryActivitySetPrize: { isStart },
    } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:activityCodePrize:add') &&
          !isStart && (
            <Button onClick={() => this.handleAdd()} style={{ marginRight: 20 }}>
              <Icon type="plus" />
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

  handleAdd = () => {
    this.setState(
      {
        actionType: 'add',
      },
      () => {
        this.modelChild.setVisible();
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
        this.modelChild.setVisible();
      }
    );
  };

  //  删除数据
  deleteData = async id => {
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
        type: 'unifiedLotteryActivitySetPrize/deletePrize',
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

  getChild = ref => (this.child = ref);

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
      type: 'unifiedLotteryActivitySetPrize/getPrizeSelect',
      payload: {
        activityId: id,
      },
    });
    this.props.dispatch({
      type: 'unifiedLotteryActivitySetPrize/getDefaultImage',
      payload: {},
    });
  }

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      unifiedLotteryActivitySetPrize: { list },
    } = this.props;
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
          {permission.includes('chuangrong:activityCodePrize:list') ? <Table {...values} /> : null}
        </Card>
        <ModifyForm
          getChild={child => (this.modelChild = child)}
          actionType={actionType}
          actionId={actionId}
          activityId={activityId}
          getList={this.getList}
        />
      </PageHeaderWrapper>
    );
  }
}
