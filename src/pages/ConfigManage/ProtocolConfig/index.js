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
// import FilterIpts from './FilterIpts';

const plainOptions = [{
  label: '序号',
  value: 'key'
}, {
  label: '协议ID',
  value: 'protocolId',
}, {
  label: '协议模板名称',
  value: 'protocolName',
}, {
  label: '协议类别',
  value: 'protocolType',
}, {
  label: '启用版本',
  value: 'versionNumber',
}, {
  label: '更新时间',
  value: 'updateTime',
}
];
const defcolumns = [{
  title: '序号',
  dataIndex: 'key',
}, {
  title: '协议ID',
  dataIndex: 'protocolId',
}, {
  title: '协议模板名称',
  dataIndex: 'protocolName',
}, {
  title: '协议类别',
  dataIndex: 'protocolType',
}, {
  title: '启用版本',
  dataIndex: 'versionNumber',
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
}
];

@permission

@connect(({ protocolTemplateManage, loading }) => ({
  protocolTemplateManage,
  loading: loading.effects['protocolTemplateManage/fetchList'] || loading.effects['protocolTemplateManage/getModifyInfo'],
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
      , 'displayName'
      , 'protocolType'
      , 'versionNumber'
      , 'status'
      , 'protocolUrl'
      , 'imgUrl'
      , 'remarks'
      , 'isShow'
      , 'delFlag'
      , 'createBy'
      , 'createTime'
      , 'updateBy'
      , 'updateTime'
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:protocoltemplate:update') ? 
                <Menu.Item onClick={async () => {
                  const res = await this.props.dispatch({
                    type: 'protocolTemplateManage/getModifyInfo',
                    payload: {
                      id: record.id
                    }
                  })
                  if (res && res.status === 1) {
                    this.modifyChild.changeVisible(true, 'edit')
                  } else {
                    message.error(res.statusDesc)
                  }
                }}>
                  <Icon type="edit" />修改
                </Menu.Item> : null
              }
              {
                permission.includes('chuangrong:protocoltemplate:info') ? 
                <Menu.Item onClick={async () => {
                  await this.props.dispatch({
                    type: 'protocolTemplateManage/getModifyInfo',
                    payload: {
                      id: record.id
                    }
                  })
                  this.modifyChild.changeVisible(true, 'view')
                }}>
                  <Icon type="eye" />查看
                </Menu.Item> : null
              }
              {
                permission.includes('chuangrong:protocoltemplate:delete') ? 
                <Menu.Item onClick={() => this.deleteHandler(record.id)}>
                <Icon type="close" />删除
                </Menu.Item> : null
              }
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
    status: 'add'
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
      type: 'protocolTemplateManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.protocolTemplateManage.searchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state
    const { permission } = this.props
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
        {
          permission.includes('chuangrong:protocoltemplate:add') ? <Button onClick={async () => {
            // 清除原先的form数据
            await this.props.dispatch({
              type: 'protocolTemplateManage/setFormData',
              payload: []
            })
            this.modifyChild.changeVisible(true, 'add')
          }}><Icon type="plus" />添加协议模板</Button> : null
        }
        {/* <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> */}
      </Fragment>
    )
  }

  //  exportExcel = () => {
  //   const { dispatch, form } = this.props;
  //   let formData = this.child.getFormValue()

  //   dispatch({
  //     type: 'protocolTemplateManage/exportExcel',
  //     payload: formData
  //   });
  // }

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
        type: 'protocolTemplateManage/deleteManage',
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
    // 获取模态框中的下拉列表数据信息
    this.props.dispatch({
      type: 'protocolTemplateManage/selectlist'
    })
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array
    })
  }

  render() {
    const { permission, protocolTemplateManage: { list, total } } = this.props;
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