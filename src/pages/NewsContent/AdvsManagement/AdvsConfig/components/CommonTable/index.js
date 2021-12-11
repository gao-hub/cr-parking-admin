import React, { PureComponent, Fragment } from 'react';
import { Card, Button, Icon, Pagination, Table, Menu, Dropdown, message, Modal, Form, Select, Radio } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';

// 添加/修改表单
import ModifyForm from './ModifyForm';
//   检索条件
import FilterIpts from './FilterIpts';

@permission
@connect(({ advertManage, loading }) => ({
  advertManage,
  loading:
    loading.effects['advertManage/fetchList'] || loading.effects['advertManage/getModifyInfo']
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    isFirst: true,
    currPage: 1,
    pageSize: 10,
    title: '添加',
    previewImg: '',
    radioVal: '',
    homeVisible: false,
    defcolumns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '广告名称',
        dataIndex: 'advertName',
      },
      {
        title: '广告位',
        dataIndex: 'advertPosition'
      },
      {
        title: '广告缩略图',
        dataIndex: 'imageUrl',
        render: (record, row) => {
          return row.imageUrl ? (
            <Card
              hoverable
              style={{ width: 100 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.imageUrl)}
              cover={<img src={row.imageUrl} />}
            />
          ) : null;
        },
      },
      {
        title: '排序',
        dataIndex: 'sortid',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (record, row) => {
          if (row.status == 0) {
            return '禁用';
          }
          if (row.status == 1) {
            return '启用';
          }
        },
      },
      {
        title: '更新人',
        dataIndex: 'updateName',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '展示时间',
        dataIndex: 'showTime'
      }
    ],

    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {permission.includes('chuangrong:advert:update') ? (
                <Menu.Item onClick={() => this.modifyHandler(record.id)}>
                  <Icon type="edit" />
                  修改
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:advert:status') ? (
                <Menu.Item onClick={() => this.updateStatusHandler(record)}>
                  <Icon type="edit" />
                  {record.status == 0 ? '启用' : '禁用'}
                </Menu.Item>
              ) : null}
              {permission.includes('chuangrong:advert:delete') ? (
                <Menu.Item onClick={() => this.deleteHandler(record)}>
                  <Icon type="close" />
                  删除
                </Menu.Item>
              ) : null}
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
  };
  previewImg = url => {
    this.setState({
      previewVisible: true,
      previewImg: url,
    });
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
  getList = async (currPage, pageSize) => {
    this.setState({ currPage, pageSize });
    await this.props.dispatch({
      type: 'advertManage/fetchList',
      payload: {
        advertType: this.props.tabIndex,
        currPage,
        pageSize,
        ...this.props.advertManage.searchInfo,
      },
    });
  };
  updateStatusHandler = async record => {
    const confirmVal = await Swal.fire({
      text: '确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'advertManage/updateStatus',
        payload: {
              status:record.status == 0 ? 1 :0,
              id: record.id,
              advertType: record.advertType,
              advertPositionId: record.advertPositionId
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
  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission, advertManage } = this.props;
    return (
      <Fragment>
        {
          this.props.tabIndex === '1' &&
          <div style={{ position: 'absolute', left: 20 }}> { `首页顶部当前启用的是: ${ advertManage.initData?.frontPositionName }` } </div>
        }
        {permission.includes('chuangrong:advert:frontPagePosition') && this.props.tabIndex === '1' ? (
          <Button onClick={() =>
            this.setState({
              homeVisible: true
            })}
          >
            首页启用
          </Button>
        ) : null}
        {permission.includes('chuangrong:advert:add') ? (
          <Button onClick={() => this.modifyChild.changeVisible(true)}>
            <Icon type="plus" />
            添加
          </Button>
        ) : null}
        <Button style={{ marginBottom: 16}} onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };
  // 修改
  modifyHandler = async id => {
    const { advertManage: { modifyInfoData } } = this.props;
    const res = await this.props.dispatch({
      type: 'advertManage/getModifyInfo',
      payload: {
        id,
      },
    });
    if (res && res.status === 1) {
      if(this.props.tabIndex === '1'){
        this.modifyChild.setState({
          advertPosition: res.data.advertPositionId
        })
      }
      this.modifyChild.changeVisible(true);
    } else {
      message.error(res.statusDesc);
    }
  };
  // 删除
  async deleteHandler(record) {
    const { id, advertType, advertPositionId } = record;
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
        type: 'advertManage/deleteManage',
        payload: {
          id,
          advertType,
          advertPositionId
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
    if(this.props.tabIndex === '1'){
      // 获取首页顶部启用
      this.getHomeTag();
    }
  }
  // 获取首页顶部启用
  getHomeTag = async () => {
    const res = await this.props.dispatch({
      type: 'advertManage/getAllSelect',
      payload: {},
    });
    this.setState({
      radioVal: res?.data?.frontPositionCode
    })
  };
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array,
    });
  };

  // 修改首页启用
  updateHomeEnable = async ()=>{
    const { radioVal } = this.state;
    await this.props.dispatch({
      type: 'advertManage/updateHomeEnable',
      payload: {
        frontPagePosition: radioVal,
      },
    });
    this.setState({
      homeVisible: false
    })
    this.getHomeTag();
  }

  //修改首页顶部启用状态
  radioChange = e =>{
    this.setState({
      radioVal: e.target.value
    })
  }

  render() {
    const {
      permission,
      advertManage: { list, total,initData },
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
      <PageHeaderWrapper renderBtn={this.renderBtn} hiddenBreadcrumb={true}>
        <Card bordered={false}>
          <FilterIpts
            tabIndex={this.props.tabIndex}
            searchWholeState={this.state.searchWholeState}
            getList={this.getList}
            getChild={this.getChild}
            pageSize={pageSize}
          />
          <StandardTable {...values} />
        </Card>
        <ModifyForm
          tabIndex={this.props.tabIndex}
          getChildData={child => (this.modifyChild = child)}
          getList={this.getList}
          currPage={currPage}
          pageSize={pageSize}
        />
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img style={{ width: '100%' }} src={this.state.previewImg} />
        </Modal>
        <Modal
          title="修改首页顶部启用状态"
          width={600}
          visible={this.state.homeVisible}
          onOk={()=>{
            this.updateHomeEnable()
          }}
          maskClosable={false}
          destroyOnClose
          onCancel={()=>{
            this.setState({
              homeVisible: false,
              radioVal: initData.frontPositionCode,
            })
          }}
        >
          <Radio.Group value={this.state.radioVal} onChange={this.radioChange} >
            <Radio key={1} value={"1"}>启用活动位</Radio>
            <Radio key={2} value={"2"}>启用banner位</Radio>
            <Radio key={0} value={"0"}>均不启用</Radio>
          </Radio.Group>
        </Modal>
       </PageHeaderWrapper>
    );
  }
}
