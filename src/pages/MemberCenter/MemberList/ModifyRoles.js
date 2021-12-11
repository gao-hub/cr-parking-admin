// 修改推荐人
import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
const FormItem = Form.Item;

@Form.create()
@connect(({ userManage, loading }) => ({
  userManage,
  submitLoading: loading.effects['userManage/updateSpreads'],
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataInfo: {},
      currPage: 1,
      pageSize: 10,
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'save',
        payload: {
          spreadsList: [],
          spreadsTotal: 0,
        },
      });
      this.cleanData();
    }
    this.setState({
      visible,
    });
  };
  //   页数改变时
  onChange = currPage => {
    this.setState(
      {
        currPage,
      },
      () => {
        this.getSpreadsLog(currPage, this.state.pageSize);
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
        this.getSpreadsLog(currPage, pageSize);
      }
    );
  };
  // 获取推荐人修改列表
  getSpreadsLog = async (currPage = this.state.currPage, pageSize = this.state.pageSize) => {
    const res = await this.props.dispatch({
      type: 'userManage/spreadsLog',
      payload: {
        currPage,
        pageSize,
        userId: this.state.dataInfo.userId,
      },
    });
  };
  handleOk = async () => {
    const {
      dispatch,
      form,
      userManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await this.props.dispatch({
          type: 'userManage/updateSpreads',
          payload: {
            ...values,
            userId: this.state.dataInfo.userId,
          },
        });
        if (res && res.status === 1) {
          message.success('修改成功');
          this.changeVisible(false);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  // 清除数据
  cleanData() {
    this.setState({
      dataInfo: {},
      currPage: 1,
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      userManage: { modifyInfoData, spreadsList, spreadsTotal },
    } = this.props;
    const { dataInfo } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '原推荐人',
        dataIndex: 'spreadsUsernameOld',
      },
      {
        title: '新推荐人',
        dataIndex: 'spreadsUsernameNew',
      },
      {
        title: '更改人',
        dataIndex: 'updateByName',
      },
      {
        title: '更改时间',
        dataIndex: 'updateTime',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ];
    const { currPage, pageSize } = this.state;
    const values = {
      columns,
      data: {
        list: spreadsList,
      },
      loading: this.props.loading,
      pagination: {
        showTotal: total => '共 ' + total + ' 条',
        current: currPage,
        pageSize,
        total: spreadsTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };

    return (
      <Modal
        title={'修改角色'}
        width={800}
        bodyStyle={{ maxHeight: 480, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        confirmLoading={this.props.submitLoading ? true : false}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >

        <Form>
          <FormItem label="用户名" {...formConfig}>
            <span>{dataInfo.username}</span>
          </FormItem>
          <FormItem label="当前角色" {...formConfig}>
            <span>{dataInfo.spreadsUserName || '暂无角色'}</span>
          </FormItem>
          <FormItem label="新角色" {...formConfig}>
            {getFieldDecorator('remark', {})(<Input placeholder={'请输入备注'} />)}
          </FormItem>
        </Form>
        {spreadsList &&
          spreadsList.length > 0 && (
            <>
              <h3>推荐人变更记录</h3>
              <StandardTable {...values} />
            </>
          )}
      </Modal>
    );
  }
}
