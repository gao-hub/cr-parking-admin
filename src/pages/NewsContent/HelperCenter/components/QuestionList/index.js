import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';
import StandardTable from '@/components/StandardTable';
import { Card, Menu, Modal, Button, Icon, Dropdown, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterIpts from './FilterIpts';
import AddQuestion from '../AddQuestion';
import ExportLoading from '@/components/ExportLoading';
import Swal from 'sweetalert2';

@permission
@connect(({ helperCenter, loading }) => ({
  helperCenter,
  loading: loading.effects['helperCenter/getQuestionList'],
  exportLoading: loading.effects['helperCenter/exportFile'],
}))
export default class QuestionList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    searchWholeState: true,
    actionType: '',
    actionId: '',
    typeId: '', // 分类的id
    syncColumns: [],
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '分类',
        dataIndex: 'typeName',
      },
      {
        title: '问题名称',
        dataIndex: 'helpName',
      },
      {
        title: '是否属于常见问题',
        dataIndex: 'isMajorStr',
      },
      {
        title: '状态',
        dataIndex: 'openStatusStr',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
    ],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const MenuItem = Menu.Item;
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:helpInfo:status') && (
                <MenuItem onClick={() => this.setDataStatus(record)}>
                  {record.openStatus === 1 ? '禁用' : '启用'}
                </MenuItem>
              )}
              {permission.includes('chuangrong:helpInfo:update') && (
                <MenuItem onClick={() => this.handleEdit(record)}>修改</MenuItem>
              )}
              {permission.includes('chuangrong:helpInfo:delete') && (
                <MenuItem onClick={() => this.handleDelete(record)}>删除</MenuItem>
              )}
            </Menu>
          );
          return (
            <Dropdown overlay={action}>
              <a className='ant-dropdown-link' href='#'>
                操作
                <Icon type='down' />
              </a>
            </Dropdown>
          );
        },
      },
    ],
    templateId: '',
  };

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }

  componentWillUnmount() {
    sessionStorage.removeItem('helperCenterTab');
  }

  syncChangeColumns = array => {
    this.setState({
      syncColumns: array,
    });
  };

  getList = (currPage, pageSize) => {
    this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'helperCenter/getQuestionList',
      payload: {
        currPage,
        pageSize,
        ...this.props.helperCenter.question.searchInfo,
      },
    });
  };

  setDataStatus = async data => {
    let title = '启用',
      openStatus = 1;
    if (data.openStatus === 1) {
      title = '禁用';
      openStatus = 0;
    }

    const confirmVal = await Swal.fire({
      title,
      text: '确定要执行本次操作吗?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'helperCenter/setQuestionStatus',
        payload: {
          id: data.id,
          openStatus,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else message.error(res.statusDesc);
    }
  };

  handleDelete = async data => {
    const confirmVal = await Swal.fire({
      text: '确定要执行本次删除操作吗?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'helperCenter/deleteQuestion',
        payload: {
          id: data.id,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else message.error(res.statusDesc);
    }
  };

  handleEdit = data => {
    this.setState(
      {
        actionId: data.id,
        actionType: 'edit',
        typeId: data.typeId,
      },
      () => {
        this.addChild.setVisible();
      },
    );
  };

  getChild = ref => (this.child = ref);

  onPageChange = currPage => {
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(this.state.currPage, this.state.pageSize);
      },
    );
  };

  onShowSizeChange = (currPage, pageSize) => {
    this.setState(
      {
        currPage,
        pageSize,
      },
      () => {
        this.getList(this.state.currPage, this.state.pageSize);
      },
    );
  };

  exportFile = () => {
    const formData = this.child.getFormData();
    delete formData.createTime;
    delete formData.updateTime;
    this.props.dispatch({
      type: 'helperCenter/exportQuestionFile',
      payload: formData,
    });
  };

  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:helpInfo:export') && (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        )}
        <Button style={{ marginBottom: 16 }} onClick={() => {
          window.location.reload();
          sessionStorage.setItem('helperCenterTab', 'question');
        }}>
          <Icon type='reload' />
          刷新
        </Button>
      </Fragment>
    );
  };

  render() {
    const {
      helperCenter: {
        question: { list, total },
      },
    } = this.props;
    const { currPage, pageSize, actionId, actionType, typeId } = this.state;
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
        onChange: this.onPageChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
        <Card bordered={false}>
          <>
            <FilterIpts getChild={this.getChild} getList={this.getList} pageSize={pageSize} />
            <StandardTable {...values} />
          </>
        </Card>
        <AddQuestion
          getChild={child => (this.addChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
          actionId={actionId}
          actionType={actionType}
          typeId={typeId}
        />
      </PageHeaderWrapper>
    );
  }
}
