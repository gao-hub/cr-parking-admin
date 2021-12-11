import React, { Component } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  message,
  InputNumber,
  Row,
  Col,
  Divider,
  Table,
} from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';
import { getDrawInfo, updateDrawInfo } from './services/index';

const FormItem = Form.Item;
const { Option } = Select;

const typeOption = [
  {
    label: '实物产品',
    value: 1,
  },
  {
    label: '现金红包',
    value: 0,
  },
];

@Form.create()
@connect(({ setPrize, loading }) => ({
  setPrize,
  loading:
    loading.effects['setPrize/addPrizeSetting'] ||
    loading.effects['setPrize/editPrizeSetting'] ||
    loading.effects['setPrize/getPrizeInfo'],
}))
export default class ModifyForm extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    data: {},
    pageSize: 10,
    currentPage: 1,
    total: 50,
    columns: [
      {
        title: '修改类型',
        dataIndex: 'optType',
        render: text => {
          return text === 1 ? '增加' : '减少';
        },
      },
      {
        title: '修改数量',
        dataIndex: 'optNum',
      },
      {
        title: '抽奖码',
        dataIndex: 'prizeCode',
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
      },
      {
        title: '修改人',
        dataIndex: 'createName',
      },
    ],
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  setVisible = () => {
    let { visible } = this.state;
    let { actionType, actionId, activityId } = this.props;
    if (visible) {
      this.props.form.resetFields();
      this.setState({
        data: {},
      });
    } else {
      actionType === 'edit' &&
        this.getPrizeSetting({
          pageSize: this.state.pageSize,
          currPage: this.state.currentPage,
        });
    }
    this.setState({
      visible: !visible,
    });
  };

  // 获取奖品设置
  getPrizeSetting = async payload => {
    let { actionId, activityId, userId } = this.props;
    let res = await getDrawInfo({
      id: actionId,
      activityId,
      userId,
      ...payload,
    });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
        total: res.data.updateLogs.total,
      });
    } else message.error(res.statusDesc);
  };

  handleOk = () => {
    let { actionType, actionId, activityId, userId } = this.props;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        values.activityId = activityId;
        values.userId = userId;
        if (actionType === 'add') {
          res = await this.props.dispatch({
            type: 'setPrize/addPrize',
            payload: values,
          });
        } else {
          res = await updateDrawInfo({
            ...values,
            id: actionId,
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setVisible();
          this.props.getList();
        } else message.error(res.statusDesc);
      }
    });
  };

  //   页数改变时
  onChange = currPage => {
    this.setState(
      {
        currentPage: currPage,
      },
      () => {
        this.getPrizeSetting(currPage, this.state.pageSize);
      }
    );
  };

  render() {
    const { form, actionType } = this.props;
    const { data, visible, columns, currentPage, pageSize, total } = this.state;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    return (
      <>
        <Modal
          title={'修改抽奖机会'}
          bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
          visible={visible}
          destroyOnClose={true}
          onOk={this.handleOk}
          maskClosable={false}
          onCancel={this.setVisible}
        >
          <Form>
            <FormItem label="当前未用次数" {...formConfig}>
              {data.notUseNum}
            </FormItem>
            <FormItem label="修改类型" {...formConfig}>
              {getFieldDecorator('optType', {
                rules: [{ required: true, message: '请选择修改类型' }],
                initialValue: 1,
              })(
                <Radio.Group>
                  <Radio value={1}>增加</Radio>
                  <Radio value={2}>减少</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem label="修改数量" {...formConfig}>
              {getFieldDecorator('optNum', {
                rules: [
                  { required: true, message: '请输入修改数量' },
                  {
                    validator: (rule, val, cb) => {
                      if (val && !/^([1-9]){1}([0-9]){0,3}$/.test(val.toString())) {
                        cb('请输入有效的修改数量(正整数)');
                      } else {
                        cb();
                      }
                    },
                  },
                ],
              })(<Input placeholder="请输入" maxLength="4" />)}
            </FormItem>
          </Form>
          <Divider orientation="left">修改日志</Divider>
          <Table
            dataSource={data?.updateLogs?.records}
            columns={columns}
            rowKey={record => record.id}
            tableLayout="fixed"
            pagination={{
              total,
              pageSize,
              current: currentPage,
              onChange: this.onChange,
            }}
          />
        </Modal>
      </>
    );
  }
}
