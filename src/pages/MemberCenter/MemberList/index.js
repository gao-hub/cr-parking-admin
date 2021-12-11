import React, { PureComponent, Fragment } from 'react';
import { Modal, Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Swal from 'sweetalert2';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import ExportLoading from '@/components/ExportLoading';
import ModifyForm from './ModifyForm';
import ModifySpreads from './ModifySpreads';
import ModifyCustoms from './ModifyCustoms';
import ModifyRoles from './ModifyRoles';
import ModifyUtm from './ModifyUtm';
import ModifyChannel from './ModifyChannel';
import ModifyIntegral from './ModifyIntegral';
import ModifyGrowUp from './ModifyGrowUp';
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
    label: '推荐人',
    value: 'spreadsUserName',
  },
  {
    label: '会员等级',
    value: 'gradeStr',
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
    label: '姓名',
    value: 'truename',
  },
  // {
  //   label: '身份证号',
  //   value: 'idcard',
  // },
  {
    label: '手机号',
    value: 'mobile',
  },
  // {
  //   label: '所属银行',
  //   value: 'bank',
  // },
  // {
  //   label: 'ACCP用户编号',
  //   value: 'accpUserno',
  // },
  // {
  //   label: '合作银行账户',
  //   value: 'bankCardNo',
  // },
  // {
  //   label: '银行卡',
  //   value: 'bankCardNo',
  // },
  {
    label: '角色',
    value: 'roleName',
  },
  {
    label: '邀请码',
    value: 'userId',
  },
  {
    label: '开户状态',
    value: 'openAccountStr',
  },
  {
    label: '完善通讯地址',
    value: 'addressStatusStr',
  },
  // {
  //   label: "实名认证状态",
  //   value: "openCertStr"
  // },
  // {
  //   label: '会员级别',
  //   value: 'levelStr',
  // },
  {
    label: '状态',
    value: 'openStatus',
  },
  {
    label: '注册时间',
    value: 'regTime',
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
    title: '推荐人',
    dataIndex: 'spreadsUserName',
  },
  {
    title: '会员等级',
    dataIndex: 'gradeStr',
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
    title: '姓名',
    dataIndex: 'truename',
  },
  // {
  //   title: '身份证号',
  //   dataIndex: 'idcard',
  // },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: '当前积分',
    dataIndex: 'currIntegral'
  },
  {
    title: '当前成长值',
    dataIndex: ''
  },
  // {
  //   title: '所属银行',
  //   dataIndex: 'bank',
  // },
  // {
  //   title: 'ACCP用户编号',
  //   dataIndex: 'accpUserno',
  // },
  // {
  //   title: '合作银行账户',
  //   dataIndex: 'bankCardNo',
  // },
  // {
  //   title: '银行卡',
  //   dataIndex: 'bankCardNo',
  // },
  {
    title: '角色',
    dataIndex: 'roleName',
  },
  {
    title: '邀请码',
    dataIndex: 'userId',
  },
  {
    title: '开户状态',
    dataIndex: 'openAccountStr',
  },
  {
    title: '完善通讯地址',
    dataIndex: 'addressStatusStr',
  },
  // {
  //   title: "实名认证状态",
  //   dataIndex: "openCertStr"
  // },
  // {
  //   title: '会员级别',
  //   dataIndex: 'levelStr',
  // },
  {
    title: '状态',
    dataIndex: 'openStatus',
    render: record => (record == 0 ? '启用' : record == 1 ? '禁用' : ''),
  },
  {
    title: '注册时间',
    dataIndex: 'regTime',
    render: record => moment(record).format('YYYY-MM-DD HH:mm:ss'),
  },
];

