import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Modal, Tabs } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import PermissionWrapper from '@/utils/PermissionWrapper';
// import ExportLoading from '@/components/ExportLoading'


//   检索条件
import FilterIpts from './FilterIpts';
import ModifyForm from './ModifyForm';


@PermissionWrapper
@connect(({ BlackList, loading }) => ({
  BlackList,
  loading:
    loading.effects['BlackList/fetchList'],
  exportLoading: loading.effects['BlackList/exportExcel'],
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
          title: '一级渠道',
          dataIndex: 'parentUtmName',
        },
        {
          title: '当前有效冻结积分',
          dataIndex: 'currValidFreezeIntegral',
        },
        {
          title: '备注',
          dataIndex: 'remark',
        },
        {
          title: '添加时间',
          dataIndex: 'createTime',
        }
      ],
      staticColumns: [
        {
          title: '操作',
          render: record => {
            const { permission } = this.props;
            const action = (
              <Menu>
                {permission.includes('chuangrong:integralBlackList:delete') ? (
                  <Menu.Item onClick={() => this.modifyHandler(record, 'remove')}>
                    移除
                  </Menu.Item>
                ) : null}
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(permission.includes('chuangrong:integralBlackList:delete'))
                }
              >
                <a className="ant-dropdown-link" href="#">
                  操作
                  <Icon type="down" />
                </a>
              </Dropdown>
            );
          },
        },
      ],
      syncColumns: [],
      modifyChildVisible: false,
    };
  }

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
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
      type: 'BlackList/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.BlackList.searchInfo,
      },
    });
  };


  // 
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:integralBlackList:add') ? (
          <Button
            onClick={() =>
              this.setState({
                modifyChildVisible: true,
                type: 'add'
              })
            }
          >
            <Icon type="plus" />
            添加
          </Button>
        ) : null}
        <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  getChild = ref => {
    this.child = ref
  };


  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  modifyHandler = async (record, type) => {
    const res = await this.props.dispatch({
      type: 'BlackList/getBlackInfo',
      payload: {
        id: record.id
      },
    });
    if (res && res.status === 1) {
      this.setState({
        modifyChildVisible: true,
        type,
        id: record.id
      });
    } else {
      message.error(res.statusDesc);
    }
  }

  render() {
    const {
      permission,
      BlackList: { list, total },
    } = this.props;
    const {
      currPage,
      pageSize,
      modifyChildVisible,

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
    return permission.includes('chuangrong:integralBlackList:view') ? (
      <Fragment>
        <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
          {
            permission.includes('chuangrong:integralBlackList:list') && 
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
        {modifyChildVisible &&
          <ModifyForm
            onCancel={() => {
              this.setState({ modifyChildVisible: false });
            }}
            getList={this.getList}
            currPage={currPage}
            pageSize={pageSize}
            type={this.state.type}
            id={this.state.id}
            permission={permission}
          />}
      </Fragment>
    ) : null;
  }
}

export default IndexComponent;
