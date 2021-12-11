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
  },{
    label: '模板名称',
    value: 'tplName',
  },{
    label: '模板标识',
    value: 'tplCode',
  }, {
    label: '模板标题',
    value: 'tplTitle',
  }, {
    label: '模板内容',
    value: 'tplContent',
  }, {
    label: '状态',
    value: 'openStatus'
  },{
    title: '更新时间',
    value: 'updateTime',
  }, {
    label: '说明',
    value: 'tplDesc',
  } 
];
const defcolumns = [{
    title: '序号',
    dataIndex: 'key',
  }, {
    title: '模板名称',
    dataIndex: 'tplName',
  },{
    title: '模板标识',
    dataIndex: 'tplCode',
  }, {
    title: '模板标题',
    dataIndex: 'tplTitle',
  }, {
    title: '模板内容',
    dataIndex: 'tplContent',
  }, {
    title: '状态',
    dataIndex: 'openStatus',
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
  },{
    title: '说明',
    dataIndex: 'tplDesc',
  }
];

@permission

@connect(({ msgTemplateManage, loading }) => ({
  msgTemplateManage,
  loading: loading.effects['msgTemplateManage/fetchList'] || loading.effects['msgTemplateManage/getModifyInfo'],
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
          ,'tplCode'
          ,'tplName'
          ,'tplTitle'
          ,'openStatus'
          ,'tplContent'
          ,'tplDesc'
          ,'delFlag'
          ,'createBy'
          ,'createTime'
          ,'updateBy'
          ,'updateTime'
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const action = (
            <Menu>
                {/* <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                <Icon type="edit" />修改
                </Menu.Item> */}
                <Menu.Item onClick={() => this.changeHandler(record.id)}>
                <Icon type="close" />启用
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
      type: 'msgTemplateManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.msgTemplateManage.searchInfo
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
      type: 'msgTemplateManage/exportExcel',
      payload: formData
    });
  }
  // 修改
  modifyHandler = async (id) => {
    const res = await this.props.dispatch({
      type: 'msgTemplateManage/getModifyInfo',
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
  async changeHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要执行此操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'msgTemplateManage/deleteManage',
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
    const { permission, msgTemplateManage: { list } } = this.props;
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