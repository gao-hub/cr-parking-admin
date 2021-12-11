import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import PermissionWrapper from '@/utils/PermissionWrapper';

// 修改物流编号
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
          dataIndex: 'orderNo',
        },
        {
          title: '所需成长值',
          dataIndex: 'productName',
        },
        {
          title: '状态',
          dataIndex: 'isShow',
          render: (record, row) => {
            if (row.isShow - 0 === 0) {
              return '启用'
            }
            if (row.isShow - 0 === 1) {
              return '禁用';
            }
            return false;
          }
        },
        {
          title: '更新人',
          dataIndex: 'parentUtm'
        },
        {
          title: '更新时间',
          dataIndex: 'sendOrderTime',
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
      deliveryVisible: false
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


  exportExcel = () => {
    const { dispatch } = this.props;
    const formData = this.child.getFormValue();
    dispatch({
      type: 'MemberRank/exportExcel',
      payload: formData,
    });
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
      deliveryVisible,
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
          {/* 发货 */}
          {
            deliveryVisible && <DeliveryForm
              onCancel={() => {
                this.setState({ deliveryVisible: false });
              }}
              salesId={salesId}
              getList={this.getList}
              currPage={currPage}
              pageSize={pageSize}
            />
          }
        </PageHeaderWrapper>
      </Fragment>
    ) : null;
  }
}

export default IndexComponent;
