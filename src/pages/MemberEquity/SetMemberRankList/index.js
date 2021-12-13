import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import PermissionWrapper from '@/utils/PermissionWrapper';

// 修改会员等级设置
import EditEquityForm from './EditEquityForm';

@PermissionWrapper
@connect(({ MemberRank, loading }) => ({
  MemberRank,
  loading:
    loading.effects['MemberRank/fetchList'] ||
    loading.effects['MemberRank/getModifyInfo'] ||
    loading.effects['MemberRank/getTabModifyInfo'],
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
          title: '等级名称',
          dataIndex: 'levelName',
        },
        {
          title: '所需成长值',
          dataIndex: 'levelValue',
        },
        {
          title: '状态',
          dataIndex: 'levelStatus',
          render: (record, row) => {
            if (row.levelStatus - 0 === 0) {
              return '禁用'
            }
            if (row.levelStatus - 0 === 1) {
              return '启用';
            }
            return false;
          }
        },
        {
          title: '更新人',
          dataIndex: 'updateName'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
        },
      ],
      syncColumns: [],
      staticColumns: [
        {
          title: '操作',
          render: record => {
            const { permission } = this.props;
            const action = (
              <Menu>
                <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                  修改
                </Menu.Item>
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(
                    permission.includes('chuangrong:integralOrder:update')
                  )
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
      modifyChildVisible: false,
      afterSalesVisible: false,
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
      type: 'MemberRank/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.MemberRank.searchInfo,
      },
    });
  };

  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  // 修改会员等级信息
  modifyHandler = async id => {
    const res = await this.props.dispatch({
      type: 'MemberRank/getModifyInfo',
      payload: {
        id,
      },
    });
    if (res && res.status === 1) {
      this.setState({
        modifyChildVisible: true,
      });
    } else {
      message.error(res.statusDesc);
    }
  };


  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  render() {
    const {
      permission,
      MemberRank: { list, total },
    } = this.props;
    const { salesId } = this.state;
    const {
      currPage,
      pageSize,
      modifyChildVisible,
      afterSalesVisible,
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
    return permission.includes('chuangrong:integralOrder:view') ? (
      <Fragment>
        <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
          {permission.includes('chuangrong:integralOrder:list') ? (
            <Card bordered={false}>
              <StandardTable {...values} />
            </Card>
          ) : null}
          {modifyChildVisible && (
            <EditEquityForm
              onCancel={() => {
                this.setState({ modifyChildVisible: false });
              }}
              getList={this.getList}
              currPage={currPage}
              pageSize={pageSize}
            />
          )}

        </PageHeaderWrapper>
      </Fragment>
    ) : null;
  }
}

export default IndexComponent;
