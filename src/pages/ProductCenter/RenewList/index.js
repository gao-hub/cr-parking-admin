import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import moment from 'moment'

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
  label: '编号',
  value: 'username',
}
  , {
  label: '用户名',
  value: 'truename',
}
  , {
  label: '车位号',
  value: 'idcard',
}
  , {
  label: '续约状态',
  value: 'mobile',
}
  , {
  label: '操作时间',
  value: 'bankCardNo',
}
];
const defcolumns = [{
  title: '序号',
  dataIndex: 'key'
}
  , {
  title: '编号',
  dataIndex: 'username',
}
  , {
  title: '用户名',
  dataIndex: 'truename',
}
  , {
  title: '车位号',
  dataIndex: 'idcard',
}
  , {
  title: '续约状态',
  dataIndex: 'mobile',
}
  , {
  title: '操作时间',
  dataIndex: 'bankCardNo',
}
];

@permission

@connect(({ renewManage, loading }) => ({
  renewManage,
  loading: loading.effects['renewManage/fetchList'] || loading.effects['renewManage/statusChangeManage'],
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
      , 'username'
      , 'truename'
      , 'idcard'
      , 'mobile'
      , 'bankCardNo'
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const { permission } = this.props
          const action = (
            <Menu>
              <Menu.Item onClick={() => this.statusChangeHandler(record)}>
                {record.openStatus == 0 ? '禁用' : '启用'}
              </Menu.Item>
            </Menu>
          )
          return (
            permission.includes('chuangrong:issueRecord:update') ? (
              <Dropdown overlay={action}>
                <a className="ant-dropdown-link" href="#">
                  操作<Icon type="down" />
                </a>
              </Dropdown>
            ) : null
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
      type: 'renewManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.renewManage.searchInfo
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
        <Button onClick={() => window.location.reload()}><Icon type="reload" />刷新</Button>
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
        type: 'renewManage/statusChangeManage',
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
    // this.getList(this.state.currPage, this.state.pageSize)
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array
    })
  }

  render() {
    const { permission, renewManage: { list, total } } = this.props;
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
        pageSize,
        total,
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
            permission.includes('chuangrong:issueRecord:list') ? (
              <>
                <FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList} getChild={this.getChild} pageSize={pageSize} />
                <StandardTable
                  {...values}
                />
              </>
            ) : null
          }
        </Card>
      </PageHeaderWrapper>
    )
  }
}