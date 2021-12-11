import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

import ModifyRole from './ModifyRole';
//   检索条件
import FilterIpts from './FilterIpts';
//   添加角色组件
import AddRole from './AddRole';

import styles from './index.less';

@permission

@connect(({ RoleManage, loading }) => ({
  RoleManage,
  loading: loading.effects['RoleManage/fetchList'],
}))

export default class RoleManage extends PureComponent {
  constructor(props) {
    super(props)
    this.deleteRole = this.deleteRole.bind(this)
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    columns: [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
    }, {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    }, {
      title: '角色说明',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '角色状态',
      key: 'status',
      dataIndex: 'status',
      render: (record) => record == '0' ? '正常' : '停用'
    }, {
      title: '操作',
      render: (record) => {
        const { permission } =  this.props
        const action = (
          <Menu>
            {
              permission.includes('system:role:update') ? 
              <Menu.Item onClick={() => this.modifyRoleInfo(record.roleId)}>
                <Icon type="edit" />修改
              </Menu.Item> : null
            }
            {
              permission.includes('system:role:delete') ? 
              <Menu.Item onClick={() => this.deleteRole(record.roleId)}>
                <Icon type="close" />删除
              </Menu.Item> : null
            }
            {/* {
              permission.includes('system:role:delRelation') ? 
              <Menu.Item onClick={() => this.disengagement(record.roleId)}>
                <Icon type="close-circle" />解除关系
              </Menu.Item> : null
            } */}
          </Menu>
        )
        return (
          <Dropdown overlay={action} disabled={permission.includes('system:role:update') || permission.includes('system:role:delete') ? false : true}>
            <a className="ant-dropdown-link" href="#">
              操作<Icon type="down" />
            </a>
          </Dropdown>
        )
      }
    }],
    selectedRows: []
  }
  //   页数改变时
  onChange = (currPage) => {
    this.setState({
      currPage,
    }, () => {
      this.getRoleList(currPage, this.state.pageSize)
    })
  }
  onShowSizeChange = (currPage, pageSize) => {
    this.setState({
      currPage,
      pageSize
    }, () => {
      this.getRoleList(currPage, pageSize)
    })
  }
  getRoleList = (currPage, pageSize) => {
    this.props.dispatch({
      type: 'RoleManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.RoleManage.searchInfo
      }
    })
  }
  renderBtn = () => {
    return (
      <Fragment>
        <Button onClick={() => this.handleEntry(1)}><Icon type="plus" />添加角色</Button>
      </Fragment>
    )
  }
  handleEntry = (type) => {
    this.addChild.changeVisible(true)
    this.setState({
      modalType: type
    })
  }
  //   修改角色管理---授权
  modifyRoleInfo = async (roleId) => {
    const res = await this.props.dispatch({
      type: 'RoleManage/getModifyRoleInfo',
      payload: {
        roleId,
      }
    })
    if (res && res.status === 1) {
      this.userChild.changeVisible(true)
    } else {
      message.error(res.statusDesc)
    }
  }
  //   删除角色管理
  deleteRole = async (roleId) => {
    const confirmVal = await Swal.fire({
      text: '确定要删除角色吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      let res;
      const { selectedRowKeys } = this.state
      if (!roleId && selectedRowKeys.length) {
        res = await this.props.dispatch({
          type: 'RoleManage/deleteRole',
          payload: {
            roleIds: selectedRowKeys,
          }
        })
      } else {
        res = await this.props.dispatch({
          type: 'RoleManage/deleteRole',
          payload: {
            roleIds: [roleId],
          }
        })
      }
      if (res && res.status === 1) {
        message.success(res.statusDesc)
        this.getRoleList(this.state.currPage, this.state.pageSize)
      } else {
        message.error(res.statusDesc)
      }
    }
  }
  //    解除关系
  disengagement = async (roleId) => {
    const confirmVal = await Swal.fire({
      text: '确定要与全部拥有该角色用户解除关系？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'RoleManage/disengagement',
        payload: {
          roleId,
        }
      })
      if (res && res.status === 1) {
        message.success(res.statusDesc)
        this.getRoleList(this.state.currPage, this.state.pageSize)
      } else {
        message.error(res.statusDesc)
      }
    }
  }
  handleSelectRows = (selectedRows, selectedRowKeys) => {
    this.setState({
      selectedRows,
      selectedRowKeys,
    });
  };
  componentDidMount() {
    this.getRoleList(this.state.currPage, this.state.pageSize)
  }
  render() {
    const { permission } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const { list, total } = this.props.RoleManage;
    const values = {
      columns: this.state.columns,
      data: {
        list,
      },
      loading: this.props.loading,
      // selectedRows: selectedRows,
      // onSelectRow: this.handleSelectRows,
      // multiSelect: true,
      pagination: {
        showTotal: (total) => `共 ${total} 条`,
        current: currPage,
        pageSize: pageSize,
        total: total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange
      },
      deleteChange: this.deleteRole
    }
    const modalValues = {
      currPage,
      pageSize,
      modalType: this.state.modalType
    }
    return (
      <PageHeaderWrapper renderBtn={permission.includes('system:role:add') ? this.renderBtn : null}>
        {
          permission.includes('system:role:list') ? 
          <Card bordered={false}>
            <FilterIpts getRoleList={this.onShowSizeChange} pageSize={pageSize} />
            <StandardTable 
              {...values}
            /> 
          </Card>
          : null
        }
        <AddRole 
          getChildData={(child) => this.addChild = child} 
          getRoleList={this.onShowSizeChange}
          currPage={currPage}
          pageSize={pageSize}
        />
        <ModifyRole
          getChildData={(child) => this.userChild = child}
          getRoleList={this.onShowSizeChange}
          currPage={currPage}
          pageSize={pageSize}
        />
      </PageHeaderWrapper>
    )
  }
}