import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Select, InputNumber } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload'
import { debounce } from '@/utils/utils'
import { _baseApi } from '@/defaultSettings.js';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ agentconfig, loading }) => ({
  agentconfig,
  submitLoading: loading.effects['agentconfig/modifyManage']
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
    this.checkLevelName = debounce(this.checkLevelName,800)
    this.checkLevelStandard = debounce(this.checkLevelStandard,800)
  }
  changeVisible = (visible, type) => {
    this.setState({
      visible,
      type
    });
  };

  checkLevelName = async(rules, value, callback)=>{
    if(!value){
      callback('请输入等级')
    }
    if(value){
      const { dispatch } = this.props;
      let res = await dispatch({
        type: 'agentconfig/checkLevelName',
        payload: {
          levelName: value,
          id: this.props.agentconfig.modifyInfo.id
        }
      })
      if(res && res.status == 1) {
        callback()
      }else callback(res.statusDesc)
    }
    callback()
  }

  checkLevelStandard = async(rules, value, callback)=>{
    if(!value && value != 0){
      callback('请输入认购标准')
    }
    if(value){
      const { dispatch } = this.props;
      let res = await dispatch({
        type: 'agentconfig/checkLevelStandard',
        payload: {
          levelStandard: value,
          id: this.props.agentconfig.modifyInfo.id
        }
      })
      if(res && res.status == 1) {
        callback()
      }else callback(res.statusDesc)
    }
    callback()
  }

  handleOk = async () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res
        if(this.state.type == 1) {
          res= await dispatch({
            type: 'agentconfig/addManage',
            payload: {
              ...values,
            }
          })
        }
        if(this.state.type == 2){
          res= await dispatch({
            type: 'agentconfig/modifyManage',
            payload: {
              ...values,
              id: this.props.agentconfig.modifyInfo.id,
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
    const { form: { getFieldDecorator }, agentconfig: { modifyInfo } } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={this.state.type == 1 ? '新增代理商' : '修改代理商'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem
            label="等级"
            {...formConfig}
          >
            {getFieldDecorator('levelName', {
              rules: [{ required: true, validator: this.checkLevelName}],
              initialValue: this.state.type == 2 ? modifyInfo && modifyInfo.levelName : null
            })(
              <Input placeholder={'请输入等级'}/>
            )}
          </FormItem>
          <FormItem
            label="认购标准"
            {...formConfig}
          >
            {getFieldDecorator('levelStandard', {
              rules: [{ required: true, validator: this.checkLevelStandard }],
              initialValue: this.state.type == 2 ? modifyInfo && modifyInfo.levelStandard : null
            })(
              <Input placeholder={'请输入认购标准'} addonAfter={'个'} onChange={(e)=>{
                const value = e.target.value;
                setTimeout(()=>{
                  this.props.form.setFieldsValue({ levelStandard: value.replace(/\D/g,'')})
                },30)
              }}/>
            )}
          </FormItem>
          <FormItem
            label="认购优惠"
            {...formConfig}
          >
            {getFieldDecorator('levelDiscount', {
              rules: [{ required: true, validator: (rules, value, callback)=>{
                if(!value){
                  callback('请填写认购优惠')
                }
                if(Number(value) < 0 || Number(value) > 100) {
                  callback('请输入大于等于0%,小于等于100%的认购优惠')
                }
                if (!value.toString().match(/^\d+([.]{1}[0-9]{1,2}){0,1}$/)) callback('必须为整数或者小数，小数点后2位');
                callback()
              }}],
              initialValue: this.state.type == 2 ? modifyInfo && modifyInfo.levelDiscount : null
            })(
              <Input placeholder={'请输入认购优惠'} addonAfter={'%'} style={{width: '100%' }}/>
            )}
          </FormItem>
          <FormItem {...formConfig} label={'上传图片'}>
            {getFieldDecorator('levelUrl', {
              rules: [{
                required: true,
                message: '请上传代理商图片',
              }],
              initialValue: (modifyInfo&& modifyInfo.levelUrl)
            })(
              <Upload
                defaultUrl={(modifyInfo&& modifyInfo.levelUrl)}
                uploadConfig={{
                  action: `${_baseApi}/userLevel/upload`,
                  fileType: ['image'],
                  size: 3
                }}
                setIconUrl={(url) => this.props.form.setFieldsValue({ levelUrl: url })}
              >
                {
                  this.state.fileList.length && this.state.fileList[0].response && this.state.fileList[0].response.status == '99' ?
                    <span style={{ color: 'red', marginLeft: '5px' }}>{this.state.fileList[0].response.statusDesc}</span>
                    : null
                }
              </Upload>
            )}
          </FormItem>
       </Form>
      </Modal>
    );
  }
}
