import React, { PureComponent, Fragment } from 'react';
import { Modal, Form, Input, InputNumber, message, Select } from 'antd';
import { connect } from 'dva';
import { debounce } from '@/utils/utils'
import Upload from '@/components/Upload'
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ developersManage, loading }) => ({
  developersManage,
  submitLoading: loading.effects['developersManage/modifyManage']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      fileList: [],
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'developersManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, developersManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        let res
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'developersManage/modifyManage',
            payload: {
              ...values,
              id: this.props.developersManage.modifyInfoData.id,
            }
          })
        } else {
          res = await dispatch({
            type: 'developersManage/addManage',
            payload: values
          })
        }
        if (res && res.status === 1) {
          this.changeVisible(false)
          message.success(res.statusDesc)
          this.props.getList(this.props.currPage, this.props.pageSize)
        } else message.error(res.statusDesc)
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
    this.checkDeveloperName= debounce(this.checkDeveloperName,800)
  }
  checkDeveloperName = async(rules, value, callback)=>{
    const { dispatch } = this.props;
    if(!value) {
      callback('请输入开发商')
    }
    let res = await dispatch({
      type: 'developersManage/checkDeveloperName',
      payload: {
        developer: value,
        id: this.props.developersManage.modifyInfoData.id
      }
    })
    if(res && res.status == 1) {
      callback()
    }else callback(res.statusDesc)
    callback()
  }
  render() {
    const { form: { getFieldDecorator }, developersManage: { modifyInfoData } } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={modifyInfoData.id ? '修改开发商' : '添加开发商'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem
            label="开发商"
            {...formConfig}
          >
            {getFieldDecorator('developer', {
              rules: [{ required: true, 
              validator: this.checkDeveloperName}],
              initialValue: modifyInfoData && modifyInfoData.developer
            })(
              <Input placeholder={'请输入开发商'} maxLength={20}/>
            )}
          </FormItem>
          <FormItem
            label="对公账户"
            {...formConfig}
          >
            {getFieldDecorator('account', {
              rules: [{ required: true, message: '请输入对公账户' }],
              initialValue: modifyInfoData && modifyInfoData.account
            })(
              <Input placeholder={'请输入对公账户'} onChange={(e)=>{
                const value = e.target.value;
                setTimeout(()=>{
                  this.props.form.setFieldsValue({ account: value.replace(/\D/g,'')})
                },30)
              }} maxLength={30}/>
            )}
          </FormItem>
          <FormItem {...formConfig} label={'相关合同'}>
            {getFieldDecorator('agreementUrl', {
              rules: [{
                required: true,
                message: '请上传相关合同',
              }],
              initialValue: modifyInfoData && eval(modifyInfoData.agreementUrl)
            })(
              <Upload
                uploadConfig={{
                  action: `${_baseApi}/developers/upload`,
                  fileType: ['image','PDF'],
                  size: 10
                }}
                defaultUrl={modifyInfoData && modifyInfoData.agreementUrl ? eval(modifyInfoData.agreementUrl) : []}
                multiplePicture={true}
                setIconUrl={(url, type) => {
                  const agreementUrl = this.props.form.getFieldValue('agreementUrl')
                  if (type !== 'remove') {
                    // 照片添加的逻辑
                    if (!agreementUrl || !agreementUrl[0]) {
                      this.props.form.setFieldsValue({ agreementUrl: [url] })
                    } else {
                      this.props.form.setFieldsValue({ agreementUrl: agreementUrl.concat([url]) })
                    }
                  } else {
                    // 照片删除的逻辑
                    const resArr = []
                    console.log(agreementUrl,"agreementUrl")
                    agreementUrl.forEach(item => {
                      if (item !== url) resArr.push(item)
                    })
                    this.props.form.setFieldsValue({ agreementUrl: resArr })
                  }
                }}
                >
                  {
                    this.state.fileList.length && this.state.fileList[0].response && this.state.fileList[0].response.status == '99' ?
                      <span style={{ color: 'red', marginLeft: '5px' }}>{this.state.fileList[0].response.statusDesc}</span>
                      : null
                  }
              </Upload>
            )}
          </FormItem>
          <FormItem
            label="状态"
            {...formConfig}
          >
            {getFieldDecorator('openStatus', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: modifyInfoData && modifyInfoData.openStatus
            })(
              <Select allowClear>
                <Option key={0} value={0}>启用</Option>
                <Option key={1} value={1}>禁用</Option>
              </Select>
            )}
          </FormItem>
          
        </Form>
      </Modal>
    );
  }
}
