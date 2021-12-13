import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ModifyForm from './AddModal'

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key'
  },
  {
    title: '奖品名称',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: '图片',
    dataIndex: 'productImg',
    key: 'productImg',
    width: 150,
    render: (record, row) =>
      row.productImg && row.productImg !== '/' ? (
        <Card
          hoverable
          style={{ width: 50 }}
          bodyStyle={{ padding: 0 }}
          cover={<img src={row.productImg} />}
        />
      ) : '/',
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    key: 'costPrice',
  },
  {
    title: '已兑换数量',
    dataIndex: 'exchangeNum',
    key: 'exchangeNum',
  },
  {
    title: '排序',
    dataIndex: 'productSorted',
    key: 'productSorted',
  },
  {
    title: '状态',
    dataIndex: 'productStatus',
    render: (record, row) => {
      if (row.productStatus - 0 === 0) {
        return '禁用'
      }
      if (row.productStatus - 0 === 1) {
        return '启用';
      }
      return false;
    }
  },
]

@permission

@connect(({ diyGiftConfig, loading }) => ({
  diyGiftConfig,
  loading: loading.effects['diyGiftConfig/fetchList'] || loading.effects['diyGiftConfig/getModifyInfo'],
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
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {
                // permission.includes('chuangrong:userleave:update') ?
                  <Menu.Item onClick={async () => {
                    const { dispatch } = this.props;
                    await dispatch({
                      type: 'diyGiftConfig/getModifyInfo',
                      payload: {
                        id: record.id
                      }
                    })
                    this.modifyChild.changeVisible(true, 2)
                  }}>
                    <Icon type="edit" />编辑
                  </Menu.Item> 
                  // : null
              }
              {
                // permission.includes('chuangrong:userleave:delete') ?
                  <Menu.Item onClick={() => this.deleteData(record.id)}>
                    <Icon type="close" />删除
                  </Menu.Item> 
                  // : null
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
        type: 'diyGiftConfig/deleteData',
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
      type: 'diyGiftConfig/fetchList',
      payload: {
        currPage,
        pageSize,
      }
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state
    const { permission } = this.props
    return (
      <Fragment>
        {
          permission.includes('chuangrong:userleave:add') ? <Button onClick={async () => {
            const { dispatch } = this.props;
            await dispatch({
              type: 'diyGiftConfig/setModifyInfo',
              payload: {}
            })
            this.modifyChild.changeVisible(true, 1)
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
    const { permission, diyGiftConfig: { list } } = this.props;
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
            getList={this.getList}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}