import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';

const FormItem = Form.Item;

@Form.create()
@connect(({ userManage, loading }) => ({
  userManage,
  submitLoading: loading.effects['userManage/updateChannel'],
}))
class ModifyChannel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataInfo: {},
      currPage: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    const { getChildData = () => {} } = this.props;

    getChildData(this);
  }

  changeVisible = visible => {
    if (!visible) {
      const { dispatch = () => {} } = this.props;

      dispatch({
        type: 'save',
        payload: {
          updateChannelRecordList: [],
          updateChannelRecordListTotal: 0,
        },
      });
      this.cleanData();
    }

    this.setState({ visible });
  };

  //   页数改变时
  onChange = currPage => {
    const { pageSize = 10 } = this.state;

    this.setState(
      {
        currPage,
      },
      () => {
        this.getTableList(currPage, pageSize);
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
        this.getTableList(currPage, pageSize);
      }
    );
  };

  /**
   * @desc 获取渠道修改记录列表
   */
  getTableList = (currPage = 1, pageSize = 10) => {
    const { dispatch = () => {} } = this.props;
    const { dataInfo = {} } = this.state;

    dispatch({
      type: 'userManage/updateChannelRecord',
      payload: {
        currPage,
        pageSize,
        userId: dataInfo.userId,
      },
    });
  };

  handleOk = async () => {
    const { dispatch, form, currPage = 1, pageSize = 10, getList = () => {} } = this.props;
    const { dataInfo = {} } = this.state;

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await dispatch({
          type: 'userManage/updateChannel',
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
      userManage: {
        loading = false,
        updateChannelRecordList = [],
        updateChannelRecordListTotal = 0,
        initData: { parentUtmTypes = [] },
      },
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
        title: '原渠道',
        dataIndex: 'oldParentUtmName',
      },
      {
        title: '新渠道',
        dataIndex: 'newParentUtmName',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
      },
      {
        title: '修改人',
        dataIndex: 'updateByName',
      }
    ];
    const { currPage, pageSize, visible, submitLoading } = this.state;
    const values = {
      columns,
      data: {
        list: updateChannelRecordList,
      },
      loading,
      pagination: {
        showTotal: total => `共 ${total} 条`,
        current: currPage,
        pageSize,
        total: updateChannelRecordListTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };

    return (
      <Modal
        title="修改渠道"
        width={800}
        // bodyStyle={{ maxHeight: 480, overflow: 'auto' }}
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={!!submitLoading}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="用户名" {...formConfig}>
            <span>{dataInfo.username}</span>
          </FormItem>
          <FormItem label="当前渠道" {...formConfig}>
            <span>{dataInfo.parentUtmName || '暂无渠道'}</span>
          </FormItem>
          <FormItem label="新渠道" {...formConfig}>
            {getFieldDecorator('parentUtmId')(
              <Select allowClear>
                {Array.isArray(parentUtmTypes) &&
                  parentUtmTypes.map(item => (
                    <Select.Option key={item.key} value={item.value}>
                      {item.title}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="备注" {...formConfig}>
            {getFieldDecorator('remark', {})(<Input placeholder="请输入备注" />)}
          </FormItem>
        </Form>
        {updateChannelRecordList &&
          updateChannelRecordList.length > 0 && (
            <>
              <h3>渠道修改记录</h3>
              <StandardTable {...values} />
            </>
          )}
      </Modal>
    );
  }
}

export default ModifyChannel;
