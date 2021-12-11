import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import { formatNumber } from '@/utils/utils';

import SetColumns from '@/components/SetColumns';

//   检索条件
import FilterIpts from './FilterIpts';

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '车位订单号',
    dataIndex: 'parkingOrderNo',
  },
  {
    title: '楼盘地区',
    dataIndex: 'location',
    render: (record, row) => {
      return `${row.provinceName || ''}-${row.cityName || ''}-${row.districtName || ''}`;
    },
  },
  {
    title: '楼盘名称',
    dataIndex: 'buildingName',
  },
  {
    title: '车位号',
    dataIndex: 'parkingCode',
  },
  {
    title: '持有人',
    dataIndex: 'buyerName',
  },
  {
    title: '推荐人',
    dataIndex: 'spreadsUserName',
  },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
  },
  // {
  //   title: '渠道',
  //   dataIndex: 'utmName',
  // },
  {
    title: '代销周期',
    dataIndex: 'investMonthStr',
  },
  {
    title: '到期未售违约金比例',
    dataIndex: 'interestRate',
  },
  {
    title: '到期未售违约金',
    dataIndex: 'interestFalsify',
  },
  {
    title: '车位价格',
    dataIndex: 'wholesalePriceStr',
  },
  {
    title: '代销服务费',
    dataIndex: 'serviceChargeStr',
  },
  {
    title: '履约保证金',
    dataIndex: 'bondStr',
  },
  {
    title: '购买价款',
    dataIndex: 'originalPriceStr',
  },
  {
    title: '续约状态',
    dataIndex: 'autoRenewStr',
  },
  {
    title: '状态',
    dataIndex: 'statusCaptialStr',
  },
  {
    title: '代销结束日',
    dataIndex: 'dueDate',
    render: record => (record ? moment(record).format('YYYY-MM-DD') : ''),
  },
];

@permission
@connect(({ duePlanManage, loading }) => ({
  duePlanManage,
  loading:
    loading.effects['duePlanManage/fetchList'] ||
    loading.effects['duePlanManage/statusChangeManage'],
  exportLoading: loading.effects['duePlanManage/exportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    syncColumns: [],
    staticColumns: [],
    searchWholeState: false,
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
    await this.setState({ currPage, pageSize });
    this.props.dispatch({
      type: 'duePlanManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.duePlanManage.searchInfo,
      },
    });
  };

  exportFile = () => {
    const { dispatch } = this.props;
    let formData = this.child.getFormValue();
    return dispatch({
      type: 'duePlanManage/exportFile',
      payload: formData,
    });
  };

  renderBtn = () => {
    const { permission } = this.props;
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        {permission.includes('chuangrong:parkingorderdue:export') ? (
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
        type: 'duePlanManage/statusChangeManage',
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
      duePlanManage: { list = [], numJson = {}, total },
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      footer: () => (
        <div>
          到期未售违约金：
          {numJson.falsifyAll || 0}元
        </div>
      ),
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize: pageSize,
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
        <Card bordered={false}>
          {permission.includes('chuangrong:parkingorderdue:list') ? (
            <>
              <FilterIpts
                searchWholeState={this.state.searchWholeState}
                getList={this.getList}
                getChild={this.getChild}
                pageSize={pageSize}
              />
              <StandardTable {...values} />
            </>
          ) : null}
        </Card>
      </PageHeaderWrapper>
    );
  }
}
