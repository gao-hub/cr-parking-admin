import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';

import SetColumns from '@/components/SetColumns';

// 操作
import OrderDetail from './operate/OrderDetail';
import Audit from './operate/Audit';
import Confirm from './operate/Confirm';
import Review from './operate/Review';
//   检索条件
import FilterIpts from './FilterIpts';
import { formatNumber, queryURL } from '@/utils/utils';
import { routerRedux } from 'dva/router';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '车位订单号',
    value: 'parkingOrderNo',
  },
  {
    label: '购买订单号',
    value: 'orderNo',
  },
  {
    label: '转让订单号',
    value: 'transferNo',
  },
  {
    label: '车位用途',
    value: 'useTypeStr',
  },
  {
    label: '代销周期',
    value: 'investMonth',
  },
  // {
  //   label: '订单类型',
  //   value: 'salesType',
  // },
  {
    label: '用户名',
    value: 'buyerName',
  },
  {
    label: '姓名',
    value: 'buyerTrueName',
  },
  {
    label: '推荐人',
    value: 'spreadsUserName',
  },
  {
    label: '推荐人角色',
    value: 'spreadsRoleName',
  },
  {
    label: '渠道',
    value: 'utmName',
  },
  ,
  {
    label: '楼盘地区',
    value: 'location',
  },
  {
    label: '楼盘名称',
    value: 'buildingName',
  },
  {
    label: '车位号',
    value: 'parkingCode',
  },
  {
    label: '购买价款',
    value: 'buyParkingPrice',
  },
  {
    label: '是否自动续约',
    value: 'autoRenew',
  },
  {
    label: '持有天数',
    value: 'holdingDays',
  },
  // {
  //   label: '服务类型',
  //   value: 'returnAnytimeStr',
  // },
  {
    label: '当前状态',
    value: 'parkingOrderStatusStr',
  },
  {
    label: '实际支付',
    value: 'payment',
  },
  {
    label: '下单时间',
    value: 'createTime',
  },
  {
    label: '付款时间',
    value: 'finishTime',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
  },
  {
    title: '所属标签',
    // dataIndex: 'tagIdDesc',
    render: record => (record != null&&Boolean(record.tagIdDesc) ? record.tagIdDesc : '--'),
  },
  {
    title: '旅游类型',
    // dataIndex: 'classify',
    render: record => (record != null&&Boolean(record.classify) ? record.classify : '--'),
  },
  {
    title: '行程天数',
    dataIndex: 'tripDays',
  },
  {
    title: '购买数量',
    dataIndex: 'orderCount',
  },
  {
    title: '用户名',
    dataIndex: 'buyerNme',
  },
  {
    title: '联系人',
    dataIndex: 'contactName',
  },
  {
    title: '联系人手机号',
    dataIndex: 'contactMobile',
  },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
  },
  // {
  //   title: '二级渠道',
  //   // dataIndex: 'utmName',
  //   render: record => (record != null&&Boolean(record.utmName) ? record.utmName : '--'),
  // },
  {
    title: '实际支付（元）',
    dataIndex: 'payment',
  },
  {
    title: '当前状态',
    dataIndex: 'orderStatusDesc',
  },
  {
    title: '退款发起人',
    // dataIndex: 'refund',
    render: record => (record != null&&Boolean(record.refund) ? record.refund : '--'),
  },
  {
    title: '退款状态',
    // dataIndex: 'review',
    render: record => (record != null&&Boolean(record.review) ? record.review : '--'),
  },
  {
    title: '退款金额',
    // dataIndex: 'refundPayment',
    render: record => (record != null&&Boolean(record.refundPayment) ? record.refundPayment : '--'),
  },
  {
    title: '购买时间',
    // dataIndex: 'finishTime',
    render: record => (record != null&&Boolean(record.finishTime) ? record.finishTime : '--'),
  },
  {
    title: '使用时间',
    // dataIndex: 'tripTime',
    render: record => (record != null&&Boolean(record.tripTime) ? record.tripTime : '--'),
  },
];

