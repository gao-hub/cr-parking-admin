import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { _baseApi } from '@/defaultSettings';
import { Modal, Form, Input, Radio, message } from 'antd';
import { addCategory, updateCategory } from './services/index';
import Upload from './comp/Upload/index';

const { confirm } = Modal;

@Form.create()
@connect(({ goodsCategoryManage }) => ({
  goodsCategoryManage,
}))
class AddCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '新增子类目',
      loading: false,
    };
  }

  componentDidMount() {
    const { infoData } = this.props;
    if (infoData) {
      this.setState({ title: '编辑子类目' });
    }
  }

  handleOk = async () => {
    const { form, getList, fData, onCancel, infoData } = this.props;
    await this.setState({ loading: true });
    form.validateFields(async (err, values) => {
      if (!err) {
        const submit = async () => {
          const { cateName, status, pic } = values;
          let res;
          if (infoData) {
            res = await updateCategory({
              cateName,
              status,
              pid: infoData.pid,
              id: infoData.id,
              pic,
            });
          } else {
            res = await addCategory({ cateName, status, pid: fData.id, pic });
          }
          this.setState({ loading: false });
          if (res && res.status === 1) {
            message.success('操作成功');
            onCancel();
            getList();
          } else {
            message.success('操作失败');
          }
        };
        if (
          fData.children.every(item => {
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
    const { title, loading } = this.state;
    const {
      form: { getFieldDecorator },
      form,
      visible,
      infoData,
      onCancel,
      fData,
    } = this.props;

    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={title}
        okText="保存"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={loading}
        onCancel={onCancel}
        destroyOnClose
      >
        <Form>
          {fData && (
            <Form.Item {...formConfig} label="上级类目名称">
              <div>{fData?.cateName}</div>
            </Form.Item>
          )}
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
          <Form.Item {...formConfig} label="示意图">
            {getFieldDecorator('pic', { rules: [{ required: true, message: '请上传' }] })(
              <Upload
                defaultUrl={infoData && infoData.pic}
                uploadConfig={{
                  action: `${_baseApi}/homeStoreCategory/upload`,
                  fileType: ['image'],
                  size: 1,
                  maxFileList: 1,
                }}
                setIconUrl={(url, deleteFlag) => {
                  if (deleteFlag) {
                    form.setFieldsValue({ pic: undefined });
                  } else {
                    form.setFieldsValue({ pic: url });
                  }
                }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AddCategory;
