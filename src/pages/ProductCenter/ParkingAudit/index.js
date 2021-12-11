/* eslint-disable react/destructuring-assignment */
import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import { formatNumber } from '@/utils/utils';
import { getRandomApi } from '@/utils/lianlianPsd';
import SetColumns from '@/components/SetColumns';

//   检索条件
import { routerRedux } from 'dva/router';
import FilterIpts from './FilterIpts';
import ModifyForm from './ModifyForm';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    title: '车位订单号',
    dataIndex: 'parkingOrderNo',
  },
  {
    label: '楼盘名称',
    value: 'buildingName',
  },
  {
    label: '所在地',
    value: 'address',
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
    label: '车位用途',
    value: 'useTypeStr',
  },
  {
    label: '代销周期',
    value: 'investMonth',
  },
  {
    label: '持有天数',
    value: 'holdDay',
  },
  {
    label: '提前出售佣金',
    value: 'interestPrice',
  },
  {
    label: '履约保证金',
    value: 'bond',
  },
  {
    label: '零售价格',
    value: 'retail_price',
  },
  {
    label: '到账金额',
    value: 'realityPrice',
  },
  {
    label: '购买人',
    value: 'buyerName',
  },
  //   , {
  //   label: '持有等级',
  //   value: 'levelNum',
  // }
  // {
  //   label: '状态',
  //   value: 'auditStatus',
  // },
  {
    label: '运营审核',
    value: 'operateAuditStatusStr',
  },
  {
    label: '财务审核',
    value: 'auditStatusStr',
  },
  {
    label: '出售时间',
    value: 'updateTime',
  },
  {
    label: '认购时间',
    value: 'finishTime',
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
  {
    title: '车位订单号',
    dataIndex: 'parkingOrderNo',
  },
  {
    title: '楼盘名称',
    dataIndex: 'buildingName',
  },
  {
    title: '所在地',
    dataIndex: 'address',
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
    title: '车位用途',
    dataIndex: 'useTypeStr',
  },
  {
    title: '代销周期',
    dataIndex: 'investMonth',
    render: record => (record != null ? `${record}个月` : ''),
  },
  {
    title: '持有天数',
    dataIndex: 'holdDay',
  },
  {
    title: '提前出售佣金',
    dataIndex: 'interestPrice',
    render: record => `${record != null ? formatNumber(record) : 0}元`,
  },
  {
    title: '履约保证金',
    dataIndex: 'bond',
    render: record => `${record != null ? formatNumber(record) : 0}元`,
  },
  {
    title: '零售价格',
    dataIndex: 'retailPrice',
    render: record => `${record != null ? formatNumber(record) : 0}元`,
  },
  {
    title: '到账金额',
    dataIndex: 'realityPrice',
    render: record => `${record != null ? formatNumber(record) : 0}元`,
  },
  {
    title: '购买人',
    dataIndex: 'buyerName',
  },
  //   , {
  //   title: '持有等级',
  //   dataIndex: 'levelNum',
  // }
  {
    title: '运营审核',
    dataIndex: 'operateAuditStatusStr',
    // render: record => record === 0 ? '在售' : record === 1 ? '已售' : record === 2 ? '转让在售' : ''
  },
  {
    title: '财务审核',
    dataIndex: 'auditStatusStr',
    // render: record => record === 0 ? '在售' : record === 1 ? '已售' : record === 2 ? '转让在售' : ''
  },
  {
    title: '出售时间',
    dataIndex: 'updateTime',
    render: (record, row) => {
      if (row.auditStatus == 4) {
        return record;
      }
      return '';
    },
  },
  {
    title: '认购时间',
    dataIndex: 'finishTime',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

@permission
@connect(({ parkingAuditManage, loading }) => ({
  parkingAuditManage,
  loading:
    loading.effects['parkingAuditManage/fetchList'] ||
    loading.effects['parkingAuditManage/getModifyInfo'],
  exportLoading: loading.effects['orderManage/exportExcel'],
}))
class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: this.props.parkingAuditManage.pagination.current || 1,
    pageSize: this.props.parkingAuditManage.pagination.size || 10,
    title: '添加',
    initColumns: [
      'key',
      'parkingOrderNo',
      'buildingName',
      'address',
      'developer',
      'parkingCode',
      'useTypeStr',
      'investMonth',
      'holdDay',
      'interestPrice',
      'bond',
      'retailPrice',
      'realityPrice',
      'buyerName',
      'auditStatusStr',
      'updateTime',
      'finishTime',
      'createTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const { auditStatus, parkingId, operateAuditStatus } = record; // 2审核成功发放中 5审核成功发放失败

          const action = (
            <Menu>
              <Menu.Item
                disabled={!permission.includes('chuangrong:parkingConsultant:info')}
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: '/product/parking/auditDetail',
                      search: `parkingId=${parkingId}&tag=${'parkingTag'}`,
                    })
                  );
                }}
              >
                <Icon type="file" /> 详情
              </Menu.Item>
              <Menu.Item
                // 出售审核显示
                disabled={
                  !permission.includes('chuangrong:parkingConsultant:operateAudit') ||
                  operateAuditStatus !== 0
                }
                onClick={() => {
                  this.setState(
                    {
                      staySearchInfo: true,
                    },
                    () => {
                      this.props.dispatch(
                        routerRedux.push({
                          pathname: '/product/parking/auditDetail',
                          search: `id=${record.id}&parkingId=${parkingId}&type=operateAudit`,
                        })
                      );
                    }
                  );
                }}
              >
                <Icon type="file-search" /> 运营审核
              </Menu.Item>
              <Menu.Item
                // 出售审核显示
                disabled={
                  !permission.includes('chuangrong:parkingConsultant:aduit') ||
                  auditStatus !== 1 ||
                  operateAuditStatus === 0
                }
                onClick={() => {
                  this.setState(
                    {
                      staySearchInfo: true,
                    },
                    () => {
                      this.props.dispatch(
                        routerRedux.push({
                          pathname: '/product/parking/auditDetail',
                          search: `id=${record.id}&parkingId=${parkingId}&type=audit`,
                        })
                      );
                    }
                  );
                }}
              >
                <Icon type="file-search" /> 财务审核
              </Menu.Item>
              <Menu.Item
                disabled={
                  !permission.includes('chuangrong:parkingConsultant:async') ||
                  // 2审核成功发放中 5审核成功发放失败
                  (auditStatus !== 2 && auditStatus !== 5)
                }
                onClick={() => this.handleSubmit(record)}
              >
                <Icon type="reload" /> 发放
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
    isModalShow: 0, // 连连支付密码 Modal
    modalJson: {},
  };

  async componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    // 请求开发商列表接口
    this.props.dispatch({
      type: 'parkingAuditManage/developerList',
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
          type: 'parkingAuditManage/setSearchInfo',
          payload: {
            buildingName,
          },
        });
      }
      this.getList(this.state.currPage, this.state.pageSize);
    }, 0);
  }

  componentWillUnmount() {
    if (!this.state.staySearchInfo) {
      this.props.dispatch({
        type: 'parkingAuditManage/setPagination',
        payload: {},
      });
    }
  }

  /**
   * @desc 发放
   * @param { object } record 列表项 json
   */
  handleSubmit = async record => {
    this.setState({ modalJson: { id: record.id } });

    const { dispatch } = this.props;
    const { currPage, pageSize } = this.state;

    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      // 出租模式 => 同步接口
      if (record.useType === 0) {
        const res = await dispatch({
          type: 'parkingAuditManage/asyncData',
          payload: {
            id: record.id,
          },
        });
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.getList(currPage, pageSize);
        } else {
          message.error(res.statusDesc);
        }
      } else {
        this.setState({ isModalShow: 1 });
      }
    }
  };

  //   页数改变时
  onChange = currPage => {
    const { dispatch } = this.props;
    const { pageSize } = this.state;

    dispatch({
      type: 'parkingAuditManage/setPagination',
      payload: {
        current: currPage,
        size: pageSize,
      },
    });
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(currPage, pageSize);
      }
    );
  };

  onShowSizeChange = (currPage, pageSize) => {
    this.props.dispatch({
      type: 'parkingAuditManage/setPagination',
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
      type: 'parkingAuditManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.parkingAuditManage.searchInfo,
      },
    });
  };

  exportFile = () => {
    const { dispatch } = this.props;
    const formData = this.child.getFormValue();
    return dispatch({
      type: 'parkingAuditManage/exportExcel',
      payload: formData,
    });
  };

  renderBtn = () => {
    const { permission } = this.props;

    return (
      <Fragment>
        {permission.includes('chuangrong:parkingConsultant:export') ? (
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

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      parkingAuditManage: { list, total },
    } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => `共 ${total} 条`,
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
          {permission.includes('chuangrong:parkingConsultant:list') ? (
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
          isShow={this.state.isModalShow === 1}
          modalJson={this.state.modalJson}
          modalType="1"
          callback={() => {
            this.setState({ isModalShow: 0 });
            setTimeout(() => {
              this.getList(currPage, pageSize);
            }, 1000);
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default template;
