import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Modal, Form } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading'

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import AddDataDictionary from './AddDataDictionary';
//   检索条件
import FilterIpts from './FilterIpts';

const defcolumns = [{
  title: '序号',
  dataIndex: 'key'
},{
  title: '字典区分',
  dataIndex: 'dictType',
},{
  title: '字典编号',
  dataIndex: 'dictCode',
},{
  title: '字典名称',
  dataIndex: 'dictName',
}]

@Form.create()

@permission

@connect(({ dataDictionary, loading }) => ({
  dataDictionary,
  loading: loading.effects['dataDictionary/fetchList'] || loading.effects['dataDictionary/modifyDataDictionary']
}))

export default class DataDictionary extends PureComponent {
  constructor(props) {
    super(props)
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('system:dict:update') ? 
                <Menu.Item onClick={() => this.modifyHandler(record)}>
                  <Icon type="edit" />修改
                </Menu.Item> : null
              }
              {
                permission.includes('system:dict:delete') ? 
                <Menu.Item onClick={() => this.deleteHandler(record)}>
                  <Icon type="close" />删除
                </Menu.Item> : null
              }
            </Menu>
          )
          return (
            <Dropdown overlay={action} disabled={permission.includes('system:dict:update') || permission.includes('system:dict:delete') ? false : true}>
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
      type: 'dataDictionary/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.dataDictionary.searchInfo
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {
          permission.includes('system:dict:add') ? <Button onClick={() => {this.addConfig(true)}}><Icon type="plus" />添加</Button> : null
        }
        <Button onClick={() => this.synchronization()}><Icon type="reload" />同步</Button>
        <Button onClick={() => window.location.reload()}><Icon type="reload" />刷新</Button>
      </Fragment>
    )
  }


  // 修改
  modifyHandler = async (record) => {
    this.props.dispatch({
      type: 'dataDictionary/initModifyInfo',
      payload: {
        id: record.id,
        // dictCode: record.dictCode,
        // dictType: record.dictType,
      }
    })
    this.addConfig(false)
  }
  // 删除
  deleteHandler = async(record) => {
    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      const delResult = await this.props.dispatch({
        type: 'dataDictionary/deleteDataDictionary',
        payload: {
          id: record.id
        }
      })
      if (delResult.status === 1) {
        this.getList(this.state.currPage, this.state.pageSize)
        message.success(delResult.statusDesc);
      } else {
        message.error(delResult.statusDesc);
      }
    }
  }

  //    添加/修改配置
  addConfig = (title) => {
    this.setState({
      modifyVisible: true,
      isAdd: title,
      modalTitle: title ? '添加数据字典' : '修改',
    })
  }
  //   同步按钮(后端同步数据用，前端无效果)
  synchronization = () => {
    this.props.dispatch({
      type: 'dataDictionary/synchronization'
    })
  }
  //   确定执行函数
  modifyHandleOk = (e) => {
    this.child.props.form.validateFields( async (err, values) => {
      if (!err) {
        let result;
        if (this.state.isAdd) {
          result = await this.props.dispatch({
            type: 'dataDictionary/addDataDictionary',
            payload: {
              ...values,
            }
          })
        } else {
          result = await this.props.dispatch({
            type: 'dataDictionary/modifyDataDictionary',
            payload: {
              ...values,
              id: this.props.dataDictionary.initModifyInfo.id
            }
          })
        }
        if (result.status === 1) {
          this.getList(this.state.currPage, this.state.pageSize)
          this.setState({
            modifyVisible: false,
          });
          message.success(result.statusDesc);
        } else {
          message.error(result.statusDesc);
        }
      }
    });
  }
  //   修改取消执行函数
  modifyHandleCancel = (e) => {
    this.props.form.resetFields()
    this.setState({
      modifyVisible: false,
    });
  }
  //   获取添加数据字典配置组件的this
  getAddconfigData = (ref) => {
    this.child = ref;
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
    const { permission, dataDictionary: { list } } = this.props;
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
          {
            permission.includes('system:dict:list') ? 
              <StandardTable 
                {...values}
              />  : null
          }
        </Card>
        {
          this.state.modifyVisible && <Modal
            title={this.state.modalTitle}
            width={500}
            bodyStyle={{maxHeight: 470, overflowY: 'auto'}}
            visible={this.state.modifyVisible}
            onOk={this.modifyHandleOk}
            confirmLoading={this.props.submitLoading}
            onCancel={this.modifyHandleCancel}
          >
            <AddDataDictionary getAddconfigData={this.getAddconfigData} modalTitle={this.state.modalTitle} isAdd={this.state.isAdd} />
          </Modal>
        }
      </PageHeaderWrapper>
    )
  }
}