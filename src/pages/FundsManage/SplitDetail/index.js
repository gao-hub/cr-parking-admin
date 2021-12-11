import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, DatePicker } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading'

import SetColumns from '@/components/SetColumns';

//   检索条件
import FilterIpts from './FilterIpts';

const { RangePicker } = DatePicker;

const plainOptions = [{
    label: '序号',
    value: 'key'
  },{
    label: '订单号',
    value: 'orderNo',
  },{
    label: '银行流水号',
    value: 'tlOrderNo',
  }, {
    label: '开发商',
    value: 'developerName',
  },{
    label: '对公账户',
    value: 'developerAccount',
  },{
    label: '订单金额',
    value: 'orderAmount',
  }, {
    label: '分账金额',
    value: 'splitAmount',
  },{
    label: '备付金余额',
    value: 'provisionBalance',
  },{
    label: '交易状态',
    value: 'tradeStatus',
  },{
    label: '创建时间',
    value: 'createTime',
  }
];
const defcolumns = [{
    title: '序号',
    dataIndex: 'key',
  }, {
        title: '订单号',
        dataIndex: 'orderNo',
      }
  , {
        title: '银行流水号',
        dataIndex: 'tlOrderNo',
      }
  , {
        title: '开发商',
        dataIndex: 'developerName',
      }
  , {
        title: '对公账户',
        dataIndex: 'developerAccount',
      }
  , {
        title: '订单金额',
        dataIndex: 'orderAmount',
      }
  , {
        title: '分账金额',
        dataIndex: 'splitAmount',
      }
  , {
        title: '备付金余额',
        dataIndex: 'provisionBalance',
      }
  , {
        title: '交易状态',
        dataIndex: 'tradeStatus',
        render: (record,row)=>{
          if(row - 0 == 0){
            return '初始化';
          }
          if(row - 0 == 1) {
            return '成功'
          }
          if(row - 0 == 2) {
            return '失败'
          }
        }
      }
  , {
    title: '操作时间',
    dataIndex: 'createTime',
  }
];

@permission

@connect(({ splitDetailManage, loading }) => ({
  splitDetailManage,
  loading: loading.effects['splitDetailManage/fetchList'] || loading.effects['splitDetailManage/getModifyInfo'],
  exportLoading: loading.effects['orderManage/exportExcel']
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
      ,'orderNo'
      ,'tlOrderNo'
      ,'developerName'
      ,'developerAccount'
      ,'orderAmount'
      ,'splitAmount'
      ,'provisionBalance'
      ,'tradeStatus'
      ,'createTime'
    ],
    syncColumns: [],
    staticColumns: [
      // {
      //   title: '操作',
      //   render: (record) => {
      //     const action = (
      //       <Menu>
      //         <Menu.Item onClick={()=>this.asyncData(record.id)}>
			// 					同步
			// 				</Menu.Item>
      //       </Menu>
      //     )
      //     return (
      //       <Dropdown overlay={action}>
      //           <a className="ant-dropdown-link" href="#">
      //               操作<Icon type="down" />
      //           </a>
      //       </Dropdown>
      //     )
      //   }
      // }
    ],
    searchWholeState: true,
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
        type: 'merchantAccountManage/asyncData',
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
    console.log(this.props.splitDetailManage)
    this.props.dispatch({
      type: 'splitDetailManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.splitDetailManage.searchInfo
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

   exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue()

    dispatch({
      type: 'splitDetailManage/exportExcel',
      payload: formData
    });
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
    const { permission, splitDetailManage: { list } } = this.props;
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
          permission.includes('chuangrong:splitDetail:view') ?
          <Card bordered={false}>
            <FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList} getChild={this.getChild} pageSize={pageSize} />
            {
              permission.includes('chuangrong:splitDetail:list') ?
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
