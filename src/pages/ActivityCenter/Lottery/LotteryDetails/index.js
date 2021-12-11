import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

import SetColumns from '@/components/SetColumns';
import FilterIpts from './FilterIpts';
import ExportLoading from '@/components/ExportLoading';
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '姓名',
    dataIndex: 'truename',
  },
  {
    title: '手机号',
    dataIndex: 'userPhone',
  },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
  },
  {
    title: '类型',
    dataIndex: 'changeTypeStr',
  },
  {
    title: '已获抽奖次数',
    dataIndex: 'totalTimes',
  },
  {
    title: '当前已用次数',
    dataIndex: 'useNum',
  },
  {
    title: '剩余可用次数',
    dataIndex: 'notUseNum',
  }, {
    title: '支付订单号',
    dataIndex: 'orderNo',
    render: (record) => record?record:'--',
  }, {
    title: '实际支付金额',
    dataIndex: 'paymentStr',
  }, {
    title: '本单获得抽奖次数',
    dataIndex: 'changeNumStr',
  }, {
    title: '是否中奖',
    dataIndex: 'isWinningStr',
  }, {
    title: '抽到奖品名称',
    dataIndex: 'activityPrizeName',
  }, {
    title: '奖品类型',
    dataIndex: 'activityPrizeTypeStr',
  },
  {
    title: '时间',
    dataIndex: 'updateTime',
  }
];

@permission
@connect(({ lotteryDetails, loading }) => ({
  lotteryDetails,
  loading:
    loading.effects['lotteryDetails/fetchList'] ||
    loading.effects['lotteryDetails/getModifyInfo'],
  exportLoading: loading.effects['lotteryDetails/exportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    initColumns: [
      'key',
      'accountName',
      'accountCode',
      'availableBalance',
      'bankAccountSum',
    ],
    syncColumns: [],
    staticColumns: [],
    searchWholeState: true,
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
      type: 'lotteryDetails/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.lotteryDetails.searchInfo,
      },
    });
  };

  /**
   * 导出列表功能实现
   * */
  exportFile = () => {
    const { dispatch} = this.props;
    const formData = this.child.getFormValue();
    delete formData.createTime;
    delete formData.updateTime;
    return dispatch({
      type: 'lotteryDetails/exportFile',
      payload: formData,
    });
  }
  renderBtn = () => {
    const { permission } = this.props;
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        {/* <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开') + '详细搜索'}</Button> */}
        {/*<SetColumns*/}
        {/*  plainOptions={plainOptions}*/}
        {/*  defcolumns={defcolumns}*/}
        {/*  initColumns={this.state.initColumns}*/}
        {/*  staticColumns={this.state.staticColumns}*/}
        {/*  syncChangeColumns={this.syncChangeColumns}*/}
        {/*/>*/}
        {permission.includes('chuangrong:activityTimesChange:export') ? (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        ) : null}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  getChild = ref => (this.child = ref);
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
    const {
      permission,
      lotteryDetails: { list },
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list: list.records,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize,
        total: list.total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        {
          permission.includes('chuangrong:activityTimesChange:list') && <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
        }

      </PageHeaderWrapper>
    );
  }
}
