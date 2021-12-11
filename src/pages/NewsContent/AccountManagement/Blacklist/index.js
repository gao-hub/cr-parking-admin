import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Tabs, Icon, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterIpts from './FilterIpts';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import Swal from 'sweetalert2';
// 添加/修改表单
import ModifyForm from './ModifyForm';

const { TabPane } = Tabs;
@permission
@connect(({ accountManagement, loading }) => ({
  accountManagement,
  loading: loading.effects['accountManagement/fetchList'],
}))
export default class template extends PureComponent {
  state = {
    searchWholeState: false,
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'trueName',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickName',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '一级渠道',
        dataIndex: 'utmName',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '添加时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          return (
            <a className="ant-dropdown-link" href="#" onClick={() => this.deleteHandler(record.id)}>
              {permission.includes('chuangrong:userBlackList:delete') && '删除'}
            </a>
          );
        },
      },
    ],
    currPage: 1,
    pageSize: 10,
  };

  // 删除
  async deleteHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要删除吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'accountManagement/deleteBlackUser',
        payload: {
          id,
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
  // 添加
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:userBlackList:add') && (
          <Button onClick={() => this.modifyChild.changeVisible(true)}>
            <Icon type="plus" />
            添加
          </Button>
        )}

        <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  // 页数改变时
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
  // 一页加载数量改变时
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
  // 获取列表
  getList = (currPage, pageSize) => {
    this.setState({ currPage });
    this.props.dispatch({
      type: 'accountManagement/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.accountManagement.searchInfo,
      },
    });
  };

  componentDidMount() {
    this.getList(this.state.currPage, this.state.pageSize);
  }

  render() {
    const {
      permission,
      accountManagement: { blackList, total },
    } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.defcolumns,
      data: {
        list: blackList,
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
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        {permission.includes('chuangrong:userBlackList:list') ? (
          <Card bordered={false}>
            <FilterIpts
              searchWholeState={this.state.searchWholeState}
              getList={this.getList}
              pageSize={pageSize}
            />
            <StandardTable {...values} />
          </Card>
        ) : null}

        <ModifyForm
          getChildData={child => (this.modifyChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
      </PageHeaderWrapper>
    );
  }
}
