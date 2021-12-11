import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';

import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import FilterIpts from './FilterIpts';

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
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
    title: '车位用途',
    dataIndex: 'useTypeStr',
  },
  {
    title: '订单状态',
    dataIndex: 'parkingOrderStatusStr',
  },
  {
    title: '类型',
    dataIndex: 'changeTypeStr',
  },
  {
    title: '兑换奖品',
    dataIndex: 'activityPrizeName',
  },
  {
    title: '车位订单号',
    dataIndex: 'parkingOrderNo',
  },
  {
    title: '实际支付金额',
    dataIndex: 'paymentStr',
  },
  {
    title: '本次获得/消耗兑换额度',
    dataIndex: 'changeQuota',
  },
  {
    title: '累计获得额度',
    dataIndex: 'totalQuota',
    render: (_, records) => {
      // 2 消耗额度
      if (records.changeType === 2) {
        return '--'
      } else return records.totalQuota
    }
  },
  {
    title: '当前可用额度',
    dataIndex: 'remainQuota',
  },
  {
    title: '当前所处档位名称',
    dataIndex: 'activityGradeName',
  },
  {
    title: '时间',
    dataIndex: 'createTime',
  },

];

@permission
@connect(({ amountDetail, loading }) => ({
  amountDetail,
  loading: loading.effects['amountDetail/getList'],
  exportLoading: loading.effects['amountDetail/exportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (record) => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:activityAccumTimesChange:update') && record.reissueFlag ? (
                  <Menu.Item onClick={() => this.handleReissue(record)}>
                    补发额度
                  </Menu.Item>
                ) : null
              }
            </Menu>
          );
          return (
            <Dropdown overlay={action}>
              <a className='ant-dropdown-link' href='#'>
                操作<Icon type='down' />
              </a>
            </Dropdown>
          );
        },
      },
    ],
    searchWholeState: false,
  };

  componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
    // 获取渠道的select
    this.props.dispatch({
      type: 'amountDetail/getSelect',
      payload: {},
    });
  }

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  //   页数改变时
  onChange = (currPage) => {
    this.setState({
      currPage,
    }, () => {
      this.getList(currPage, this.state.pageSize);
    });
  };
  onShowSizeChange = (currPage, pageSize) => {
    this.setState({
      currPage,
      pageSize,
    }, () => {
      this.getList(currPage, pageSize);
    });
  };
  getList = async (currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'amountDetail/getList',
      payload: {
        currPage,
        pageSize,
        ...this.props.amountDetail.searchInfo,
      },
    });
  };

  exportExcel = () => {
    let formData = this.child.getFormValue();
    this.props.dispatch({
      type: 'amountDetail/exportFile',
      payload: formData,
    });
  };

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {
          permission.includes('chuangrong:activityAccumTimesChange:export') &&
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
            导出
          </ExportLoading>
        }
        <Button onClick={() => window.location.reload()}><Icon type='reload' />刷新</Button>
      </Fragment>
    );
  };

  //  补发额度
  handleReissue = async (data) => {
    const confirmVal = await Swal.fire({
      title: '补发额度',
      text: '确定要给该用户补发额度吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定补发',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'amountDetail/setReissue',
        payload: {
          id: data.id,
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

  getChild = ref => this.child = ref;

  render() {
    const { permission, amountDetail: { list, total } } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: (total) => ('共 ' + total + ' 条'),
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
        {
          permission.includes('chuangrong:activityAccumTimesChange:list') && (
            <Card bordered={false}>
              <FilterIpts
                getChild={child => this.child = child}
                pageSize={pageSize}
                getList={this.getList}
              />
              <StandardTable
                {...values}
              />
            </Card>
          )
        }
      </PageHeaderWrapper>
    );
  }
}
