import React, { PureComponent, Fragment } from 'react';
import { Modal, Form, Input, message, Radio, Divider, Select } from 'antd';
import { connect } from 'dva';
import Swal from 'sweetalert2'
import StandardTable from '@/components/StandardTable';
import Upload from '@/components/Upload'
import { _baseApi } from '@/defaultSettings'
import { number } from 'prop-types';

const FormItem = Form.Item;
const { TextArea } = Input;
const  RadioGroup = Radio.Group;
const { Option } = Select;



@Form.create()
@connect(({ protocolTemplateManage, loading }) => ({
  protocolTemplateManage,
  submitLoading: loading.effects['protocolTemplateManage/updateAction']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      syncColumns: [],
      radioVal: this.props.protocolTemplateManage.formData ? this.findRadioVal(this.props.protocolTemplateManage.formData.protocolVersion) : 0,
      status: 'add',
      fileList: [],
      defcolumns: [ {
        title: '是否启用',
        dataIndex: 'id',
        render: record => {
          return <Radio disabled={this.state.status === 'view'} key={record} value={record}></Radio>
        }
      }, {
        title: '版本',
        dataIndex: 'versionNumber',
      }, {
        title: '文件名称',
        dataIndex: 'protocolName',
      }, {
        title: '更新时间',
        dataIndex: 'updateTime',
      }, {
        title: '备注',
        dataIndex: 'remarks',
      },{
        title: '更新人',
        dataIndex:'updateBy'
      }
      ]
    };
  }
  changeVisible = (visible, status) => {
    if (!visible) {
      this.props.dispatch({
        type: 'protocolTemplateManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
      status
    });
  };
  findRadioVal = (arr) => {
    let id
    if (arr && arr.length) {
      arr.map(item => {
        if (item.displayFlag - 0 === 1) id = item.id
      })
    }
    return id
  }
  // 检查验证参数的返回值，如果有错误则进行提示并返回false，没错误则返回true
  checkValidate = (validateObj, type = 1) => {
    if (!type) {
      delete validateObj['e_error']
      delete validateObj['n_error']
      delete validateObj['v_error']
    }
    const validateArr = Object.values(validateObj)
    let tip = ''
    validateArr.forEach(item => {
      if (item) tip = item
    })
    if (tip) {
      message.error(tip)
      return false
    } else return true
  }
  handleSubmit = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields(async (err, values) => {
        console.log(values,"values")
        if (err) reject(err)
        if (!err) {
          // values.protocolUrl = this.state.fileList[0].fileUrl
          const confirmRes = await Swal.fire({
            text: '确定要进行该操作么？',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          if (confirmRes.value) {
            // 提前将验证参数准备好
            let validate
            let validatePayload = {
              ...values,
              oldDisplayName: this.props.protocolTemplateManage.formData.protocolTemplateVO && this.props.protocolTemplateManage.formData.protocolTemplateVO.displayName ? this.props.protocolTemplateManage.formData.protocolTemplateVO.displayName : ''
            }
            let res
            // 通过id判断是添加或修改
            if (this.props.protocolTemplateManage.formData.protocolTemplateVO && this.props.protocolTemplateManage.formData.protocolTemplateVO.id) {
              // 修改校验
              validatePayload.flag = '1'
              validate = await this.props.dispatch({
                type: 'protocolTemplateManage/validationProtocolNameAction',
                payload: validatePayload
              })
              if (!this.checkValidate(validate, 0)) {
                resolve(false)
                return
              }
              // 提交表格中信息
              res = await this.props.dispatch({
                type: 'protocolTemplateManage/updateAction',
                payload: {
                  ...values,
                  id: this.props.protocolTemplateManage.formData.protocolTemplateVO.id
                }
              })
            } else {
              // 添加校验
              validatePayload.flag = '0'
              validate = await this.props.dispatch({
                type: 'protocolTemplateManage/validationProtocolNameAction',
                payload: validatePayload
              })
              if (!this.checkValidate(validate)) {
                resolve(false)
                return
              }
              // 提交表格中的信息
              res = await this.props.dispatch({
                type: 'protocolTemplateManage/insertAction',
                payload: {
                  ...values
                }
              })
            }
            resolve(res)
          }
        }
      })
    });
  }
  handleOk = async () => {
    // 点击模态框确定按钮执行的方法
    if (this.state.status === 'view') {
      this.setState({ visible: false })
      return
    }
    try {
      const res = await this.handleSubmit()
      if (res) {
        message.success('操作成功')
        this.props.getList()
        this.setState({ visible: false })
      } else message.error('操作失败')
    } catch (err) {
      console.log(err)
    }
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const { form: { getFieldDecorator }, protocolTemplateManage: { modifyInfoData, formData, selectData } } = this.props;
    const { currPage, pageSize, data, selectedRows } = this.state;
    const formConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const values = {
      columns: this.state.defcolumns,
      data: {
        list: formData.protocolVersion,
      },
      loading: this.props.loading,
      pagination: false
      // pagination: {
      //   showTotal: (total) => ('共 ' + total + ' 条'),
      //   defaultCurrent: currPage,
      //   defaultPageSize: pageSize,
      //   total: formData.length,
      //   showQuickJumper: true,
      //   showSizeChanger: true,
      //   pageSizeOptions: ['10', '20', '30', '40'],
      //   onChange: this.onChange,
      //   onShowSizeChange: this.onShowSizeChange
      // },
    }
    return (
      <Modal
        className={'ant-modal-lg'}
        title={({'edit':'修改','view': '查看', 'add': "添加"})[this.state.status] || "添加"}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
        { this.state.status !== 'add' ? (
          <FormItem
            label="协议ID"
            {...formConfig}
          >
            {getFieldDecorator('protocolId', {
              rules: [{ required: true, message: '请填写信息！',whitespace: true }],
              initialValue: formData.protocolTemplateVO ? formData.protocolTemplateVO.protocolId.toString() : ''
            })(
              <Input disabled={this.state.status === 'view' || this.state.status === 'edit'}></Input>
            )}
          </FormItem>
        ) : null }
          <FormItem
            label="协议模板名称"
            {...formConfig}
          >
            {getFieldDecorator('protocolName', {
              rules: [{ required: true, message: '请输入协议模板名称', whitespace: true }],
              initialValue: formData.protocolTemplateVO ? formData.protocolTemplateVO.protocolName : ''
            })(
              <Input placeholder={'请输入协议模板名称'}  disabled={this.state.status === 'view' || this.state.status === 'edit'}/>
            )}
          </FormItem>
          <FormItem
            label="前台展示名称"
            {...formConfig}
          >
            {getFieldDecorator('displayName', {
              rules: [{ required: true, message: '请输入前台展示名称', whitespace: true }],
              initialValue: formData.protocolTemplateVO ? formData.protocolTemplateVO.displayName : ''
            })(
              <Input placeholder={'请输入前台展示名称'} disabled={this.state.status === 'view'}/>
            )}
          </FormItem>
          <FormItem
          label="协议类别"
          {...formConfig}
        >
          {getFieldDecorator('protocolCode', {
            rules: [{ required: true, message: '请填写信息！' }],
            initialValue: formData.protocolTemplateVO ? formData.protocolTemplateVO.protocolCode : ''
          })(
            <Select allowClear getPopupContainer={trigger => trigger.parentNode} disabled={this.state.status === 'view' || this.props.status === 'edit'}>
              { selectData && selectData.length ? selectData.map((item, idx) => (
                <Option value={item.value} key={item.key}>{item.title}</Option>
              )) : null }
            </Select>
          )}
        </FormItem>
          <FormItem
            label="协议版本号"
            {...formConfig}
          >
            {getFieldDecorator('versionNumber', {
              rules: [{ required: true, validator: (rule, val, cb) => {
                if (!val) {
                  cb('请填写信息！')
                  return
                } else if (formData.protocolTemplateVO && formData.protocolTemplateVO.versionNumber && val === formData.protocolTemplateVO.versionNumber) {
                  cb('请修改信息后保存！')
                  return
                } else cb()
              }  }],
              initialValue: formData.protocolTemplateVO ? formData.protocolTemplateVO.versionNumber : ''
            })(
              <Input placeholder={'请输入协议版本号'} disabled={this.state.status === 'view'}/>
            )}
          </FormItem>
          <FormItem {...formConfig} label={'协议上传'}>
            {getFieldDecorator('protocolUrl', {
              rules: [{
                required: true,
                message: '请上传协议',
              }],
              initialValue: formData.protocolTemplateVO && formData.protocolTemplateVO.protocolUrl
            })(
              <Upload
                defaultUrl={formData.protocolTemplateVO && formData.protocolTemplateVO.protocolUrl}
                uploadConfig={{
                  action: `${_baseApi}/protocolTemplate/upload`,
                  fileType: ['PDF'],
                  size: 3
                }}
                setIconUrl={(url) => this.props.form.setFieldsValue({ protocolUrl: url })}
              >
                {
                  this.state.fileList.length && this.state.fileList[0].response && this.state.fileList[0].response.status == '99' ?
                    <span style={{ color: 'red', marginLeft: '5px' }}>{this.state.fileList[0].response.statusDesc}</span>
                    : null
                }
              </Upload>
            )}
          </FormItem>
          {/* <FormItem
            label="帮助中心显示"
            {...formConfig}
          >
            {getFieldDecorator('isShow', {
              rules: [{ required: true, message: '请选择是否在帮助中心显示' }],
              initialValue: formData.protocolTemplateVO && formData.protocolTemplateVO.isShow ? formData.protocolTemplateVO.isShow : 0
            })(
              <Radio.Group disabled={this.state.status === 'view'}>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </Radio.Group>
            )}
          </FormItem> */}

          <FormItem
            label="显示排序"
            {...formConfig}
          >
            {getFieldDecorator('sort', {
              initialValue: formData.protocolTemplateVO ? formData.protocolTemplateVO.sort : ''
            })(
              <Input  type={number}/>
            )}
          </FormItem>



          <FormItem
            label="备注"
            {...formConfig}
          >
            {getFieldDecorator('remarks', {
              rules: [{ required: true, message: '请输入备注' }],
              initialValue: formData.protocolTemplateVO ? formData.protocolTemplateVO.remarks : ''
            })(
              <TextArea placeholder={'请输入备注'} disabled={this.state.status === 'view'} autoSize={{ minRows: 6 }}/>
            )}
          </FormItem>
          {
            this.state.status == 'add' ? null : (<Fragment>
              { this.state.status === 'view' ? (
                <Fragment>
                  <FormItem
                    label="更新时间"
                    {...formConfig}
                  >
                    <span>{formData.protocolTemplateVO ? formData.protocolTemplateVO.updateTime : ''}</span>
                  </FormItem>
                  <FormItem
                    label="更新人"
                    {...formConfig}
                  >
                      <span>{formData.protocolTemplateVO ? formData.protocolTemplateVO.updateUserName : ''}</span>
                  </FormItem>
                </Fragment>
              ) : null }
              <Divider orientation="left">协议更新历史</Divider>
              <RadioGroup style={{ width: '100%' }} value={this.state.radioVal} onChange={async (e) => {
                // 调用保存协议的方法
                const res = await this.props.dispatch({
                  type: 'protocolTemplateManage/updateExistProtocol',
                  payload: {
                    id: e.target.value
                  }
                });
                if (res) {
                  message.success('操作成功')
                  this.setState({ radioVal: e.target.value })
                  // 重新重置表格数据
                  if (this.props.protocolTemplateManage.formData.protocolTemplateVO && this.props.protocolTemplateManage.formData.protocolTemplateVO.id) {
                    await this.props.dispatch({
                      type: 'protocolTemplateManage/infoInfoAction',
                      payload: {
                        ids: this.props.protocolTemplateManage.formData.protocolTemplateVO.id
                      }
                    })
                    this.props.form.resetFields()
                  }
                } else message.error('操作失败')
              }}>
                <StandardTable
                  {...values}
                />
              </RadioGroup>
            </Fragment>)
          }
        </Form>
      </Modal>
    );
  }
}
