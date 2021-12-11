import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Swal from 'sweetalert2';
import { formatNumber } from '@/utils/utils';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import ModifyForm from './ModifyForm';

//   检索条件
import FilterIpts from './FilterIpts';

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '退货订单号',
    dataIndex: 'orderNo',
  },
  {
    title: '车位订单号',
    dataIndex: 'parkingOrderNo',
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
    title: '代销周期',
    dataIndex: 'investMonth',
    render: record => (record != null ? `${record}个月` : '-'),
  },
  {
    title: '用户名',
    dataIndex: 'returnUserName',
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
    title: '提前退货违约金比例',
    dataIndex: 'rate',
    render: (record, row) =>row.rate!=null?row.rate && `${formatNumber(row.rate * 100)}%`:'-',
  },
  {
    title: '楼盘地区',
    dataIndex: 'buildingArea',
  },
  {
    title: '楼盘名称',
    dataIndex: 'buildingName',
  },
  {
    title: '车位号',
    dataIndex: 'parkingNo',
  },
  {
    title: '购买价款',
    dataIndex: 'returnParkingPrice',
    render: record => `${record != null ? formatNumber(record) : 0}元`,
  },
  {
    title: '申请退款',
    dataIndex: 'returnBuybackPrice',
    render: record => `${record != null ? formatNumber(record) : 0}元`,
  },
  // ,{
  //   title: '当期租金',
  //   dataIndex: 'returnCurrentRent',
  //   render: (record, row)=>{
  //     return row.returnCurrentRent && formatNumber(row.returnCurrentRent)
  //   }
  // }
  {
    title: '提前退货违约金',
    dataIndex: 'returnServiceFee',
    render: record => record != null && record != 0 ? `${formatNumber(record)}元` : '-',
  },
  {
    title: '到账金额',
    dataIndex: 'returnPaidIn',
    render: record => `${record != null ? formatNumber(record) : 0}元`,
  },
  // eslint-disable-next-line spaced-comment
  /*{
  title: '服务类型',
  dataIndex: 'returnAnytimeStr'
}, {
  title: '是否满一年',
  dataIndex: 'firstTime',
  render: (record, row) => {
    if(row.transferRemainingDays == 0 ) {
      return '是'
    }
    if(row.transferRemainingDays !== 0) {
      return '否'
    }
  }
}, */ {
    title: '状态',
    dataIndex: 'orderStatusStr',
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
@connect(({ buybackOrderManage, loading }) => ({
  buybackOrderManage,
  loading:
    loading.effects['buybackOrderManage/fetchList'] ||
    loading.effects['buybackOrderManage/getModifyInfo'],
    exportLoading: loading.effects['buybackOrderManage/exportFile']
}))
class template extends PureComponent {
  state = {
    currPage: this.props.buybackOrderManage.pagination.current || 1,
    pageSize: this.props.buybackOrderManage.pagination.size || 10,
    syncColumns: [],
    initColumns: [
      'key',
      'orderNo',
      'parkingOrderNo',
      'tlOrderNo',
      'returnUserName',
      'buildingArea',
      'buildingName',
      'parkingNo',
      'parkingPrice',
      'buybackPrice',
      'currentRent',
      'serviceFee',
      'paidIn',
      'productType',
      'orderStatusStr',
      'createTime',
      'updateTime',
    ],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const { orderStatus, parkingOrderNo, parkingId, id } = record; //   31-发发中，33-异常

          const action = (
            <Menu>
              <Menu.Item
                disabled={permission.includes('chuangrong:order:update') && orderStatus !== 30}
                onClick={() => {
                  this.setState(
                    {
                      staySearchInfo: true,
                    },
                    () => {
                      router.push(
                        `/buyback/buybackorder/verify?parkingOrderNo=${parkingOrderNo}&parkingId=${parkingId}&id=${id}`
                      );
                    }
                  );
                }}
              >
                <Icon type="check" />
                审核
              </Menu.Item>
              {/* <Menu.Item
                disabled={
                  permission.includes('chuangrong:returnorder:async') &&
                  (orderStatus == 31 || orderStatus == 33)
                    ? false
                    : true
                }
                onClick={() => this.asyncHandler(record)}
              >
                <Icon type="reload" /> 同步
              </Menu.Item> */}
              {permission.includes('chuangrong:order:update') &&
                (orderStatus === 31 || orderStatus === 33) && (
                  <Menu.Item onClick={() => this.asyncHandler(record)}>
                    <Icon type="reload" /> 发放
                  </Menu.Item>
                )}
            </Menu>
          );
          return (
            <Dropdown overlay={action}>
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
    staySearchInfo: false, // 保留筛选条件
    isModalShow: 0, // 连连支付密码 Modal
    modalJson: {},
  };

  componentDidMount() {
    const { staticColumns, currPage, pageSize } = this.state;

    this.syncChangeColumns([...defcolumns, ...staticColumns]);
    this.getList(currPage, pageSize);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    const { staySearchInfo } = this.state;

    if (!staySearchInfo) {
      dispatch({
        type: 'buybackOrderManage/setPagination',
        payload: {},
      });
    }
  }

  // eslint-disable-next-line no-return-assign
  getChild = ref => (this.child = ref);

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  //   页数改变时
  onChange = currPage => {
    const { dispatch } = this.props;
    const { pageSize } = this.state;

    dispatch({
      type: 'buybackOrderManage/setPagination',
      payload: {
        current: currPage,
        size: pageSize,
      },
    });
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(currPage, pageSize);
      }
    );
  };

  onShowSizeChange = (currPage, pageSize) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'buybackOrderManage/setPagination',
      payload: {
        current: currPage,
        size: pageSize,
      },
    });
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
    const { dispatch, buybackOrderManage } = this.props;

    await this.setState({
      currPage,
      pageSize,
    });
    dispatch({
      type: 'buybackOrderManage/fetchList',
      payload: {
        currPage,
        pageSize,
        orderType: 3,
        ...buybackOrderManage.searchInfo,
      },
    });
  };

  // 同步
  async asyncHandler(record) {
    this.setState({ modalJson: { id: record.id } });
    const { dispatch } = this.props;
    const { currPage, pageSize } = this.state;

    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      if (record.useType === 0) {
        const res = await dispatch({
          type: 'buybackOrderManage/asyncData',
          payload: {
            id: record.id,
          },
        });
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.getList(currPage, pageSize);
        } else {
          message.error(res.statusDesc);
        }
      } else {
        this.setState({ isModalShow: 1 });
      }
    }
  }

  exportFile = () => {
    const { dispatch} = this.props;
    const formData = this.child.getFormValue();
    delete formData.createTime;
    delete formData.updateTime;
    return dispatch({
      type: 'buybackOrderManage/exportFile',
      payload: formData,
    });
  }

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props
    return (
      <Fragment>
        <Button onClick={() => this.setState({ searchWholeState: !searchWholeState })}>
          {`${searchWholeState ? '合并' : '展开'}详细搜索`}
        </Button>
        {permission.includes("chuangrong:returnorder:export") && <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportFile}>导出</ExportLoading> }
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };


  render() {
    const {
      loading,
      permission,
      buybackOrderManage: { list },
    } = this.props;

    const {
      currPage,
      pageSize,
      syncColumns,
      searchWholeState,
      staySearchInfo,
      isModalShow,
      modalJson,
    } = this.state;

    const values = {
      columns: syncColumns,
      data: {
        list: list.records,
      },
      loading,
      pagination: {
        showTotal: total => `共 ${total} 条`,
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
        {permission.includes('chuangrong:returnorder:list') ? (
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
              staySearchInfo={staySearchInfo}
            />
            <StandardTable {...values} />
          </Card>
        ) : null}

        <ModifyForm
          isShow={isModalShow === 1}
          modalJson={modalJson}
          modalType="1"
          callback={() => {
            this.setState({ isModalShow: 0 });
            setTimeout(() => {
              this.getList(currPage, pageSize);
            }, 1000);
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default template;
