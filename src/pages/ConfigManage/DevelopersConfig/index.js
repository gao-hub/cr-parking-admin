import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';

const plainOptions = [{
  label: '序号',
  value: 'key',
},{
  label: '开发商名称',
  value: 'developer',
},{
  label: '对公账户',
  value: 'createBy'
},{
  label: '状态',
  value: 'openStatus',
},{
  label: '创建时间',
  value: 'createTime',
}];
const defcolumns = [{
    title: '序号',
    dataIndex: 'key',
},{
    title: '开发商名称',
    dataIndex: 'developer',
  },{
    title: '对公账户',
    dataIndex: 'account'
  },{
    title: '状态',
    dataIndex: 'openStatus',
    render: (record,rows)=>{
      if(rows.openStatus - 0 == 0){
        return '启用';
      }
      if(rows.openStatus -0 == 1) {
        return '禁用'
      }
    }
  },{
    title: '创建时间',
    dataIndex: 'createTime',
  }
];

@permission

@connect(({ developersManage, loading }) => ({
  developersManage,
  loading: loading.effects['developersManage/fetchList'] || loading.effects['developersManage/getModifyInfo'],
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
      ,'developer'
      ,'openStatus'
      ,'createBy'
      ,'updateBy'
      ,'createTime'
      ,'updateTime'
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const action = (
            <Menu>
                <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                <Icon type="edit" />修改
                </Menu.Item>
                <Menu.Item onClick={() => this.updateHandler(record)}>
                <Icon type="close" />{record.openStatus - 0 == 0 ? '禁用' : '启用'}
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
    await this.setState({
      currPage,
      pageSize
    })
    this.props.dispatch({
      type: 'developersManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.developersManage.searchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state
    return (
      <Fragment>
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        <Button onClick={() => this.modifyChild.changeVisible(true)}><Icon type="plus" />添加</Button>
        <Button onClick={() => window.location.reload()}><Icon type="reload" />刷新</Button>
      </Fragment>
    )
  }


  // 修改
  modifyHandler = async (id) => {
    const res = await this.props.dispatch({
      type: 'developersManage/getModifyInfo',
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
  async updateHandler(record) {
    const confirmVal = await Swal.fire({
      text: `确定要${record.openStatus - 0 == 0 ? '禁用': '启用'}吗？`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'developersManage/updateManage',
        payload: {
          id: record.id,
          openStatus: record.openStatus - 0 == 0 ? 1 : 0
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
    const { permission, developersManage: { list } } = this.props;
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