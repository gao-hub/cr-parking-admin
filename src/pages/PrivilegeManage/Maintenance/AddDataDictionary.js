import React, { Component } from 'react'
import {
  Form,
  Input,
  Button,
  Icon,
  DatePicker,
  Checkbox,
  Radio
} from 'antd';
import { connect } from 'dva';
//   引入添加汇转让配置
import AddDataDictionary from './AddDataDictionary';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const CheckboxGroup = Checkbox.Group;

@Form.create()

@connect(({ dataDictionary }) => ({
  dataDictionary,
}))

export default class ModalDataDictionary extends Component {
  componentDidMount() {
    this.props.getAddconfigData(this)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isAdd } = this.props;
    const { initModifyInfo } = this.props.dataDictionary;
    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    return (
      <Form className={'addForm'}>
        <FormItem
          label="字典区分"
          {...formItemConfig}
        >
          {getFieldDecorator('dictType', {
            rules: [{
              required: true,
              validator: (rule, value, cb) => {
                if (!value) {
                  cb('请填写信息')
                  return
                } else if (value.length > 20 || value.length < 1 || !(value.toString()).match(/^[a-zA-Z0-9_]+$/)) {
                  cb('字典区分只能是数字、字母或者下划线，长度1~20位！！')
                  return
                }
                cb()
              }
            }],
            initialValue: !isAdd ? initModifyInfo.dictType : ""
          })(
            <Input disabled={!isAdd} maxLength={20} />
          )}
        </FormItem>
        <FormItem
          label="字典编号"
          {...formItemConfig}
        >
          {getFieldDecorator('dictCode', {
            rules: [{
              required: true,
              validator: (rule, value, cb) => {
                if (!value) {
                  cb('请填写信息')
                  return
                } else if (value.length > 6 || value.length < 1 || !(value.toString()).match(/^[a-zA-Z0-9_]+$/)) {
                  cb('字典编号只能是数字、字母或者下划线，长度1~6位！！')
                  return
                }
                cb()
              }
            }],
            initialValue: !isAdd ? initModifyInfo.dictCode : ""
          })(
            <Input disabled={!isAdd} maxLength={6} />
          )}
        </FormItem>
        <FormItem
          label="字典名称"
          {...formItemConfig}
        >
          {getFieldDecorator('dictName', {
            rules: [{
              required: true,
              validator: (rule, value, cb) => {
                if (!value) {
                  cb('请填写信息')
                  return
                } else if (value.length > 100) {
                  cb('字典名称长度不能超过100个字符！')
                  return
                }
                cb()
              }
            }],
            initialValue: !isAdd ? initModifyInfo.dictName : ""
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="排序"
          {...formItemConfig}
        >
          {getFieldDecorator('sort', {
            rules: [{
              validator: (rule, value, cb) => {
                if (value && !(value.toString()).match(/^[0-9]+$/)) {
                  cb('排序只能输入数字，长度不能超过2位！')
                  return
                }
                cb()
              }
            }],
            initialValue: !isAdd ? initModifyInfo.sort : ""
          })(
            <Input maxLength={2} />
          )}
        </FormItem>
        <FormItem
          label="扩展项目1"
          {...formItemConfig}
        >
          {getFieldDecorator('other1', {
            rules: [{
              validator: (rule, value, cb) => {
                if (value && value.length > 255) {
                  cb('扩展项目1长度不能超过255个字符！')
                  return
                }
                cb()
              }
            }],
            initialValue: !isAdd ? initModifyInfo.other1 : ""
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="扩展项目2"
          {...formItemConfig}
        >
          {getFieldDecorator('other2', {
            rules: [{
              validator: (rule, value, cb) => {
                if (value && value.length > 255) {
                  cb('扩展项目1长度不能超过255个字符！')
                  return
                }
                cb()
              }
            }],
            initialValue: !isAdd ? initModifyInfo.other2 : ""
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="扩展项目3"
          {...formItemConfig}
        >
          {getFieldDecorator('other3', {
            rules: [{
              validator: (rule, value, cb) => {
                if (value && value.length > 255) {
                  cb('扩展项目1长度不能超过255个字符！')
                  return
                }
                cb()
              }
            }],
            initialValue: !isAdd ? initModifyInfo.other3 : ""
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    )
  }
}