@permission
@connect(({ userManage, loading }) => ({
  userManage,
  loading:
    loading.effects['userManage/fetchList'] ||
    loading.effects['userManage/statusChangeManage'] ||
    loading.effects['userManage/downloadMember'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    initColumns: [
      'key',
      'username',
      'spreadsUserName',
      'gradeStr',
      'parentUtmName',
      // 'utmName',
      'truename',
      'idcard',
      'mobile',
      'accpUserno',
      'bankCardNo',
      'roleName',
      // 'levelStr',
      'userId',
      'openAccountStr',
      'addressStatusStr',
      // "openCertStr",
      'openStatus',
      'regTime',
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              <Menu.Item onClick={() => this.statusChangeHandler(record)}>
                {record.openStatus == 0 ? '禁用' : '启用'}
              </Menu.Item>
              {/*
                <Menu.Item
                  onClick={() => {
                    this.modifyChild.changeVisible(true);
                    this.modifyChild.setState({
                      dataInfo: record,
                    });
                  }}
                >
                  修改手机号
                </Menu.Item>
              */}
              {/* {permission.includes('chuangrong:customer:updateutm') &&
                record &&
                record.roleId === 3 && (
                  <Menu.Item
                    onClick={() => {
                      this.modifyUtmChild.changeVisible(true);
                      this.modifyUtmChild.setState({
                        dataInfo: record,
                      });
                    }}
                  >
                    修改渠道
                  </Menu.Item>
                )} */}
              {permission.includes('chuangrong:customer:detail') && (
                <Menu.Item
                  onClick={() => {
                    this.props.dispatch(
                      routerRedux.push({
                        pathname: '/member/detail',
                        search: '?userId=' + record.userId,
                      })
                    );
                  }}
                >
                  详情
                </Menu.Item>
              )}
              {permission.includes('chuangrong:customer:updateParentUtm') && (
                <Menu.Item
                  onClick={() => {
                    this.modifyChannel.changeVisible(true);
                    this.modifyChannel.setState(
                      {
                        dataInfo: record,
                      },
                      () => this.modifyChannel.getTableList()
                    );
                  }}
                >
                  修改一级渠道
                </Menu.Item>
              )}
              {permission.includes('chuangrong:customer:spreads') &&
                record &&
                record.roleId !== 3 && (
                  <Menu.Item
                    onClick={() => {
                      this.modifySpreadsChild.changeVisible(true);
                      this.modifySpreadsChild.setState({ dataInfo: record });
                      this.props.dispatch({
                        type: 'userManage/spreadsLog',
                        payload: {
                          currPage: 1,
                          pageSize: 10,
                          userId: record.userId,
                        },
                      });
                    }}
                  >
                    修改推荐人
                  </Menu.Item>
                )}
              {permission.includes('chuangrong:customer:updatetostaff') &&
                record &&
                record.roleId === 1 && (
                  <Menu.Item
                    onClick={() => {
                      this.modifyCustomsChild.changeVisible(true);
                      this.modifyCustomsChild.setState({ dataInfo: record });
                    }}
                  >
                    客户更改为员工
                  </Menu.Item>
                )}
              {/*{permission.includes('chuangrong:customer:spreads') && record && record.roleId !== 3 &&*/}
              {/*<Menu.Item*/}
              {/*  onClick={() => {*/}
              {/*    this.modifyRolesChild.changeVisible(true);*/}
              {/*    this.modifyRolesChild.setState({*/}
              {/*      dataInfo: record,*/}
              {/*    });*/}
              {/*    this.props.dispatch({*/}
              {/*      type: 'userManage/spreadsLog',*/}
              {/*      payload: {*/}
              {/*        currPage: 1,*/}
              {/*        pageSize:10,*/}
              {/*        userId:record.userId*/}
              {/*      },*/}
              {/*    })*/}
              {/*  }}*/}
              {/*>*/}
              {/*  修改角色*/}
              {/*</Menu.Item>*/}
              {/*}*/}

              {permission.includes('chuangrong:customer:export') &&
                record.certName &&
                record.certName !== '' /* certName判断是否实名认证 */ && (
                  <Menu.Item
                    onClick={() => {
                      this.props.dispatch({
                        type: 'userManage/downloadMember',
                        payload: record.userId,
                      });
                      // this.modifyChild.changeVisible(true);
                      // this.modifyChild.setState({
                      //   dataInfo: record,
                      // });
                      // 请求下载信息接口
                    }}
                  >
                    下载身份信息
                  </Menu.Item>
                )}
              {permission.includes('chuangrong:customer:mobile') ? (
                <Menu.Item
                  onClick={async () => {
                    const { dispatch } = this.props;
                    const res = await dispatch({
                      type: 'userManage/showMobile',
                      payload: {
                        userId: record.userId,
                      },
                    });

                    if (res && res.status === 1) {
                      Modal.success({ title: res.data && res.data.mobile });
                    } else {
                      message.error(res && res.statusDesc);
                    }
                  }}
                >
                  <Icon type="edit" />
                  查看手机号
                </Menu.Item>
              ) : null}
              {
                permission.includes('chuangrong:integralModifyLog:update') ? (
                  <Menu.Item
                    onClick={async () => {
                      const { dispatch } = this.props;
                      this.getIntegralInfo(true, record)
                    }}
                  >
                    修改积分
                  </Menu.Item>) : null
              }

              {
                permission.includes('chuangrong:integralModifyLog:update') ? (
                  <Menu.Item
                    onClick={async () => {
                      const { dispatch } = this.props;
                      this.getGrowupInfo(true, record)
                    }}
                  >
                    修改成长值
                  </Menu.Item>) : null
              }
            </Menu>
          );
          return permission.includes('chuangrong:customer:update') ? (
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
      type: 'userManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.userManage.searchInfo,
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
  async statusChangeHandler(record) {
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
        type: 'userManage/statusChangeManage',
        payload: {
          userId: record.userId,
          openStatus: record.openStatus == 0 ? 1 : 0,
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

  getIntegralInfo = async (flag, dataInfo) => {
    const { dispatch } = this.props;
    const { currPage, pageSize } = this.state;
    await dispatch({
      type: 'userManage/getIntegralInfo',
      payload: {
        currPage,
        pageSize,
        userId: dataInfo.userId,
      },
    });
    this.setState({
      dataInfo
    })
    this.modifyIntegral.changeVisible(flag);
  }
  getGrowupInfo = async (flag, dataInfo) => {
    const { dispatch } = this.props;
    const { currPage, pageSize } = this.state;
    await dispatch({
      type: 'userManage/getGrowupInfo',
      payload: {
        currPage,
        pageSize,
        userId: dataInfo.userId,
      },
    });
    this.setState({
      dataInfo
    })
    this.modifyIntegral.changeVisible(flag);
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
      userManage: { list, total },
    } = this.props;
    const { currPage, pageSize, data, selectedRows, dataInfo } = this.state;
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
          {permission.includes('chuangrong:customer:list') ? (
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
        <ModifyCustoms
          getChildData={child => (this.modifyCustomsChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <ModifyRoles
          getChildData={child => (this.modifyRolesChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <ModifyUtm
          getChildData={child => (this.modifyUtmChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <ModifyChannel
          getChildData={child => (this.modifyChannel = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <ModifyIntegral
          getChildData={child => (this.modifyIntegral = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
          dataInfo={dataInfo}
        />
        <ModifyGrowUp
          getChildData={child => (this.modifyIntegral = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
          dataInfo={dataInfo}
        />
      </PageHeaderWrapper>
    );
  }
}
