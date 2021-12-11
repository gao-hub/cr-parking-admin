import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import PermissionWrapper from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';


//   检索条件
import FilterIpts from './FilterIpts';



@PermissionWrapper
@connect(({ IntegralDetail, loading }) => ({
  IntegralDetail,
  loading:
    loading.effects['IntegralDetail/fetchList'],
  exportLoading: loading.effects['IntegralDetail/exportExcel'],
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
          title: '渠道',
          dataIndex: 'parentUtm',
        },
        {
          title: '积分类型',
          dataIndex: 'changeType',
          render: (record) => {
            if(record - 0 === 0 ) {
              return '获得积分'
            }
            if(record - 0 === 1 ) {
              return '消耗积分'
            }
            return false;
          }
        },
        {
          title: '订单号',
          dataIndex: 'businessOrderNo',
        },
        {
          title: '订单类型',
          dataIndex: 'businessType'
        },
        {
          title: '积分交易名称',
          dataIndex: 'integralTradeName',
        },
        {
          title: '实际支付金额',
          dataIndex: 'payment',
        },
        {
          title: '本次获得/消耗积分',
          dataIndex: 'changeNum',
        },
        {
          title: '积分状态',
          dataIndex: 'integralStatus',
          render: (record) => {
            if (record - 0 === 0) {
              return '已冻结';
            }
            if (record - 0 === 1) {
              return '已发放';
            }
            if (record - 0 === 2) {
              return '已消耗';
            }
            if (record - 0 === 5) {
              return '冻结消耗';
            }
            return false
          },
        },
        {
          title: '当前可用积分',
          dataIndex: 'totalNum',
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          render: (record) => {
            return <span style={{color: '#FF6600'}}>{record}</span>
          }
        }
      ],
      syncColumns: []
    };
  }

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns]);
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
      type: 'IntegralDetail/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.IntegralDetail.searchInfo,
      },
    });
  };


  // 
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {
          permission.includes('chuangrong:integralBusinessLog:export') &&
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading>
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
      type: 'IntegralDetail/exportExcel',
      payload: formData,
    });
  };

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
      IntegralDetail: { data: { list, pagination: { total } } },
    } = this.props;
    const {
      currPage,
      pageSize,
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
    return permission.includes('chuangrong:integralBusinessLog:view') ? (
      <Fragment>
        <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
          {
            permission.includes('chuangrong:integralBusinessLog:list') &&
            <Card bordered={false}>
              <FilterIpts
                getList={this.getList}
                getChild={this.getChild}
                pageSize={pageSize}
              />
              <StandardTable {...values} />
            </Card>
          }

        </PageHeaderWrapper>
      </Fragment>
    ) : null;
  }
}

export default IndexComponent;
