// 修改推荐人
import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;

@Form.create()
@connect(({ enterpriseManage, loading }) => ({
  enterpriseManage,
  submitLoading: loading.effects['enterpriseManage/statusChangeManage'],
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataInfo: {},
      spreadsLog: [],
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'enterpriseManage/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
    });
  };

  // 获取推荐人修改列表
  getSpreadsLog = async () => {
    const res = await this.props.dispatch({
      type: 'enterpriseManage/spreadsLog',
      payload: {
        ...values,
        userId: this.state.dataInfo.userId,
      },
    });
    if (res && res.status === 1) {
      this.setState({
        spreadsLog: res.data,
      });
    }
  };
  handleOk = async () => {
    const {
      dispatch,
      form,
      enterpriseManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await this.props.dispatch({
          type: 'enterpriseManage/statusChangeManage',
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
  render() {
    const {
      form: { getFieldDecorator },
      enterpriseManage: { modifyInfoData },
    } = this.props;
    const { dataInfo } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '原推荐人',
        dataIndex: 'oldSpreads',
      },
      {
        title: '新推荐人',
        dataIndex: 'spreads',
      },
      {
        title: '更改人',
        dataIndex: 'updater',
      },
      {
        title: '更改时间',
        dataIndex: 'updatetime',
        render: text => moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ];
    return (
      <Modal
        title={'修改推荐人'}
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
          <FormItem label="当前推荐人" {...formConfig}>
            <span>{dataInfo.spreadsUserName || '暂无推荐人'}</span>
          </FormItem>
          <FormItem label="新推荐人" required {...formConfig}>
            {getFieldDecorator('spreadsUserName', {
              rules: [{ required: true, message: '请输入推荐人用户名' }],
            })(<Input placeholder={'请输入推荐人用户名'} />)}
          </FormItem>
          <FormItem label="备注" {...formConfig}>
            {getFieldDecorator('remark', {})(<Input placeholder={'请输入备注'} />)}
          </FormItem>
        </Form>

        {this.spreadsLog &&
          this.spreadsLog.length > 0 && (
            <>
              <h3>推荐人变更记录</h3>
              <Table columns={columns} bordered dataSource={this.spreadsLog} pagination={false} />
            </>
          )}
      </Modal>
    );
  }
}
