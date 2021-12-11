import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon } from 'antd';

import permission from '@/utils/PermissionWrapper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterIpts from './FilterIpts';
import StandardTable from '@/components/StandardTable';

@permission
@connect(({ activityMessage, loading }) => ({
  activityMessage,
  loading: loading.effects['activityMessage/getRecordList'],
}))
export default class RecordList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    searchWholeState: true,
    syncColumns: [],
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
        width: 80,
      },
      {
        title: '推送对象',
        dataIndex: 'consumerUserTypeStr',
      },
      {
        title: '推送人',
        dataIndex: 'userName',
      },
      {
        title: '消息编号',
        dataIndex: 'msgNo',
      },
      {
        title: '标题',
        dataIndex: 'msgTitle',
      },
      {
        title: '推送类型',
        dataIndex: 'sendTypeStr',
      },
      {
        title: '状态',
        dataIndex: 'sendStatusStr',
      },
      {
        title: '提交时间',
        dataIndex: 'planUpdateTime',
      },
      {
        title: '推送成功时间',
        dataIndex: 'createTime',
      },
    ],
    staticColumns: [],
  };

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  getList = async (currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize,
    });
    const payload = {
      currPage,
      pageSize,
      ...this.props.activityMessage.record.searchInfo,
    };
    this.props.dispatch({
      type: 'activityMessage/getRecordList',
      payload,
    });
  };

  getChild = ref => {
    this.cihld = ref;
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

  renderBtn = () => {
    return (
      <Fragment>
        <Button style={{ marginBottom: '16px' }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  render() {
    const { currPage, pageSize } = this.state;
    const {
      permission,
      activityMessage: {
        record: { list, total, totalAmount },
      },
    } = this.props;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => `共${total}条`,
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
      <Fragment>
        <PageHeaderWrapper hiddenBreadcrumb={true} renderBtn={this.renderBtn}>
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              getChild={this.getChild}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}
