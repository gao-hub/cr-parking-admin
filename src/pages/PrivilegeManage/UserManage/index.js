import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import styles from '@/style/TableList.less';
import ModalForm from './ModalForm';

const dateFormat = 'YYYY-MM-DD'
const FormItem = Form.Item;
const { Option } = Select;

@permission

@connect(({ manageMember, loading }) => ({
  manageMember,
  loading: loading.models.manageMember
}))

@Form.create()

export default class IndexComponent extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    modalType: '',
    currPage: 1,
    pageSize: 10
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '角色',
      dataIndex: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: record => record == 1 ? '禁用' : '启用'
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: record => moment(record).format('YYYY-MM-DD  HH:mm:ss')
    },
    {
      title: '操作',
      render: (text, record) =>{
        const { permission } = this.props;
        const action = (
          <Menu>
            {
              permission.includes('system:user:update') && record.status == 1 ?
              <Menu.Item onClick={() => this.modifyState(record.userId, 0)}>
                <Icon type="check" />启用
              </Menu.Item> : null
            }
            {
              permission.includes('system:user:update') && record.status == 0 ?
              <Menu.Item onClick={() => this.modifyState(record.userId, 1)}>
                <Icon type="close" />禁用
              </Menu.Item> : null
            }
            {
              permission.includes('system:user:update') ? 
              <Menu.Item onClick={() => this.handleUpdateModalVisible(true, record, 2)}>
                <Icon type="edit" />修改
              </Menu.Item> : null
            }
            {
              permission.includes('system:user:update') ? 
              <Menu.Item onClick={() => {
                Modal.confirm({
                  title: '重置密码',
                  content: '确定重置密码吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => this.resetPassword(record.userId),
                });
              }}>
                <Icon type="redo" />重置密码
              </Menu.Item> : null
            }
            {
              permission.includes('system:user:delete') ? 
              <Menu.Item onClick={() => {
                Modal.confirm({
                  title: '删除管理员',
                  content: '本操作不可逆，确定要删除此管理员吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => this.deleteManage(record.userId),
                });
              }}>
                <Icon type="close" />删除
              </Menu.Item> : null
            }
          </Menu>
        )
        return (
          <Dropdown overlay={action} disabled={permission.includes('system:user:update') || permission.includes('system:user:delete') ? false : true}>
            <a className="ant-dropdown-link" href="#">
              操作<Icon type="down" />
            </a>
          </Dropdown>
        )
      },
    },
  ];
  componentDidMount() {
    this.getManageMemberList()
    this.resetModels()
    this.getRoleList()
  }
  /**  获取角色
   * 
   */
  getRoleList = () => {
    this.props.dispatch({
      type: 'manageMember/getRoleList',
      payload: {
        status: 0
      }
    })
  }
  /**  删除管理员
   * userId 用户id
   */
  deleteManage = async (userId) => {
    const res = await this.props.dispatch({
      type: 'manageMember/deleteManage',
      payload: {
        userId
      }
    })
    if (res && res.status === 1) {
      message.success(res.statusDesc);
      this.getManageMemberList(this.state.currPage, this.state.pageSize)
    } else message.error(res.statusDesc)
  }
  /** 重置models数据
   * 
   */
  resetModels = () => {
    this.props.dispatch({
      type: 'manageMember/saveModifyInfo',
      payload: {}
    })
  }
  /**  重置密码
   * userId 用户id
   */
  resetPassword = async (userId) => {
    const res = await this.props.dispatch({
      type: 'manageMember/resetPassword',
      payload: {
        userId
      }
    })
    if (res && res.status === 1) {
      message.success(res.statusDesc);
      this.getManageMemberList(this.state.currPage, this.state.pageSize)
    } else message.error(res.statusDesc)
  }
  /** 修改状态
   * userId 用户id
   * status: 1 禁用  0 启用
   */
  modifyState = (userId, status) => {
    Modal.confirm({
      title: '改变状态',
      content: `确定要${status ? '禁用' : '启用'}该用户吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await this.props.dispatch({
          type: 'manageMember/modifyState',
          payload: {
            userId,
            status
          }
        })
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setState({
            updateModalVisible: false
          })
          this.getManageMemberList(this.state.currPage, this.state.pageSize)
        } else message.error(res.statusDesc)
      },
    });
  }
  //   获取列表
  getManageMemberList = (currPage = 1, pageSize = 10) => {
    this.setState({
      currPage,
      pageSize
    }, () => {
      this.props.dispatch({
        type: 'manageMember/fetchList',
        payload: {
          currPage,
          pageSize,
          ...this.state.formValues,
        }
      })
    })
    
  }
  renderBtn = () => {
    return (
      <Fragment>
        <Button onClick={() => this.handleUpdateModalVisible(true, {}, 1)}><Icon type="add" />添加用户</Button>
      </Fragment>
    )
  }
  /** 添加修改用户弹窗操作
   * modalType 判断是添加还是修改
   * updateModalVisible 添加修改弹窗显示
   * record  传参  默认没有值
   */
  handleUpdateModalVisible = async (flag, record={}, modalType) => {
    const { dispatch } = this.props;
    if(modalType === 2) {
      await dispatch({
        type: 'manageMember/getModifyInfo',
        payload: {
          userId: record.userId
        }
      })
    } else {
      await dispatch({
        type: 'manageMember/saveInfo',
        payload: {}
      })
    }
    this.setState({
      updateModalVisible: !!flag,
      modalType,
      id: record.userId
    });
  }

 

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { currPage, pageSize } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      }, () => this.getManageMemberList(1, pageSize));
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={[{ xxl: 8, xl: 16, md: 24, lg: 32 }, 2]}>
          <Col xxl={4} xl={6} lg={6} md={6}>
            <FormItem label="用户名">
              {getFieldDecorator('userName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={6} md={6}>
            <FormItem label="手机号">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={6} md={6}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select
                  allowClear
                >
                  <Option key={0} value={0}>启用</Option>
                  <Option key={1} value={1}>禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={6} md={6}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
             <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               重置
             </Button>
          </Col>
        </Row>
      </Form>
    );
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.setState({
      currPage: pagination.current,
      pageSize: pagination.pageSize,
    }, () => this.getManageMemberList(pagination.current, pagination.pageSize))
  };

  handleFormReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const {
      manageMember: { data },
      loading,
      permission
    } = this.props;
    const { updateModalVisible, pageSize, currPage, modalType } = this.state;
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      id: this.state.id
    };
    return (
      <PageHeaderWrapper renderBtn={permission.includes('system:user:add') ? this.renderBtn : null}>
        {
          permission.includes('system:user:list') ? 
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
                <StandardTable
                  data={data}
                  // data={{ list: [{ key: 1 }], pagination: { total: 1 } }}
                  columns={this.columns}
                  multiSelect = {false}
                  loading={loading}
                  onChange={this.handleStandardTableChange}
                /> 
            </div>
          </Card>
        : null }
        <ModalForm
          {...updateMethods}
          modalType={modalType}
          updateModalVisible={updateModalVisible}
          getManageMemberList={() => this.getManageMemberList(currPage, pageSize)}
        />
      </PageHeaderWrapper>
    )
  }
}