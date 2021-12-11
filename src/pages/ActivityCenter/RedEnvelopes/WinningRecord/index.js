import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';

import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import FilterIpts from './FilterIpts';


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
    title: '奖品名称',
    dataIndex: 'activityPrizeName',
  },
  {
    title: '领取状态',
    dataIndex: 'deliveryStatusStr',
  },
  {
    title: '领取时间',
    dataIndex: 'deliveryTime',
  }
];

@permission
@connect(({ redRecord, loading }) => ({
  redRecord,
  loading: loading.effects['redRecord/getList']
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    syncColumns: [],
    searchWholeState: false,
  };

  componentDidMount() {
    this.syncChangeColumns([...defcolumns]);
    this.getList(this.state.currPage, this.state.pageSize);
    // 获取select
    this.props.dispatch({
      type: 'redRecord/getSelect',
      payload: {},
    });
  }

  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  //   页数改变时
  onChange = (currPage) => {
    this.setState({
      currPage,
    }, () => {
      this.getList(currPage, this.state.pageSize);
    });
  };
  onShowSizeChange = (currPage, pageSize) => {
    this.setState({
      currPage,
      pageSize,
    }, () => {
      this.getList(currPage, pageSize);
    });
  };
  getList = async (currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'redRecord/getList',
      payload: {
        currPage,
        pageSize,
        ...this.props.redRecord.searchInfo,
      },
    });
  };

  exportExcel = () => {
    let formData = this.child.getFormValue();
    this.props.dispatch({
      type: 'redRecord/exportFile',
      payload: formData,
    });
  };

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {
          permission.includes('chuangrong:redrecord:export') &&
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
            导出
          </ExportLoading>
        }
        <Button onClick={() => window.location.reload()}><Icon type='reload' />刷新</Button>
      </Fragment>
    );
  };

 

  

  getChild = ref => this.child = ref;

  render() {
    const { permission, redRecord: { list, total } } = this.props;
    const { currPage, pageSize,  deliveryId } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: (total) => ('共 ' + total + ' 条'),
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
        {
          permission.includes('chuangrong:redrecord:list') && (
            <Card bordered={false}>
              <FilterIpts
                getChild={child => this.child = child}
                pageSize={pageSize}
                getList={this.getList}
              />
              <StandardTable
                {...values}
              />
            </Card>
          )
        }
       
      </PageHeaderWrapper>
    );
  }
}
