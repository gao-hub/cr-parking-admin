import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';

import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import FilterIpts from './FilterIpts';
import SendGoodsModal from './SendGoods';
import EditExpressModal from './EditExpress';

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '兑换编号',
    dataIndex: 'id',
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
    title: '消耗额度',
    dataIndex: 'useQuota',
  },
  {
    title: '兑换档位',
    dataIndex: 'activityGradeName',
  },
  {
    title: '剩余可用额度',
    dataIndex: 'remainQuota',
  },
  {
    title: '奖品类型',
    dataIndex: 'activityPrizeTypeStr',
  },
  {
    title: '奖品名称',
    dataIndex: 'activityPrizeName',
  },
  {
    title: '发放状态',
    dataIndex: 'deliveryStatusStr',
  },
  {
    title: '兑换时间',
    dataIndex: 'createTime',
  },
  {
    title: '发放时间',
    dataIndex: 'deliveryTime',
  },
  {
    title: '收货地址',
    dataIndex: 'receiveAddressDetail',
  },
  {
    title: '发货方式',
    dataIndex: 'deliveryTypeStr',
  },
  {
    title: '物流单号',
    dataIndex: 'deliveryId',
  },
];

@permission
@connect(({ exchangeRecord, loading }) => ({
  exchangeRecord,
  loading: loading.effects['exchangeRecord/getList'],
  exportLoading: loading.effects['exchangeRecord/exportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    actionId: '',
    deliveryId: '', // 物流单号
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: (text, record) => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:activityAccumRecord:falsify') &&
                (record.deliveryStatus === 3 || record.deliveryStatus === 4) ? (
                  <Menu.Item onClick={() => this.sendGoods(record)}>
                    发货
                  </Menu.Item>
                ) : null
              }
              {
                // deliveryStatus : 5 已发货   deliveryType 1 物流 2 送货上门
                permission.includes('chuangrong:activityAccumRecord:update') && record.deliveryStatus === 5 && record.deliveryType === 1 ? (
                  <Menu.Item onClick={() => this.editExpress(record)}>
                    修改物流
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
    // 获取select
    this.props.dispatch({
      type: 'exchangeRecord/getSelect',
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
      type: 'exchangeRecord/getList',
      payload: {
        currPage,
        pageSize,
        ...this.props.exchangeRecord.searchInfo,
      },
    });
  };

  exportExcel = () => {
    let formData = this.child.getFormValue();
    this.props.dispatch({
      type: 'exchangeRecord/exportFile',
      payload: formData,
    });
  };

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {
          permission.includes('chuangrong:activityAccumRecord:export') &&
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
            导出
          </ExportLoading>
        }
        <Button onClick={() => window.location.reload()}><Icon type='reload' />刷新</Button>
      </Fragment>
    );
  };

  //  发货
  sendGoods = async (data) => {
    // 收货地址为空不能进行发货操作
    if (!data.addressFlag) {
      Swal.fire({
        text: '收货地址为空，无法进行此操作。请尽快联系客户确认收货地址。？',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      });
      return;
    }
    this.setState({
      actionId: data.id,
    }, () => {
      this.sendGoodsChild.setVisible(true);
    });
  };

  // 修改物流信息
  editExpress = async data => {
    this.setState({
      actionId: data.id,
      deliveryId: data.deliveryId,
    }, () => {
      this.editExpressChild.setVisible(true);
    });
  };

  getChild = ref => this.child = ref;

  render() {
    const { permission, exchangeRecord: { list, total } } = this.props;
    const { currPage, pageSize, actionId, deliveryId } = this.state;
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
          permission.includes('chuangrong:activityAccumRecord:list') && (
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
        <SendGoodsModal
          getChild={child => this.sendGoodsChild = child}
          currPage={currPage}
          pageSize={pageSize}
          getList={this.getList}
          actionId={actionId}
        />
        <EditExpressModal
          getChild={child => this.editExpressChild = child}
          currPage={currPage}
          pageSize={pageSize}
          actionId={actionId}
          deliveryId={deliveryId}
          getList={this.getList}
        />
      </PageHeaderWrapper>
    );
  }
}
