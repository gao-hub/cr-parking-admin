import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading'

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';

const plainOptions = [{
  label: '序号',
  value: 'key'
}
  , {
  label: 'id',
  value: 'id',
}
  , {
  label: '协议id',
  value: 'protocolId',
}
  , {
  label: '协议模板名称',
  value: 'protocolName',
}
  , {
  label: '版本号',
  value: 'versionNumber',
}
  , {
  label: '操作（0.创建1.修改2.删除）',
  value: 'operation',
}
  , {
  label: '创建者',
  value: 'createBy',
}
  , {
  label: '创建时间',
  value: 'createTime',
}
  , {
  label: '更新者',
  value: 'updateBy',
}
  , {
  label: '更新时间',
  value: 'updateTime',
}
];
const defcolumns = [{
  title: '序号',
  dataIndex: 'key',
}, {
  title: '协议模板名称',
  dataIndex: 'protocolName',
}
  , {
  title: '版本号',
  dataIndex: 'versionNumber',
}
  , {
  title: '操作',
  dataIndex: 'operation',
  render: (record, row) => {
    if (row.operation - 0 == 0) {
      return '创建'
    }
    if (row.operation - 0 == 1) {
      return '修改'
    }
    if (row.operation - 0 == 2) {
      return '删除'
    }
  }
}
  , {
  title: '修改人',
  dataIndex: 'updateBy',
}
  , {
  title: '修改时间',
  dataIndex: 'updateTime',
}
];

@permission

@connect(({ protocolLogManage, loading }) => ({
  protocolLogManage,
  loading: loading.effects['protocolLogManage/fetchList'] || loading.effects['protocolLogManage/getModifyInfo'],
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
      , 'id'
      , 'protocolId'
      , 'protocolName'
      , 'versionNumber'
      , 'operation'
      , 'createBy'
      , 'createTime'
      , 'updateBy'
      , 'updateTime'
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
  getList = async(currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize
    })
    this.props.dispatch({
      type: 'protocolLogManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.protocolLogManage.searchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state
    return (
      <Fragment>
        {/* <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{searchWholeState ? '合并' : '展开' + '详细搜索'}</Button> */}
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {/* <Button onClick={() => this.modifyChild.changeVisible(true)}><Icon type="plus" />添加</Button> */}
        {/* <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> */}
      </Fragment>
    )
  }

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue()

    dispatch({
      type: 'protocolLogManage/exportExcel',
      payload: formData
    });
  }
  // 修改
  modifyHandler = async (id) => {
    const res = await this.props.dispatch({
      type: 'protocolLogManage/getModifyInfo',
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
        type: 'protocolLogManage/deleteManage',
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
    const { permission, protocolLogManage: { list, total } } = this.props;
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
          {/* <FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList} getChild={this.getChild} pageSize={pageSize} /> */}
          {
            permission.includes('chuangrong:systemconfiglog:list') ? 
            <StandardTable
              {...values}
            /> : null
          }
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