import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect,history } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';
import { formatNumber } from '@/utils/utils';
import { routerRedux } from 'dva/router';

const selfcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '车位订单号',
    dataIndex: 'parkingOrderNo',
  },
  {
    title: '车位类型',
    dataIndex: 'useTypeStr',
  },
  {
    title: '用户名',
    dataIndex: 'buyerName',
  },
  {
    title: '姓名',
    dataIndex: 'buyerTrueName',
  },
  // {
  //   title: '推荐人',
  //   dataIndex: 'spreadsUserName',
  // },
  // {
  //   title: '推荐人姓名',
  //   dataIndex: 'spreadsTrueName',
  // },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
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
    title: '购买价款',
    dataIndex: 'originalPrice',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  // {
  //   title: '是否自动续约',
  //   dataIndex: 'autoRenewStr'
  // },
  // {
  //   title: '持有天数',
  //   dataIndex: 'holdingDays',
  // },
  {
    title: '期望售价',
    dataIndex:'selfExpectedPriceStr',
    key:'selfExpectedPriceStr'

  },
  {
    title: '实际支付',
    dataIndex: 'payment',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '当前状态',
    dataIndex: 'parkingOrderStatusStr',
  },
  {
    title: '交割状态',
    dataIndex:'selfDeliveryStatusStr',
    key:'selfDeliveryStatusStr'
  },
  {
    title: '发送用户',
    dataIndex:'invoicePushFlagStr',
    key:'invoicePushFlagStr'
  },

  {
    title: '下单时间',
    dataIndex: 'createTime',
  },
  {
    title: '付款时间',
    dataIndex: 'finishTime',
  }
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '车位订单号',
    dataIndex: 'parkingOrderNo',
  },
  // {
  //   title: '购买订单号',
  //   dataIndex: 'orderNo',
  // },
  // {
  //   title: '转让订单号',
  //   dataIndex: 'transferNo',
  // },
  {
    title: '车位用途',
    dataIndex: 'useTypeStr',
  },
  {
    title: '代销周期',
    dataIndex: 'investMonthStr'
  },
  // {
  //   title: '订单类型',
  //   dataIndex: 'salesType',
  //   render: record => {
  //     switch (record) {
  //       case 1:
  //         return '认购';
  //       case 2:
  //         return '认购(含服务)';
  //       case 3:
  //         return '销售';
  //     }
  //   },
  // },
  {
    title: '用户名',
    dataIndex: 'buyerName',
  },
  {
    title: '姓名',
    dataIndex: 'buyerTrueName',
  },
  // {
  //   title: '推荐人',
  //   dataIndex: 'spreadsUserName',
  // },
  // {
  //   title: '推荐人姓名',
  //   dataIndex: 'spreadsTrueName',
  // },
  // {
  //   title: '推荐人角色',
  //   dataIndex: 'spreadsRoleName',
  // },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
  },
  // {
  //   title: '渠道',
  //   dataIndex: 'utmName',
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
    title: '车位号',
    dataIndex: 'parkingCode',
  },
  {
    title: '购买价款',
    dataIndex: 'originalPrice',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '是否自动续约',
    dataIndex: 'autoRenewStr'
  },
  {
    title: '持有天数',
    dataIndex: 'holdingDays',
  },
  // {
  //   title: '服务类型',
  //   dataIndex: 'returnAnytimeStr',
  // },
  {
    title: '当前状态',
    dataIndex: 'parkingOrderStatusStr',
  },
  // {
  //   title: '交割状态',
  //   dataIndex:'selfDeliveryStatusStr',
  //   key:'selfDeliveryStatusStr'
  // },
  // {
  //   title: '期望售价',
  //   dataIndex:'selfExpectedPriceStr',
  //   key:'selfExpectedPriceStr'

  // },
  {
    title: '实际支付',
    dataIndex: 'payment',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
  },
  {
    title: '付款时间',
    dataIndex: 'finishTime',
  },
];

