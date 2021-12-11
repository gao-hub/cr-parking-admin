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
import ReturnFilterIpts from '../../ReturnFilterIpts';

//   发放弹窗
import ReleaseModal from '../Modal';

let confirmLoading = false;

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '车位订单号',
    value: 'parkingOrderNo',
  },
  {
    label: '银行流水号',
    value: 'seqNo',
  },
  {
    label: '楼盘地区',
    value: 'buildingArea',
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
    label: '购买价款',
    value: 'wholesalePrice',
  },
  {
    label: '到账金额',
    value: 'payment',
  },
  {
    label: '状态',
    value: 'statusStr',
  },
  {
    label: '委托结束日',
    value: 'dueDate',
  },
  {
    label: '完成时间',
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
    dataIndex: 'parkingOrderNo',
  },
  {
    title: '银行流水号',
    dataIndex: 'seqNo',
  },
  {
    title: '楼盘地区',
    dataIndex: 'buildingArea',
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
    title: '购买价款',
    dataIndex: 'wholesalePrice',
  },
  {
    title: '到账金额',
    dataIndex: 'payment',
  },
  {
    title: '状态',
    dataIndex: 'statusStr',
  },
  {
    title: '委托结束日',
    dataIndex: 'dueDate',
    render: record => (record ? moment(record).format('YYYY-MM-DD') : ''),
  },
  {
    title: '完成时间',
    dataIndex: 'finishTime',
  },
];

@permission
@connect(({ sendManage, loading }) => ({
  sendManage,
  loading:
    loading.effects['sendManage/returnFetchList'] ||
    loading.effects['sendManage/statusChangeManage'] ||
    loading.effects['sendManage/returnBatchAllocate'] ||
    loading.effects['sendManage/returnAsyncData'],
  batchLoading: loading.effects['sendManage/returnBatchAllocate'],
  importLoading: loading.effects['sendManage/importFile'],
  exportLoading: loading.effects['sendManage/returnExportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    release: {
      //发放状态
      visible: false, //显示发放弹窗
      selectedReleaseRows: '', //发放提交选中数据
      type: 0, //1 全部发放    2 批量发放
      idList: [], //选中的id
      key: [],
    },
    currPage: 1,
    pageSize: 10,
    title: '添加',
    selectedRowKeys: [],
    initColumns: [
      'key',
      'parkingOrderNo',
      'seqNo',
      'buildingArea',
      'buildingName',
      'parkingCode',
      'buyerName',
      'spreadsUserName',
      'utmName',
      'wholesalePrice',
      'payment',
      'statusStr',
      'dueDate',
      'finishTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const { status } = record; // 0-待发放，1-发放中，2-发放成功，3-发放失败
          if (status == 2) return false;
          const action = (
            <Menu>
              <Menu.Item
                disabled={
                  permission.includes('chuangrong:issueRecord:sendOne') && status === 0
                    ? false
                    : true
                }
                onClick={() => this.allocateHandler(record)}
              >
                <Icon type="radius-setting" /> 发放
              </Menu.Item>
              <Menu.Item
                disabled={
                  permission.includes('chuangrong:issueRecord:sendOne') &&
                  (status === 1 || status === 3)
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
      type: 'sendManage/returnFetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.sendManage.returnSearchInfo,
      },
    });

    // 请求列表同时更新待发放总额
    this.getSumData();
    this.clearCheck();
  };

  getSumData = async () => {
    await this.props.dispatch({
      type: 'sendManage/returnSumData',
      payload: {
        idList: this.state.release.idList,
      },
    });
  };
  clearCheck = () => {
    this.setState({
      release: { ...this.state.release, selectedReleaseRows: [], idList: [] },
    });
    setTimeout(() => {
      this.getSumData();
    }, 100);
  };

  exportFile = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();

    return dispatch({
      type: 'sendManage/returnExportFile',
      payload: formData,
    });
  };
  onFullDistribution = val => {
    if (this.state.release.idList.length === 0 && val === 2) {
      message.error('请选择发放订单');
    } else {
      //1全部 2当前页选中
      this.setState({ release: { ...this.state.release, visible: true, type: val } });
    }
  };

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:issueRecord:sendAll') ? (
          <>
            <Button onClick={this.onFullDistribution.bind(this, 1)}>全部发放</Button>
            <Button onClick={this.onFullDistribution.bind(this, 2)}>批量发放</Button>
          </>
        ) : null}
        {/*{permission.includes("chuangrong:issueRecord:sendAll") && <Button onClick={() => !this.props.batchLoading ? this.allocateHandler({}): null}>{this.props.batchLoading ? <Icon type="loading" /> : null}批量发放</Button>}*/}
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
        {permission.includes('chuangrong:issueRecord:reTurnExport') && (
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
        type: 'sendManage/returnBatchAllocate',
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
        type: 'sendManage/returnAsyncData',
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
    this.getList(this.state.currPage, this.state.pageSize);
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

  changeStatus = status => {
    this.setState({
      release: { ...this.state.release, visible: status },
    });
  };
  render() {
    const {
      permission,
      sendManage: { returnList, returnTotal, returnTotalAmount },
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      rowKey: 'id',
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: this.state.release.idList,
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            release: {
              ...this.state.release,
              selectedReleaseRows: selectedRows,
              idList: selectedRowKeys,
            },
          });
          setTimeout(() => {
            this.getSumData();
          }, 100);
        },
        getCheckboxProps: record => ({
          disabled: record.status !== 0, // Column configuration not to be checked
        }),
      },
      columns: this.state.syncColumns,
      data: {
        list: returnList,
      },
      footer: () => (
        <div>
          <span style={{ marginRight: '20px' }}>
            待发放金额总计： {returnTotalAmount.sum ? returnTotalAmount.sum : 0}元
          </span>
          <span style={{ marginRight: '20px' }}>
            选中待发放金额总计：
            {returnTotalAmount.selectedSum ? returnTotalAmount.selectedSum : 0}元
          </span>
          <span style={{ marginRight: '20px' }}>选中待发放免密金额总计：0元</span>
        </div>
      ),
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize: pageSize,
        total: returnTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
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
              <ReturnFilterIpts
                searchWholeState={this.state.searchWholeState}
                getList={this.getList}
                clearCheck={this.clearCheck}
                getChild={this.getChild}
                pageSize={pageSize}
              />
              <StandardTable {...values} />
            </>
          ) : null}
        </Card>
        <ReleaseModal
          clearCheck={this.clearCheck}
          getList={this.getList}
          release={this.state.release}
          returnTotalAmount={returnTotalAmount}
          status={this.changeStatus}
        />
      </PageHeaderWrapper>
    );
  }
}
