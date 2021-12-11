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

//  类型管理弹窗
import TypeModal from './TypeModal'

//   检索条件
import BuyBackFilterIpts from './BuyBackFilterIpts';


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

export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    //类型管理
    backCurrPage: 1,
    backPageSize: 10,
    backTitle: '添加',
    backSyncColumns: [],
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '类型名称',
        dataIndex: 'groupsName',
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
                permission.includes('chuangrong:communityGroups:update') ? 
                <Menu.Item onClick={() => this.modifyTypeInfo(record.id, 2)}>
                  <Icon type="edit" />修改
                </Menu.Item> : null
              }
              {
                permission.includes('chuangrong:communityGroups:state') && record.productState === 1 ? 
                <Menu.Item onClick={() => this.modifyTypeState(record.id, 0)}>
                  <Icon type="edit" />启用
                </Menu.Item> : null
              }
              {
                permission.includes('chuangrong:communityGroups:state') && record.productState === 0 ? 
                <Menu.Item onClick={() => this.modifyTypeState(record.id, 1)}>
                  <Icon type="edit" />禁用
                </Menu.Item> : null
              }
              {
                permission.includes('chuangrong:communityGroups:delete') ? 
                <Menu.Item onClick={() => this.deleteType(record.id)}>
                  <Icon type="close" />删除
                </Menu.Item> : null
              }
            </Menu>
          );
          return permission.includes('chuangrong:communityGroups:update') ||
            permission.includes('chuangrong:communityGroups:delete') ? (
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
    backSearchWholeState: false,
    isModalShow: 0, // 连连支付密码 Modal
    modalJson: {},
    tabIndex: '1',
  }

  /** 修改状态
   * id 功能id
   * status: 1 禁用  0 启用
   */
   modifyTypeState = (id, status) => {
    Modal.confirm({
      title: '改变状态',
      content: `确定要${status ? '禁用' : '启用'}该状态吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await this.props.dispatch({
          type: 'SmartCommunity/modifyTypeState',
          payload: {
            id,
            productState: status
          }
        })
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.getTypeList(this.state.backCurrPage, this.state.backPageSize)
          this.props.dispatch({
            type: 'SmartCommunity/getTypeSelect'
          });
        } else if(res) message.error(res.statusDesc)
      },
    });
  }
  /**
   * @desc 删除类型管理
   * @param { string } id   功能id
   */
   async deleteType (id) {
    const confirmVal = await Swal.fire({
      text: '确定要删除此类型吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'SmartCommunity/deleteType',
        payload: {
          id,
        }
      })
      if (res && res.status === 1) {
        message.success(res.statusDesc)
        this.getTypeList(1, this.state.backPageSize)
        this.props.dispatch({
          type: 'SmartCommunity/getTypeSelect'
        });
      } else if(res) {
        message.error(res.statusDesc)
      }
    }
  }

  /**
   * @desc 编辑类型管理 获取类型详情并打开弹窗
   * @param { string } id   类型id
   * @param { number } type 弹窗类型  1: 添加  2：编辑
   */
   async modifyTypeInfo (id, type) {
    const res = await this.props.dispatch({
      type: 'SmartCommunity/getTypeInfo',
      payload: {
        id,
      }
    })
    if (res && res.status === 1) {
      this.typeChild.changeVisible(true, type)
    } else if(res) {
      message.error(res.statusDesc)
    }
  }

  /**
   * 类型管理
   * 页数改变时
   * */
  onBackChange = currPage => {
    this.setState(
      {
        backCurrPage: currPage,
      },
      () => {
        this.getTypeList(currPage, this.state.backPageSize);
      }
    );
  };


  /**
   * 类型管理
   * 页数改变时
   * */
  onBackShowSizeChange = (currPage, pageSize) => {
    this.setState(
      {
        backCurrPage: currPage,
        backPageSize: pageSize,
      },
      () => {
        this.getTypeList(currPage, pageSize);
      }
    );
  };

  /**
   * 类型管理
   * 获取列表数据
   * */
  getTypeList = async (currPage = 1, pageSize = 10, filter = false) => {
    await this.setState({ backCurrPage: currPage, backPageSize: pageSize });
    const paraFilter = filter ? {} : this.props.SmartCommunity.backSearchInfo;
    this.props.dispatch({
      type: 'SmartCommunity/fetchBackList',
      payload: {
        currPage,
        pageSize,
        ...paraFilter,
      },
    });
  };

  //   类型管理右上角自定义操作
  backRenderBtn = () => {
    const { searchWholeState } = this.state;
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:communityGroups:add') ? (
          <Button onClick={() => (!this.props.batchLoading ? this.typeChild.changeVisible(true, 1) : null)}>
            {this.props.batchLoading ? <Icon type="loading" /> : null}
            添加类型
          </Button>
        ) : null}
        {/* <Button onClick={() => this.getTypeList(1, 10, true)}>
          <Icon type="reload" />
          刷新
        </Button> */}
      </Fragment>
    );
  };

  getChild2 = ref => (this.child2 = ref);

  componentDidMount() {
    this.getTypeList(this.state.backCurrPage, this.state.backPageSize);
  }

  render (){
    const {
      permission,
      SmartCommunity: { typeManageList = [], typeTotal = 0 },
    } = this.props;
    const {
      data,
      selectedRows,
      backCurrPage,
      backPageSize,
      isModalShow = 0,
      modalJson = {},
    } = this.state;
    const buyBackValues = {
      columns: this.state.columns,
      data: {
        list: typeManageList,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: backCurrPage,
        pageSize: backPageSize,
        total: typeTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onBackChange,
        onShowSizeChange: this.onBackShowSizeChange,
      },
    };
    return (
      <Card bordered={false}>
        <PageHeaderWrapper renderBtn={this.backRenderBtn} hiddenBreadcrumb={true}>
            <BuyBackFilterIpts
              searchWholeState={this.state.searchWholeState}
              getTypeList={this.getTypeList}
              getChild={this.getChild2}
              current={backCurrPage}
              pageSize={backPageSize}
            />
            <StandardTable {...buyBackValues} />
        </PageHeaderWrapper>
        <TypeModal
          getChildData={(child) => this.typeChild = child}
          getTypeList = {this.getTypeList}
        />
      </Card>
    )
  }
}