@permission
@connect(({ tripOrderManage, loading }) => ({
  tripOrderManage,
  loading:
    loading.effects['tripOrderManage/fetchList'] ||
    loading.effects['tripOrderManage/getModifyInfo'],
  exportLoading: loading.effects['orderManage/exportExcel'],
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
      'parkingOrderNo',
      'orderNo',
      'transferNo',
      'useTypeStr',
      'investMonth',
      'salesType',
      'buyerName',
      'buyerTrueName',
      'spreadsUserName',
      'spreadsRoleName',
      'utmName',
      'location',
      'buildingName',
      'parkingCode',
      'buyParkingPrice',
      'autoRenew',
      'holdingDays',
      'parkingOrderStatusStr',
      'payment',
      'createTime',
      'finishTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          let rid = record.id;
          const action = (
            <Menu>

              {
                permission.includes('chuangrong:travelOrder:info') ? (
              <Menu.Item onClick={() => {
                let modalJson= { id:rid }
                this.setState({
                isDetailShow: 1,
                  modalJson
              });}}>
                详情
              </Menu.Item>
              ) : null
              }
              {
                record.reviewType===3 &&(
                permission.includes('chuangrong:travelOrder:refund') ? (
                  <Menu.Item onClick={() => {
                    let modalJson= { id:rid }
                    this.setState({ isAuditShow: 1,
                    modalJson });}}>
                    初审
                  </Menu.Item>
                ) : null
                )
              }
              {
                record.reviewType===2 &&(
                permission.includes('chuangrong:travelOrder:review') ? (
                  <Menu.Item onClick={() => {
                    let modalJson= { id:rid }
                    this.setState({ isReviewShow: 1,
                      modalJson
                    });}}>
                    复审
                  </Menu.Item>
                ) : null
                )
              }
              {
                record.refundType===0 &&
                record.orderStatus===2 &&(
                permission.includes('chuangrong:travelOrder:updateOne') ? (
                  <Menu.Item onClick={() => {
                    let modalJson= { id:rid }
                    this.setState({ isConfirmShow: 1 ,
                      modalJson
                    });}}>
                    二次确认
                  </Menu.Item>
                ) : null
                )
              }
            </Menu>
          );
          return (
            <Dropdown
              overlay={action}
            >
              <a className="ant-dropdown-link">
                操作
                <Icon type="down" />
              </a>
            </Dropdown>
          );
        },
      },
    ],
    searchWholeState: true,
    isDetailShow: 0,
    isAuditShow: 0,
    isConfirmShow: 0,
    isReviewShow: 0,
    modalJson: {
      id: 0,
    }
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
      type: 'tripOrderManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.tripOrderManage.searchInfo,
      },
    });
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();
    const { tripTimeStart, tripTimeEnd, finishTimeStart, finishTimeEnd } = formData;
    // 31天时间戳
    const days31 = 31 * 24 * 60 * 60 * 1000;
    // 是否选择了使用时间
    const hasTripTime = tripTimeStart && tripTimeEnd;
    // 是否选择了购买时间
    const hasFinishTime = finishTimeStart && finishTimeEnd;
    // 使用时间 时间差
    const tripTimeRang = new Date(tripTimeEnd).getTime() - new Date(tripTimeStart).getTime();
    // 购买时间 时间差
    const finishTimeRang = new Date(finishTimeEnd).getTime() - new Date(finishTimeStart).getTime();
    // 必须先选择至少一个日期区间
    if (!hasTripTime && !hasFinishTime) {
      return message.warn('请选择导出数据的购买时间（购买时间需小于等于31天）');
    }
    // 判断使用时间是否超限
    if (tripTimeRang && tripTimeRang > days31) {
      return message.warn('购买时间起止需小于等于31天');
    }
    // 判断购买时间是否超限
    if (finishTimeRang && finishTimeRang > days31) {
      return message.warn('完成时间起止需小于等于31天');
    }
    // 请求导出接口
    const res = dispatch({
      type: 'tripOrderManage/exportExcel',
      payload: formData,
    });
    if (res && res.status && res.statusDesc) {
      message.error(res.statusDesc);
    }
    return res;
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {(searchWholeState ? '合并' : '展开') + '详细搜索'}
        </Button>
        {/*<SetColumns*/}
        {/*  plainOptions={plainOptions}*/}
        {/*  defcolumns={defcolumns}*/}
        {/*  initColumns={this.state.initColumns}*/}
        {/*  staticColumns={this.state.staticColumns}*/}
        {/*  syncChangeColumns={this.syncChangeColumns}*/}
        {/*/>*/}
        {permission.includes('chuangrong:travelOrder:export') && (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
            导出
          </ExportLoading>
        )}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  // 修改
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'tripOrderManage/getModifyInfo',
      payload: {
        id,
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
        type: 'tripOrderManage/deleteManage',
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
  async componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    // 如果从别的页面过来 设置查询条件后再进行查询操作
    const { orderNo } = this.props.location.query;
    setTimeout(async () => {
      if (orderNo) {
        this.child.props.form.setFieldsValue({ orderNo });
        await this.props.dispatch({
          type: 'tripOrderManage/setSearchInfo',
          payload: {
            orderNo,
          },
        });
      }
      this.getList(this.state.currPage, this.state.pageSize);
    }, 0);
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      tripOrderManage: { list, total },
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
          {permission.includes('chuangrong:travelOrder:list') ? (
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
        <OrderDetail
          isShow={this.state.isDetailShow === 1}
          infoData={this.state.modalJson}
          callback={() => {
            this.setState({ isDetailShow: 0 ,
              modalJson: {
                id: 0,
              }});
            setTimeout(() => {
              this.getList(currPage, pageSize);
            }, 1000);
          }}
        />
        <Audit
          isShow={this.state.isAuditShow === 1}
          infoData={this.state.modalJson}
          callback={() => {
            this.setState({ isAuditShow: 0,
              modalJson: {
                id: 0,
              } });
            setTimeout(() => {
              this.getList(currPage, pageSize);
            }, 1000);
          }}
        />
        <Confirm
          isShow={this.state.isConfirmShow === 1}
          infoData={this.state.modalJson}
          callback={() => {
            this.setState({ isConfirmShow: 0 ,
              modalJson: {
                id: 0,
              }});
            setTimeout(() => {
              this.getList(currPage, pageSize);
            }, 1000);
          }}
        />
        <Review
          isShow={this.state.isReviewShow === 1}
          infoData={this.state.modalJson}
          callback={() => {
            this.setState({ isReviewShow: 0,
              modalJson: {
                id: 0,
              } });
            setTimeout(() => {
              this.getList(currPage, pageSize);
            }, 1000);
          }}
        />

      </PageHeaderWrapper>
    );
  }
}
