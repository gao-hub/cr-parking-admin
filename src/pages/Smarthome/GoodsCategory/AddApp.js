import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Radio, message, InputNumber } from 'antd';
import { addScene, updateScene } from './services/index';

const { confirm } = Modal;

@Form.create()
@connect(({ goodsCategoryManage }) => ({
  goodsCategoryManage,
}))
class AddApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleOk = async () => {
    const { form, getList, onCancel, infoData } = this.props;

    await this.setState({ loading: true });
    form.validateFields(async (err, values) => {
      if (!err) {
        let res;

        if (infoData) {
          res = await updateScene({ ...values, id: infoData.id });
        } else {
          res = await addScene({ ...values });
        }
        await this.setState({ loading: false });
        if (res && res.status === 1) {
          message.success('操作成功');
          onCancel();
          getList();
        } else {
          message.error('操作失败');
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
        title={infoData ? '编辑' : '添加'}
        okText="保存"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={loading}
        onCancel={onCancel}
        destroyOnClose
      >
        <Form>
          <Form.Item {...formConfig} label="标签位置">
            <div>应用场景</div>
          </Form.Item>
          <Form.Item {...formConfig} label="标签名称">
            {getFieldDecorator('sceneName', {
              initialValue: infoData && infoData.sceneName,
              rules: [
                { required: true, message: '输入框不得为空' },
                { whitespace: true, message: '输入框不得为空' },
              ],
            })(<Input maxLength={4} />)}
          </Form.Item>
          <Form.Item {...formConfig} label="排序">
            {getFieldDecorator('sortId', {
              initialValue: infoData && infoData.sortId,
              rules: [{ required: true, message: '输入框不得为空' }],
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item {...formConfig} label="标签描述">
            {getFieldDecorator('sceneDescription', {
              initialValue: infoData && infoData.sceneDescription,
              rules: [],
            })(<Input />)}
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

export default AddApp;
