import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import ModifyForm from './ModifyForm';
import ModifyStopRelease from './ModifyStopRelease';
import ModifyTransfer from './ModifyTransfer';
import { formatNumber } from '@/utils/utils';

import SetColumns from '@/components/SetColumns';

//   检索条件
import FilterIpts from './FilterIpts';
import { routerRedux } from 'dva/router';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  //   , {
  //   label: '车位编号',
  //   value: 'parkingCode',
  // }
  {
    label: '订单号',
    value: 'orderCode',
  },
  {
    label: '用户名',
    value: 'userName',
  },
  {
    label: '姓名',
    value: 'trueName',
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
    label: '楼盘名称',
    value: 'buildingName',
  },
  //   , {
  //   label: '持有等级',
  //   value: 'levelNum',
  // }
  {
    label: '车位号',
    value: 'parkingCode',
  },
  {
    label: '购买价款',
    value: 'originalPrice',
  },
  {
    label: '支付金额',
    value: 'payment',
  },
  {
    label: '期望售价',
    value: 'expectedPrice',
  },
  {
    label: '服务费',
    value: 'serviceCharge',
  },
  {
    label: '当前状态',
    value: 'statusStr',
  },
  {
    label: '实际售价',
    value: 'payment',
  },
  {
    label: '发布时间',
    value: 'releaseTime',
  },
  {
    label: '完成时间',
    value: 'completionTime',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  //   , {
  //   title: '车位编号',
  //   dataIndex: 'parkingCode',
  // }
  {
    title: '车位订单号',
    dataIndex: 'orderCode',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '姓名',
    dataIndex: 'trueName',
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
    title: '楼盘名称',
    dataIndex: 'buildingName',
  },
  //   , {
  //   title: '持有等级',
  //   dataIndex: 'levelNum',
  // }
  {
    title: '车位号',
    dataIndex: 'parkingCode',
    // render: record => record === 0 ? '在售' : record === 1 ? '已售' : record === 2 ? '转让在售' : ''
  },
  {
    title: '购买价款',
    dataIndex: 'originalPrice',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '支付金额',
    dataIndex: 'payment',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '期望售价',
    dataIndex: 'expectedPrice',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '服务费',
    dataIndex: 'serviceCharge',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '当前状态',
    dataIndex: 'statusStr',
  },
  {
    title: '实际售价',
    dataIndex: 'actualPrice',
    render: record => record != null ? `${formatNumber(record)}元` : '',
  },
  {
    title: '发布时间',
    dataIndex: 'releaseTime',
  },
  {
    title: '完成时间',
    dataIndex: 'completionTime',
  },
];

@permission
@connect(({ parkingTransferManage, loading }) => ({
  parkingTransferManage,
  loading:
    loading.effects['parkingTransferManage/fetchList'] ||
    loading.effects['parkingTransferManage/getModifyInfo'],
  exportLoading: loading.effects['orderManage/exportExcel'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: this.props.parkingTransferManage.pagination.current || 1,
    pageSize: this.props.parkingTransferManage.pagination.size || 10,
    title: '添加',
    initColumns: [
      'key',
      // , 'parkingCode'
      'buildingName',
      'location',
      'developer',
      'parkingCode',
      'standardPrice',
      'buyerName',
      'parkingSalesStr',
      'auditStatusStr',
      'firstTime',
      'createTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const { auditStatus, id } = record; // 2审核成功发放中 5审核成功发放失败
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:transferList:update')&& record && record.status === 0  ? (
                  <Menu.Item onClick={async () => {
                    // 获取车位列表信息
                    await this.props.dispatch({
                      type: 'parkingTransferManage/getModifyInfo',
                      payload: {
                        id: record.id
                      }
                    })
                    this.modifyChild.changeVisible(true)
                    this.modifyChild.setState({ id: record.id })
                  }}>
                    审核
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:transferList:update')&& record && record.status === 2 ? (
                  <Menu.Item onClick={async () => {
                    // 获取车位列表信息
                    await this.props.dispatch({
                      type: 'parkingTransferManage/getModifyInfo',
                      payload: {
                        id: record.id
                      }
                    })
                    this.modifyStopReleaseChild.changeVisible(true)
                    this.modifyStopReleaseChild.setState({ id: record.id })
                  }}>
                    终止发布
                  </Menu.Item>
                ) : null
              }
              {
                permission.includes('chuangrong:transferList:update')&& record && record.status === 2 ? (
                  <Menu.Item onClick={async () => {
                    // 获取车位列表信息
                    await this.props.dispatch({
                      type: 'parkingTransferManage/getModifyInfo',
                      payload: {
                        id: record.id
                      }
                    })
                    this.modifyTransferChild.changeVisible(true)
                    this.modifyTransferChild.setState({ id: record.id })
                  }}>
                    已转让
                  </Menu.Item>
                ) : null
              }
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
    searchWholeState: true,
    staySearchInfo: false, // 保留筛选条件
  };
  //   页数改变时
  onChange = currPage => {
    this.props.dispatch({
      type: 'parkingTransferManage/setPagination',
      payload: {
        current: currPage,
        size: this.state.pageSize
      },
    })
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
    this.props.dispatch({
      type: 'parkingTransferManage/setPagination',
      payload: {
        current: currPage,
        size: pageSize
      },
    })
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
      type: 'parkingTransferManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.parkingTransferManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {(searchWholeState ? '合并' : '展开') + '详细搜索'}
        </Button>
        {/*<SetColumns*/}
        {/*  plainOptions={plainOptions}*/}
        {/*  defcolumns={defcolumns}*/}
        {/*  initColumns={this.state.initColumns}*/}
        {/*  staticColumns={this.state.staticColumns}*/}
        {/*  syncChangeColumns={this.syncChangeColumns}*/}
        {/*/>*/}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  getChild = ref => (this.child = ref);
  async componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    // 请求开发商列表接口
    this.props.dispatch({
      type: 'parkingTransferManage/developerList',
      payload: {
        currPage: 1,
        pageSize: 999999,
      },
    });
    // 如果从别的页面过来 设置查询条件后再进行查询操作
    const { buildingName } = this.props.location.query;
    setTimeout(async () => {
      if (buildingName && this.child) {
        this.child.props.form.setFieldsValue({ buildingName });
        await this.props.dispatch({
          type: 'parkingTransferManage/setSearchInfo',
          payload: {
            buildingName,
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

  componentWillUnmount(){
    if(!this.state.staySearchInfo){
      this.props.dispatch({
        type: 'parkingTransferManage/setPagination',
        payload: {},
      })
    }
  }

  render() {
    const {
      permission,
      parkingTransferManage: { list, developerList, total },
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
        <Card bordered={false}>
          {permission.includes('chuangrong:transferList:list') ? (
            <>
              <FilterIpts
                searchWholeState={this.state.searchWholeState}
                getList={this.getList}
                getChild={this.getChild}
                pageSize={pageSize}
                staySearchInfo={this.state.staySearchInfo}
              />
              <StandardTable {...values} />
            </>
          ) : null}
        </Card>
        <ModifyForm
          getChildData={child => (this.modifyChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <ModifyStopRelease
          getChildData={child => (this.modifyStopReleaseChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <ModifyTransfer
          getChildData={child => (this.modifyTransferChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />

      </PageHeaderWrapper>
    );
  }
}
