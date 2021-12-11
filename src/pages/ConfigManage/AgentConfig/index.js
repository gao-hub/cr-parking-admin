import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

import SetColumns from '@/components/SetColumns';

import ModifyForm from './AddModal'


const plainOptions = [{
  label: '序号',
  value: 'key'
},
{
  label: '等级',
  value: 'levelName'
},
{
  label: '认购标准',
  value: 'levelStandard'
},
{
  label: '认购优惠',
  value: 'levelDiscount'
}];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key'
  },
  {
    title: '等级',
    dataIndex: 'levelName',
    key: 'levelName',
  },
  {
    title: '认购标准',
    dataIndex: 'levelStandard',
    key: 'levelStandard'
  },
  {
    title: '认购优惠',
    dataIndex: 'levelDiscount',
    key: 'levelDiscount',
    render: (record, row) =>{
      return row.levelDiscount + '%'
    }
  },
]

@permission

@connect(({ agentconfig, loading }) => ({
  agentconfig,
  loading: loading.effects['agentconfig/fetchList'] || loading.effects['agentconfig/getModifyInfo'],
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
      'key',
      'levelName',
      'levelStandard',
      'levelDiscount',
    ],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:userleave:update') ? 
                <Menu.Item onClick={async() => {
                  const { dispatch } = this.props;
                  await dispatch({
                    type: 'agentconfig/getModifyInfo',
                    payload: {
                      id:  record.id
                    }
                  })
                  this.modifyChild.changeVisible(true, 2)
                }}>
                <Icon type="edit" />编辑
                </Menu.Item> : null
              }
              {
                permission.includes('chuangrong:userleave:delete') ? 
                <Menu.Item  onClick={()=>this.deleteData(record.id)}>
                  <Icon type="close" />删除
                </Menu.Item> : null
              }
            </Menu>
          )
          return (
            <Dropdown overlay={action} disabled={permission.includes('chuangrong:userleave:update') || permission.includes('chuangrong:userleave:delete') ? false : true}>
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
	
	//  删除数据
  deleteData = async (id) => {
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
        type: 'agentconfig/deleteData',
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
  getList = (currPage, pageSize) => {
    this.props.dispatch({
      type: 'agentconfig/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.agentconfig.searchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state
    const { permission } = this.props
    return (
      <Fragment>
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {
          permission.includes('chuangrong:userleave:add') ? <Button onClick={async() => {
            const { dispatch } = this.props; 
            await dispatch({
              type: 'agentconfig/setModifyInfo',
              payload: {}
            })
            this.modifyChild.changeVisible(true,1)
           }} style={{ marginRight: 20 }}><Icon type="plus" />新增</Button> : null
        }
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
    const { permission, agentconfig: { list } } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
				list: list.records
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
          {
            permission.includes('chuangrong:userleave:list') ? 
            <StandardTable 
              {...values}
            /> : null
          }
          <ModifyForm
            getChildData={(child) => this.modifyChild = child}
            getList = {this.getList}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}