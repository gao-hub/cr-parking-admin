import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import PermissionWrapper from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';


// 修改物流编号
import ModifyForm from './ModifyForm';
// 发货
import DeliveryForm from './DeliveryForm';
// 售后
import AfterSalesForm from './AfterSalesForm';

//   检索条件
import FilterIpts from './FilterIpts';


@PermissionWrapper
@connect(({ ExchangeOrders, loading }) => ({
  ExchangeOrders,
  loading:
    loading.effects['ExchangeOrders/fetchList'] ||
    loading.effects['ExchangeOrders/getModifyInfo'] ||
    loading.effects['ExchangeOrders/getTabModifyInfo'],
  exportLoading: loading.effects['ExchangeOrders/exportExcel'],
}))
class IndexComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currPage: 1,
      pageSize: 10,
      defcolumns: [
        {
          title: '序号',
          dataIndex: 'key',
        },
        {
          title: '订单号',
          dataIndex: 'orderNo',
        },
        {
          title: '商品名称',
          dataIndex: 'productName',
        },
        {
          title: '商品编号',
          dataIndex: 'productId',
        },
        {
          title: '商品类型',
          dataIndex: 'orderType',
          render: (record) => {
            if (record - 0 === 0) {
              return '实物';
            }
            if (record - 0 === 1) {
              return '虚拟';
            }
            return false
          },
        },
        {
          title: '积分价格',
          dataIndex: 'payIntegral',
        },
        {
          title: '商品售价',
          dataIndex: 'otPrice'
        },
        {
          title: '渠道',
          dataIndex: 'parentUtm'
        },
        {
          title: '购买人用户名',
          dataIndex: 'buyerName'
        },
        {
          title: '手机号',
          dataIndex: 'mobile'
        },
        {
          title: '收货信息',
          render: (record)=>{
            // 防止为空的优化
            let str = record.receiverName;
            if(str && record.receiverMobile){
              str = `${str}/${record.receiverMobile}`;
            }
            if(str && record.receiverAddress) {
              str = `${str}/${record.receiverAddress}`;
            }
            return str || '--';
          }
        }, {
          title: '订单状态',
          dataIndex: 'orderStatusStr'
        },
        {
          title: '购买时间',
          dataIndex: 'createTime',
        },
        {
          title: '发货时间',
          dataIndex: 'sendOrderTime',
        },
        {
          title: '物流订单号',
          dataIndex: 'deliveryId',
        }, {
          title: '退款时间',
          dataIndex: 'refundFinishTime'
        }, {
          title: '退货积分',
          dataIndex: 'refundPayment'
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
                {permission.includes('chuangrong:integralOrder:delivery') &&record.orderStatus === 2 ? (
                  <Menu.Item onClick={() => this.deliveryHandler(record.id)}>
                    发货
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:integralOrder:update') && record.orderStatus === 3 ? (
                  <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                    修改物流单号
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:integralOrder:refund') && (record.orderStatus === 2 ||
                  record.orderStatus === 3 ||
                  record.orderStatus === 4) ? (
                    <Menu.Item onClick={() => this.afterSalesHandler(record.id)}>
                      售后
                    </Menu.Item>
                ) : null}
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(
                    permission.includes('chuangrong:integralOrder:delivery') ||
                    permission.includes('chuangrong:integralOrder:update') || 
                    permission.includes('chuangrong:integralOrder:refund')
                  )
                }
              >
                <a className="ant-dropdown-link" href="#">
                  操作
                  <Icon type="down" />
                </a>
              </Dropdown>
            );
          },
        },
      ],
      modifyChildVisible: false,
      afterSalesVisible: false,
      deliveryVisible: false
    };
  }

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }


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

  //
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


  // 获取列表数据
  getList = (currPage, pageSize) => {
    this.setState({ currPage, pageSize });
    this.props.dispatch({
      type: 'ExchangeOrders/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.ExchangeOrders.searchInfo,
      },
    });
  };


  renderBtn = () => {
    const { permission, exportLoading } = this.props;
    return (
      <Fragment>
        {
          permission.includes('chuangrong:integralOrder:export') ?
            <ExportLoading exportLoading={exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading> : null
        }
        <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };


  exportExcel = () => {
    const { dispatch } = this.props;
    const formData = this.child.getFormValue();
    dispatch({
      type: 'ExchangeOrders/exportExcel',
      payload: formData,
    });
  };

  // 修改物流单号
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'ExchangeOrders/getModifyInfo',
      payload: {
        id,
      },
    });
    if (res && res.status === 1) {
      this.setState({
        modifyChildVisible: true,
      });
    } else {
      message.error(res.statusDesc);
    }
  };

  // 售后
  afterSalesHandler = async (id) => {
    this.setState({
      afterSalesVisible: true,
      salesId: id
    });
  }

  // 发货
  deliveryHandler = async (id) => {
    this.setState({
      deliveryVisible: true,
      salesId: id
    });
  }

  getChild = ref => {
    this.child = ref
  };


  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      ExchangeOrders: { list, total },
    } = this.props;
    const { salesId } = this.state;
    const {
      currPage,
      pageSize,
      modifyChildVisible,
      afterSalesVisible,
      deliveryVisible,
    } = this.state;
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
    return permission.includes('chuangrong:integralOrder:view') ? (
      <Fragment>
        <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
          {permission.includes('chuangrong:integralOrder:list') ? (
            <Card bordered={false}>
              <FilterIpts
                getList={this.getList}
                getChild={this.getChild}
                pageSize={pageSize}
              />
              <StandardTable {...values} />
            </Card>
          ) : null}
          {modifyChildVisible && (
            <ModifyForm
              onCancel={() => {
                this.setState({ modifyChildVisible: false });
              }}
              getList={this.getList}
              currPage={currPage}
              pageSize={pageSize}
            />
          )}
          {/* 售后 */}
          {
            afterSalesVisible && <AfterSalesForm
              onCancel={() => {
                this.setState({ afterSalesVisible: false });
              }}
              getList={this.getList}
              currPage={currPage}
              pageSize={pageSize}
              salesId={salesId}
            />
          }
          {/* 发货 */}
          {
            deliveryVisible && <DeliveryForm
              onCancel={() => {
                this.setState({ deliveryVisible: false });
              }}
              salesId={salesId}
              getList={this.getList}
              currPage={currPage}
              pageSize={pageSize} 
            />
          }
        </PageHeaderWrapper>
      </Fragment>
    ) : null;
  }
}

export default IndexComponent;
