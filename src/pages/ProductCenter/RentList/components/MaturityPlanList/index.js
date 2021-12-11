import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import moment from 'moment'

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading'
import { formatNumber } from '@/utils/utils'

import SetColumns from '@/components/SetColumns';

//   检索条件
import PlanFilterIpts from '../../PlanFilterIpts';
import { routerRedux } from 'dva/router';

const plainOptions = [{
  label: '序号',
  value: 'key'
}
  , {
    label: '续约编号',
    value: 'renewNo',
  }
  , {
  label: '车位订单号',
  value: 'parkingOrderNo',
}
  , {
  label: '楼盘地区',
  value: 'buildingArea',
}
  , {
  label: '楼盘名称',
  value: 'buildingName',
}
  , {
  label: '车位号',
  value: 'parkingCode',
}
  , {
  label: '当前持有人',
  value: 'buyerName',
}
  , {
  label: '购买价款',
  value: 'originalPrice',
}
  , {
  label: '已收租金',
  value: 'sumRent',
}
  , {
  label: '当期租期',
  value: 'rentDate',
}
  , {
  label: '当期租金',
  value: 'rent',
}
, {
  label: '状态',
  value: 'status'
}
  , {
    label: '续约状态',
    value: 'autoRenew',
  }
  , {
  label: '委托结束日',
  value: 'dueDate',
}
  , {
  label: '应付时间',
  value: 'copingTime',
}
];
const defcolumns = [{
  title: '序号',
  dataIndex: 'key'
}
  , {
    title: '续约编号',
    dataIndex: 'renewNo',
  }
  , {
  title: '车位订单号',
  dataIndex: 'parkingOrderNo',
}
  , {
  title: '楼盘地区',
  dataIndex: 'buildingArea'
}
  , {
  title: '楼盘名称',
  dataIndex: 'buildingName',
}
  , {
  title: '车位号',
  dataIndex: 'parkingCode',
}
  , {
  title: '当前持有人',
  dataIndex: 'buyerName',
}
  , {
  title: '购买价款',
  dataIndex: 'originalPrice',
  render: record => (record != null ? formatNumber(record) : 0) + '元'
}
  , {
  title: '已收租金',
  dataIndex: 'sumRent',
}
  , {
  title: '当期租期',
  dataIndex: 'rentDate',
}
  , {
  title: '当期租金',
  dataIndex: 'rent',
}
,{
  title: '状态',
  dataIndex: 'status'
}
  , {
    title: '续约状态',
    dataIndex: 'autoRenew',
  }
  , {
  title: '委托结束日',
  dataIndex: 'dueDate',
  render: record => (record ? moment(record).format('YYYY-MM-DD') : '')
}
  , {
  title: '应付时间',
  dataIndex: 'copingTime',
}
];

@permission
@connect(({ rentManage, loading }) => ({
  rentManage,
  loading: loading.effects['rentManage/fetchPlanList'] || loading.effects['rentManage/statusChangeManage'],
  exportLoading: loading.effects['rentManage/exportFile'],
}))

export default class template extends PureComponent {
  constructor(props) {
    super(props)
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    initColumns: ['key'
      , 'renewNo'
      , 'parkingOrderNo'
      , 'buildingArea'
      , 'buildingName'
      , 'parkingCode'
      , 'buyerName'
      , 'originalPrice'
      , 'sumRent'
      , 'rentDate'
      , 'rent'
      , 'status'
      , 'autoRenew'
      , 'dueDate'
      , 'copingTime'
    ],
    syncColumns: [],
    staticColumns: [],
    searchWholeState: false,
  }
  //   页数改变时
  onChange = (currPage) => {
    this.setState({
      currPage,
    }, () => {
      this.getList(currPage, this.state.pageSize)
    })
  }
  onShowSizeChange = (currPage, pageSize) => {
    this.setState({
      currPage,
      pageSize
    }, () => {
      this.getList(currPage, pageSize)
    })
  }
  getList = async(currPage, pageSize) => {
    await this.setState({ currPage, pageSize })
    this.props.dispatch({
      type: 'rentManage/fetchPlanList',
      payload: {
        currPage,
        pageSize,
        ...this.props.rentManage.planSearchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开') + '详细搜索'}</Button>
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {permission.includes('chuangrong:dueRenew:export') ? (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        ) : null}
        <Button style={{ marginBottom: '16px' }} onClick={() => window.location.reload()}><Icon type="reload" />刷新</Button>
      </Fragment>
    )
  }
  exportFile = () => {
    const { dispatch } = this.props;
    let formData = this.child.getFormValue();
    const { dueDateStart, dueDateEnd } = formData;
    // 31天时间戳
    const days = 31 * 24 * 60 * 60 * 1000 * 3;
    // 购买时间 时间差
    const time = new Date(dueDateEnd).getTime() - new Date(dueDateStart).getTime();
    // 必须先选择至少一个日期区间
    if (!dueDateStart && !dueDateEnd) {
      return message.warn('请选择委托结束时间（起止时间需小于等于3个月）');
    }
    // 判断购买时间是否超限
    if (time && time > days) {
      return message.warn('委托结束时间起止需小于等于3个月');
    }
    return dispatch({
      type: 'rentManage/exportFile',
      payload: formData,
    });
  };
  // 改变状态
  async statusChangeHandler(record) {
    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'rentManage/statusChangeManage',
        payload: {
          userId: record.userId,
          openStatus: record.openStatus == 0 ? 1 : 0
        }
      })
      if (res && res.status === 1) {
        message.success(res.statusDesc)
        this.getList(this.state.currPage, this.state.pageSize)
      } else {
        message.error(res.statusDesc)
      }
    }
  }

  getChild = ref => this.child = ref
  componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns])
    this.getList(this.state.currPage, this.state.pageSize)
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array
    })
  }

  render() {
    const { permission, rentManage: { planList, planTotal } } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list: planList,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: (total) => ('共 ' + total + ' 条'),
        current: currPage,
        pageSize: pageSize,
        total: planTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange
      },
    }
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn} hiddenBreadcrumb={true}>
        <Card bordered={false}>
          {permission.includes('chuangrong:dueRenew:list') ? (
            <>
              <PlanFilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList} getChild={this.getChild} pageSize={pageSize} />
              <StandardTable
                {...values}
              />
            </>
          ) : null}
        </Card>
      </PageHeaderWrapper>
    )
  }
}
