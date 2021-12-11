import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import permission from '@/utils/PermissionWrapper';
import StandardTable from '@/components/StandardTable';
import { Card, Button, Icon, Menu, Dropdown, message } from 'antd';
import FilterInpts from './FilterIpts';
import AddModal from './AddModal';
import SetColumns from '@/components/SetColumns';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';

const plainOptions = [
  {
    label: '序号',
    value: 'key',
  },
  {
    label: '文章标题',
    value: 'newsTitle',
  },
  {
    label: '状态',
    value: 'newsStatus',
  },
  {
    label: '更新人',
    value: 'updateByName',
  },
  {
    label: '更新时间',
    value: 'updateTime',
  },
];

@permission
@connect(({ companySituation, loading }) => ({
  companySituation,
  loading: loading.effects['companySituation/getList'],
}))
export default class CompanySituation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currPage: 1,
      pageSize: 10,
      searchWholeState: true,
      actionId: '',
      actionType: '',
      initColumns: ['key', 'newsTitle', 'newsStatus', 'updateByName', 'updateTime'],
      syncColumns: [],
      defcolumns: [
        { title: '序号', dataIndex: 'key', width: 80 },
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
        {
          title: '状态',
          dataIndex: 'newsStatus',
          width: 80,
          render: status => {
            return <div>{status === 1 ? '启用' : '禁用'}</div>;
          },
        },
        { title: '更新人', dataIndex: 'updateByName', width: 100 },
        { title: '更新时间', dataIndex: 'updateTime', width: 200 },
      ],
      staticColumns: [
        {
          title: '操作',
          width: 100,
          render: record => {
            // 1启用 0 禁用
            const MenuItem = Menu.Item;
            const { permission } = this.props;
            const action = (
              <Menu>
                {permission.includes('chuangrong:dynamicArt:info') && (
                  <MenuItem onClick={() => this.handleDetail(record)}>
                    {/* <Icon type="eye" /> */}
                    详情
                  </MenuItem>
                )}
                {permission.includes('chuangrong:dynamicArt:update') && (
                  <MenuItem onClick={() => this.setStatus(record)}>
                    {+record.newsStatus === 1 ? '禁用' : '启用'}
                  </MenuItem>
                )}
                {permission.includes('chuangrong:dynamicArt:update') && (
                  <MenuItem onClick={() => this.handleEdit(record)}>
                    {/* <Icon type="edit" /> */}
                    修改
                  </MenuItem>
                )}
                {permission.includes('chuangrong:dynamicArt:delete') && (
                  <MenuItem onClick={() => this.handleDelete(record)}>
                    {/* <Icon type="close" /> */}
                    删除
                  </MenuItem>
                )}
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
    };
  }
  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }
  getList = async (currPage, pageSize) => {
    await this.setState({
      currPage,
      pageSize,
    });
    this.props.dispatch({
      type: 'companySituation/getList',
      payload: {
        currPage,
        pageSize,
        ...this.props.companySituation.searchInfo,
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
  handleAdd = () => {
    this.setState(
      {
        actionType: 'add',
        actionId: '',
      },
      () => {
        this.addChild.setVisible();
      }
    );
  };
  handleDetail = data => {
    this.setState(
      {
        actionType: 'detail',
        actionId: data.id,
      },
      () => {
        this.addChild.setVisible();
      }
    );
  };
  handleEdit = data => {
    this.setState(
      {
        actionType: 'edit',
        actionId: data.id,
      },
      () => {
        this.addChild.setVisible();
      }
    );
  };
  setStatus = async data => {
    let title = '启用',
      status = 1;
    if (+data.newsStatus === 1) {
      title = '禁用';
      status = 0;
    }
    const confirmVal = await Swal.fire({
      title,
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'companySituation/setStatus',
        payload: {
          id: data.id,
          newsStatus: status,
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
      text: '确定要删除吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'companySituation/deleteData',
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

  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        <SetColumns
          plainOptions={plainOptions}
          defcolumns={this.state.defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
        {permission.includes('chuangrong:dynamicArt:add') ? (
          <Button onClick={this.handleAdd}>添加</Button>
        ) : null}
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
      companySituation: { list, total },
    } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: { list: list },
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
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        {permission.includes('chuangrong:dynamicArt:list') && (
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
        <AddModal
          getChild={child => (this.addChild = child)}
          actionType={this.state.actionType}
          actionId={this.state.actionId}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
      </PageHeaderWrapper>
    );
  }
}
