import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';

import SetColumns from '@/components/SetColumns';

//   检索条件
import FilterIpts from './FilterIpts';
import { formatNumber } from '@/utils/utils';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '续约编号',
    value: 'renewNo',
  },
  {
    label: '车位订单号',
    value: 'parkingOrderNo',
  },
  {
    label: '购买订单号',
    value: 'orderNo',
  },
  {
    label: '车位用途',
    value: 'useTypeStr',
  },
  {
    label: '用户名',
    value: 'buyerName',
  },
  {
    label: '姓名',
    value: 'buyerTrueName',
  },
  {
    label: '推荐人',
    value: 'spreadUserName',
  },
  // {
  //   label: '推荐人角色',
  //   value: 'spreadRoleName',
  // },
  {
    label: '一级渠道',
    value: 'parentUtmName',
  },
  // {
  //   label: '渠道',
  //   value: 'utmName',
  // },
  {
    label: '楼盘地区',
    value: 'buildingArea',
  },
  {
    label: '楼盘名称',
    value: 'buildingName',
  },
  {
    label: '车位号',
    value: 'parkingCode',
  },
  {
    label: '购买价款',
    value: 'originalPrice',
  },
  {
    label: '持有天数',
    value: 'holdDays',
  },
  {
    label: '代销周期',
    value: 'investMonth',
  },
  {
    label: '续约期次',
    value: 'period',
  },
  {
    label: '当前状态',
    value: 'status',
  },
  {
    label: '续约时间',
    value: 'renewDate',
  },
  {
    label: '委托结束日',
    value: 'dueDate',
  },
];
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
    title: '购买订单号',
    dataIndex: 'orderNo',
  },
  {
    title: '车位用途',
    dataIndex: 'useTypeStr',
  },
  {
    title: '用户名',
    dataIndex: 'buyerName',
  },
  {
    title: '姓名',
    dataIndex: 'buyerTrueName',
  },
  {
    title: '推荐人',
    dataIndex: 'currSpreadUserName',
  },
  // {
  //   title: '推荐人角色',
  //   dataIndex: 'currSpreadRoleName',
  // },
  {
    title: '一级渠道',
    dataIndex: 'parentUtmName',
  },
  // {
  //   title: '渠道',
  //   dataIndex: 'currUtmName',
  // },
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
  },
  {
    title: '持有天数',
    dataIndex: 'holdDays',
  },
  {
    title: '代销周期',
    dataIndex: 'investMonth',
  },
  {
    title: '续约期次',
    dataIndex: 'period',
  },
  {
    title: '当前状态',
    dataIndex: 'status',
  },
  {
    title: '续约时间',
    dataIndex: 'renewDate',
  },
  {
    title: '委托结束日',
    dataIndex: 'dueDate',
  },
];

@permission
@connect(({ renewalManage, loading }) => ({
  renewalManage,
  loading:
    loading.effects['renewalManage/fetchList'] || loading.effects['renewalManage/getModifyInfo'],
  exportLoading: loading.effects['orderManage/exportExcel'],
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
      'renewNo',
      'parkingOrderNo',
      'orderNo',
      'useTypeStr',
      'buyerName',
      'buyerTrueName',
      'currSpreadUserName',
      'currSpreadRoleName',
      'currUtmName',
      'buildingArea',
      'buildingName',
      'parkingCode',
      'originalPrice',
      'holdDays',
      'investMonth',
      'period',
      'status',
      'renewDate',
      'dueDate',
    ],
    syncColumns: [],
    staticColumns: [],
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
    await this.setState({ currPage, pageSize });
    console.log(this.state)
    this.props.dispatch({
      type: 'renewalManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.renewalManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:renew:export') && (
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

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();
    const { renewDateStart, renewDateEnd } = formData;
    // 添加前端必要字段校验
    if (!renewDateStart || !renewDateEnd) {
      return message.warning('请选择导出的时间范围！');
    }
    dispatch({
      type: 'renewalManage/exportExcel',
      payload: formData,
    });
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
      renewalManage: { list, total },
    } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
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
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        <Card bordered={false}>
          {permission.includes('chuangrong:renew:list') ? (
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
