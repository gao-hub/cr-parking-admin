/**
 * 企业用户列表
 */
import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Modal, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import ExportLoading from '@/components/ExportLoading';
import ModifyForm from './ModifyForm';
import ModifySpreads from './ModifySpreads';
import RechargeForm from './RechargeForm';
import WithdrawForm from './WithdrawForm';
import UpdateMobile from './UpdateMobile';
import UpdatePassword from './UpdatePassword';
import UpdatePasswordSecond from './UpdatePasswordSecond';
import permission from '@/utils/PermissionWrapper';

import SetColumns from '@/components/SetColumns';

//   检索条件
import FilterIpts from './FilterIpts';
const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '用户名',
    value: 'username',
  },
  {
    label: '企业名称',
    value: 'businessName',
  },
  {
    label: '公司类型',
    value: 'businessName',
  },
  {
    label: '手机号',
    value: 'mobile',
  },
  {
    label: 'ACCP商户编号',
    value: 'accpTxno',
  },
  {
    label: '合作银行账户',
    value: 'bankNo',
  },
  {
    label: '开户状态',
    value: 'openAccount',
  },
  {
    label: '提交时间',
    value: 'createTime',
  },
  {
    label: '开户时间',
    value: 'openTime',
  },
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '企业名称',
    dataIndex: 'businessName',
  },
  {
    title: '公司类型',
    dataIndex: 'type',
    render: record => (record == 0 ? '物业公司' : record == 1 ? '销售公司' : ''),
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: 'ACCP商户编号',
    dataIndex: 'accpTxno',
  },
  {
    title: '合作银行账户',
    dataIndex: 'bankNo',
  },
  {
    title: '单笔免密额度',
    dataIndex: 'singleLimit',
    render: (text, record) => (text !== null? text  : '-'),
  },
  {
    title: '单日剩余免密额度/单日银行免密度',
    dataIndex: '',
    width: 200,
    render: record =>
      (record.surplusDailyLimit !== null ? record.surplusDailyLimit : '-') +
      '/' +
      (record.dailyLimit !== null ? record.dailyLimit : '-'),
  },
  {
    title: '单月剩余免密额度/单月银行免密度',
    dataIndex: '',
    width: 200,
    render: record =>
      (record.surplusMonthlyLimit !== null ? record.surplusMonthlyLimit : '-') +
      '/' +
      (record.monthlyLimit !== null ? record.monthlyLimit : '-'),
  },
  {
    title: '开户状态',
    dataIndex: 'openAccount',
    render: record => (record == 0 ? '未开户' : record == 1 ? '已开户' : ''),
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    render: record => moment(record).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '开户时间',
    dataIndex: 'openTime',
    render: record => moment(record).format('YYYY-MM-DD HH:mm:ss'),
  },
];

@permission
@connect(({ enterpriseManage, loading }) => ({
  enterpriseManage,
  loading:
    loading.effects['enterpriseManage/fetchList'] ||
    loading.effects['enterpriseManage/statusChangeManage'] ||
    loading.effects['enterpriseManage/downloadMember'] ||
    loading.effects['enterpriseManage/withdrawSubmit'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    oldPassInfo: {},
    currPage: 1,
    pageSize: 10,
    title: '添加',
    initColumns: [
      'key',
      'username',
      'businessName',
      'mobile',
      'accpTxno',
      'bankNo',
      'openAccount',
      'createTime',
      'openTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:businessUser:recharge') && (
                <Menu.Item onClick={() => this.rechargeHandle(record.userId)}>充值</Menu.Item>
              )}
              {permission.includes('chuangrong:businessAccount:withdraw') && (
                <Menu.Item
                  onClick={() => {
                    this.setState({
                      isModalShow: 1,
                      modalJson: { userId: record.userId, balance: record.balance },
                    });
                  }}
                >
                  提现
                </Menu.Item>
              )}
              {permission.includes('chuangrong:businessAccount:updateMobile') && (
                <Menu.Item
                  onClick={() => {
                    let that = this;
                    that.setState({
                      isModalShow: 2,
                      modalJson: { ...record },
                    });
                    // Modal.confirm({
                    //   content: `确定要执行本次操作吗？`,
                    //   okText: '确认',
                    //   cancelText: '取消',
                    //   onOk: () => {
                    //     that.setState({
                    //       isModalShow: 2,
                    //       modalJson: { ...record },
                    //     });
                    //   },
                    // })
                  }}
                >
                  修改手机号
                </Menu.Item>
              )}
              {permission.includes('chuangrong:businessAccount:reset') && (
                <Menu.Item
                  onClick={() => {
                    let that = this;
                    that.setState({
                      isModalShow: 3,
                      modalJson: { ...record },
                    });
                    // Modal.confirm({
                    //   content: `确定要执行本次操作吗？`,
                    //   okText: '确认',
                    //   cancelText: '取消',
                    //   onOk: () => {
                    //     that.setState({
                    //       isModalShow: 3,
                    //       modalJson: { ...record },
                    //     });
                    //   },
                    // })
                  }}
                >
                  修改密码
                </Menu.Item>
              )}
              {/*
                <Menu.Item onClick={() => this.statusChangeHandler(record.id)}>同步</Menu.Item>
              */}
            </Menu>
          );
          return permission.includes('chuangrong:businessUser:recharge') ||
            permission.includes('chuangrong:businessAccount:withdraw') ? (
            <Dropdown overlay={action}>
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
    isModalShow: 0,
  };
  // 充值
  rechargeHandle = accountCode => {
    this.rechargeForm.changeVisible(true);
    this.rechargeForm.getData(accountCode);
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
      type: 'enterpriseManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.enterpriseManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        {/* <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>{(searchWholeState ? '合并' : '展开') + '详细搜索'}</Button> */}
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  // 改变状态
  async statusChangeHandler(id) {
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
        type: 'enterpriseManage/statusChangeManage',
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
      enterpriseManage: { list, total },
    } = this.props;
    const {
      currPage,
      pageSize,
      data,
      selectedRows,
      isModalShow = 0,
      modalJson = {},
      oldPassInfo = {},
    } = this.state;
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
          {permission.includes('chuangrong:businessUser:list') ? (
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
        <ModifySpreads
          getChildData={child => (this.modifySpreadsChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <RechargeForm
          getChildData={child => (this.rechargeForm = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <WithdrawForm
          isShow={isModalShow === 1}
          modalJson={modalJson}
          callback={() => {
            this.setState({ isModalShow: 0 });
            setTimeout(() => {
              this.getList(currPage, pageSize);
            }, 1000);
          }}
        />
        <UpdateMobile
          isShow={isModalShow === 2}
          modalJson={modalJson}
          callback={flag => {
            this.setState({ isModalShow: 0 });
            if (flag === 'submit') {
              setTimeout(() => {
                this.getList(currPage, pageSize);
              }, 1000);
            }
          }}
        />
        <UpdatePassword
          isShow={isModalShow === 3}
          modalJson={modalJson}
          callback={(flag, params) => {
            if (flag === 'submit') {
              this.setState({ isModalShow: 4, oldPassInfo: params });
            } else {
              this.setState({ isModalShow: 0 });
            }
          }}
        />
        <UpdatePasswordSecond
          oldPassInfo={oldPassInfo}
          isShow={isModalShow === 4}
          modalJson={modalJson}
          callback={flag => {
            this.setState({ isModalShow: 0 });
            if (flag === 'submit') {
              setTimeout(() => {
                this.getList(currPage, pageSize);
              }, 1000);
            }
          }}
        />
      </PageHeaderWrapper>
    );
  }
}
