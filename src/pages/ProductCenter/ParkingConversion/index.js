import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import PermissionWrapper from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';

//   检索条件
import FilterIpts from './FilterIpts';

@PermissionWrapper
@connect(({ parkingConversionModel, loading }) => ({
  parkingConversionModel,
  loading: loading.effects['parkingConversionModel/fetchList'],
  exportLoading: loading.effects['parkingConversionModel/exportFile'],
}))
class template extends PureComponent {
  state = {
    currPage: 1,
    pageSize: 10,
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '楼盘名称',
        dataIndex: 'buildingName',
      },
      {
        title: '车位编号',
        dataIndex: 'parkingCode',
      },
      {
        title: '车位价格',
        dataIndex: 'parkingPrice',
      },
      {
        title: '转化次数',
        dataIndex: 'tranferTimes',
      },
      {
        title: '资金成本',
        children: [
          {
            title: '佣金',
            dataIndex: 'commission',
          },
          {
            title: '溢价/租金',
            dataIndex: 'rent',
          },
          {
            title: '总计',
            dataIndex: 'total',
          },
        ],
      },
      {
        title: '操作',
        render: (_, record) => (
          <Button
            type="link"
            onClick={() => {
              router.push({
                pathname: '/product/parking/conversionInfo',
                query: {
                  id: record.id,
                },
              });
            }}
          >
            查看详情
          </Button>
        ),
      },
    ],
  };

  componentDidMount() {
    const { currPage, pageSize } = this.state;
    this.getList(currPage, pageSize);
  }

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

  getList = async (currPage, pageSize) => {
    const {
      dispatch,
      parkingConversionModel: { searchInfo },
    } = this.props;
    await this.setState({ currPage, pageSize });
    dispatch({
      type: 'parkingConversionModel/fetchList',
      payload: {
        currPage,
        pageSize,
        ...searchInfo,
      },
    });
  };

  exportFile = () => {
    const { dispatch } = this.props;
    const formData = this.child.getFormValue();
    return dispatch({
      type: 'parkingConversionModel/exportFile',
      payload: formData,
    });
  };

  renderBtn = () => {
    const { permission, exportLoading } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:parkingConversion:export') ? (
          <ExportLoading exportLoading={exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        ) : null}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  getChild = ref => {
    this.child = ref;
  };

  render() {
    const {
      permission,
      loading,
      parkingConversionModel: { list = [], total },
    } = this.props;
    const { currPage, pageSize, defcolumns } = this.state;
    const values = {
      columns: defcolumns,
      data: {
        list,
      },
      bordered: true,
      loading,
      pagination: {
        showTotal: total1 => `共 ${total1} 条`,
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
          {permission.includes('chuangrong:parkingConversion:list') ? (
            <>
              <FilterIpts getList={this.getList} getChild={this.getChild} pageSize={pageSize} />
              <StandardTable {...values} />
            </>
          ) : null}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default template;
