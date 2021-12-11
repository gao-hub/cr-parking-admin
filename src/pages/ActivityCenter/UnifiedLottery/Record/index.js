import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

import SetColumns from '@/components/SetColumns';
import FilterIpts from './FilterIpts';
import ExportLoading from '@/components/ExportLoading';
import { routerRedux } from 'dva/router';
import ModifyForm from './AddModal';

const { confirm } = Modal;
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '活动名称',
    dataIndex: 'activityName',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '姓名',
    dataIndex: 'truename',
  },
  {
    title: '手机号',
    dataIndex: 'userPhone',
  },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
  },
  {
    title: '抽奖码',
    dataIndex: 'prizeCode',
  },
  {
    title: '奖品名称',
    dataIndex: 'activityPrizeName',
  },
  {
    title: '中奖时间',
    dataIndex: 'createTime',
  },
];

@permission
@connect(({ UnifiedLotteryRecord, loading }) => ({
  UnifiedLotteryRecord,
  loading:
    loading.effects['UnifiedLotteryRecord/fetchList'] ||
    loading.effects['UnifiedLotteryRecord/getModifyInfo'],
  exportLoading: loading.effects['UnifiedLotteryRecord/exportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    syncColumns: [],
    staticColumns: [
      // {
      //   title: '操作',
      //   render: (text, record) => {
      //     const { permission, dispatch } = this.props;
      //     const action = (
      //       <Menu>
      //         {permission.includes('chuangrong:activityRecord:update') &&
      //         (record.deliveryStatus === 3 || record.deliveryStatus === 4) ? (
      //           <Menu.Item onClick={() => this.deliveryData(record)}>发货</Menu.Item>
      //         ) : null}
      //       </Menu>
      //     );
      //     return (
      //       <Dropdown overlay={action}>
      //         <a className="ant-dropdown-link" href="#">
      //           操作
      //           <Icon type="down" />
      //         </a>
      //       </Dropdown>
      //     );
      //   },
      // },
    ],
    searchWholeState: true,
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
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'UnifiedLotteryRecord/fetchList',
      payload: {
        currPage,
        pageSize,
        activityType: 3,
        ...this.props.UnifiedLotteryRecord.searchInfo,
      },
    });
  };
  //  删除数据
  deleteData = async id => {
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
        type: 'UnifiedLotteryRecord/deleteData',
        payload: {
          id,
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

  //  发货方法
  deliveryData = async record => {
    if (record.receiveAddress === '' || !record.receiveAddress) {
      confirm({
        title: '发货',
        content: '收货地址为空，无法进行此操作。请尽快联系客户确认收货地址。',
        okText: '确定',
        cancelText: '取消',
        onOk() {},
        onCancel() {
          // console.log('Cancel');
        },
      });
    } else {
      this.modifyChild.setState({ infoData: record });
      this.modifyChild.changeVisible(true);
    }
  };

  /**
   * 导出列表功能实现
   * */
  exportFile = () => {
    const { dispatch } = this.props;
    const formData = this.child.getFormValue();
    delete formData.createTime;
    delete formData.updateTime;
    return dispatch({
      type: 'UnifiedLotteryRecord/exportFile',
      payload: { ...formData, activityType: 3 },
    });
  };

  renderBtn = () => {
    const { permission } = this.props;
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        {permission.includes('chuangrong:activityCodeRecord:export') ? (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        ) : null}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  getChild = ref => (this.child = ref);
  componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
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
      UnifiedLotteryRecord: { list },
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list: list.records,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize,
        total: list.total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        {permission.includes('chuangrong:activityCodeRecord:list') && (
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
        )}
        <ModifyForm
          getChildData={child => (this.modifyChild = child)}
          setDataList={dataSource => this.setState({ tableList: dataSource })}
          dataSource={this.state.tableList}
          getList={this.getList}
          type={'add'}
        />
      </PageHeaderWrapper>
    );
  }
}
