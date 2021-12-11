import React, { PureComponent } from 'react';
import { Modal, Form, Input, Checkbox, DatePicker, Select, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';

const FormItem = Form.Item;

@Form.create()
@connect(({ appVersionManage, loading }) => ({
  appVersionManage,
  submitLoading: loading.effects['appVersionManage/modifyManage'],
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'appVersionManage/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const {
      dispatch,
      form,
      appVersionManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        let { updateTime = '' } = values;
        updateTime = moment(updateTime).format('YYYY-MM-DD');

        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'appVersionManage/modifyManage',
            payload: {
              ...values,
              updateTime,
              id: this.props.appVersionManage.modifyInfoData.id,
            },
          });
        } else {
          res = await dispatch({
            type: 'appVersionManage/addManage',
            payload: values,
          });
        }
        if (res && res.status === 1) {
          this.changeVisible(false);
          message.success(res.statusDesc);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);

    this.props.dispatch({
      type: 'appVersionManage/getSelectList',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      appVersionManage: { modifyInfoData, selectListJson = {} },
    } = this.props;

    const { versionUpType = [], versionType = [] } = selectListJson;

    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="系统名称" {...formConfig}>
            {getFieldDecorator('typeSelect', {
              rules: [{ required: true, message: '请选择系统名称' }],
              initialValue: modifyInfoData && modifyInfoData.type ? [modifyInfoData.type] : null,
            })(
              <Checkbox.Group disabled={!!modifyInfoData.id}>
                {Array.isArray(versionType) &&
                  versionType.map(item => <Checkbox value={item.value}>{item.title}</Checkbox>)}
              </Checkbox.Group>
            )}
          </FormItem>

          <FormItem label="版本号" {...formConfig}>
            {getFieldDecorator('version', {
              rules: [{ required: true, message: '请输入版本号' }],
              initialValue: modifyInfoData && modifyInfoData.version,
            })(<Input maxLength={20} placeholder={'请输入版本号'} />)}
          </FormItem>

          <FormItem label="更新地址" {...formConfig}>
            {getFieldDecorator('url', {
              rules: [{ required: false, message: '请输入更新地址' }],
              initialValue: modifyInfoData && modifyInfoData.url,
            })(<Input placeholder={'请输入更新地址'} />)}
          </FormItem>

          <FormItem label="更新内容" {...formConfig}>
            {getFieldDecorator('content', {
              rules: [{ required: true, message: '请输入更新内容' }],
              initialValue: modifyInfoData && modifyInfoData.content,
            })(<TextArea maxLength={500} placeholder={'请输入更新内容'} />)}
          </FormItem>

          <FormItem label="更新方式" {...formConfig}>
            {getFieldDecorator('isUpdate', {
              rules: [{ required: true, message: '请输入更新方式' }],
              initialValue: modifyInfoData && modifyInfoData.isUpdate,
            })(
              <Select allowClear>
                {Array.isArray(versionUpType) &&
                  versionUpType.map(item => (
                    <Select.Option key={item.key} value={item.value}>
                      {item.title}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </FormItem>

          <FormItem label="更新时间" {...formConfig}>
            {getFieldDecorator('updateTime', {
              rules: [{ required: true, message: '请选择更新时间' }],
              initialValue:
                modifyInfoData && modifyInfoData.updateTime
                  ? moment(modifyInfoData.updateTime)
                  : null,
            })(<DatePicker placeholder="请选择" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
