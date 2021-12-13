import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Select, InputNumber, Radio } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload'
import { debounce } from '@/utils/utils'
import { _baseApi } from '@/defaultSettings.js';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ diyGiftConfig, loading }) => ({
  diyGiftConfig,
  submitLoading: loading.effects['diyGiftConfig/modifyManage']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      fileList: [],
      infoData: {}
    };
  }
  componentDidMount() {
    this.props.getChildData(this);
  }
  changeVisible = (visible, type) => {
    this.setState({
      visible,
      type
    });
  };

  handleOk = async () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res
        if (this.state.type == 1) {
          res = await dispatch({
            type: 'diyGiftConfig/addManage',
            payload: {
              ...values,
            }
          })
        }
        if (this.state.type == 2) {
          res = await dispatch({
            type: 'diyGiftConfig/modifyManage',
            payload: {
              ...values,
              id: this.props.diyGiftConfig.modifyInfo.id,
            }
          })
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc)
          this.changeVisible(false)
          this.props.getList(this.props.currPage, this.props.pageSize)
        } else message.error(res.statusDesc)
      }
    });
  };
  render() {
    const { form: { getFieldDecorator }, diyGiftConfig: { modifyInfo } } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={this.state.type == 1 ? '添加奖品' : '编辑奖品'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem
            label="奖品名称"
            {...formConfig}
          >
            {getFieldDecorator('levelName', {
              rules: [{ required: true, message: "请输入奖品名称" }],
              initialValue: this.state.type == 2 ? modifyInfo && modifyInfo.levelName : null
            })(
              <Input placeholder={'请输入奖品名称'} maxLength={10} />
            )}
          </FormItem>
          <FormItem {...formConfig} label={'图片'} extra={<span style={{ fontSize: '10px' }}>(注：建议尺寸96x96像素，支持JPG、PNG、JPEG格式)</span>}>
            {getFieldDecorator('levelUrl', {
              rules: [{
                required: true,
                message: '请上传图片',
              }],
              initialValue: (modifyInfo && modifyInfo.levelUrl)
            })(
              <Upload
                defaultUrl={(modifyInfo && modifyInfo.levelUrl)}
                uploadConfig={{
                  action: `${_baseApi}/userLevel/upload`,
                  fileType: ['image'],
                  size: 2
                }}
                setIconUrl={(url) => this.props.form.setFieldsValue({ levelUrl: url })}
              >
                {/* {
                  this.state.fileList.length && this.state.fileList[0].response && this.state.fileList[0].response.status == '99' ?
                    <span style={{ color: 'red', marginLeft: '5px' }}>{this.state.fileList[0].response.statusDesc}</span>
                    : null
                } */}
              </Upload>
            )}
          </FormItem>
          <FormItem
            label="成本价"
            {...formConfig}
          >
            {getFieldDecorator('a', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    callback('请输入成本价')
                    return
                  }
                  const regEn = /^[0-9,<=>.≤≥]+$/;
                  //--> 特殊字符+数字
                  if (value && !regEn.test(value)) {
                    callback('请输入有效的成本价（只可输入数字符号）');
                  } else {
                    callback();
                  }
                }
              }],
              initialValue: this.state.type == 2 ? modifyInfo && modifyInfo.levelStandard : null
            })(
              <Input placeholder={'请输入成本价'} maxLength={10} />
            )}
          </FormItem>
          <FormItem
            label="排序"
            {...formConfig}
          >
            {getFieldDecorator('levelStandard', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    callback('请输入排序')
                    return
                  }
                  const regEn = /^[0-9]*$/;
                  //--> 特殊字符+数字
                  if (!regEn.test(value)) {
                    callback('请输入有效的排序（数字）');
                  } else {
                    callback();
                  }
                }
              }],
              initialValue: this.state.type == 2 ? modifyInfo && modifyInfo.levelStandard : null
            })(
              <Input placeholder={'请输入排序'} maxLength={10} />
            )}
          </FormItem>
          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('levelStatus', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: modifyInfo && modifyInfo.levelStatus
            })(
              <RadioGroup allowClear>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </RadioGroup>
            )}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}
