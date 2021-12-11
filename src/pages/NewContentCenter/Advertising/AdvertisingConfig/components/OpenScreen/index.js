import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
// import ExportLoading from '@/components/ExportLoading'

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '展示平台',
    value: 'typeStr',
  },
  {
    label: '广告名称',
    value: 'posterName',
  },
  {
    label: '广告位',
    value: 'posterType',
  },
  {
    label: '广告缩略图',
    value: 'posterUrl',
  },
  {
    label: '排序',
    value: 'sort',
  },
  {
    label: '状态',
    value: 'posterStatus',
  },
  {
    label: '更新人',
    value: 'updateBy',
  },
  {
    label: '创建时间',
    value: 'createTime',
  },
];

@permission
@connect(({ advertManage, loading }) => ({
  advertManage,
  loading:
    loading.effects['advertManage/fetchList'] || loading.effects['advertManage/getModifyInfo'],
  exportLoading: loading.effects['orderManage/exportExcel'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    previewImg: '',
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '广告名称',
        dataIndex: 'advertName',
      },
      {
        title: '广告位',
        dataIndex: 'advertPosition'
      },
      {
        title: '广告缩略图',
        dataIndex: 'imageUrl',
        render: (record, row) => {
          return row.imageUrl ? (
            <Card
              hoverable
              style={{ width: 100 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.imageUrl)}
              cover={<img src={row.imageUrl} />}
            />
          ) : null;
        },
      },
      {
        title: '排序',
        dataIndex: 'sortid',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (record, row) => {
          if (row.status == 0) {
            return '已禁用';
          }
          if (row.status == 1) {
            return '已启用';
          }
        },
      },
      {
        title: '更新人',
        dataIndex: 'updateName',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '展示时间',
        dataIndex: 'showTime'
      }
    ],

    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:advert:update') ? (
                <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                  <Icon type="edit" />
                  修改
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:advert:status') ? (
                <Menu.Item onClick={() => this.updateStatusHandler(record)}>
                  <Icon type="edit" />
                  {record.status == 0 ? '启用' : '禁用'}
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:advert:delete') ? (
                <Menu.Item onClick={() => this.deleteHandler(record.id)}>
                  <Icon type="close" />
                  删除
                </Menu.Item>
              ) : null}
            </Menu>
          );
          return (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作
                <Icon type="down" />
              </a>
            </Dropdown>
          );
        },
      },
    ],
    searchWholeState: false,
  };

  previewImg = url => {
    this.setState({
      previewVisible: true,
      previewImg: url,
    });
  };

  //   页数改变时
  onChange = currPage => {
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(currPage, this.state.pageSize);
      }
    );
  };
  onShowSizeChange = (currPage, pageSize) => {
    this.setState(
      {
        currPage,
        pageSize,
      },
      () => {
        this.getList(currPage, pageSize);
      }
    );
  };
  getList = (currPage, pageSize) => {
    this.setState({ currPage, pageSize });
    this.props.dispatch({
      type: 'advertManage/fetchList',
      payload: {
        advertType:3,
        currPage,
        pageSize,
        ...this.props.advertManage.searchInfo,
      },
    });
  };
  updateStatusHandler = async record => {
    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'advertManage/updateStatus',
        payload: {
              status:record.status == 0 ? 1 :0,
              id: record.id,
              advertType:3,
              advertPositionId:31
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else {
        message.error(res.statusDesc);
      }
    }
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
       
        {permission.includes('chuangrong:advert:add') ? (
          <Button onClick={() => this.modifyChild.changeVisible(true)}>
            <Icon type="plus" />
            添加
          </Button>
        ) : null}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
        {/* <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> */}
      </Fragment>
    );
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();

    dispatch({
      type: 'advertManage/exportExcel',
      payload: formData,
    });
  };
  // 修改
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'advertManage/getModifyInfo',
      payload: {
        id,
      },
    });
    if (res && res.status === 1) {
      this.modifyChild.changeVisible(true);
    } else {
      message.error(res.statusDesc);
    }
  };
  // 删除
  async deleteHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要删除吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'advertManage/deleteManage',
        payload: {
          id,
          advertType:3,
          advertPositionId:31
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else {
        message.error(res.statusDesc);
      }
    }
  }

  getChild = ref => (this.child = ref);
  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      advertManage: { list, total },
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
          { permission.includes('chuangrong:advert:list') ? (
            <Card bordered={false}>
              <FilterIpts
                searchWholeState={this.state.searchWholeState}
                getList={this.getList}
                getChild={this.getChild}
                pageSize={pageSize}
              />
              <StandardTable {...values} />
            </Card>
          ) : null}
          <ModifyForm
            getChildData={child => (this.modifyChild = child)}
            getList={this.getList}
            currPage={currPage}
            pageSize={pageSize}
          />
          <Modal
            visible={this.state.previewVisible}
            footer={null}
            onCancel={() => this.setState({ previewVisible: false })}
          >
            <img style={{ width: '100%' }} src={this.state.previewImg} />
          </Modal>

       </PageHeaderWrapper>
    );
  }
}
