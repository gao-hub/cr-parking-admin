import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import StandardTable from '@/components/StandardTable';
import { Card, Button, message } from 'antd';
import FilterInpts from './FilterIpts';

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
  },
  {
    title: '商家订单号',
    dataIndex: 'merchantOrderNo',
  },
  {
    title: '银行流水号',
    dataIndex: 'seqNo',
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
  },
  {
    title: '充值手机号',
    dataIndex: 'rechargeMobile',
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '充值金额',
    dataIndex: 'rechargeAmount',
  },
  {
    title: '实际支付',
    dataIndex: 'payAmount',
  },
  // {
  //   title: '支付渠道',
  //   dataIndex: 'parentUtmName',
  // },
  {
    title: '支付方式',
    dataIndex: 'payWayStr',
  },
  {
    title: '支付状态',
    dataIndex: 'payStatusStr',
  },
  {
    title: '充值状态',
    dataIndex: 'rechargeStatusStr',
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
  },
];

@permission
@connect(({ rechargeOrder, loading }) => ({
  rechargeOrder,
  loading: loading.effects['rechargeOrder/getList'],
  exportLoading: loading.effects['rechargeOrder/exportFile'],
}))
export default class RechargeOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currPage: 1,
      pageSize: 10,
      searchWholeState: true,
      syncColumns: [],
      staticColumns: [],
    };
  }
  componentDidMount() {
    this.syncChangeColumns([...defcolumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }
  getList = async (currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'rechargeOrder/getList',
      payload: {
        currPage,
        pageSize,
        ...this.props.rechargeOrder.searchInfo,
      },
    });
  };
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
  getChild = ref => {
    this.child = ref;
  };
  exportFile = () => {
    const { dispatch } = this.props;
    const formData = this.child.getFormValue();
    if (!formData.createTimeStart && !formData.createTimeEnd) {
      return message.error('请选择导出的时间范围');
    }
    return dispatch({
      type: 'rechargeOrder/exportFile',
      payload: formData,
    });
  };
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:rechargeorder:export') ? (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        ) : null}
        <Button onClick={() => window.location.reload()}>刷新</Button>
      </Fragment>
    );
  };
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };
  render() {
    const {
      permission,
      rechargeOrder: { list, total },
    } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: { list: list },
      loading: this.props.loading,
      pagination: {
        showTotal: total => `共${total}条`,
        currPage: currPage,
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
        {permission.includes('chuangrong:rechargeorder:list') && (
          <Card bordered={false}>
            <FilterInpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
        )}
      </PageHeaderWrapper>
    );
  }
}
