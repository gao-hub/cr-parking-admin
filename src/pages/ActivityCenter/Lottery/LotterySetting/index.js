import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message, PageHeader } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

import ModifyForm from './AddModal';
import StockModal from './StockModal';

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
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
    render: (record, row) => {
      return row.prizeImg ? (
        <Card
          hoverable
          style={{ width: 100 }}
          bodyStyle={{ padding: 0 }}
          onClick={() => this.previewImg(row.prizeImg)}
          cover={<img src={row.prizeImg}/>}
        />
      ) : null;
    },
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
  },
  {
    title: '库存数量',
    dataIndex: 'remainingNum',
  },
  {
    title: '已发放数量',
    dataIndex: 'useNum',
  },
  {
    title: '中奖概率',
    dataIndex: 'winningProbabilityStr',
  },
  {
    title: '中奖限制',
    dataIndex: 'winningLimitNum',
    render: text => text ? `${text}次` : '--'
  },
];

@permission

@connect(({ lotterySetting, loading }) => ({
  lotterySetting,
  loading: loading.effects['lotterySetting/fetchList'],
}))

export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 40,
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (text, record) => {
          const {
            permission, dispatch,
            match: { params: { id } },
          } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:activityPrize:list')&& record.isStart!==1 ? (
                  <Menu.Item onClick={() => {
                    this.modifyChild.setState({ infoData: record, idx: null, activityId: id });
                    this.modifyChild.changeVisible(true);
                    this.modifyChild.setState({ lotteryType: record.prizeType });
                  }}>
                    编辑
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:activityPrize:list')&& record.isStart!==1 ? (
                  <Menu.Item onClick={() => this.deleteData(record.id)}>
                    删除
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:activityPrize:list') && record.isStart===1 ? (
                  <Menu.Item onClick={() => {
                    this.modifyStockChild.setState({ infoData: record, idx: null, activityId: id });
                    this.modifyStockChild.changeVisible(true);
                  }}>
                    修改库存
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:activityPrize:list')&& record.isStart!==1 ? (
                  <Menu.Item onClick={() => this.sort(record.id, 0)}>
                    <Icon type="caret-up" />上移
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:activityPrize:list')&& record.isStart!==1 ? (
                  <Menu.Item onClick={() => this.sort(record.id, 1)}>
                    <Icon type="caret-down" />下移
                  </Menu.Item>
                ) : null
              }
            </Menu>
          );
          return (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作<Icon type="down"/>
              </a>
            </Dropdown>
          );
        },
      },
    ],
    searchWholeState: false,
  };
  //   排序
  sort = async (id, direction) => {
    const { lotterySetting: { list } } = this.props;
    let ids = ''
    list.map(item => {
      ids = ids ? `${ids},${item.id}` : `${item.id}`
    })
    const res = await this.props.dispatch({
      type: 'lotterySetting/sortList',
      payload: {
        id,
        direction,
        ids
      },
    });
    if (res && res.status === 1) {
      message.success(res.statusDesc);
      this.getList(this.state.currPage, this.state.pageSize);
    } else {
      message.error(res.statusDesc);
    }
  }
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
    const {
      match: {
        params: { id },
      },
    } = this.props;
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'lotterySetting/fetchList',
      payload: {
        currPage,
        pageSize,
        activityId: id,
        ...this.props.lotterySetting.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const {
      permission,
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    return (
      <Fragment>
        {/*<Button*/}
        {/*  onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开') + '详细搜索'}</Button>*/}
        {/*<SetColumns*/}
        {/*  plainOptions={plainOptions}*/}
        {/*  defcolumns={defcolumns}*/}
        {/*  initColumns={this.state.initColumns}*/}
        {/*  staticColumns={this.state.staticColumns}*/}
        {/*  syncChangeColumns={this.syncChangeColumns}*/}
        {/*/>*/}
        {
          permission.includes('chuangrong:activityPrize:list') ? <Button
            onClick={() => {
              const { lotterySetting: { list } } = this.props;
              if( list.length >= 10 ){
                message.warning('奖品数量最多添加十个');
                return;
              }
              this.modifyChild.setState({ infoData: {}, idx: null, activityId: id });
              this.modifyChild.changeVisible(true);
            }}
            style={{ marginRight: 20 }}><Icon type="plus"/>添加</Button> : null
        }
        <Button onClick={() => window.location.reload()}><Icon type="reload"/>刷新</Button>
      </Fragment>
    );
  };

  //  删除数据
  deleteData = async (id) => {
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
        type: 'lotterySetting/deleteData',
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
        type: 'lotterySetting/statusChangeManage',
        payload: {
          userId: record.userId,
          openStatus: record.openStatus == 0 ? 1 : 0,
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
    const { permission, lotterySetting: { list, total } } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: false
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        <PageHeader title={'奖品设置'}>活动页面奖品顺序跟后台显示顺序一致，黑名单用户默认中成本价最低的奖品。</PageHeader>
        <Card bordered={false}>
          {
            permission.includes('chuangrong:activityPrize:list') ? (
              <>
                {/*<FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList}*/}
                {/*            getChild={this.getChild} pageSize={pageSize}/>*/}
                <StandardTable
                  {...values}
                />
              </>
            ) : null
          }
        </Card>
        <ModifyForm
          getList={this.getList}
          getChildData={child => (this.modifyChild = child)}
        />
        <StockModal
          getList={this.getList}
          getChildData={child => (this.modifyStockChild = child)}
        />
      </PageHeaderWrapper>
    );
  }
}
