import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Radio } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import permission from '@/utils/PermissionWrapper';
import { regNum } from '@/utils/utils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formConfig = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

@Form.create()
@connect(({ userManage, loading }) => ({
  userManage,
  submitLoading: loading.effects['userManage/updateIntegral'],
}))
@permission
class ModifyIntegral extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currPage: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    const { getChildData = () => { } } = this.props;

    getChildData(this);
  }

  changeVisible = visible => {
    this.setState({
      visible
    })
  };

  //   页数改变时
  onChange = currPage => {
    const { pageSize = 10 } = this.state;

    this.setState({ currPage },
      () => {
        this.getTableList(currPage, pageSize);
      }
    );
  };

  onShowSizeChange = (currPage, pageSize) => {
    this.setState({ currPage, pageSize },
      () => {
        this.getTableList(currPage, pageSize);
      }
    );
  };

  /**
   * @desc 获取积分修改记录列表
   */
  getTableList = (currPage = 1, pageSize = 10) => {
    const { dispatch, userId } = this.props;

    dispatch({
      type: 'userManage/getIntegralInfo',
      payload: {
        currPage,
        pageSize,
        userId,
      },
    });
  };

  handleOk = async () => {
    const { dispatch, form, currPage = 1, pageSize = 10, getList = () => { }, dataInfo } = this.props;

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await dispatch({
          type: 'userManage/updateIntegral',
          payload: {
            ...values,
            userId: dataInfo.userId,
          },
        });

        if (res && res.status === 1) {
          message.success('修改成功');
          this.changeVisible(false);
          getList(currPage, pageSize);
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
      userManage: {
        loading = false,
        integrayList = [],
        integrayListTotal = 0
      },
      dataInfo,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        width: 10
      },
      {
        title: '修改类型',
        dataIndex: 'alterType',
        render: (record) => {
          if (record - 0 === 0) {
            return '增加'
          }
          return '减少';
        },
        width: 10
      },
      {
        title: '修改积分值',
        dataIndex: 'alterPoint',
        width: 10
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        width: 10
      },
      {
        title: '修改人',
        dataIndex: 'updateBy',
        width: 10
      }
    ];
    const { currPage, pageSize, visible, submitLoading } = this.state;
    const values = {
      columns,
      data: {
        list: integrayList,
      },
      loading,
      pagination: {
        showTotal: total => `共 ${total} 条`,
        current: currPage,
        pageSize,
        total: integrayListTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
      scroll: "0"
    };

    return (
      <Modal
        title="修改积分"
        width={800}
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={!!submitLoading}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="当前积分" {...formConfig}>
            <span>{dataInfo && dataInfo.currIntegral}</span>
          </FormItem>
          <FormItem label="修改类型" {...formConfig}>
            {getFieldDecorator('alterType', {
              rules: [{ required: true, message: '请选择修改类型' }],
            })(
              <RadioGroup allowClear>
                <Radio value={0}>增加</Radio>
                <Radio value={1}>减少</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="修改积分值" {...formConfig}>
            {getFieldDecorator('alterPoint', {
              rules: [{ required: true, validator: (rules, value, callback) => {
                if (!value) {
                  callback('请修改积分值')
                }
                if(value === '0') {
                  callback('修改积分值不能为0')
                }
                if (!regNum.test(value)) {
                  callback('请输入正整数')
                }
                callback()
              } }],
            })(<Input placeholder="请输入修改积分值" maxLength={8} />)}
          </FormItem>
        </Form>
        {
          integrayList.length ?
            <>
              <h3>修改日志</h3>
              <StandardTable {...values} />
            </> : null
        }
      </Modal>
    );
  }
}

export default ModifyIntegral;
