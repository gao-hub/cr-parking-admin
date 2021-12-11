import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message, Modal, Tooltip } from 'antd';
import { connect } from 'dva';

import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import FilterIpts from './FilterIpts';
import ModifyForm from './ModifyForm';

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
    title: '累计获得抽奖次数',
    dataIndex: 'totalTimes',
  },
  {
    title: '已用',
    dataIndex: 'useNum',
  },
  {
    title: '未用',
    dataIndex: 'notUseNum',
  },
  {
    title: '抽奖码',
    dataIndex: 'prizeCode',
    render: (_, record) => {
      if (record.prizeCode) {
        const codeArray = record.prizeCode.split(',');
        if (codeArray.length > 3) {
          return (
            <Tooltip title={record.prizeCode}>
              <span>
                {codeArray.slice(0, 3).join(',')}
                ...
              </span>
            </Tooltip>
          );
        }
        return record.prizeCode;
      }
      return '-';
    },
  },
];

@permission
@connect(({ unifiedLotteryActivityUserDetails, loading }) => ({
  unifiedLotteryActivityUserDetails,
  loading: loading.effects['unifiedLotteryActivityUserDetails/getList'],
  exportLoading: loading.effects['unifiedLotteryActivityUserDetails/exportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    syncColumns: [],
    actionType: '',
    actionId: 0,
    userId: 0,
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:activityCodeTimesChange:update') ? (
                <Menu.Item
                  onClick={() => {
                    this.setState(
                      {
                        actionType: 'edit',
                        actionId: record.id,
                        userId: record.userId,
                      },
                      () => {
                        this.modelChild.setVisible();
                      }
                    );
                  }}
                >
                  修改
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
    searchWholeState: false,
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.setState({
      activityId: id,
    });
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
    // 获取渠道的select
    this.props.dispatch({
      type: 'unifiedLotteryActivityUserDetails/getSelect',
      payload: {},
    });
  }

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
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
      type: 'unifiedLotteryActivityUserDetails/getList',
      payload: {
        activityId: this.state.activityId,
        currPage,
        pageSize,
        ...this.props.unifiedLotteryActivityUserDetails.searchInfo,
      },
    });
  };

  exportExcel = () => {
    let formData = this.child.getFormValue();
    this.props.dispatch({
      type: 'unifiedLotteryActivityUserDetails/exportFile',
      payload: { ...formData, activityId: this.state.activityId },
    });
  };

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:activityCodeTimesChange:export') && (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
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

  getChild = ref => (this.child = ref);

  render() {
    const {
      permission,
      unifiedLotteryActivityUserDetails: { list, total },
    } = this.props;
    const { currPage, pageSize, actionId, actionType, activityId, userId } = this.state;
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
        {permission.includes('chuangrong:activityCodeTimesChange:list') && (
          <>
            <Card bordered={false}>
              <FilterIpts
                getChild={child => (this.child = child)}
                pageSize={pageSize}
                getList={this.getList}
              />
              <StandardTable {...values} />
            </Card>
            <ModifyForm
              getChild={child => (this.modelChild = child)}
              actionId={actionId}
              getList={this.getList}
              actionType={actionType}
              activityId={activityId}
              userId={userId}
            />
          </>
        )}
      </PageHeaderWrapper>
    );
  }
}
