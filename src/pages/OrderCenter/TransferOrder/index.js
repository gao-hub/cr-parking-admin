import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading'

import SetColumns from '@/components/SetColumns';

import { formatNumber } from '@/utils/utils';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';

const plainOptions = [{
  label: '序号',
  value: 'key'
}, {
  label: '出让订单号',
  value: 'orderNo',
},{
  label: '车位订单号',
  value: 'parkingOrderNo',
},{
  label: '楼盘名称',
  value: 'buildingName',
},{
  label: '所在地',
  value: 'location',
}
// ,{
//   label: '开发商',
//   value: 'developerName',
// }
,{
  label: '车位号',
  value: 'parkingNo',
},{
  label: '转让价格',
  value: 'transferPrice',
},{
  label: '剩余天数',
  value: 'transferRemainingDays',
},{
  label: '服务费',
  value: 'transferServiceFee',
},{
  label: '实际到账',
  value: 'transferPaidIn',
},{
  label: '用户名',
  value: 'transferUserName',
}
// ,{
//   label: '用户角色',
//   value: 'buyerRole',
// }
,{
  label: '推荐人',
  value: 'spreadsUserName'
},{
  label: '渠道',
  value: 'utmName'
},{
  label: '是否一年',
  value: 'oneYear',
},{
  label: '状态',
  value: 'orderStatusStr',
},{
  label: '发起时间',
  value: 'createTime',
},
];
const defcolumns = [{
  title: '序号',
  dataIndex:'key',
  value: 'key'
}, {
  title: '出让订单号',
  dataIndex: 'orderNo',
}, {
  title: '车位订单号',
  dataIndex: 'parkingOrderNo',
}, {
  title: '楼盘名称',
  dataIndex: 'buildingName',
}, {
  title: '所在地',
  dataIndex: 'location',
  render: (record, row) => {
    return `${row.provinceName}-${row.cityName}-${row.districtName}`
  }
}, {
  title: '车位号',
  dataIndex: 'parkingNo',
},{
  title: '转让价格',
  dataIndex: 'transferPrice',
  render: record => (record != null ? formatNumber(record) : 0) + '元',
},{
  title: '剩余天数',
  dataIndex: 'transferRemainingDays',
}, {
  title: '服务费',
  dataIndex: 'transferServiceFee',
  render: record => (record != null ? formatNumber(record) : 0) + '元',
}, {
  title: '实际到账',
  dataIndex: 'transferPaidIn',
  render: record => (record != null ? formatNumber(record) : 0) + '元',
}, {
  title: '用户名',
  dataIndex: 'transferUserName',
},
// {
//   title: '用户角色',
//   dataIndex: 'buyerRole',
// },
{
  title: '推荐人',
  dataIndex: 'spreadsUserName'
},{
  title: '渠道',
  dataIndex: 'utmName'
},{
  title: '是否一年',
  dataIndex: 'oneYear',
  render: (record,row)=>{
    if(row.transferRemainingDays - 0 == 0){
      return '是'
    }
    if(row.transferRemainingDays - 0 !== 0){
      return '否'
    }
  }
}, {
  title: '状态',
  dataIndex: 'orderStatusStr',
}, {
  title: '发起时间',
  dataIndex: 'createTime',
}
];

@permission

@connect(({ orderManage, loading }) => ({
  orderManage,
  loading: loading.effects['orderManage/fetchList'] || loading.effects['orderManage/getModifyInfo']
}))

export default class template extends PureComponent {
  constructor(props) {
    super(props)
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    syncColumns: [],
    initColumns: [
      'key'
      ,'orderNo'
      ,'parkingOrderNo'
      ,'buildingName'
      ,'location'
      ,'developerName'
      ,'parkingNo'
      ,'transferPrice'
      ,'remainingDays'
      ,'transferServiceFee'
      ,'transferPaidIn'
      ,'transferName'
      ,'buyerRole'
      ,'oneYear'
      ,'orderStatus'
      ,'createTime'

    ],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          let contractUrlList = record.contractUrlList;
          const action = (
            <Menu>
                {/* <Menu.Item onClick={() => router.push(`/order/list/detail?parkingOrderNo=${record.parkingOrderNo}&parkingId=${record.parkingId}`)}>
                  <Icon type="edit" />详情
                </Menu.Item> */}
                {
                  record.contractUrlList && record.contractUrlList.map((item,index)=>
                  <Menu.Item key={index}
                    onClick={()=>{
                      window.open(item.contractUrl)
                    }}>
                    {item.desc}
                  </Menu.Item>)
                }
            </Menu>
          )
          return (
            <Dropdown overlay={action} disabled={contractUrlList && contractUrlList.length ? false : true}>
              <a className="ant-dropdown-link" href="#">
                操作<Icon type="down" />
              </a>
            </Dropdown>
          )
        }
      }
    ],
    searchWholeState: true,
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
    await this.setState({
      currPage,
      pageSize
    })
    this.props.dispatch({
      type: 'orderManage/fetchList',
      payload: {
        currPage,
        pageSize,
        orderType:2,
        ...this.props.orderManage.searchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state
    return (
      <Fragment>
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开') + '详细搜索'}</Button>
        {/*<SetColumns*/}
        {/*  plainOptions={plainOptions}*/}
        {/*  defcolumns={defcolumns}*/}
        {/*  initColumns={this.state.initColumns}*/}
        {/*  staticColumns={this.state.staticColumns}*/}
        {/*  syncChangeColumns={this.syncChangeColumns}*/}
        {/*/>*/}
        <Button onClick={() => window.location.reload()}><Icon type="reload" />刷新</Button>
      </Fragment>
    )
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
    const { permission, orderManage: { list } } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list: list.records,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: (total) => ('共 ' + total + ' 条'),
        current: currPage,
        pageSize,
        total: list.total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange
      },
    }
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        {
          permission.includes('chuangrong:transferorder:list') ?
          <Card bordered={false}>
            <FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList} getChild={this.getChild} pageSize={pageSize} />
            <StandardTable
              {...values}
            />
          </Card> : null
        }

        <ModifyForm
          getChildData={(child) => this.modifyChild = child}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
      </PageHeaderWrapper>
    )
  }
}
