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
  }
  , {
        label: '车位出售分摊比例',
        value: 'apportionmentRatio',
      }
  , {
        label: '转让服务费',
        value: 'transferServiceFee',
      }
  , {
        label: '回购服务费',
        value: 'buybackServiceFee',
      }
  , {
        label: '保障服务车位单价',
        value: 'securityPrice',
      }
  , {
        label: '保障服务开启开关',
        value: 'securityStatus',
      }
  , {
        label: '创建人ID',
        value: 'createBy',
      }
  , {
        label: '修改人ID',
        value: 'updateBy',
      }
  , {
        label: '创建时间',
        value: 'createTime',
      }
  , {
        label: '最后修改时间',
        value: 'updateTime',
      }
];
const defcolumns = [{
    title: '序号',
    dataIndex: 'key',
  }, {
        title: '车位出售分摊比例',
        dataIndex: 'apportionmentRatio',
      }
  ,{
        title: '转让服务费',
        dataIndex: 'transferServiceFee',
      }
  , {
        title: '回购服务费',
        dataIndex: 'buybackServiceFee',
      }
  , {
        title: '保障服务车位单价',
        dataIndex: 'securityPrice',
      }
  , {
        title: '保障服务开启开关',
        dataIndex: 'securityStatus',
        render:(record,row)=>{
          if(row.securityStatus == 0){
            return '关闭'
          }
          if(row.securityStatus == 1){
            return '开启'
          }
        }
      }
  , {
        title: '创建人ID',
        dataIndex: 'createBy',
      }
  , {
        title: '修改人ID',
        dataIndex: 'updateBy',
      }
  , {
        title: '创建时间',
        dataIndex: 'createTime',
      }
  , {
        title: '最后修改时间',
        dataIndex: 'updateTime',
      }
];

@permission

@connect(({ systemConfigLogManage, loading }) => ({
  systemConfigLogManage,
  loading: loading.effects['systemConfigLogManage/fetchList'] || loading.effects['systemConfigLogManage/getModifyInfo'],
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
          ,'id'
          ,'balanceWarn'
          ,'balanceWarnPhone'
          ,'apportionmentRatio'
          ,'discountRateMin'
          ,'discountRateMax'
          ,'transferServiceFee'
          ,'buybackServiceFee'
          ,'returnDay'
          ,'extendReturnDay'
          ,'securityPrice'
          ,'securityStatus'
          ,'securityDescribe'
          ,'createBy'
          ,'updateBy'
          ,'createTime'
          ,'updateTime'
          ,'rentRate'
          ,'returnRate'
    ],
    syncColumns: [],
    staticColumns: [
      // {
      //   title: '操作',
      //   render: (record) => {
      //     const action = (
      //       <Menu>
      //           <Menu.Item onClick={() => this.modifyHandler(record.id)}>
      //           <Icon type="edit" />修改
      //           </Menu.Item>
      //           <Menu.Item onClick={() => this.deleteHandler(record.id)}>
      //           <Icon type="close" />删除
      //           </Menu.Item>
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
  getList = (currPage, pageSize) => {
    this.props.dispatch({
      type: 'systemConfigLogManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.systemConfigLogManage.searchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state
    return (
      <Fragment>
          <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{searchWholeState ? '合并' : '展开' + '详细搜索'}</Button>
          <SetColumns
                  plainOptions={plainOptions}
                  defcolumns={defcolumns}
                  initColumns={this.state.initColumns}
                  staticColumns={this.state.staticColumns}
                  syncChangeColumns={this.syncChangeColumns}
          />
        {/* <Button onClick={() => this.modifyChild.changeVisible(true)}><Icon type="plus" />添加</Button> */}
         <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading>
      </Fragment>
    )
  }

   exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue()

    dispatch({
      type: 'systemConfigLogManage/exportExcel',
      payload: formData
    });
  }
  // 修改
  modifyHandler = async (id) => {
    const res = await this.props.dispatch({
      type: 'systemConfigLogManage/getModifyInfo',
      payload: {
        id
      }
    })
    if (res && res.status === 1) {
      this.modifyChild.changeVisible(true)
    } else {
      message.error(res.statusDesc)
    }
  }
  // 删除
  async deleteHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要删除角色吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'systemConfigLogManage/deleteManage',
        payload: {
          id
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
    const { permission, systemConfigLogManage: { list } } = this.props;
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
        <Card bordered={false}>
          <FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList} getChild={this.getChild} pageSize={pageSize} />
          <StandardTable 
            {...values}
          /> 
        </Card>
      </PageHeaderWrapper>
    )
  }
}