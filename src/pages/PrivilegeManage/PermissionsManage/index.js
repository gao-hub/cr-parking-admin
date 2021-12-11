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
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import UpdateForm from './UpdateForm';
// import styles from './TableList.less';
import styles from '@/style/TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ permission, loading }) => ({
  permission,
  loading: loading.models.permission})
)

@Form.create()

export default class IndexComponent extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    value: ['0-0-0'],
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'name',
    },
    {
      title: '权限',
      dataIndex: 'desc',
    },
    {
      title: '权限名称',
      dataIndex: 'desc2',
    },
    {
      title: '权限说明',
      dataIndex: 'tdad',
    },
    {
      title: '操作',
      render: (text, record) => {
        const action = (
          <Menu>
              <Menu.Item onClick={() => this.handleUpdateModalVisible(true, record,2)}>
                <Icon type="edit" />修改
              </Menu.Item>
              <Menu.Item onClick={() => {
                    Modal.confirm({
                    title: '删除任务',
                    content: '确定删除该任务吗？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => this.deleteItem(record.id),
                    });
                }}>
                <Icon type="close" />删除
              </Menu.Item>
            </Menu>
        )
        return (
          <Dropdown overlay={action}>
            <a className="ant-dropdown-link" href="#">
              操作<Icon type="down" />
            </a>
          </Dropdown>
        )
      },
    },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'permission/fetch',
    });
  }
  renderBtn = () => {
    return (
      <Fragment>
        <Button onClick={() => this.handleUpdateModalVisible(true, {}, 1)}>添加权限</Button>
      </Fragment>
    )
  }

  handleUpdateModalVisible = (flag, record, type) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      modalType:  type
    });
  }

 

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'permission/fetch',
        payload: values,
      });
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="权限">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="权限名称">
                {getFieldDecorator('status')(
                  <Input placeholder="请输入" />
                )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
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
    const { dispatch } = this.props;
    const { formValues } = this.state;


    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'permission/fetch',
      payload: params,
    });
  };

  onChange = (value) => {
    console.log('onChange ', value);
    this.setState({ value });
  }

  handleFormReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const {
      permission: { data },
      loading
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, modalType } = this.state;
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
            <StandardTable
              data={data}
              columns={this.columns}
              multiSelect = {false}
              loading={loading}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            modalType= {modalType}
        />
      </PageHeaderWrapper>
    )
  }
}