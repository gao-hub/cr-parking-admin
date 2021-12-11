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
  }, {
    label: '推送对象',
    value: 'msgTo',
  }, {
    label: '模板名称',
    value: 'tplName',
  }, {
    label: '消息标题',
    value: 'msgTitle',
  }, {
    label: '消息内容',
    value: 'msgContent',
  }, {
    label: '推送人',
    value: 'createBy',
  }, {
    label: '状态',
    value: 'openStatus',
    // 0禁用 1启用
  },{
    label: '提交时间',
    value: 'createTime',
  }, {
    label: '推送成功时间',
    value: 'updateTime',
  }
];
const defcolumns = [{
  title: '序号',
  dataIndex: 'key'
}, {
  title: '推送对象',
  dataIndex: 'msgTo',
}, {
  title: '模板名称',
  dataIndex: 'tplName',
}, {
  title: '消息标题',
  dataIndex: 'msgTitle',
}, {
  title: '消息内容',
  dataIndex: 'msgContent',
}, {
  title: '推送人',
  dataIndex: 'createBy',
}, {
  title: '状态',
  dataIndex: 'openStatus',
  // 0禁用 1启用
},{
  title: '提交时间',
  dataIndex: 'createTime',
}, {
  title: '推送成功时间',
  dataIndex: 'updateTime',
}
];

@permission

@connect(({ msgLogManage, loading }) => ({
  msgLogManage,
  loading: loading.effects['msgLogManage/fetchList'] || loading.effects['msgLogManage/getModifyInfo'],
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
          ,'msgTo'
          ,'tplId'
          ,'tplName'
          ,'msgTitle'
          ,'msgContent'
          ,'openStatus'
          ,'delFlag'
          ,'createBy'
          ,'createTime'
          ,'updateBy'
          ,'updateTime'
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
      type: 'msgLogManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.msgLogManage.searchInfo
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
        {/* <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> */}
      </Fragment>
    )
  }

   exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue()

    dispatch({
      type: 'msgLogManage/exportExcel',
      payload: formData
    });
  }
  // 修改
  modifyHandler = async (id) => {
    const res = await this.props.dispatch({
      type: 'msgLogManage/getModifyInfo',
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
        type: 'msgLogManage/deleteManage',
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
    const { permission, msgLogManage: { list } } = this.props;
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