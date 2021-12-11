import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Tabs, Checkbox } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import { formatNumber } from '@/utils/utils';

const { TabPane } = Tabs;

//   检索条件
import FilterIpts from './FilterIpts';
import ModifyForm from './ModifyForm';

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 80,
  },
  {
    title: '产品编号',
    dataIndex: 'productNo',
    width: 130,
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    width: 200,
  },
  {
    title: '所属标签',
    dataIndex: 'tagId',
    render: (record, row) => row.tagTitle,
    width: 100,
  },
  {
    title: '旅游类型',
    dataIndex: 'classifyId',
    render: record => {
      switch (record) {
        case 5:
          return '国内游';
        case 6:
          return '周边游';
      }
    },
    width: 100,
  },
  {
    title: '售卖价格',
    dataIndex: 'productPrice',
    render: record => record != null ? record + '元 起' : '',
    width: 100,
  },
  {
    title: '供应商',
    dataIndex: 'companyName',
    width: 100,
  },
  {
    title: '联系人',
    dataIndex: 'customerServiceName',
    width: 100,
  },
  {
    title: '联系人手机号',
    dataIndex: 'customerServicePhone',
    width:140,
  },
  {
    title: '在架状态',
    dataIndex: 'onSale',
    render: record => {
      switch (record) {
        case 1:
          return '在架';
        case 2:
          return '下架';
        case 0:
          return '--';
      }
    },
    width: 100,
  },
  {
    title: '是否推荐',
    dataIndex: 'recommend',
    render: record => {
      switch (record) {
        case 0:
          return '--';
        case 1:
          return '推荐中';
      }
    },
    width: 100,
  },
  {
    title: '销量',
    dataIndex: 'saleCount',
    width: 100,
  }
];
const columns1 = [
  {
    title: '上架时间',
    dataIndex: 'onSaleTime',
    width: 140,
  },
  {
    title: '下架时间',
    dataIndex: 'offSaleTime',
    width: 140,
  }]
;
const columns2 = [
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 140,
  }
];


