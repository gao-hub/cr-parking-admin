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
    label: '用户名',
    value: 'userName',
  },{
    label: 'ACCP用户编号',
    value: 'accpUserno'
  },
  {
    label: '可用金额',
    value: 'availableBalance',
  },
  /*{
    label: '冻结金额',
    value: 'frozenBalance',
  }, */
  {
    label: '银行账户金额',
    value: 'bankAccountBalance',
  }
];
const defcolumns = [{
    title: '序号',
    dataIndex: 'key',
  }, {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: 'ACCP用户编号',
    dataIndex: 'accpUserno',
  },
  {
    title: '可用金额',
    dataIndex: 'availableBalance',
  },/* {
    title: '冻结金额',
    dataIndex: 'frozenBalance',
  }, */{
    title: '银行账户金额',
    dataIndex: 'bankAccountBalance',
  }
];

@permission

@connect(({ userAccountManage, loading }) => ({
  userAccountManage,
  loading: loading.effects['userAccountManage/fetchList'] || loading.effects['userAccountManage/getModifyInfo'],
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
          ,'userId'
          ,'userName'
          ,'accpUserno'
          ,'availableBalance'
          // ,'frozenBalance'
          ,'bankAccountBalance'
          ,'delFlag'
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
          const { permission } = this.props
          const available = permission.includes('chuangrong:account:async')
          return (
              <a className={available? "ant-dropdown-link" : "ant-btn-link-disabled"} onClick={() => available && this.asyncHandler(record.id)} href="#">
                更新  <Icon type="reload" />
              </a>
          );
          // const action = (
          //   <Menu>
          //       {/* <Menu.Item onClick={() => this.modifyHandler(record.id)}>
          //       <Icon type="edit" />修改
          //       </Menu.Item> */}
          //       <Menu.Item onClick={() => this.asyncHandler(record.id)}>
          //       <Icon type="redo" />更新
          //       </Menu.Item>
          //   </Menu>
          // )
          // return (
          //   <Dropdown overlay={action}>
          //       <a className="ant-dropdown-link" href="#">
          //           操作<Icon type="down" />
          //       </a>
          //   </Dropdown>
          // )
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
      type: 'userAccountManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.userAccountManage.searchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
          <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{searchWholeState ? '合并' : '展开' + '详细搜索'}</Button>
          {/*<SetColumns*/}
          {/*  plainOptions={plainOptions}*/}
          {/*  defcolumns={defcolumns}*/}
          {/*  initColumns={this.state.initColumns}*/}
          {/*  staticColumns={this.state.staticColumns}*/}
          {/*  syncChangeColumns={this.syncChangeColumns}*/}
          {/*/>*/}
        {/* <Button onClick={() => this.modifyChild.changeVisible(true)}><Icon type="plus" />添加</Button> */}
        {
          permission.includes('chuangrong:userAccount:export') ? <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> : null
        }
      </Fragment>
    )
  }

   exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue()

    dispatch({
      type: 'userAccountManage/exportExcel',
      payload: formData
    });
  }
  // 修改
  modifyHandler = async (id) => {
    const res = await this.props.dispatch({
      type: 'userAccountManage/getModifyInfo',
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
  // 更新
  async asyncHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要更新吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'userAccountManage/asyncManage',
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
    const { permission, userAccountManage: { list } } = this.props;
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
          permission.includes('chuangrong:account:view') ?
          <Card bordered={false}>
            <FilterIpts searchWholeState={this.state.searchWholeState} getList={this.getList} getChild={this.getChild} pageSize={pageSize} />
            {
              permission.includes('chuangrong:account:list') ?
              <StandardTable
                {...values}
              />  : null
            }
          </Card> : null
        }
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
