import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import { routerRedux } from 'dva/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';
import { formatNumber } from '@/utils/utils';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '所在地',
    value: 'location',
  },
  {
    label: '楼盘名称',
    value: 'buildingName',
  },
  {
    label: '开发商',
    value: 'developerId',
  },
  {
    label: '车位总量',
    value: 'parkingSum',
  },
  {
    label: '在售车位（租售）',
    value: 'parkingNum',
  },
  {
    label: '在售车位（自用）',
    value: 'parkingSelfNum',
  },
  //   , {
  //   label: '真实车位数量*',
  //   value: 'trueNum',
  // }
  {
    label: '最低价款',
    value: 'sectionMin',
  },
  {
    label: '开启自用',
    value: 'selfUse',
  },
  {
    label: '首购专享',
    value: 'firstPurchaseFlag',
  },
  //   , {
  //   label: '楼盘类型',
  //   value: 'buildingType',
  // }
  {
    label: '状态',
    value: 'openStatus',
  },
  {
    label: '是否置顶',
    value: 'topStatusStr',
  },
  {
    label: '创建时间',
    value: 'createTime',
  },
];

@permission
@connect(({ buildingManage, loading }) => ({
  buildingManage,
  loading:
    loading.effects['buildingManage/fetchList'] ||
    loading.effects['buildingManage/getModifyInfo'] ||
    loading.effects['buildingManage/parkingList'],
  exportLoading: loading.effects['orderManage/exportExcel'],
}))
export default class template extends PureComponent {
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    initColumns: [
      'key',
      'location',
      'buildingName',
      'developerId',
      'parkingSum',
      'parkingNum',
      'parkingSelfNum',
      'sectionMin',
      'selfUse',
      'firstPurchaseFlag',
      'openStatus',
      'topStatusStr',
      'createTime',
    ],
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '所在地',
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
        title: '开发商',
        dataIndex: 'developerId',
        render: record => {
          const { developerList } = this.props.buildingManage;
          const resItem = developerList.find(item => item.id == record) || {};
          return resItem.developer;
        },
      },
      {
        title: '车位总量',
        dataIndex: 'parkingSum',
      },
      {
        title: '在售车位  （租售）',
        dataIndex: 'parkingNum',
      },
      {
        title: '在售车位（自用）',
        dataIndex: 'parkingSelfNum',
      },
      //   , {
      //   title: '真实车位数量*',
      //   dataIndex: 'trueNum',
      // }
      {
        title: '最低价款',
        dataIndex: 'sectionMin',
        render: record => (record != null ? formatNumber(record) : 0) + '元',
      },
      {
        title: '开启租售',
        dataIndex: 'rentSale',
        render: record => (record == 0 ? '是' : '否'),
      },
      {
        title: '代租版',
        dataIndex: 'rentStatus',
        render: record => (record == 0 ? '关闭' : '启用'),
      },
      {
        title: '开启自用',
        dataIndex: 'selfUse',
        render: record => (record == 0 ? '是' : '否'),
      },
      {
        title: '首购专享',
        dataIndex: 'firstPurchaseFlag',
        render: record => (record == 1 ? '是' : '否'),
      },
      //   , {
      //   title: '楼盘类型',
      //   dataIndex: 'buildingType',
      //   render: record => record === 0 ? '住宅' : '别墅'
      // }
      {
        title: '状态',
        dataIndex: 'openStatus',
        render: record => (record === 0 ? '开启' : record === 1 ? '关闭' : ''),
      },
      {
        title: '是否置顶',
        dataIndex: 'topStatusStr',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;

          const action = (
            <Menu>
              {permission.includes('chuangrong:building:topStatus') ? (
                <Menu.Item
                  onClick={() => {
                    this.setStickStatus(record);
                  }}
                >
                  {record.topStatus === 0 ? '置顶' : '取消置顶'}
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:building:update') ? (
                <Menu.Item
                  onClick={() => {
                    this.props.dispatch(
                      routerRedux.push({
                        pathname: '/product/building/edit/' + record.id,
                      })
                    );
                  }}
                >
                  修改
                </Menu.Item>
              ) : null}
              <Menu.Item
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: '/product/parking/list',
                      search: '?buildingName=' + record.buildingName,
                    })
                  );
                }}
              >
                查看车位
              </Menu.Item>
              {permission.includes('chuangrong:parkingConsultant:add') ? (
                <Menu.Item
                  onClick={async () => {
                    // this.props.dispatch(routerRedux.push({
                    //   pathname: '/product/parking/list'
                    // }))
                    // 获取车位列表信息
                    await this.props.dispatch({
                      type: 'buildingManage/parkingList',
                      payload: {
                        id: record.id,
                      },
                    });
                    this.modifyChild.changeVisible(true);
                    this.modifyChild.setState({ id: record.id });
                  }}
                >
                  车位出售
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
      type: 'buildingManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.buildingManage.searchInfo,
      },
    });
  };
  // 置顶状态修改
  setStickStatus = async record => {
    let text = '确定置顶该楼盘吗?',
      topStatus = 1;
    if (record.topStatus === 1) {
      text = '确定取消置顶该楼盘吗?';
      topStatus = 0;
    }
    const confirmVal = await Swal.fire({
      text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'buildingManage/setStickStatus',
        payload: {
          id: record.id,
          topStatus,
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
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {(searchWholeState ? '合并' : '展开') + '详细搜索'}
        </Button>
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={this.state.defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {permission.includes('chuangrong:building:add') ? (
          <Button
            onClick={() => {
              this.props.dispatch(
                routerRedux.push({
                  pathname: '/product/building/edit/new',
                })
              );
            }}
          >
            <Icon type="plus" />
            添加
          </Button>
        ) : null}
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
      type: 'buildingManage/getModifyInfo',
      payload: {
        id,
      },
    });
    if (res && res.status === 1) {
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
        type: 'buildingManage/deleteManage',
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
  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
    // 请求开发商列表接口
    this.props.dispatch({
      type: 'buildingManage/developerList',
      payload: {
        currPage: 1,
        pageSize: 999999,
      },
    });
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      buildingManage: { list, total },
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
          {permission.includes('chuangrong:building:list') ? (
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
        <ModifyForm
          getChildData={child => (this.modifyChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
      </PageHeaderWrapper>
    );
  }
}
