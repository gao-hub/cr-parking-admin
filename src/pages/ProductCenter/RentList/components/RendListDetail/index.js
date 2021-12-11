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
import FilterIpts from '../../FilterIpts';
import { routerRedux } from 'dva/router';

const plainOptions = [{
  label: '序号',
  value: 'key'
}
  , {
  label: '车位订单号',
  value: 'orderId',
}
  , {
  label: '楼盘地区',
  value: 'location',
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
  value: 'standardPrice',
}
  , {
  label: '已收租金',
  value: 'rentSum',
}
  , {
  label: '当期租期',
  value: 'rentTime',
}
  , {
  label: '当期租金',
  value: 'rent',
}
  , {
  label: '当前产品类型',
  value: 'rentType',
} , {
  label: '状态',
  value: 'releaseStatus'
}
  , {
  label: '持有时间',
  value: 'holdTime',
}
  , {
  label: '应付时间',
  value: 'mustTime',
}
];
const defcolumns = [{
  title: '序号',
  dataIndex: 'key'
}
  , {
  title: '车位订单号',
  dataIndex: 'orderId',
}
  , {
  title: '楼盘地区',
  dataIndex: 'location',
  render: (record, row) => {
    return `${row.provinceName || ''}-${row.cityName || ''}-${row.districtName || ''}`
  }
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
  dataIndex: 'standardPrice',
  render: record => (record != null ? formatNumber(record) : 0) + '元'
}
  , {
  title: '已收租金',
  dataIndex: 'rentSum',
}
  , {
  title: '当期租期',
  dataIndex: 'rentTime',
}
  , {
  title: '当期租金',
  dataIndex: 'rent',
}
  , {
  title: '当前产品类型',
  dataIndex: 'rentType',
  render: record => record === 0 ? '无' : record === 1 ? '无忧退货' : ''
},{
  title: '状态',
  dataIndex: 'releaseStatus',
  render: (record, row) => {
    if(row.releaseStatus - 0 == 0) {
      return '发放中'
    }
    if(row.releaseStatus - 0 == 1) {
      return '退货'
    }
    if(row.releaseStatus - 0 == 2) {
      return '已售'
    }
  }
}
  , {
  title: '持有时间',
  dataIndex: 'holdTime',
}
  , {
  title: '应付时间',
  dataIndex: 'mustTime',
}
];

@permission

@connect(({ rentManage, loading }) => ({
  rentManage,
  loading: loading.effects['rentManage/fetchList'] || loading.effects['rentManage/statusChangeManage'],
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
      , 'orderId'
      , 'location'
      , 'buildingName'
      , 'parkingCode'
      , 'buyerName'
      , 'standardPrice'
      , 'rentSum'
      , 'rentTime'
      , 'rent'
      , 'rentType'
      , 'releaseStatus'
      , 'holdTime'
      , 'mustTime'
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const { permission } = this.props
          const action = (
            <Menu>
              <Menu.Item onClick={() => {
                this.props.dispatch(routerRedux.push({
                  pathname: '/product/send/list',
                  search: '?parkingId=' + record.parkingId
                }))
              }}>
                查看明细
              </Menu.Item>
            </Menu>
          )
          return (
            permission.includes('chuangrong:parkingRent:info') ? (<Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作<Icon type="down" />
              </a>
            </Dropdown>) : null
          )
        }
      }
    ],
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
      type: 'rentManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.rentManage.searchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state
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
        <Button style={{ marginBottom: '16px' }} onClick={() => window.location.reload()}><Icon type="reload" />刷新</Button>
      </Fragment>
    )
  }

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
    const { permission, rentManage: { list, total } } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: (total) => ('共 ' + total + ' 条'),
        current: currPage,
        pageSize: pageSize,
        total,
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
          {permission.includes('chuangrong:parkingRent:list') ? (
            <>
              <FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList} getChild={this.getChild} pageSize={pageSize} />
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
