import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Tabs } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import { formatNumber } from '@/utils/utils';

const { TabPane } = Tabs;
import SetColumns from '@/components/SetColumns';
//   发放弹窗
import ReleaseModal from './Modal';

//   检索条件
import FilterIpts from './FilterIpts';
import BuyBackFilterIpts from './BuyBackFilterIpts';
import ModifyForm from './ModifyForm';
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '续约编号',
    dataIndex: 'renewNo',
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
    title: '购买价款',
    dataIndex: 'originalPrice',
    render: record => (record != null ? formatNumber(record) : 0) + '元',
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
    title: '代销周期',
    dataIndex: 'investMonthStr',
  },
  {
    title: '到期未售违约金比例',
    dataIndex: 'interestRate',
  },
  {
    title: '到期未售违约金',
    dataIndex: 'interestAmount',
  },
  {
    title: '状态',
    dataIndex: 'statusStr',
  },
  {
    title: '代销结束日',
    dataIndex: 'dueDate',
  },
  {
    title: '完成时间',
    dataIndex: 'finishTime',
  },
];

const buyBackDefcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '到期订单号',
    dataIndex: 'renewNo',
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
    title: '代销周期',
    dataIndex: 'investMonthStr',
  },
  {
    title: '到期未售违约金比例',
    dataIndex: 'interestRate',
  },
  {
    title: '到期未售违约金',
    dataIndex: 'interestAmount',
  },
  {
    title: '车位价格',
    dataIndex: 'wholesalePrice',
  },
  {
    title: '代销服务费',
    dataIndex: 'serviceCharge',
  },
  {
    title: '履约保证金',
    dataIndex: 'bond',
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
    title: '代销结束日',
    dataIndex: 'dueDate',
  },
  {
    title: '完成时间',
    dataIndex: 'finishTime',
  },
];

