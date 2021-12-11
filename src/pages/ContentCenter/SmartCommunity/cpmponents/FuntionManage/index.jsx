import React, { PureComponent, Fragment } from 'react';
import { 
  Card, 
  Button, 
  Icon, 
  Pagination, 
  Table, 
  Menu, 
  Dropdown, 
  message, 
  Tabs, 
  Modal 
} from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import ExportLoading from '@/components/ExportLoading';
import { formatNumber } from '@/utils/utils';

const { TabPane } = Tabs;
import SetColumns from '@/components/SetColumns';

//  功能管理弹窗
import FunctionModal from './FunctionModal'
//   检索条件
import FilterIpts from './FilterIpts';



@permission
@connect(({ SmartCommunity, loading }) => ({
  SmartCommunity,
  loading:
    loading.effects['SmartCommunity/fetchList'] ||
    loading.effects['SmartCommunity/statusChangeManage'],
  exportLoading: loading.effects['sendManage/exportFile'],
  batchLoading:
    loading.effects['SmartCommunity/penaltyBatchHandOut'] ||
    loading.effects['SmartCommunity/returnBatchHandOut'],
}))

export default class FuntionManage extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    title: '添加',
    syncColumns: [],
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '功能名称',
        dataIndex: 'productName',
      },
      {
        title: '关联类型',
        dataIndex: 'groupsName',
      },
      {
        title: 'icon',
        dataIndex: 'icon',
        render: record =>
          record != null && record != '' ? <img src={record} width={70} height={70} alt="" /> : '',
      },
      {
        title: '排序',
        dataIndex: 'sort',
      },
      {
        title: '状态',
        dataIndex: 'productState',
        render: record => record === 1 ? '禁用' : '启用'
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '操作',
        render: record => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('chuangrong:community:update') ? 
                <Menu.Item onClick={() => this.modifyFunctionInfo(record.id, 2)}>
                  <Icon type="edit" />修改
                </Menu.Item> : null
              }
              {
                permission.includes('chuangrong:community:state') && record.productState == 1 ? 
                <Menu.Item onClick={() => this.modifyState(record.id, 0)}>
                  <Icon type="edit" />启用
                </Menu.Item> : null
              }
              {
                permission.includes('chuangrong:community:state') && record.productState == 0 ? 
                <Menu.Item onClick={() => this.modifyState(record.id, 1)}>
                  <Icon type="edit" />禁用
                </Menu.Item> : null
              }
              {
                permission.includes('chuangrong:community:delete') ? 
                <Menu.Item onClick={() => this.deleteFunction(record.id)}>
                  <Icon type="close" />删除
                </Menu.Item> : null
              }
            </Menu>
          );
          return permission.includes('chuangrong:community:state') ||
            permission.includes('chuangrong:community:delete') ||
            permission.includes('chuangrong:community:update') ? (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作
                <Icon type="down" />
              </a>
            </Dropdown>
          ) : null;
        },
      },
    ],
    searchWholeState: false,
  }

  /** 修改状态
   * id 功能id
   * status: 1 禁用  0 启用
   */
   modifyState = (id, status) => {
    Modal.confirm({
      title: '改变状态',
      content: `确定要${status ? '禁用' : '启用'}该状态吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await this.props.dispatch({
          type: 'SmartCommunity/modifyFcState',
          payload: {
            id,
            productState: status
          }
        })
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.getList(this.state.currPage, this.state.pageSize)
        } else if(res) message.error(res.statusDesc)
      },
    });
  }

  /**
   * @desc 删除功能管理
   * @param { string } id   功能id
   */
   async deleteFunction (id) {
    const confirmVal = await Swal.fire({
      text: '确定要删除此功能吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'SmartCommunity/delete',
        payload: {
          id,
        }
      })
      if (res && res.status === 1) {
        message.success(res.statusDesc)
        this.getList(1, this.state.pageSize)
      } else if(res) {
        message.error(res.statusDesc)
      }
    }
  }

  /**
   * @desc 编辑功能管理 获取功能详情并打开弹窗
   * @param { string } id   功能id
   * @param { number } type 弹窗类型  1: 添加  2：编辑
   */
   async modifyFunctionInfo (id, type) {
    const res = await this.props.dispatch({
      type: 'SmartCommunity/getFunctionInfo',
      payload: {
        id,
      }
    })
    if (res && res.status === 1) {
      this.modifyChild.changeVisible(true, type)
    } else if(res) {
      message.error(res.statusDesc)
    }
  }

  /**
   * 功能管理
   * 页数改变时
   * */
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

  /**
   * 功能管理
   * 页数改变时
   * */
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

  /**
   * 功能管理
   * 获取列表数据
   * */
   getList = async (currPage = 1, pageSize = 10, filter = false) => {
    await this.setState({ currPage, pageSize });
    const paraFilter = filter ? {} : this.props.SmartCommunity.searchInfo;
    this.props.dispatch({
      type: 'SmartCommunity/fetchList',
      payload: {
        currPage,
        pageSize,
        ...paraFilter,
      },
    });
  };

  componentDidMount() {
    this.getList(this.state.currPage, this.state.pageSize);
  }

  renderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:community:add') ? (
          <Button onClick={() => (!this.props.batchLoading ? this.modifyChild.changeVisible(true, 1) : null)}>
            {this.props.batchLoading ? <Icon type="loading" /> : null}
            添加功能
          </Button>
        ) : null}
        {/* <Button onClick={() => this.getList(1, 10, true)}>
          <Icon type="reload" />
          刷新
        </Button> */}
      </Fragment>
    );
  };

  getChild = ref => (this.child = ref);

  render () {
    const {
      permission,
      SmartCommunity: { list = [], numJson = {}, total = 0 },
    } = this.props;
    const {
      currPage,
      pageSize,
      data,
      selectedRows,
      backCurrPage,
      backPageSize,
      isModalShow = 0,
      modalJson = {},
    } = this.state;
    const values = {
      columns: this.state.columns,
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
      <Card bordered={false}>
        <PageHeaderWrapper renderBtn={this.renderBtn} hiddenBreadcrumb={true}>
          <FilterIpts
            searchWholeState={this.state.searchWholeState}
            getList={this.getList}
            getChild={this.getChild}
            pageSize={pageSize}
          />
          <StandardTable {...values} />
        </PageHeaderWrapper>
        <FunctionModal
          getChildData={(child) => this.modifyChild = child}
          getList = {this.getList}
        />
      </Card>
    )
  }
}