@permission
@connect(({ tripProductManage, loading }) => ({
  tripProductManage,
  loading:
    loading.effects['tripProductManage/fetchList'] ||
    loading.effects['tripProductManage/statusChangeManage'],
  exportLoading: loading.effects['sendManage/exportFile'],
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    //违约金发放
    currPage: 1,
    pageSize: 10,
    onSale: 1,
    title: '添加',
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {this.state.onSale == 1 ? (
                <Menu.Item
                  disabled={(!permission.includes('chuangrong:travelProduct:recommend'))}
                  onClick={() => this.updateRecommend(record)}>
                  <Icon type="edit"/>
                  {record.recommend == 0 ? '推荐' : '取消推荐'}
                </Menu.Item>
              ) : null}
              <Menu.Item
                disabled={(!permission.includes('chuangrong:travelProduct:sale'))}
                onClick={() => this.updateStatusHandler(record)}>
                <Icon type="plus"/>
                {record.onSale == 1 ? '下架' : '上架'}
              </Menu.Item>
              <Menu.Item
                disabled={(!permission.includes('chuangrong:travelProduct:tag'))}
                onClick={() => {
                  this.modifyChild.changeVisible(true);
                  this.modifyChild.setState({
                    dataInfo: record,
                  });
                }}>
                <Icon type="edit"/>
                改归属
              </Menu.Item>
            </Menu>
          );
          return (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作
                <Icon type="down"/>
              </a>
            </Dropdown>
          );
        },
        width: 140,
      },
    ],
    searchWholeState: false,

    isModalShow: 0, // 连连支付密码 Modal
    modalJson: {},
    tabIndex: '1',
    autoSale: false,
  };

  getChild = ref => (this.child = ref);

  componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...columns1, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize, this.state.onSale);
    /**
     * 获取自动同步上架状态
     * */
    this.getAutoSaleHandler();
  }


  /**
   * 切换在架/下架/旅游产品库tab
   * */
  changeTabIndex = index => {
    const { dispatch,tripProductManage } = this.props;
    this.setState({
      tabIndex: index,
    });
    if (this.child) {
      this.child.reset();
    }
    // 切换tab清除搜索条件
    dispatch({
      type:'tripProductManage/setSearchInfo',
      payload: {}
    })
    if (index == 1) {
      this.syncChangeColumns([...defcolumns, ...columns1, ...this.state.staticColumns]);
      this.getList(1, this.state.pageSize, 1);
    } else if (index == 2) {
      this.syncChangeColumns([...defcolumns, ...columns1, ...this.state.staticColumns]);
      this.getList(1, this.state.pageSize, 2);
    } else {
      this.syncChangeColumns([...defcolumns, ...columns2, ...this.state.staticColumns]);
      this.getList(1, this.state.pageSize, -1);
    }
  };

  /**
   * 上架或者下架操作
   * */
  updateStatusHandler = async record => {
    let text = '';
    if (record.onSale === 1) {
      text = '是否要下架该产品?';
    } else {
      text = '是否要上架该产品?';
    }
    const confirmVal = await Swal.fire({
      text: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'tripProductManage/updateSale',
        payload: {
          id: record.id,
          onSale: record.onSale == 1 ? 2 : 1,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize, this.state.onSale);
      } else {
        message.error(res.statusDesc);
      }
    }
  };

  /**
   * 推荐或者取消推荐
   * */
  updateRecommend = async record => {
    let text = '';
    if (record.recommend === 0) {
      text = '是否要推荐该产品?';
    } else {
      text = '是否要取消推荐该产品?';
    }
    const confirmVal = await Swal.fire({
      text: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'tripProductManage/updateRecommend',
        payload: {
          id: record.id,
          recommend: record.recommend == 0 ? 1 : 0,
        },
      });
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize, this.state.onSale);
      } else {
        message.error(res.statusDesc);
      }
    }
  };

  // 点击修改
  modifyHandler = async id => {
    this.modifyChild.changeVisible(true);
    this.modifyChild.setState({
      dataInfo: record,
    });
  };

  /**
   * 违约金发放
   * 页数改变时
   * */
  onChange = currPage => {
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(currPage, this.state.pageSize, this.state.onSale);
      },
    );
  };

  /**
   * 违约金发放
   * 页数改变时
   * */
  onShowSizeChange = (currPage, pageSize) => {
    this.setState(
      {
        currPage,
        pageSize,
      },
      () => {
        this.getList(currPage, pageSize, this.state.onSale);
      },
    );
  };


  /**
   * 违约金发放
   * 获取列表数据
   * */
  getList = async (currPage = 1, pageSize = 10, onSale = 1) => {
    await this.setState({ currPage, pageSize, onSale });
    const paraFilter = this.props.tripProductManage.searchInfo || {};
    await this.props.dispatch({
      type: 'tripProductManage/fetchList',
      payload: {
        currPage,
        pageSize,
        onSale,
        ...paraFilter,
      },
    });
  };
  /**
   * 违约金发放
   * 导出功能
   * */
  exportFile = () => {
    const { dispatch } = this.props;
    let formData = this.child.getFormValue();
    formData.onSale = this.state.onSale;

    return dispatch({
      type: 'tripProductManage/exportFile',
      payload: formData,
    });
  };
  /**
   * 上架或者下架操作
   * */
  getAutoSaleHandler = async () => {
    const res = await this.props.dispatch({
      type: 'tripProductManage/getAutoSale',
    });
    if (res && res.status === 1) {
      this.setState({
        autoSale: res.data === 1 ? true : false,
      });
    }
  };

  /**
   * 开启/关闭自动上下架功能
   * */
  changeAutoSale = async (e) => {
    let text = '';
    if (e.target.checked) {
      text = '是否要开启自动上架功能？开启后商品自动上架。';
    } else {
      text = '是否要关闭自动上架功能？关闭后商品需要手动上架。';
    }
    const confirmVal = await Swal.fire({
      text: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'tripProductManage/updateAutoSale',
        payload: {
          synchronize: e.target.checked ? 1 : 0,
        },
      });
      if (res && res.status === 1) {
        this.setState({ autoSale: e.target.checked });
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize, this.state.onSale);
      } else {
        message.error(res.statusDesc);
      }
    }
  };

  //违约金发放数组初始化
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };


  renderBtn = () => {
    const { autoSale, onSale } = this.state;

    const { permission } = this.props;
    return (
      <Fragment>
        {(onSale !== 1 && onSale !== 2) && (permission.includes('chuangrong:travelProduct:async')) ? (
          <Checkbox onChange={this.changeAutoSale} checked={autoSale}>自动同步上架</Checkbox>
        ) : null}
        {permission.includes('chuangrong:travelProduct:export') ? (
          <ExportLoading exportLoading={this.props.exportLoading} exportExcel={this.exportFile}>
            导出
          </ExportLoading>
        ) : null}
        {permission.includes('chuangrong:travelProduct:list') ? (
          <Button  style={{ marginBottom: 16}}  onClick={() =>

            this.getList(1, 10, onSale)
          }>
            <Icon type="reload"/>
            刷新
          </Button>
        ) : null}
      </Fragment>
    );
  };

  render() {
    const {
      permission,
      tripProductManage: { list = [], numJson = {}, total = 0 },
    } = this.props;
    const {
      currPage,
      pageSize,
      onSale,
    } = this.state;
    const values = {
      columns: this.state.syncColumns,
      data: {
        list,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize: pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <>
        <Tabs defaultActiveKey="1" onChange={this.changeTabIndex} tabBarStyle={{ marginBottom: 40 }}>
          <TabPane tab="在架" key="1">
            <PageHeaderWrapper renderBtn={this.renderBtn} hiddenBreadcrumb={true}>
              <Card bordered={false}>
                {permission.includes('chuangrong:travelProduct:list') ? (
                  <>
                    <FilterIpts
                      searchWholeState={this.state.searchWholeState}
                      getList={this.getList}
                      getChild={this.getChild}
                      pageSize={pageSize}
                      onSale={onSale}
                    />
                    <StandardTable {...values} />
                  </>
                ) : null}
              </Card>
            </PageHeaderWrapper>
          </TabPane>

          <TabPane tab="下架" key="2">
            <PageHeaderWrapper renderBtn={this.renderBtn} hiddenBreadcrumb={true}>
              <Card bordered={false}>
                {permission.includes('chuangrong:travelProduct:list') ? (
                  <>
                    <FilterIpts
                      searchWholeState={this.state.searchWholeState}
                      getList={this.getList}
                      getChild={this.getChild}
                      pageSize={pageSize}
                      onSale={onSale}
                    />
                    <StandardTable {...values} />
                  </>
                ) : null}
              </Card>
            </PageHeaderWrapper>
          </TabPane>
          <TabPane tab="旅游产品库" key="3">
            <PageHeaderWrapper renderBtn={this.renderBtn} hiddenBreadcrumb={true}>
              <Card bordered={false}>
                {permission.includes('chuangrong:travelProduct:list') ? (
                  <>
                    <FilterIpts
                      searchWholeState={this.state.searchWholeState}
                      getList={this.getList}
                      getChild={this.getChild}
                      pageSize={pageSize}
                      onSale={onSale}
                    />
                    <StandardTable {...values} />
                  </>
                ) : null}
              </Card>
            </PageHeaderWrapper>
          </TabPane>
        </Tabs>

        <ModifyForm
          getChildData={child => (this.modifyChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
          onSale={onSale}
        />
      </>
    );
  }
}