@permission
@connect(({ falsifySendManage, loading }) => ({
  falsifySendManage,
  loading:
    loading.effects['falsifySendManage/fetchList'] ||
    loading.effects['falsifySendManage/statusChangeManage'],
  exportLoading: loading.effects['sendManage/exportFile'],
  batchLoading:
    loading.effects['falsifySendManage/penaltyBatchHandOut'] ||
    loading.effects['falsifySendManage/returnBatchHandOut'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    //发放
    release: {
      //发放状态
      visible: false, //显示发放弹窗
      type: 0, //1 全部发放    2 批量发放
      idList: [], //选中的id
      selectedReleaseRows: '', //选中的数据
    },
    //违约金发放
    currPage: 1,
    pageSize: 10,
    title: '添加',
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:businessUser:recharge') &&
                (record.status === 0 || record.status === 3) && (
                  <Menu.Item onClick={() => this.handleHandOut('penalty', record)}>
                    手动发放
                  </Menu.Item>
                )}
              {permission.includes('chuangrong:businessUser:recharge') &&
                record.status === 1 && (
                  <Menu.Item
                    onClick={async () => {
                      const { dispatch } = this.props;
                      const res = await dispatch({
                        type: 'falsifySendManage/penaltyHandOut',
                        payload: {
                          id: record.id,
                        },
                      });

                      if (res && res.status === 1) {
                        await this.getList(currPage, pageSize);
                        message.loading(res.statusDesc);
                      } else {
                        message.error(res.statusDesc);
                      }
                    }}
                  >
                    同步
                  </Menu.Item>
                )}
            </Menu>
          );
          return permission.includes('chuangrong:businessUser:recharge') ||
            permission.includes('chuangrong:businessAccount:withdraw') ? (
            <Dropdown overlay={action} disabled={record.status === 2}>
              <a className="ant-dropdown-link" href="#">
                操作
                <Icon type="down" />
              </a>
            </Dropdown>
          ) : null;
        },
      },
    ],
    searchWholeState: false,

    //到期退货
    backCurrPage: 1,
    backPageSize: 10,
    backTitle: '添加',
    backSyncColumns: [],
    backStaticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:businessUser:recharge') &&
                record.status === 0 && (
                  <Menu.Item onClick={() => this.handleHandOut('return', record)}>
                    {record.status === 0 ? '发放' : '重新发放'}
                  </Menu.Item>
                )}
              {permission.includes('chuangrong:businessUser:recharge') &&
                (record.status === 1 || record.status === 3) && (
                  <Menu.Item
                    onClick={async () => {
                      const { dispatch } = this.props;
                      const res = await dispatch({
                        type: 'falsifySendManage/reReturnHandOut',
                        payload: {
                          id: record.id,
                        },
                      });

                      if (res && res.status === 1) {
                        this.getBackList(backCurrPage, backPageSize);
                      } else {
                        message.error(res.statusDesc);
                      }
                    }}
                  >
                    {record.status === 1 ? '同步' : '重新发放'}
                  </Menu.Item>
                )}
            </Menu>
          );
          return permission.includes('chuangrong:businessUser:recharge') ||
            permission.includes('chuangrong:businessAccount:withdraw') ? (
            <Dropdown overlay={action} disabled={record.status === 2}>
              <a className="ant-dropdown-link" href="#">
                操作
                <Icon type="down" />
              </a>
            </Dropdown>
          ) : null;
        },
      },
    ],
    backSearchWholeState: false,
    isModalShow: 0, // 连连支付密码 Modal
    modalJson: {},
    tabIndex: '1',
  };

  /**
   * @desc 手动发放、批量发放
   * @param { string } sign 'penalty' => 违约金       'return' => 到期退货
   * @param { object } record 列表项 json
   */
  handleHandOut = async (sign = '', record = {}) => {
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
      // id 不存在  则走批量发放
      if (!record.id) {
        const res = await dispatch({
          type: 'falsifySendManage/penaltyBatchHandOut',
          payload: {
            id: null,
          },
        });
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.getList(currPage, pageSize);
        } else {
          message.error(res.statusDesc);
        }
      } else {
        this.setState({
          modalJson: {
            sign,
            id: record.id,
            status: record.status,
          },
          isModalShow: 1,
        });
      }
    }
  };

  /**
   * 违约金发放
   * 页数改变时
   * */
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

  /**
   * 到期退货
   * 页数改变时
   * */
  onBackChange = currPage => {
    this.setState(
      {
        backCurrPage: currPage,
      },
      () => {
        this.getBackList(currPage, this.state.backPageSize);
      }
    );
  };

  /**
   * 违约金发放
   * 页数改变时
   * */
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

  /**
   * 到期退货
   * 页数改变时
   * */
  onBackShowSizeChange = (currPage, pageSize) => {
    this.setState(
      {
        backCurrPage: currPage,
        backPageSize: pageSize,
      },
      () => {
        this.getBackList(currPage, pageSize);
      }
    );
  };

  /**
   * 违约金发放
   * 获取列表数据
   * */
  getList = async (currPage = 1, pageSize = 10, filter = false) => {
    await this.setState({ currPage, pageSize });
    const paraFilter = filter ? {} : this.props.falsifySendManage.searchInfo;
    this.props.dispatch({
      type: 'falsifySendManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...paraFilter,
      },
    });
  };

  /**
   * 到期退货
   * 获取列表数据
   * */
  getBackList = async (currPage = 1, pageSize = 10, filter = false) => {
    await this.setState({ backCurrPage: currPage, backPageSize: pageSize });
    const paraFilter = filter ? {} : this.props.falsifySendManage.backSearchInfo;
    this.props.dispatch({
      type: 'falsifySendManage/fetchBackList',
      payload: {
        currPage,
        pageSize,
        ...paraFilter,
      },
    });
    this.clearCheck();
    this.getSumData();
  };

  /**
   * 违约金发放
   * 导出功能
   * */
  exportFile = () => {
    const { dispatch } = this.props;
    let formData = this.child.getFormValue();
    return dispatch({
      type: 'falsifySendManage/exportFile',
      payload: formData,
    });
  };

  /**
   * 到期退货
   * 导出功能
   * */
  exportBackFile = () => {
    const { dispatch } = this.props;
    let formData = this.child2.getFormValue();
    return dispatch({
      type: 'falsifySendManage/exportBackFile',
      payload: formData,
    });
  };

  onFullDistribution = val => {
    if (this.state.release.idList.length === 0 && val === 2) {
      message.error('请选择发放订单');
    } else {
      if (val === 1) {
        //1全部 2当前页选中
        this.setState({ release: { ...this.state.release, idList: [], visible: true, type: val } });
      } else {
        this.setState({ release: { ...this.state.release, visible: true, type: val } });
      }
      this.getSumData();
    }
  };

  clearCheck = () => {
    this.setState({
      release: { ...this.state.release, selectedReleaseRows: [], idList: [] },
    });
    setTimeout(() => {
      this.getSumData();
    }, 100);
  };

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:salecapital:falsify') ? (
          <Button onClick={() => (!this.props.batchLoading ? this.handleHandOut() : null)}>
            {this.props.batchLoading ? <Icon type="loading" /> : null}
            批量发放
          </Button>
        ) : null}
        {permission.includes('chuangrong:salecapital:export') ? (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        ) : null}
        <Button onClick={() => this.getList(1, 10, true)} style={{ marginBottom: 16 }}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  backRenderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:salecapital:falsifyAll') ? (
          <>
            <Button onClick={this.onFullDistribution.bind(this, 1)}>全部发放</Button>
            <Button onClick={this.onFullDistribution.bind(this, 2)}>批量发放</Button>
          </>
        ) : null}
        {permission.includes('chuangrong:salecapital:export') ? (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportBackFile}>
            导出
          </ExportLoading>
        ) : null}
        <Button
          onClick={() => {
            this.getBackList(1, 10, true);
            this.clearCheck();
          }}
        >
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  getChild = ref => (this.child = ref);
  getChild2 = ref => (this.child2 = ref);
  getSumData = async () => {
    const { dispatch } = this.props;
    const response = await dispatch({
      type: 'falsifySendManage/getReturnSum',
      payload: {
        idList: this.state.release.idList,
      },
    });
  };
  componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
    this.syncChangeBuyBackColumns([...buyBackDefcolumns, ...this.state.backStaticColumns]);
  }

  //违约金发放数组初始化
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  //到期退货数组初始化
  syncChangeBuyBackColumns = (array = []) => {
    this.setState({
      backSyncColumns: array,
    });
  };

  changeTabIndex = index => {
    this.setState({
      tabIndex: index,
    });
    if (this.child) {
      this.child.reset();
    }
    if (this.child2) {
      this.child2.reset();
    }
    if (index == 1) {
      this.getList(this.state.currPage, this.state.pageSize, true);
    } else {
      this.getBackList(this.state.backCurrPage, this.state.backPageSize, true);
    }
  };
  changeStatus = status => {
    this.setState({
      release: { ...this.state.release, visible: status },
    });
  };
  render() {
    const {
      permission,
      falsifySendManage: { list = [], numJson = {}, total = 0 },
    } = this.props;
    const {
      currPage,
      pageSize,
      data,
      selectedRows,
      backCurrPage,
      backPageSize,
      isModalShow = 0,
      modalJson = {},
    } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },

      footer: () => (
        <div>
          <span>
            当前待发金额总计：
            {numJson.issuedAll || 0}
            元；
          </span>
          <span style={{ paddingLeft: '20px' }}>
            银行免密额度：
            {numJson.monthlyLimit || 0}
            元；
          </span>
          <span style={{ paddingLeft: '20px' }}>
            剩余免密额度：
            {numJson.surplusMonthlyLimit || 0}元
          </span>
        </div>
      ),
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize: pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    const buyBackValues = {
      columns: this.state.backSyncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: backCurrPage,
        pageSize: backPageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onBackChange,
        onShowSizeChange: this.onBackShowSizeChange,
      },
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
      footer: () => (
        <div>
          <span style={{ marginRight: '20px' }}>
            待发放金额总计：
            {this.props.falsifySendManage.sumData.allPrice
              ? this.props.falsifySendManage.sumData.allPrice
              : 0}
            元
          </span>
          <span style={{ marginRight: '20px' }}>
            选中待发放金额总计：{' '}
            {this.props.falsifySendManage.sumData.selectedPrice
              ? this.props.falsifySendManage.sumData.selectedPrice
              : 0}
            元
          </span>
          <span style={{ marginRight: '20px' }}>
            选中待发放免密金额总计：
            {this.props.falsifySendManage.sumData.selectedToBPrice
              ? this.props.falsifySendManage.sumData.selectedToBPrice
              : 0}
            元
          </span>
        </div>
      ),
    };
    return (
      <>
        <Tabs
          defaultActiveKey="1"
          onChange={this.changeTabIndex}
          tabBarStyle={{ marginBottom: 40 }}
        >
          <TabPane tab="违约金发放" key="1">
            <PageHeaderWrapper renderBtn={this.renderBtn} hiddenBreadcrumb={true}>
              <Card bordered={false}>
                {permission.includes('chuangrong:salecapital:list') ? (
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
            </PageHeaderWrapper>
          </TabPane>

          <TabPane tab="到期退货" key="2">
            <PageHeaderWrapper renderBtn={this.backRenderBtn} hiddenBreadcrumb={true}>
              <Card bordered={false}>
                {permission.includes('chuangrong:salecapital:list') ? (
                  <>
                    <BuyBackFilterIpts
                      clearCheck={this.clearCheck}
                      searchWholeState={this.state.searchWholeState}
                      getBackList={this.getBackList}
                      getChild={this.getChild2}
                      pageSize={pageSize}
                    />
                    <StandardTable {...buyBackValues} />
                  </>
                ) : null}
              </Card>
            </PageHeaderWrapper>
          </TabPane>
        </Tabs>
        <ReleaseModal
          clearCheck={this.clearCheck}
          getList={this.getBackList}
          release={this.state.release}
          returnTotalAmount={this.props.falsifySendManage.sumData}
          status={this.changeStatus}
        />
        <ModifyForm
          isShow={isModalShow === 1}
          modalJson={modalJson}
          modalType="1"
          callback={() => {
            this.setState({ isModalShow: 0 });
            const { tabIndex = '1' } = this.state;

            setTimeout(() => {
              if (tabIndex === '1') {
                this.getList(currPage, pageSize);
              } else {
                this.getBackList(backCurrPage, backPageSize);
              }
            }, 1000);
          }}
        />
      </>
    );
  }
}
