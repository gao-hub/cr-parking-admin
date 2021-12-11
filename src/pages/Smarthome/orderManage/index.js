import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PermissionWrapper from '@/utils/PermissionWrapper';
import { connect } from 'dva';
import { Card, Button, Icon, Menu, Dropdown, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import ExportLoading from '@/components/ExportLoading';
import FilterIpts from './FilterIpts';

import Fahuo from './comp/fahuo';
import Chushen from './comp/chushen';
import Fushen from './comp/fushen';
import Shouhou from './comp/shouhou';

@PermissionWrapper
@connect(({ SmarthomeOrderManage, loading }) => ({
  SmarthomeOrderManage,
  loading: loading.effects['SmarthomeOrderManage/fetchList'],
  exportLoading: loading.effects['SmarthomeOrderManage/exportFile'],
}))
class template extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currPage: 1,
      pageSize: 5,
      isFahuoShow: false,
      isChushenShow: false,
      isFushenShow: false,
      isShouhouShow: false,
      id: 0,
      recordData: null,
      defcolumns: [
        {
          title: '序号',
          dataIndex: 'key',
          width: 80,
        },
        {
          title: '订单类型',
          dataIndex: 'orderType',
          width: 130,
          render: record => {
            let str = record === 0 ? '普通订单' : record === 1 ? '活动订单' : '';
            return str;
          },
        },
        {
          title: '商品订单号',
          dataIndex: 'orderNo',
          width: 130,
        },
        {
          title: '商品名称',
          dataIndex: 'storeName',
          width: 130,
        },
        {
          title: '商品缩略图',
          dataIndex: 'productUrl',
          render: record => (
            <img style={{ width: '60px', height: '60px' }} src={record} alt="产品缩略图" />
          ),
          width: 200,
        },
        {
          title: '规格',
          dataIndex: 'productSpecs',
          width: 200,
        },
        {
          title: '所属类目',
          dataIndex: 'categorName',
          width: 100,
        },
        {
          title: '售价',
          dataIndex: 'price',
          width: 100,
        },
        {
          title: '运费',
          dataIndex: 'freight',
          width: 100,
        },
        {
          title: '购买人姓名',
          dataIndex: 'buyerTrueName',
          width: 100,
        },
        {
          title: '手机号',
          dataIndex: 'buyerMobile',
          width: 140,
        },
        {
          title: '收货信息',
          render: record => `${record.receiveName}/${record.receivePhone}/${record.receiveAddress}`,
          width: 200,
        },
        {
          title: '实际支付金额',
          dataIndex: 'payment',
          width: 100,
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatus',
          render: record => {
            switch (record) {
              case 1:
                return '待付款';
              case 2:
                return '待发货';
              case 3:
                return '待收货';
              case 4:
                return '已完成';
              case 5:
                return '已关闭';
              case 6:
                return '已退款';
              default:
                return '';
            }
          },
          width: 100,
        },
        {
          title: '售后状态',
          dataIndex: 'refundType',
          render: record => {
            switch (record) {
              case 0:
                return '无';
              case 1:
                return '待审核';
              case 2:
                return '待复审';
              case 3:
                return '已退款';
              default:
                return '';
            }
          },
          width: 100,
        },
        {
          title: '退款金额',
          dataIndex: 'refundPayment',
          width: 100,
        },
        {
          title: '购买时间',
          dataIndex: 'createTime',
          width: 150,
        },
        {
          title: '发货时间',
          dataIndex: 'sendTime',
          width: 150,
        },
        {
          title: '确认收货时间',
          dataIndex: 'confirmTime',
          width: 150,
        },
        {
          title: '退款时间',
          dataIndex: 'refundFinishTime',
          width: 150,
        },
        {
          title: '物流订单号',
          dataIndex: 'deliveryId',
          width: 100,
        },
        {
          title: '操作',
          fixed: 'right',
          render: record => {
            const { permission, dispatch } = this.props;
            // orderStatus refundType
            // 1:待付款,2:待发货,3:待收货,4:已完成,5:已关闭6:已退款
            // 0 未进行退款 1 用户提交退货 2 初审成功待复审
            const action = (
              <Menu>
                {permission.includes('chuangrong:homeOrder:info') ? (
                  <Menu.Item
                    onClick={() => {
                      router.push({
                        pathname: '/smarthome/order/info',
                        query: {
                          id: record.id,
                        },
                      });
                    }}
                  >
                    详情
                  </Menu.Item>
                ) : null}
                {record.orderStatus === 2 &&
                record.refundType === 0 &&
                permission.includes('chuangrong:homeOrder:send') ? (
                  <Menu.Item
                    onClick={() => {
                      this.setState({
                        isFahuoShow: true,
                        id: record.id,
                      });
                    }}
                  >
                    发货
                  </Menu.Item>
                ) : null}
                {record.orderStatus === 3 &&
                record.refundType === 0 &&
                permission.includes('chuangrong:homeOrder:send') ? (
                  <Menu.Item
                    onClick={() => {
                      this.setState({
                        isFahuoShow: true,
                        id: record.id,
                      });
                    }}
                  >
                    修改订单号
                  </Menu.Item>
                ) : null}
                {(record.orderStatus === 2 ||
                  record.orderStatus === 3 ||
                  record.orderStatus === 4) &&
                record.refundType === 0 &&
                permission.includes('chuangrong:homeOrder:updateOne') ? (
                  <Menu.Item
                    onClick={() => {
                      this.setState({
                        isShouhouShow: true,
                        id: record.id,
                        recordData: record,
                      });
                    }}
                  >
                    售后
                  </Menu.Item>
                ) : null}
                {record.orderStatus === 2 &&
                record.refundType === 1 &&
                permission.includes('chuangrong:homeOrder:refund') ? (
                  <Menu.Item
                    onClick={() => {
                      this.setState({
                        isChushenShow: true,
                        id: record.id,
                        recordData: record,
                      });
                    }}
                  >
                    初审
                  </Menu.Item>
                ) : null}
                {(record.orderStatus === 2 ||
                  record.orderStatus === 3 ||
                  record.orderStatus === 4) &&
                record.refundType === 2 &&
                permission.includes('chuangrong:homeOrder:review') ? (
                  <Menu.Item
                    onClick={async () => {
                      await dispatch({
                        type: 'SmarthomeOrderManage/getOrderInfo',
                        payload: {
                          id: record.id,
                        },
                      });
                      this.setState({
                        isFushenShow: true,
                        id: record.id,
                        recordData: record,
                      });
                    }}
                  >
                    复审
                  </Menu.Item>
                ) : null}
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(
                    permission.includes('chuangrong:homeOrder:review') ||
                    permission.includes('chuangrong:homeOrder:refund') ||
                    permission.includes('chuangrong:homeOrder:updateOne') ||
                    permission.includes('chuangrong:homeOrder:send') ||
                    permission.includes('chuangrong:homeOrder:info')
                  )
                }
              >
                <a className="ant-dropdown-link">
                  操作
                  <Icon type="down" />
                </a>
              </Dropdown>
            );
          },
          width: 100,
        },
      ],
    };
  }

  componentDidMount() {
    const { currPage, pageSize } = this.state;
    this.getList(currPage, pageSize);
  }

  exportFile = () => {
    const {
      dispatch,
      SmarthomeOrderManage: { searchInfo },
    } = this.props;

    return dispatch({
      type: 'SmarthomeOrderManage/exportFile',
      payload: searchInfo,
    });
  };

  renderBtn = () => {
    const { permission, exportLoading } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:homeOrder:export') && (
          <ExportLoading exportLoading={exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        )}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  onChange = currPage => {
    const { pageSize } = this.state;
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

  getList = (currPage = 1, pageSize = 10) => {
    const {
      SmarthomeOrderManage: { searchInfo },
      dispatch,
    } = this.props;
    this.setState({ currPage, pageSize });
    const paraFilter = searchInfo || {};
    dispatch({
      type: 'SmarthomeOrderManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...paraFilter,
      },
    });
  };

  render() {
    const {
      permission,
      loading,
      SmarthomeOrderManage: { list, total },
    } = this.props;
    const { defcolumns, id } = this.state;
    const {
      currPage,
      pageSize,
      isFahuoShow,
      isChushenShow,
      isFushenShow,
      isShouhouShow,
      recordData,
    } = this.state;

    const values = {
      columns: defcolumns,
      data: {
        list,
      },
      loading,
      pagination: {
        showTotal: totalarg => `共 ${totalarg} 条`,
        current: currPage,
        pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '30'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return permission.includes('chuangrong:homeOrder:view') ? (
      <Fragment>
        <PageHeaderWrapper renderBtn={this.renderBtn}>
          <Card bordered={false}>
            {permission.includes('chuangrong:homeOrder:list') ? (
              <>
                <FilterIpts getList={this.getList} pageSize={pageSize} />
                <StandardTable {...values} />
              </>
            ) : null}
          </Card>
          <Fahuo
            visible={isFahuoShow}
            id={id}
            onCancel={() => {
              this.setState({ isFahuoShow: false });
            }}
            getList={() => {
              this.getList(currPage, pageSize);
            }}
          />
          <Chushen
            visible={isChushenShow}
            id={id}
            recordData={recordData}
            onCancel={() => {
              this.setState({ isChushenShow: false });
            }}
            getList={() => {
              this.getList(currPage, pageSize);
            }}
          />
          {isFushenShow && (
            <Fushen
              visible={isFushenShow}
              id={id}
              recordData={recordData}
              onCancel={() => {
                this.setState({ isFushenShow: false });
              }}
              getList={() => {
                this.getList(currPage, pageSize);
              }}
            />
          )}
          <Shouhou
            visible={isShouhouShow}
            id={id}
            recordData={recordData}
            onCancel={() => {
              this.setState({ isShouhouShow: false });
            }}
            getList={() => {
              this.getList(currPage, pageSize);
            }}
          />
        </PageHeaderWrapper>
      </Fragment>
    ) : null;
  }
}

export default template;
