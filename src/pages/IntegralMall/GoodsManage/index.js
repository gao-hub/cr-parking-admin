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
@connect(({ GoodsManage, loading }) => ({
  GoodsManage,
  loading:
    loading.effects['GoodsManage/fetchList'] ||
    loading.effects['GoodsManage/getModifyInfo'],
  exportLoading: loading.effects['GoodsManage/exportExcel'],
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
          title: '商品编码',
          dataIndex: 'virtualGoodsCode',
          render: (record) => (<span style={{ color: '#0000FF' }}>{record}</span>) 
          
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
        },
        {
          title: '商品类型',
          dataIndex: 'goodsType',
          render: (record) => {
            if (record - 0 === 0) {
              return '实物';
            }
            if (record - 0 === 1) {
              return '虚拟';
            }
            return false;
          }
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          render: (record) => (<span style={{ color: '#FF6600'}}>{record}</span>)
        },
        {
          title: '售价',
          dataIndex: 'otPrice',
          render: (record) => (<span style={{ color: '#FF6600' }}>{record}</span>)
        },
        {
          title: '积分',
          dataIndex: 'integralPrice',
          render: (record) =>(<span style={{ color: '#FF6600' }}>{record}</span>)
        },
        {
          title: '在架状态',
          dataIndex: 'isShow',
          render: (record, row) => {
            if (row.isShow - 0 === 0) {
              return '仓库中';
            }
            if (row.isShow - 0 === 1) {
              return '在架';
            }
            return false;
          },
        },
        {
          title: '是否推荐',
          dataIndex: 'recommendFlag',
          render: (record) => {
            if (record - 0 === 0) {
              return '--';
            }
            if (record - 0 === 1) {
              return '推荐中';
            }
            return false;
          }
        },
        {
          title: '库存',
          dataIndex: 'stock'
        },
        {
          title: '兑换量',
          render: (record) => {
            // 实物商品兑换数
            if (record.goodsType === 0) {
              return record.exchangeNum;
            }
            // 虚拟商品兑换数
            if (record.goodsType === 1) {
              return record.virtualExchangeNum;
            }
            return false
          }
        },
        {
          title: '上架时间',
          dataIndex: 'showTime',
          render: (record) => {
            if(record) {
              return record;
            }
            return '--';
          }
        },
        {
          title: '下架时间',
          dataIndex: 'hideTime',
          render: (record) => {
            if(record) {
              return record;
            }
            return '--';
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          render: (record) => {
            if(record) {
              return record;
            }
            return '--';
          }
        },
      ],
      staticColumns: [
        {
          title: '操作',
          render: record => {
            const { permission } = this.props;
            const action = (
              <Menu>
                {permission.includes('chuangrong:integralGoods:info') ? (
                  <Menu.Item onClick={() => this.modifyHandler(record, 'info')}>
                    详情
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:integralGoods:update') ? (
                  <Menu.Item onClick={() => this.modifyHandler(record, 'modify')}>
                    修改
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:integralGoods:putaway') ? (
                  <Menu.Item onClick={() => this.updateShelvesHandler(record)}>
                    {record.isShow == 0 ? '上架' : '下架'}
                  </Menu.Item>
                ) : null}
                {permission.includes('chuangrong:integralGoods:recommend') ? (
                  <Menu.Item onClick={() => this.recommendedHandler(record)}>
                    {record.recommendFlag == 0 ? '推荐' : '取消推荐'}
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


  // 
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
      type: 'GoodsManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...this.props.GoodsManage.searchInfo,
      },
    });
  };


  // 上下架
  updateShelvesHandler = async record => {
    const confirmVal = await Swal.fire({
      text: `是否要${record.isShow == 0 ? '上架' : '下架'}该产品？`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'GoodsManage/updateStatus',
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

  // 取消推荐
  recommendedHandler = async record => {
    const confirmVal = await Swal.fire({
      text: `是否要${record.recommendFlag == 1 ? '取消' : ''}推荐该产品？`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'GoodsManage/cancelCommended',
        payload: {
          id: record.id,
          recommendFlag: record.recommendFlag == 0 ? 1 : 0,
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
        {permission.includes('chuangrong:integralGoods:add') ? (
          <Button onClick={() => { this.modifyHandler({}, 'add') }}>
            <Icon type="plus" />
            新增
          </Button>
        ) : null}
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
      type: 'GoodsManage/exportExcel',
      payload: formData,
    });
  };

  // 新增/详情/修改
  modifyHandler = async (record, type) => {
    router.push({
      pathname: '/integralMall/goodsManage/save',
      query: {
        id: record ? record.id : undefined,
        type,
        goodsType: record ? record.goodsType : undefined
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
      GoodsManage: { data: { list, pagination: { total } } },
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
