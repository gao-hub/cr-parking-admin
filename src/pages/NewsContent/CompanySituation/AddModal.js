import React, { Component } from 'react';
import { Form, Input, Modal, Radio, message, DatePicker } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings.js';
import BraftEditor from '@/components/BraftEditor';
import moment from 'moment';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const rules = {
  name: [{ required: true, message: '请填写文章标题' }],
  content: [{ required: true, message: '请填写文章内容' }],
  newsPic: [{ required: true, message: '请上传封面图' }],
  status: [{ required: true, message: '请选择状态' }],
  time: [{ required: true, message: '请选择时间' }],
};
const statusOption = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '禁用',
    value: 0,
  },
];

@connect(({ companySituation }) => ({
  companySituation,
}))
@Form.create()
export default class AddModal extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    data: {},
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  setVisible = () => {
    const { visible } = this.state;
    const { actionType, actionId } = this.props;
    if (!visible && actionType !== 'add' && actionId) {
      this.getData({ id: actionId });
    } else {
      this.setState({ data: {} });
    }
    this.setState({
      visible: !visible,
    });
  };

  getData = async payload => {
    let res = await this.props.dispatch({
      type: 'companySituation/getData',
      payload,
    });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
      });
    } else message.error(res.statusDesc);
  };

  handleContentChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      newsContent: value === '<p></p>' ? '' : value,
    });
  };

  handleOk = () => {
    const {
      actionType,
      actionId,
      dispatch,
      form,
      getList,
      currPage,
      pageSize,
    } = this.props;
    if (actionType === 'detail') {
      this.setVisible();
      return;
    }
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        values.newsDate = moment(values.newsDate).format(dateFormat);
        if (actionType === 'add') {
          res = await dispatch({
            type: 'companySituation/addData',
            payload: values,
          });
        } else {
          res = await dispatch({
            type: 'companySituation/editData',
            payload: {
              ...values,
              id: actionId,
            },
          });
        }
        if (res && res.status === 1) {
          this.setVisible();
          message.success(res.statusDesc);
          getList(currPage, pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };

  render() {
    const {
      actionType,
      form: { getFieldDecorator },
    } = this.props;
    const { data } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    // 查看详情
    const isView = actionType === 'detail';
    const titleOption = {
      add: '添加',
      edit: '修改',
      detail: '详情',
    };
    return (
      <Modal
        title={titleOption[actionType]}
        visible={this.state.visible}
        width="80%"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        destroyOnClose
        onOk={this.handleOk}
        onCancel={this.setVisible}
      >
        <Form>
          <FormItem label="文章标题" {...formConfig}>
            {getFieldDecorator('newsTitle', {
              rules: rules.name,
              initialValue: data.newsTitle || '',
            })(<Input maxLength={20} disabled={isView} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="文章简介" {...formConfig}>
            {getFieldDecorator('newsIntroduction', {
              rules: [{ required: false, message: '请输入文章简介' }],
              initialValue: data && data.newsIntroduction,
            })(<Input disabled={isView} placeholder={'请输入'} maxLength={50} />)}
          </FormItem>
          <FormItem label="时间" {...formConfig}>
            {getFieldDecorator('newsDate', {
              rules: rules.time,
              initialValue: data.newsDate ? moment(data.newsDate) : null,
            })(<DatePicker disabled={isView} />)}
          </FormItem>
          <FormItem
            label="封面图"
            {...formConfig}
            extra={
              <span style={{ fontSize: '10px' }}>(注：请上传336*264的图片，大小不超过2MB)</span>
            }
          >
            {(actionType === 'add' || (actionType !== 'add' && data.newsPic)) &&
              getFieldDecorator('newsPic', {
                rules: rules.newsPic,
                initialValue: data && data.newsPic,
              })(
                <Upload
                  defaultUrl={(data && data.newsPic) || ''}
                  disabled={isView}
                  uploadConfig={{
                    action: `${_baseApi}/dynamicArt/upload`,
                    fileType: ['image'],
                    size: 2,
                    imgSize: { width: 336, height: 264 },
                  }}
                  setIconUrl={url => {
                    this.props.form.setFieldsValue({ newsPic: url });
                  }}
                />
              )}
          </FormItem>
          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('newsStatus', {
              rules: rules.status,
              initialValue: data && data.newsStatus,
            })(
              <Radio.Group disabled={isView}>
                {statusOption.map(item => (
                  <Radio key={item.value + 1} value={item.value}>
                    {item.label}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="文章内容" {...formConfig}>
            {getFieldDecorator('newsContent', {
              rules: rules.content,
              initialValue: data && data.newsContent,
            })(
              <BraftEditor
                handleChange={this.handleContentChange}
                uploadImgUrl={`${_baseApi}/dynamicArt/upload`}
                content={data.newsContent}
                placeholder="请输入文章内容"
                image={true}
                video={true}
                minHeight="500px"
                disabled={isView}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