@permission
@connect(({ parkingOrderManage, loading }) => ({
  parkingOrderManage,
  loading:
    loading.effects['parkingOrderManage/fetchList'] ||
    loading.effects['parkingOrderManage/getModifyInfo'],
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
      // 'orderNo',
      // 'transferNo',
      'useTypeStr',
      'investMonthStr',
      'salesType',
      'buyerName',
      'buyerTrueName',
      'spreadsUserName',
      'spreadsTrueName',
      // 'spreadsRoleName',
      'utmName',
      'location',
      'buildingName',
      'parkingCode',
      'buyParkingPrice',
      'autoRenewStr',
      'holdingDays',
      'parkingOrderStatusStr',
      'selfDeliveryStatusStr',
      'selfExpectedPriceStr',
      'payment',
      'createTime',
      'finishTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission,tabIndex } = this.props;
          let contractUrlList = record.contractUrlList;
          const action = (
            <Menu>
              {permission.includes('chuangrong:parkingorder:info')
                ? record.contractUrlList &&
                  record.contractUrlList.map((item, index) => (
                    <Menu.Item
                      key={index}
                      onClick={() => {
                        window.open(item.contractUrl);
                      }}
                    >
                      {item.desc}
                    </Menu.Item>
                  ))
                : null}
            </Menu>
          );
          const actionSelf = (
            <Menu>
               {permission.includes('chuangrong:parkingorder:selfUseInfo')
                ? record.contractUrlList &&
                  record.contractUrlList.map((item, index) => (
                    <Menu.Item
                      key={index}
                      onClick={() => {
                        window.open(item.contractUrl);
                      }}
                    >
                      {item.desc}
                    </Menu.Item>
                  ))
                : null}
                {
                   permission.includes('chuangrong:parkingorder:downPdf') && 
                   (record.useType === 2 || record.useType === 3) && 
                   record.parkingOrderStatus === 12 &&
                   record.contractUrlList ?
                   (
                    <Menu.Item 
                      onClick={()=>{
                        this.downloadZip(record.parkingOrderNo)
                      }}
                    >
                      下载无章协议
                    </Menu.Item>
                   ):null
                }
               {
                permission.includes('chuangrong:returnorder:return') && 
                (record.useType === 2 || record.useType === 3) &&
                record.parkingOrderStatus === 12? (
                  <Menu.Item onClick={() => {
                    this.buttonPopup(record,0)
                  }}>
                    退货
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:parkingorder:selfDelivery') && 
                (record.useType === 2 || record.useType === 3) &&
                record.parkingOrderStatus === 12 && 
                record.selfDeliveryStatus === 0 ? (
                  <Menu.Item onClick={() => {
                    this.buttonPopup(record,1)
                  }}>
                    已交割
                  </Menu.Item>
                ) : null
              }
              {
                 permission.includes('chuangrong:parkingorder:blueInvoice') &&  record.parkingOrderStatus === 12 &&  (
                //  未开票
                 record.invoiceId === null || (
                  //  已开票但未成功
                  record.invoiceStatus === 0 &&
                  record.invoiceType === 1
                 ) || (
                  //  冲红成功
                  record.invoiceStatus === 1 &&
                  record.invoiceType === 2
                 )
                  ) ? (
                  <Menu.Item 
                      onClick={()=>{this.modifyHandler(0,record)}}
                  >
                      开发票
                  </Menu.Item>
                 ):null         
              }
              {
                  permission.includes('chuangrong:parkingorder:downInvoice') &&  
                  ( record.parkingOrderStatus === 12 || 
                    record.parkingOrderStatus === 3 ||
                    record.parkingOrderStatus === 4 ) &&  (
                    // 开票成功 || 冲红成功
                    record.invoiceId  &&  record.invoiceStatus === 1
                      // 冲红失败
                    // ( record.invoiceType === 2 && record.invoiceStatus === 0) )
                  ) ? (
                    <Menu.Item 
                      onClick={()=>{this.modifyHandler(2,record)}}
                    >
                      下载
                    </Menu.Item>
                  ):null

              }
              {
                 permission.includes('chuangrong:parkingorder:redInvoice') && 
                  ( record.parkingOrderStatus === 12 || 
                    record.parkingOrderStatus === 3  || 
                    record.parkingOrderStatus === 4  )  &&  
                  (
                   // 开票成功 
                   record.invoiceId  && ( 
                    //  开票成功
                    (record.invoiceStatus === 1 && record.invoiceType === 1 )||
                      // 冲红失败
                    ( record.invoiceType === 2 && record.invoiceStatus === 0) )
                 ) ? (
                  <Menu.Item 
                    onClick={()=>{this.modifyHandler(1,record)}}
                  >
                      冲红
                  </Menu.Item>
                 ):null
              }
              
              
               
            </Menu>
          );
          return (
            <Dropdown
              overlay={tabIndex === '1'?action:actionSelf}
              // disabled={contractUrlList && contractUrlList.length ? false : true}
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
  };
  reloads = async () =>{ 
    const { dispatch } = this.props
    await dispatch({
      type: 'parkingOrderManage/setSearchInfo',
      payload: {},
    })
    console.log(this.props)

    window.location.reload()
  }
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
    const {tabIndex} = this.props
    let orderUseType = tabIndex === '1'?0:1
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'parkingOrderManage/fetchList',
      payload: {
        currPage,
        pageSize,
        orderUseType,
        ...this.props.parkingOrderManage.searchInfo,
      },
    });
  };

  exportExcel = () => {
    const { dispatch, form,tabIndex } = this.props;
    let orderUseType = tabIndex === '1'?0:1

    let formData = this.child.getFormValue();
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
    if (!hasCreateTime && !hasFinishTime) {
      return message.warn('请选择导出数据的起止时间（起止时间需小于等于31天）');
    }
    // 判断购买时间是否超限
    if (createTimeRang && createTimeRang > days31) {
      return message.warn('购买时间起止需小于等于31天');
    }
    // 判断完成时间是否超限
    if (finishTimeRang && finishTimeRang > days31) {
      return message.warn('完成时间起止需小于等于31天');
    }
    // 请求导出接口
    const res = dispatch({
      type: 'parkingOrderManage/exportExcel',
      payload: {...formData,orderUseType}
      
    });
    if (res && res.status && res.statusDesc) {
      message.error(res.statusDesc);
    }
    return res;
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission,tabIndex } = this.props;
    return (
      <div style={{ marginBottom: 16 }}>
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
        
        {((permission.includes('chuangrong:parkingorder:export') && tabIndex === '1' ) || 
         (permission.includes('chuangrong:parkingorder:selfUseExport') && tabIndex === '2' ) ) && (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
            导出
          </ExportLoading>
        )}
        <Button onClick={this.reloads}>
          <Icon type="reload" />
          刷新
        </Button>
      </div>
    );
  };

  // 开发票 下载 冲票
  modifyHandler = async (type,record) => {
    let res;
    if(record.invoiceId !== null && record.invoiceStatus === 0){
      res = await this.props.dispatch({
        type: 'parkingOrderManage/getModifyInfo',
        payload: {
          id:record.invoiceId,
        },
      });
    }
    this.modifyChild.cahngeTitle(type,record)
    this.modifyChild.changeVisible(true);
  
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
        type: 'parkingOrderManage/deleteManage',
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
  // 下载协议zip
  async downloadZip(parkingOrderNo){
    const res = await this.props.dispatch({
      type: 'parkingOrderManage/downLoadPdf',
        payload: {
          parkingOrderNo
        },
    })
    if(res && res.status === 1){
      window.open(res.statusDesc)
    }else{
      message.error(res.statusDesc);
    }
  }
  // 退货 已交割
  async buttonPopup(item,idx){
    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      if(idx === 0){
        const resreturn = await this.props.dispatch({
          type: 'parkingOrderManage/createReturn',
          payload:item
         
        });
        if (resreturn && resreturn.status === 1) {
          message.success(resreturn.statusDesc);
          this.getList(this.state.currPage, this.state.pageSize);
        } else {
          message.error(resreturn.statusDesc);
        }
      }else{
        const selfDeliveryRes = await this.props.dispatch({
          type: 'parkingOrderManage/selfDelivery',
          payload:item,
          
        });
        if (selfDeliveryRes && selfDeliveryRes.status === 1) {
          message.success(selfDeliveryRes.statusDesc);
          this.getList(this.state.currPage, this.state.pageSize);
        } else {
          message.error(selfDeliveryRes.statusDesc);
        }
      }
      
    }
  }

  getChild = ref => (this.child = ref);
  async componentDidMount() {
    const { tabIndex } = this.props
    let list = tabIndex === '2'?[...selfcolumns]:[...defcolumns];   
    this.syncChangeColumns([...list, ...this.state.staticColumns]);
    
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      parkingOrderManage: { list, total },
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
      <PageHeaderWrapper renderBtn={this.renderBtn}  hiddenBreadcrumb={true}>
        <Card bordered={false}>
              <FilterIpts
                searchWholeState={this.state.searchWholeState}
                getList={this.getList}
                getChild={this.getChild}
                pageSize={pageSize}
                tabIndex={this.props.tabIndex}
              />
              <StandardTable {...values} />        
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
