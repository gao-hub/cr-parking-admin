import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Radio, message } from 'antd';
import { addCategory, updateCategory } from './services/index';

const { confirm } = Modal;

@Form.create()
@connect(({ goodsCategoryManage }) => ({
  goodsCategoryManage,
}))
class AddCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleOk = async () => {
    const {
      form,
      getList,
      onCancel,
      infoData,
      goodsCategoryManage: { list },
    } = this.props;

    await this.setState({ loading: true });
    form.validateFields(async (err, values) => {
      if (!err) {
        const submit = async () => {
          const { cateName, status } = values;
          let res;
          if (infoData) {
            res = await updateCategory({ cateName, status, pid: 0, id: infoData.id });
          } else {
            res = await addCategory({ cateName, status, pid: 0 });
          }
          await this.setState({ loading: false });
          if (res && res.status === 1) {
            message.success('操作成功');
            onCancel();
            getList();
          } else {
            message.success('操作失败');
          }
        };
        if (
          list.every(item => {
            if (infoData && item.id === infoData.id) {
              return true;
            }
            return item.cateName !== values.cateName;
          })
        ) {
          await submit();
        } else {
          confirm({
            title: '校验',
            content: '类目名称重复，确定执行操作吗?',
            onOk: async () => {
              await submit();
            },
            onCancel() {},
            okText: '确定',
            cancelText: '取消',
          });
        }
      }
      this.setState({ loading: false });
    });
  };

  render() {
    const { loading } = this.state;
    const {
      form: { getFieldDecorator },
      visible,
      onCancel,
      infoData,
    } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={infoData ? '编辑类目' : '新增类目'}
        okText="保存"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={loading}
        onCancel={onCancel}
        destroyOnClose
      >
        <Form>
          <Form.Item {...formConfig} label="类目名称">
            {getFieldDecorator('cateName', {
              initialValue: infoData && infoData.cateName,
              rules: [
                { required: true, message: '输入框不得为空' },
                { whitespace: true, message: '输入框不得为空' },
              ],
            })(<Input maxLength={6} />)}
          </Form.Item>
          <Form.Item {...formConfig} label="状态">
            {getFieldDecorator('status', {
              initialValue: infoData && infoData.status,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AddCategory;
