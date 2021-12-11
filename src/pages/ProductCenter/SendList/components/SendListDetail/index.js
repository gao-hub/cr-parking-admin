import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';

import SetColumns from '@/components/SetColumns';

//   检索条件
import FilterIpts from '../../FilterIpts';

let confirmLoading = false;

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '车位订单号',
    value: 'orderId',
  },
  {
    label: '银行流水号',
    value: 'rentId',
  },
  {
    label: '楼盘地区',
    value: 'location',
  },
  {
    label: '楼盘名称',
    value: 'buildingName',
  },
  {
    label: '车位号',
    value: 'parkingCode',
  },
  {
    label: '持有人',
    value: 'buyerName',
  },
  {
    label: '租期',
    value: 'rentTime',
  },
  {
    label: '租金',
    value: 'rent',
  },
  {
    label: '推荐人',
    value: 'spreadsUserName',
  },
  {
    label: '一级渠道',
    value: 'parentUtmName',
  },
  // {
  //   label: '渠道',
  //   value: 'utmName',
  // },
  {
    label: '服务类型',
    value: 'rentType',
  },
  {
    label: '状态',
    value: 'orderStatus',
  },
  {
    label: '付租时间',
    value: 'finishTime',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '车位订单号',
    dataIndex: 'orderId',
  },
  {
    title: '银行流水号',
    dataIndex: 'rentId',
  },
  {
    title: '楼盘地区',
    dataIndex: 'location',
    render: (record, row) => {
      return `${row.provinceName || ''}-${row.cityName || ''}-${row.districtName || ''}`;
    },
  },
  {
    title: '楼盘名称',
    dataIndex: 'buildingName',
  },
  {
    title: '车位号',
    dataIndex: 'parkingCode',
  },
  {
    title: '持有人',
    dataIndex: 'buyerName',
  },
  {
    title: '租期',
    dataIndex: 'rentTime',
  },
  {
    title: '租金',
    dataIndex: 'rent',
  },
  {
    title: '推荐人',
    dataIndex: 'spreadsUserName',
  },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
  },
  // {
  //   title: '渠道',
  //   dataIndex: 'utmName',
  // },
  {
    title: '服务类型',
    dataIndex: 'rentType',
    render: record => (record === 1 ? '无忧退货' : record === 0 ? '无' : ''),
  },
  {
    title: '状态',
    dataIndex: 'orderStatus',
    render: record => {
      switch (record) {
        case 0:
          return '待发放';
        case 1:
          return '发放成功';
        case 2:
          return '发放失败';
        case 4:
          return '发放中';
      }
    },
  },
  {
    title: '付租时间',
    dataIndex: 'finishTime',
    render: record => (record || '-'),
  },
];

