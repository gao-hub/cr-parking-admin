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
@connect(({ GrowupInfoList, loading }) => ({
  GrowupInfoList,
  loading:
    loading.effects['GrowupInfoList/fetchList'],
  exportLoading: loading.effects['GrowupInfoList/exportExcel'],
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
          dataIndex: 'mobile',
        },
        {
          title: '渠道',
          dataIndex: 'parentUtmIdStr',
        },
        {
          title: '获得/扣回',
          dataIndex: 'changeType',
          render: (record) => {
            if(record - 0 === 0 ) {
              return '获得'
            }
            if(record - 0 === 1 ) {
              return '扣回'
            }
            return false;
          }
        },
        {
          title: '订单号',
          dataIndex: 'orderNo',
        },
        {
          title: '成长值类型',
          dataIndex: 'growthTypeName'
        },
        {
          title: '实际支付金额',
          dataIndex: 'actualPay',
        },
        {
          title: '本次获得/扣回成长值',
          dataIndex: 'changeValue',
        },
        {
          title: '成长值获得/扣回时间',
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
      type: 'GrowupInfoList/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.GrowupInfoList.searchInfo,
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
      type: 'GrowupInfoList/exportExcel',
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
      GrowupInfoList: { data: { list, pagination: { total } } },
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
