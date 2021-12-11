import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import { routerRedux } from 'dva/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import { formatNumber } from '@/utils/utils'

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '购买订单号',
    value: 'orderNo',
  },
  {
    label: '银行流水号',
    value: 'outOrderNo',
  },
  {
    label: '车位用途',
    value: 'useTypeStr',
  },
  {
    label: '订单类型',
    value: 'salesTypeStr',
  },
  {
    label: '用户名',
    value: 'buyerName',
  },
  {
    label: '推荐人',
    value: 'spreadsUserName'
  },
  {
    label: "推荐人角色",
    value: "spreadsRoleName"
  },
  {
    label: '一级渠道',
    value: 'parentUtmName'
  },
  // {
  //   label: '渠道',
  //   value: 'utmName'
  // },
  {
    label: '楼盘地区',
    value: 'location'
  },
  {
    label: '楼盘名称',
    value: 'buildingName',
  },
  {
    label: '购买车位数',
    value: 'orderParkingNum',
  },
  {
    label: '实际支付',
    value: 'payment',
  },
  {
    label: '支付渠道',
    value: 'paymentUtmName',
  },
  {
    label: '支付方式',
    value: 'paymentWayName',
  },
  // {
  //   label: '楼盘类型',
  //   value: 'buildingTypeStr',
  // },
  // {
  //   label: '服务类型',
  //   value: 'returnAnytimeStr',
  // },
  // {
  //   label: '服务金额',
  //   value: 'returnAnytimePrice'
  // },
  // {
  //   label: '销售顾问',
  //   value: 'consultant',
  // },
  {
    label: '状态',
    value: 'orderStatus',
  },
  {
    label: '发起时间',
    value: 'createTime',
  },
  {
    label: '完成时间',
    value: 'finishTime',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '购买订单号',
    dataIndex: 'orderNo',
  },
  {
    title: '银行流水号',
    dataIndex: 'outOrderNo',
  },
  {
    title: '车位用途',
    dataIndex: 'useTypeStr',
  },
  {
    title: '订单类型',
    dataIndex: 'salesTypeStr',
  },
  {
    title: '用户名',
    dataIndex: 'buyerName',
  },
  {
    title: '推荐人',
    dataIndex: 'spreadsUserName'
  },
  {
    title: "推荐人角色",
    dataIndex: "spreadsRoleName"
  },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName'
  },
  // {
  //   title: '渠道',
  //   dataIndex: 'utmName'
  // },
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
    title: '购买车位数',
    dataIndex: 'orderParkingNum',
  },
  {
    title: '实际支付',
    dataIndex: 'payment',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '支付渠道',
    dataIndex: 'paymentUtmName',
  },
  {
    title: '支付方式',
    dataIndex: 'paymentWayName',
  },
  // {
  //   title: '楼盘类型',
  //   dataIndex: 'buildingTypeStr'
  // },
  // {
  //   title: '楼盘类型',
  //   dataIndex: 'salesType',
  //   render: record => (record === 1 ? '包销' : record === 2 ? '销售' : ''),
  // },
  // {
  //   title: '服务类型',
  //   dataIndex: 'returnAnytimeStr',
  // },
  // {
  //   title: '服务金额',
  //   dataIndex: 'returnAnytimePrice'
  // },
  // {
  //   title: '销售顾问',
  //   dataIndex: 'consultant',
  // },
  {
    title: '状态',
    dataIndex: 'orderStatus',
    render: record => {
      switch (record) {
        case 10:
          return '待支付';
        case 11:
          return '支付成功';
        case 12:
          return '支付失败';
        case 13:
          return '交易关闭';
        case 14:
          return '已取消';
        case 15:
          return '待处理';
      }
    },
  },
  {
    title: '发起时间',
    dataIndex: 'createTime',
  },
  {
    title: '完成时间',
    dataIndex: 'finishTime',
  },
];