@permission
@connect(({ sendManage, loading }) => ({
  sendManage,
  loading:
    loading.effects['sendManage/fetchList'] ||
    loading.effects['sendManage/statusChangeManage'] ||
    loading.effects['sendManage/batchAllocate'] ||
    loading.effects['sendManage/asyncData'],
  batchLoading: loading.effects['sendManage/batchAllocate'],
  importLoading: loading.effects['sendManage/importFile'],
  exportLoading: loading.effects['sendManage/exportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    selectedRowKeys: [],
    initColumns: [
      'key',
      'orderId',
      'rentId',
      'location',
      'buildingName',
      'parkingCode',
      'buyerName',
      'rentTime',
      'rent',
      'spreadsUserName',
      'utmName',
      'rentType',
      'orderStatus',
      'finishTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const { orderStatus } = record; // 0-待发放，1-发放成功，2-发放失败，3-已过期,4-发放中
          if (orderStatus == 1) return false;
          const action = (
            <Menu>
              <Menu.Item
                disabled={
                  permission.includes('chuangrong:issueRecord:async') && orderStatus === 0
                    ? false
                    : true
                }
                onClick={() => this.allocateHandler(record)}
              >
                <Icon type="radius-setting" /> 手动发放
              </Menu.Item>
              <Menu.Item
                disabled={
                  permission.includes('chuangrong:issueRecord:async') &&
                  (orderStatus === 4 || orderStatus === 2)
                    ? false
                    : true
                }
                onClick={() => this.asyncHandler(record)}
              >
                <Icon type="reload" /> 同步
              </Menu.Item>
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
  getList = async (currPage, pageSize) => {
    await this.setState({ currPage, pageSize });
    this.props.dispatch({
      type: 'sendManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.sendManage.searchInfo,
      },
    });
    // 请求列表同时更新待发放总额
    this.getSumData();
  };

  getSumData = async () => {
    await this.props.dispatch({
      type: 'sendManage/sumData',
    });
  };

  exportFile = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();
    const { rentTime } = formData;
    if (!rentTime) {
      return message.warn('请选择租期');
    }
    return dispatch({
      type: 'sendManage/exportFile',
      payload: formData,
    });
  };

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {/*{*/}
        {/*  permission.includes('chuangrong:issueRecord:import') &&*/}
        {/*  <Button onClick={() => !this.props.importLoading ? this.refs.uploadIpt.dispatchEvent(new MouseEvent('click')) : null}>{this.props.importLoading ? <Icon type="loading" /> : null}导入已发送信息</Button>*/}
        {/*}*/}
        {/*{*/}
        {/*  permission.includes('chuangrong:issueRecord:export') &&*/}
        {/*  <Button onClick={() => !this.props.exportLoading ? this.exportHandler() : null}>{this.props.exportLoading ? <Icon type="loading" /> : null}导出待发放记录</Button>*/}
        {/*}*/}
        {permission.includes('chuangrong:issueRecord:falsify') && (
          <Button onClick={() => (!this.props.batchLoading ? this.allocateHandler({}) : null)}>
            {this.props.batchLoading ? <Icon type="loading" /> : null}
            批量发放
          </Button>
        )}
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {(searchWholeState ? '合并' : '展开') + '详细搜索'}
        </Button>
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {permission.includes('chuangrong:issueRecord:export') && (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        )}
        <Button style={{ marginBottom: '16px' }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  importHandler = async e => {
    const { files } = e.target;
    if (files.length > 0) {
      const excelTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const fileType = files[0].type;
      if (!(excelTypes.includes(fileType) || files[0].name.match('.xls'))) {
        message.error('请上传excel类型的文件');
        return;
      }
      try {
        const fd = new FormData();
        fd.append('file', files[0]);
        const res = await this.props.dispatch({
          type: 'sendManage/importFile',
          payload: fd,
        });
        if (res === true) {
          message.success('导入成功');
          this.getList(this.state.currPage, this.state.pageSize);
        } else {
          message.error(res);
        }
        // 清除input
        this.refs.uploadIpt.value = '';
      } catch (err) {
        console.log(err);
      }
    }
  };

  exportHandler() {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();

    dispatch({
      type: 'sendManage/exportFile',
      payload: formData,
    });
  }

  async allocateHandler(record) {
    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      if (confirmLoading) return;
      confirmLoading = true;
      const res = await this.props.dispatch({
        type: 'sendManage/batchAllocate',
        payload: {
          id: record.id,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else {
        message.error(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      }
      confirmLoading = false;
    }
  }
  // 同步状态
  async asyncHandler(record) {
    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      if (confirmLoading) return;
      confirmLoading = true;
      const res = await this.props.dispatch({
        type: 'sendManage/asyncData',
        payload: {
          id: record.id,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else {
        message.error(res.statusDesc);
      }
      confirmLoading = false;
    }
  }

  getChild = ref => (this.child = ref);
  async componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    const { parkingId } = this.props.parkingId;
    setTimeout(async () => {
      // 如果从别的页面过来 设置查询条件后再进行查询操作
      if (parkingId) {
        await this.props.dispatch({
          type: 'sendManage/setSearchInfo',
          payload: {
            parkingId,
          },
        });
      }
      this.getList(this.state.currPage, this.state.pageSize);
    }, 0);
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };
  // 选择调整部门的员工
  onSelectChange = selectedRowKeys => {
    let staffIds = [];
    selectedRowKeys.map(item => {
      staffIds.push(item.userId);
    });
    console.log(staffIds, 'departmentId');
    this.setState({
      selectedRowKeys,
      staffIds,
    });
  };
  render() {
    const {
      permission,
      sendManage: { list, total, totalAmount },
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      footer: () => (
        <div>
          待发放金额总计：
          {totalAmount}元
        </div>
      ),
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize: pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
      // selectedRows: this.state.selectedRowKeys,
      // onSelectRow:this.onSelectChange,
      // multiSelect: true,
      // multiOperate: (
      //   <Fragment>
      //     <a onClick={this.batchAllocate} style={{ marginLeft: 24 }}>批量发放</a>
      //   </Fragment>
      // ),
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn} hiddenBreadcrumb={true}>
        <input
          type="file"
          onChange={this.importHandler}
          style={{ display: 'none' }}
          ref="uploadIpt"
        />
        <Card bordered={false}>
          {permission.includes('chuangrong:issueRecord:list') ? (
            <>
              <FilterIpts
                searchWholeState={this.state.searchWholeState}
                getList={this.getList}
                getChild={this.getChild}
                pageSize={pageSize}
              />
              <StandardTable {...values} />
            </>
          ) : null}
        </Card>
      </PageHeaderWrapper>
    );
  }
}
