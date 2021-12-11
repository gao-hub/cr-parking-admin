/**
 * 企业用户列表
 */
import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon,  message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';


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
    label: '当前手机号',
    value: 'userMobile',
  },
  {
    label: '姓名',
    value: 'userTrueName',
  },
  {
    label: '身份证号',
    value: 'idcardNo',
  },
  {
    label: '银行卡号',
    value: 'cardNo',
  },
  {
    label: '银行卡预留手机号',
    value: 'bankMobile',
  },
  {
    label: '默认银行卡',
    value: 'defaultCardStr',
  },
  {
    label: '绑卡时间',
    value: 'createTime',
  },
];
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
    title: '当前手机号',
    dataIndex: 'userMobile',
  },
  {
    title: '姓名',
    dataIndex: 'userTrueName',
  },
  {
    title: '身份证号',
    dataIndex: 'idcardNo',
  },
  {
    title: '银行卡号',
    dataIndex: 'cardNo',
  },
  {
    title: '银行卡预留手机号',
    dataIndex: 'bankMobile',
  },
  {
    title: '默认银行卡',
    dataIndex: 'defaultCardStr',
  },
  {
    title: '绑卡时间',
    dataIndex: 'createTime',
    render: record => moment(record).format('YYYY-MM-DD HH:mm:ss'),
  },
];

@permission
@connect(({ bankcardManage, loading }) => ({
  bankcardManage,
  loading:
    loading.effects['bankcardManage/fetchList'] ||
    loading.effects['bankcardManage/statusChangeManage'] ||
    loading.effects['bankcardManage/downloadMember'] ||
    loading.effects['bankcardManage/withdrawSubmit'],
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
      'userName',
      'userMobile',
      'userTrueName',
      'idcardNo',
      'cardNo',
      'bankMobile',
      'defaultCardStr',
      'createTime',
    ],
    syncColumns: [],
    staticColumns: [
    ],
    searchWholeState: false,
    isModalShow: 0,
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
      type: 'bankcardManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.bankcardManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

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
      bankcardManage: { list, total },
    } = this.props;
    const { currPage, pageSize, data, selectedRows, isModalShow = 0, modalJson = {} } = this.state;
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
          {permission.includes('chuangrong:userBankCard:list') ? (
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
    );
  }
}