@permission
@connect(({ paymentOrderManage, loading }) => ({
  paymentOrderManage,
  loading:
    loading.effects['paymentOrderManage/fetchList'] ||
    loading.effects['paymentOrderManage/getModifyInfo'],
  exportLoading: loading.effects['paymentOrderManage/exportExcel'],
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
      'orderNo',
      'outOrderNo',
      'useTypeStr',
      'salesTypeStr',
      'buyerName',
      'spreadsUserName',
      'spreadsRoleName',
      'utmName',
      'location',
      'buildingName',
      'orderParkingNum',
      'payment',
      'paymentUtmName',
      'paymentWayName',
      'orderStatus',
      'createTime',
      'finishTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              <Menu.Item
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: '/order/parking/list',
                      params:{
                        orderNo:record.orderNo,
                        tabkey:record.useType === 2 || record.useType === 3 ? '2':'1'
                      },
                       // 判断进入车位订单是否是自用版tabkey
                      // search: `?orderNo=${record.orderNo}&tabkey=${record.useType === 2 || record.useType === 3 ? '1':'2'}`, 
                    })
                  );
                }}
              >
                车位订单
              </Menu.Item>
              {
                permission.includes('chuangrong:offlinepayinfo:audit') && record.orderStatus === 15 ? (
                  <Menu.Item
                    onClick={() => this.modifyHandler(record.orderNo)}
                  >
                    订单处理
                  </Menu.Item>
                ) : null
              }
            </Menu>
          );
          return permission.includes('chuangrong:payorder:info') ? (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作
                <Icon type="down" />
              </a>
            </Dropdown>
          ) : null;
        },
      },
    ],
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
    await this.setState({ currPage, pageSize })
    this.props.dispatch({
      type: 'paymentOrderManage/fetchList',
      payload: {
        currPage,
        pageSize,
        orderType: 1,
        ...this.props.paymentOrderManage.searchInfo,
      },
    });
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue()
    const { createTimeStart, createTimeEnd, finishTimeStart, finishTimeEnd } = formData;
    // 31天时间戳
    const days31 = 31 * 24 * 60 * 60 * 1000;
    // 是否选择了购买时间
    const hasCreateTime = createTimeStart && createTimeEnd;
    // 是否选择了完成时间
    const hasFinishTime = finishTimeStart && finishTimeEnd;
    // 购买时间 时间差
    const createTimeRang = new Date(createTimeEnd).getTime() - new Date(createTimeStart).getTime();
    // 完成时间 时间差
    const finishTimeRang = new Date(finishTimeEnd).getTime() - new Date(finishTimeStart).getTime();
    // 必须先选择至少一个日期区间
    if( !hasCreateTime && !hasFinishTime ){
      return message.warn("请选择导出数据的起止时间（起止时间需小于等于31天）");
    }
    // 判断购买时间是否超限
    if(createTimeRang && createTimeRang > days31){
      return message.warn("购买时间起止需小于等于31天");
    }
    // 判断完成时间是否超限
    if(finishTimeRang && finishTimeRang > days31){
      return message.warn("完成时间起止需小于等于31天");
    }
    return dispatch({
      type: 'paymentOrderManage/exportExcel',
      payload: formData
    });
  }
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {(searchWholeState ? '合并' : '展开') + '详细搜索'}
        </Button>
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {permission.includes("chuangrong:payorder:export") && <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> }
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  // 修改
  modifyHandler = async orderNo => {
    const res = await this.props.dispatch({
      type: 'paymentOrderManage/getModifyInfo',
      payload: {
        orderNo,
      },
    });
    if (res && res.status === 1) {
      this.modifyChild.changeVisible(true);
    } else {
      message.error(res.statusDesc);
    }
  };
  // 删除
  async deleteHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要删除角色吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'paymentOrderManage/deleteManage',
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
      paymentOrderManage: { list, total },
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
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
          {permission.includes('chuangrong:payorder:list') ? (
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
        <ModifyForm
          getChildData={child => (this.modifyChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
      </PageHeaderWrapper>
    );
  }
}
