import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Menu, Dropdown, message } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import router from 'umi/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import PermissionWrapper from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';


//   检索条件
import FilterIpts from './FilterIpts';


@PermissionWrapper
@connect(({ EquityManage, loading }) => ({
  EquityManage,
  loading:
    loading.effects['EquityManage/fetchList'] ||
    loading.effects['EquityManage/getModifyInfo'],
  exportLoading: loading.effects['EquityManage/exportExcel'],
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
          title: '权益名称',
          dataIndex: 'goodsName',
        },
        {
          title: '图标',
          dataIndex: 'virtualGoodsCode',
          render: (record) => (<i style={{ color: '#0000FF' }}>{record}</i>) 
        },
        {
          title: '排序',
          dataIndex: '',
        },
        {
          title: '状态',
          dataIndex: 'isShow',
          render: (record, row) => {
            if (row.isShow - 0 === 0) {
              return '启用';
            }
            if (row.isShow - 0 === 1) {
              return '禁用';
            }
            return false;
          },
        },
        {
          title:'更新人',
          dataIndex:''
        },
        {
          title: '更新时间',
          dataIndex: 'createTime',
          render: (record) => {
            if(record) {
              return record;
            }
            return '--';
          }
        },
        {
          title:'备注',
          dataIndex:''
        },
      ],
      staticColumns: [
        {
          title: '操作',
          render: record => {
            const { permission } = this.props;
            const action = (
              <Menu>
                {permission.includes('chuangrong:integralGoods:update') ? (
                  <Menu.Item onClick={() => this.modifyHandler(record, 'modify')}>
                    修改
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:integralGoods:putaway') ? (
                  <Menu.Item onClick={() => this.updateShelvesHandler(record)}>
                    {record.isShow == 0 ? '启用' : '禁用'}
                  </Menu.Item>
                ) : null}
              </Menu>
            );
            return (
              <Dropdown
                overlay={action}
                disabled={
                  !(
                    permission.includes('chuangrong:integralGoods:update') ||
                    permission.includes('chuangrong:integralGoods:info') || 
                    permission.includes('chuangrong:integralGoods:putaway') ||
                    permission.includes('chuangrong:integralGoods:recommend')
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
      searchWholeState: false,
    };
  }

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }

  //  页数改变时
  onChange = currPage => {
    this.setState(
      { currPage },
      () => {
        this.getList(currPage, this.state.pageSize);
      }
    );
  };


  // 点击分页
  onShowSizeChange = (currPage, pageSize) => {
    this.setState({ currPage, pageSize },
      () => {
        this.getList(currPage, pageSize);
      }
    );
  };


  // 获取列表数据
  getList = (currPage, pageSize) => {
    this.setState({ currPage, pageSize });
    this.props.dispatch({
      type: 'EquityManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.EquityManage.searchInfo,
      },
    });
  };


  // 启用禁用操作
  updateShelvesHandler = async record => {
    const confirmVal = await Swal.fire({
      text: `是否要${record.isShow == 0 ? '启用' : '禁用'}该权益？`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'EquityManage/updateStatus',
        payload: {
          id: record.id,
          isShow: record.isShow == 0 ? 1 : 0,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else {
        message.error(res.statusDesc);
      }
    }
  };

  // 
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {
          permission.includes('chuangrong:integralGoods:export') &&
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportExcel}>导出</ExportLoading>
        }
        <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  // 导出
  exportExcel = () => {
    const { dispatch } = this.props;
    const formData = this.child.getFormValue();
    dispatch({
      type: 'EquityManage/exportExcel',
      payload: formData,
    });
  };

  // 修改
  modifyHandler = async (record, type) => {
    router.push({
      pathname: '/memberEquity/addEquity/edit',
      query: {
        id: record ? record.id : undefined,
      },
    });
  };

  getChild = ref => {
    this.child = ref
  };


  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };



  render() {
    const {
      permission,
      EquityManage: { data: { list, pagination: { total } } },
    } = this.props;
    const {
      currPage,
      pageSize,
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

    return permission.includes('chuangrong:integralGoods:view') ? (
      <Fragment>
        <PageHeaderWrapper renderBtn={this.renderBtn}>
          {permission.includes('chuangrong:integralGoods:list') ? (
            <Card bordered={false}>
              <FilterIpts
                searchWholeState={this.state.searchWholeState}
                getList={this.getList}
                getChild={this.getChild}
                pageSize={pageSize}
              />
              <StandardTable {...values} />
            </Card>
          ) : null}
        </PageHeaderWrapper>
      </Fragment>
    ) : null;
  }
}

export default IndexComponent;
