import React, { PureComponent, Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';

import SetColumns from '@/components/SetColumns';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';



@permission
@connect(({ newsManage, loading }) => ({
  newsManage,
  loading: loading.effects['newsManage/fetchList'] || loading.effects['newsManage/getModifyInfo'],
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
      'id',
      'newsTypeStr',
      'newsTitle',
      'newsDate',
      'newPic',
      'newsStatusStr',
      'newsContent',
      'remark',
      'createBy',
      'createTime',
      // 'updateBy',
      'updateTime',
      'updateByStr'
    ],
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        width: 100,
        render: record => {
          const { permission } = this.props;
          const status = record.newsStatus == "1";
          const action = (
            <Menu>
              <Menu.Item disabled={!permission.includes("chuangrong:news:update")} onClick={() => this.updateStatus(record)}>
                <Icon type="edit" />
                { status ? "禁用" : "启用" }
              </Menu.Item>
              <Menu.Item disabled={!permission.includes("chuangrong:news:info") && !permission.includes("chuangrong:news:update")} onClick={() => this.modifyHandler(record.id)}>
                <Icon type="edit" />
                修改
              </Menu.Item>
              <Menu.Item disabled={!permission.includes("chuangrong:news:delete")} onClick={() => this.deleteHandler(record.id)}>
                <Icon type="close" />
                删除
              </Menu.Item>
            </Menu>
          );
          return (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作
                <Icon type="down" />
              </a>
            </Dropdown>
          );
        },
      },
    ],
    searchWholeState: false,
    plainOptions: [
      {
        label: '序号',
        value: 'key',
      },
      // {
      //   label: '',
      //   value: 'id',
      // },
      {
        label: '文章类别', // 1楼盘发布2新闻资讯3官方公告
        value: "newsTypeStr"
      },
      {
        label: '文章标题',
        value: 'newsTitle',
      },
      // {
      //   label: '时间',
      //   value: 'newsDate',
      // },
      // {
      //   label: '封面图',
      //   value: 'newPic',
      // },
      {
        label: '状态', //1启用，0禁用
        value: 'newsStatusStr',
      },
      // {
      //   label: '文章内容',
      //   value: 'newsContent',
      // },
      // {
      //   label: '备注',
      //   value: 'remark',
      // },
      // {
      //   label: '创建人ID',
      //   value: 'createBy',
      // },
      // {
      //   label: '创建时间',
      //   value: 'createTime',
      // },
      {
        label: '更新人',
        value: 'updateByStr',
      },
      {
        label: '更新时间',
        value: 'updateTime',
      },
    ],
    defcolumns : [
      {
        title: '序号',
        dataIndex: 'key',
        width: 80
      },
      // {
      //   title: '',
      //   dataIndex: 'id',
      // },
      {
        title: '文章类别', // 1楼盘发布2新闻资讯3官方公告
        dataIndex: 'newsTypeStr',
        width: 100
      },
      {
        title: '文章标题',
        dataIndex: 'newsTitle',
        render: (text,record)=>{
          return <>
              <CopyToClipboard title="点击复制资讯地址" text={record.infoUrl} onCopy={() => message.success('已经复制到剪贴板')}>
                <a href="#!">
                  {text} <Icon style={{ marginRight: 10 }} type="copy" />
                </a>
              </CopyToClipboard>
            </>;
        }
      },
      // {
      //   title: '时间',
      //   dataIndex: 'newsDate',
      // },
      // {
      //   title: '封面图',
      //   dataIndex: 'newPic',
      // },
      {
        title: '状态', // 1启用，0禁用
        dataIndex: 'newsStatusStr',
        width: 80
      },
      // {
      //   title: '文章内容',
      //   dataIndex: 'newsContent',
      // },
      // {
      //   title: '备注',
      //   dataIndex: 'remark',
      // },
      // {
      //   title: '创建人ID',
      //   dataIndex: 'createBy',
      // },
      // {
      //   title: '创建时间',
      //   dataIndex: 'createTime',
      // },
      {
        title: '更新人',
        dataIndex: 'updateByStr',
        width: 100
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: 200
      },
    ]
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
  getList = (currPage, pageSize) => {
    this.props.dispatch({
      type: 'newsManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.newsManage.searchInfo,
      },
    });
  };
  renderBtn = () => {
    const { permission } = this.props
    const { searchWholeState } = this.state;
    return (
      <Fragment>
        {/*
        <Button onClick={() => this.setState({ searchWholeState: !this.state.searchWholeState })}>
          {searchWholeState ? '合并' : '展开' + '详细搜索'}
        </Button>
      */}
        <SetColumns
          plainOptions={this.state.plainOptions}
          defcolumns={this.state.defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {permission.includes("chuangrong:news:add") && <Button onClick={() => this.modifyChild.changeVisible(true)}>
          <Icon type="plus" />
          添加
        </Button>}
        {/*
        <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>
          导出
        </ExportLoading>
       */}
      </Fragment>
    );
  };

  exportExcel = () => {
    const { dispatch, form } = this.props;
    let formData = this.child.getFormValue();

    dispatch({
      type: 'newsManage/exportExcel',
      payload: formData,
    });
  };
  // 启用禁用
  updateStatus = async (record)=>{
    const { id, newsStatus} = record;
    const changedStatus = newsStatus == 1 ? 0 : 1;
    const res = await this.props.dispatch({
      type: 'newsManage/updateStatus',
      payload: {
        id,
        newsStatus: changedStatus
      },
    });
    if (res && res.status === 1) {
      message.success(res.statusDesc);
      this.getList(this.state.currPage, this.state.pageSize);
    } else {
      message.error(res.statusDesc);
    }
  }
  // 修改
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'newsManage/getModifyInfo',
      payload: {
        id,
      },
    });
    if (res && res.status === 1) {
      this.modifyChild.changeVisible(true);
    } else {
      message.error(res.statusDesc);
    }
  };
  // 删除
  async deleteHandler(id) {
    const confirmVal = await Swal.fire({
      text: '确定要删除角色吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'newsManage/deleteManage',
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

  getChild = ref => (this.child = ref);
  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
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
      newsManage: { list,total },
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
        defaultCurrent: currPage,
        defaultPageSize: pageSize,
        total: total,
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
          <FilterIpts
            searchWholeState={this.state.searchWholeState}
            getList={this.getList}
            getChild={this.getChild}
            pageSize={pageSize}
          />
          <StandardTable {...values} />
        </Card>
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
