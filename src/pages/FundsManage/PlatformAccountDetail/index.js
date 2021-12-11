import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading'

import SetColumns from '@/components/SetColumns';

//   检索条件
import FilterIpts from './FilterIpts';

const plainOptions = [{
  label: '序号',
  value: 'key'
}, {
  label: '订单号',
  value: 'orderNo',
},{
  label: '银行流水号',
  value: 'tlOrderNo',
},{
  label: '用户名',
  value: 'userName',
},{
  label: '楼盘名称',
  value: 'buildingName',
},{
  label: '收支类型',
  value: 'paymentType',
},{
  label: '交易类型',
  value: 'tradeType',
},{
  label: '交易方式',
  value: 'tradeWay',
},{
  label: '交易银行',
  value: 'bankId',
},{
  label: '到账金额',
  value: 'actualAmount',
},{
  label: '平台余额',
  value: 'platformBalance',
},{
  label: '状态',
  value: 'tradeStatus',
},{
  label: '操作时间',
  value: 'createTime',
}];

const defcolumns = [{
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
  },
  {
    title: '银行流水号',
    dataIndex: 'tlOrderNo',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '楼盘名称',
    dataIndex: 'buildingName',
  },
  {
    title: '收支类型',
    dataIndex: 'paymentType',
    render: (record,row)=>{
      if(row.paymentType- 0 == 0) {
        return '收入';
      }
      if(row.paymentType- 0 == 1){
        return '支出';
      }
    }
  },
  {
    title: '交易类型',
    dataIndex: 'tradeTypeStr',
  },
  {
    title: '交易方式',
    dataIndex: 'tradeWayStr',
  },
  {
    title: '交易银行',
    dataIndex: 'bankStr',
  },
  {
    title: '到账金额',
    dataIndex: 'actualAmount',
  },
  {
    title: '平台余额',
    dataIndex: 'platformBalance',
  },
  {
    title: '状态',
    dataIndex: 'tradeStatus',
    render: (record,row) => {
      if(row.tradeStatus - 0 == 0){
        return '初始化'
      }
      if(row.tradeStatus - 0 == 1) {
        return '成功'
      }
      if(row.tradeStatus - 0 == 2) {
        return '失败'
      }
    }
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
  }
];

@permission

@connect(({ platformAccountDetailManage, loading }) => ({
  platformAccountDetailManage,
  loading: loading.effects['platformAccountDetailManage/fetchList'] || loading.effects['platformAccountDetailManage/getModifyInfo'],
}))

export default class template extends PureComponent {
  constructor(props) {
    super(props)
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    initColumns: ['key',
      'orderNo',
      'tlOrderNo',
      'userName',
      'buildingName',
      'paymentType',
      'tradeTypeStr',
      'tradeWayStr',
      'bankStr',
      'actualAmount',
      'platformBalance',
      'tradeStatus',
      'createTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={()=>this.asyncData(record.id)}>
								同步
							</Menu.Item>
            </Menu>
          )
          return (
            <Dropdown overlay={action}>
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
      type: 'platformAccountDetailManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.platformAccountDetailManage.searchInfo
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

  //  同步数据
  asyncData = async (id) => {
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
        type: 'platformAccountDetailManage/asyncData',
        payload: {
          id,
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

  render() {
    const { permission, platformAccountDetailManage: { list } } = this.props;
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
          permission.includes('chuangrong:platformAccountDetail:view') ?
          <Card bordered={false}>
            <FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList} getChild={this.getChild} pageSize={pageSize} />
            {
              permission.includes('chuangrong:platformAccountDetail:list') ?
              <StandardTable
                {...values}
              /> : null
            }
          </Card> : null
        }
      </PageHeaderWrapper>
    )
  }
}
