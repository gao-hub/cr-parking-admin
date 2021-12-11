import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import ModifyForm from './ModifyForm';
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
    label: '楼盘名称',
    value: 'buildingName',
  },
  {
    label: '所在地',
    value: 'location',
  },
  {
    label: '开发商',
    value: 'developer',
  },
  {
    label: '车位号',
    value: 'parkingCode',
  },
  {
    label: '购买价款',
    value: 'standardPrice',
  },
  {
    label: '持有人',
    value: 'buyerName',
  },
  //   , {
  //   label: '持有等级',
  //   value: 'levelNum',
  // }
  {
    label: '状态',
    value: 'parkingSalesStr',
  },
  // {
  //   label: '出售状态',
  //   value: 'auditStatusStr',
  // },
  {
    label: '锁定',
    value: 'auditStatus',
  },
  {
    label: '初次认购时间',
    value: 'firstTime',
  },
  {
    label: '创建时间',
    value: 'createTime',
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
    title: '楼盘名称',
    dataIndex: 'buildingName',
  },
  {
    title: '所在地',
    dataIndex: 'location',
    render: (record, row) => {
      return `${row.provinceName || ''}-${row.cityName || ''}-${row.districtName || ''}`;
    },
  },
  {
    title: '开发商',
    dataIndex: 'developer',
  },
  {
    title: '车位号',
    dataIndex: 'parkingCode',
  },
  {
    title: '购买价款',
    dataIndex: 'standardPrice',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
  },
  {
    title: '持有人',
    dataIndex: 'buyerName',
  },
  //   , {
  //   title: '持有等级',
  //   dataIndex: 'levelNum',
  // }
  {
    title: '状态',
    dataIndex: 'parkingSalesStr',
    // render: record => record === 0 ? '在售' : record === 1 ? '已售' : record === 2 ? '转让在售' : ''
  },
  // {
  //   title: '出售状态',
  //   dataIndex: 'auditStatusStr',
  // },
  {
    title: '锁定',
    dataIndex: 'auditStatus',
    render: record => (record === 6 ? '已锁定' : '未锁定'),
  },
  {
    title: '上下架',
    dataIndex: 'parkingStatus',
    render: record => (record === 0 ? '上架' : '下架'),
  },
  {
    title: '开启租售',
    dataIndex: 'rentSale',
    render: record => (record === 0 ? '是' : '否'),
  },
  {
    title: '开启自用',
    dataIndex: 'selfUseFlag',
    render: record => (record === 0 ? '否' : '是'),
  },
  {
    title: '初次认购时间',
    dataIndex: 'firstTime',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

@permission
@connect(({ buildingParkingManage, loading }) => ({
  buildingParkingManage,
  loading:
    loading.effects['buildingParkingManage/fetchList'] ||
    loading.effects['buildingParkingManage/getModifyInfo'],
  exportLoading: loading.effects['orderManage/exportExcel'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: this.props.buildingParkingManage.pagination.current || 1,
    pageSize: this.props.buildingParkingManage.pagination.size || 10,
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
              {/*<Menu.Item*/}
              {/*  disabled={permission.includes('chuangrong:buildingParking:info') ? false : true}*/}
              {/*  onClick={() => {*/}
              {/*    this.props.dispatch(*/}
              {/*      routerRedux.push({*/}
              {/*        pathname: '/order/list/detail',*/}
              {/*        search: `parkingId=${id}&tag=${'parkingTag'}`,*/}
              {/*      })*/}
              {/*    );*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <Icon type="file" /> 详情*/}
              {/*</Menu.Item>*/}
              {/*<Menu.Item*/}
              {/*  disabled={*/}
              {/*    permission.includes('chuangrong:buildingParking:aduit') && auditStatus == 1*/}
              {/*      ? false*/}
              {/*      : true*/}
              {/*  }*/}
              {/*  onClick={() => {*/}
              {/*    this.setState({*/}
              {/*      staySearchInfo: true*/}
              {/*    },()=>{*/}
              {/*      this.props.dispatch(*/}
              {/*        routerRedux.push({*/}
              {/*          pathname: '/order/list/detail',*/}
              {/*          search: `parkingId=${id}&type=audit`,*/}
              {/*        })*/}
              {/*      );*/}
              {/*    })*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <Icon type="file-search" /> 审核*/}
              {/*</Menu.Item>*/}
              <Menu.Item
                disabled={
                  permission.includes('chuangrong:buildingParking:async') &&
                  // 2审核成功发放中 5审核成功发放失败
                  (auditStatus == 2 || auditStatus == 5)
                    ? false
                    : true
                }
                onClick={() => this.asyncHandler(record)}
              >
                <Icon type="reload" /> 同步
              </Menu.Item>
              <Menu.Item
                disabled={!permission.includes('chuangrong:buildingParking:frame')}
                onClick={() => this.updateStatusHandler(record)}
              >
                <Icon type="edit" />
                {record.parkingStatus == 0 ? '下架' : '上架'}
              </Menu.Item>
              {permission.includes('chuangrong:buildingParking:sales') &&
                record.parkingSales === 4 && (
                  <Menu.Item onClick={() => this.changeOnSale(record)}>
                    <Icon type="sync" /> 在售
                  </Menu.Item>
                )}

              <Menu.Item
                disabled={
                  !(
                    permission.includes('chuangrong:buildingParking:update') &&
                    (record.parkingStatus === 1 ||
                      (record.parkingSales === 0 && record.auditStatus !== 6))
                  )
                }
                onClick={() => this.modifyHandler(record.id)}
              >
                <Icon type="edit" />
                编辑
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
    searchWholeState: true,
    staySearchInfo: false, // 保留筛选条件
  };
  // 同步
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
      const res = await this.props.dispatch({
        type: 'buildingParkingManage/asyncData',
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
    }
  }
  // 在售
  async changeOnSale(record) {
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
        type: 'buildingParkingManage/changeOnSale',
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
    }
  }
  //   页数改变时
  onChange = currPage => {
    this.props.dispatch({
      type: 'buildingParkingManage/setPagination',
      payload: {
        current: currPage,
        size: this.state.pageSize,
      },
    });
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
      type: 'buildingParkingManage/setPagination',
      payload: {
        current: currPage,
        size: pageSize,
      },
    });
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
      type: 'buildingParkingManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.buildingParkingManage.searchInfo,
      },
    });
  };

  /**
   * 上架&&下架操作
   * */
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
        type: 'buildingParkingManage/updateStatus',
        payload: {
          id: record.id,
          parkingStatus: record.parkingStatus == 0 ? 1 : 0,
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
    return (
      <Fragment>
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
        {/* <Button onClick={() => this.modifyChild.changeVisible(true)}><Icon type="plus" />车位出售</Button> */}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  // 修改
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'buildingParkingManage/getModifyInfo',
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
      text: '确定要删除角色吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'buildingParkingManage/deleteManage',
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
  }

  getChild = ref => (this.child = ref);
  async componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    // 请求开发商列表接口
    this.props.dispatch({
      type: 'buildingParkingManage/developerList',
      payload: {
        currPage: 1,
        pageSize: 999999,
      },
    });

    // 请求下拉初始化数据
    this.props.dispatch({
      type: 'buildingParkingManage/selectList',
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
          type: 'buildingParkingManage/setSearchInfo',
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

  componentWillUnmount() {
    if (!this.state.staySearchInfo) {
      this.props.dispatch({
        type: 'buildingParkingManage/setPagination',
        payload: {},
      });
    }
  }

  render() {
    const {
      permission,
      buildingParkingManage: { list, developerList, total, natureList },
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
          {permission.includes('chuangrong:buildingParking:list') ? (
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
          natureList={natureList}
        />
      </PageHeaderWrapper>
    );
  }
}
