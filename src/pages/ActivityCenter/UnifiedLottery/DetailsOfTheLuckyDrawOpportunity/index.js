import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Tooltip } from 'antd';
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
    title: '活动名称',
    dataIndex: 'activityName',
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
  },
  {
    title: '支付订单号',
    dataIndex: 'orderNo',
    render: record => (record ? record : '--'),
  },
  {
    title: '实际支付金额',
    dataIndex: 'paymentStr',
  },
  {
    title: '本单获得抽奖次数',
    dataIndex: 'changeNumStr',
  },
  {
    title: '抽奖码',
    dataIndex: 'prizeCode',
    render: (_, record) => {
      if (record.prizeCode) {
        const codeArray = record.prizeCode.split(',');
        if (codeArray.length > 3) {
          return (
            <Tooltip title={record.prizeCode}>
              <span>
                {codeArray.slice(0, 3).join(',')}
                ...
              </span>
            </Tooltip>
          );
        }
        return record.prizeCode;
      }
      return '-';
    },
  },

  // {
  //   title: '是否开奖',
  //   dataIndex: 'isWinningStr',
  // },
  {
    title: '抽到奖品名称',
    dataIndex: 'activityPrizeName',
  },
  // {
  //   title: '奖品类型',
  //   dataIndex: 'activityPrizeTypeStr',
  // },
  {
    title: '时间',
    dataIndex: 'updateTime',
  },
];

@permission
@connect(({ DetailsOfTheLuckyDrawOpportunity, loading }) => ({
  DetailsOfTheLuckyDrawOpportunity,
  loading:
    loading.effects['DetailsOfTheLuckyDrawOpportunity/fetchList'] ||
    loading.effects['DetailsOfTheLuckyDrawOpportunity/getModifyInfo'],
  exportLoading: loading.effects['DetailsOfTheLuckyDrawOpportunity/exportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    initColumns: ['key', 'accountName', 'accountCode', 'availableBalance', 'bankAccountSum'],
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
      type: 'DetailsOfTheLuckyDrawOpportunity/fetchList',
      payload: {
        currPage,
        pageSize,
        activityType: 3,
        ...this.props.DetailsOfTheLuckyDrawOpportunity.searchInfo,
      },
    });
  };

  /**
   * 导出列表功能实现
   * */
  exportFile = () => {
    const { dispatch } = this.props;
    const formData = this.child.getFormValue();
    delete formData.createTime;
    delete formData.updateTime;
    return dispatch({
      type: 'DetailsOfTheLuckyDrawOpportunity/exportFile',
      payload: { ...formData, activityType: 3 },
    });
  };
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
        {permission.includes('chuangrong:activityCodeLuckyDetails:export') ? (
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
      DetailsOfTheLuckyDrawOpportunity: { list },
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
        {permission.includes('chuangrong:activityCodeLuckyDetails:list') && (
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
        )}
      </PageHeaderWrapper>
    );
  }
}
