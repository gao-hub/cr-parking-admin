import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Radio } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ parkingOrderManage, loading }) => ({
  parkingOrderManage,
  submitLoading: loading.effects['parkingOrderManage/modifyManage']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      download: null,
      title: '',
      currentList:null,
      requestFlag:true
    };
  }
  cahngeTitle = (type,record = null) => {
    const { from } = this.props
    let title = ''
    switch (type) {
      case 0:
        title = '开具发票';
        break;
      case 1:
        title = '冲红发票';
        break;
      case 2:
        title = '下载发票';
        break
      default:
        break;
    }
    this.setState({
      type,
      title,
      currentList:record,
      download:null
    })
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'parkingOrderManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  onChange = e => {
    let download = e.target.value
    this.setState({
      download
    })
  }
  requestType(values,currentList,type){
        const { dispatch } = this.props;
        let parkingOrderNo = currentList?.parkingOrderNo
        let id = currentList?.invoiceId
        this.setState({requestFlag:false})
        // 开居发票
            // 未开发票 冲红成功调用新增接口
            if((currentList.invoiceId === null || 
              (currentList.invoiceStatus === 1 &&
               currentList.invoiceType === 2)) && type === 0 ){
                    return dispatch({
                      type: 'parkingOrderManage/invoiceAdd',
                      payload: 
                      {
                        ...values,
                        parkingOrderNo,
                        invoiceType:1,
                      }
                    })
            }else if(type === 0){
                  // 已开发票 开票失败调用更新
                 return dispatch({
                    type: 'parkingOrderManage/invoiceUpdate',
                    payload: 
                    {
                      ...values,
                      id,
                      parkingOrderNo,
                      invoiceType:1,
                    }
                })
            }
          //冲红  
            if(
              type === 1 && 
              // 冲红 => 开票成功
              (currentList.invoiceStatus === 1 && 
              currentList.invoiceType === 1 && 
              currentList.invoiceId)){
               return dispatch({
                  type: 'parkingOrderManage/invoiceAdd',
                  payload: 
                  {
                    ...values,
                    parkingOrderNo:currentList?.parkingOrderNo,
                    invoiceType:2
                  }
                })
    
            }else if(type === 1){
              return  dispatch({
                type: 'parkingOrderManage/invoiceUpdate',
                payload: 
                {
                  ...values,
                  id,
                  parkingOrderNo,
                  invoiceType:2,
                }
              })
            }
          // 下载
          if(type === 2){
           return dispatch({
              type: 'parkingOrderManage/invoiceDownload',
              payload: 
              {
                ...values,
                id,
                parkingOrderNo
              }
            })
          }
  }
  handleOk = async () => {
    const { dispatch, form, parkingOrderManage: { modifyInfoData } } = this.props;
    const { currentList,type,requestFlag } = this.state
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res 
        let _this = this
        if(requestFlag){        
            res = await _this.requestType(values,currentList,type)         
        }            
        if(res){ 
          if (res.status === 1) {
            this.changeVisible(false)
            message.success(res.statusDesc)
            this.props.getList(this.props.currPage, this.props.pageSize)
          } else { message.error(res.statusDesc) }
          setTimeout(async () => {
            _this.setState({requestFlag:true})      
          }, 200);
        }
         
      }
    });
  };
  
  componentDidMount() {
    this.props.getChildData(this);
   
  }
  render() {
    const { form: { getFieldDecorator }, parkingOrderManage: { modifyInfoData } } = this.props;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };
    const { download, title, type, currentList } = this.state
    let downloads = download === null ? modifyInfoData.downloadType : download
    return (
      <Modal
        title={title}
        width={650}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          {
            type != 2 ? (
              <>
                <FormItem
                  label="复核人"
                  {...formConfig}
                >
                  {getFieldDecorator('reviewerName', {
                    rules: [

                    ],
                    initialValue: modifyInfoData && modifyInfoData.reviewerName
                  })(
                    <Input placeholder={'请输入复核人'} maxLength={10} disabled={currentList?.invoiceStatus === 0}/>
                  )}
                </FormItem>
                <FormItem
                  label="收款人"
                  {...formConfig}
                >
                  {getFieldDecorator('payeeName', {
                    rules: [],
                    initialValue: modifyInfoData && modifyInfoData.payeeName
                  })(
                    <Input placeholder={'请输入收款人'} maxLength={10}  disabled={currentList?.invoiceStatus === 0}/>
                  )}
                </FormItem>
                <FormItem
                  label="开票员"
                  {...formConfig}
                >
                  {getFieldDecorator('invoicingName', {
                    rules: [{ required: true, message: '请输入开票员' }],
                    initialValue: modifyInfoData && modifyInfoData.invoicingName
                  })(
                    <Input placeholder={'请输入开票员'} maxLength={10} disabled={currentList?.invoiceStatus === 0} />
                  )}
                </FormItem>
              </>

            ) : null
          }

          <FormItem
            label="下载方式"
            {...formConfig}
          >
            {getFieldDecorator('downloadType', {
              rules: [{ required: true, message: '请选择下载方式' }],
              initialValue: modifyInfoData && modifyInfoData.downloadType
            })(
              <Radio.Group onChange={this.onChange}  disabled={currentList?.invoiceStatus === 0 &&  type != 2}>
                {
                  type != 2 ? ( <Radio value={0}>不下载</Radio>):null
                }
               
                <Radio value={1}>发送到手机</Radio>
                <Radio value={2}>发送到邮箱</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {
              downloads === 1 ? (
              <FormItem
                label="手机号"
                {...formConfig}
              >
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      validator: (rule, val, cb) => {
                        if (val == null || val == '') cb('请输入手机号')
                        else if (!(val).toString().match(/^1[3456789]\d{9}$/)) cb('请输入正确的手机号')
                        else cb()
                      }
                    }
                  ],
                  initialValue: modifyInfoData && modifyInfoData.mobile
                })(
                  <Input placeholder={'请输入手机号'} maxLength={11} disabled={currentList?.invoiceStatus === 0 &&  type != 2} />
                )}
              </FormItem>
            ) : downloads === 2   ? (
              <FormItem
                label="邮箱"
                {...formConfig}
              >
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      validator: (rule, val, cb) => {
                        if (val == null || val == '') cb('请输入邮箱')
                        else if (!(val).toString().match(/^([a-zA-Z0-9_\.\-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) cb('请输入正确的邮箱')
                        else cb()
                      }
                    }
                  ],
                  initialValue: modifyInfoData && modifyInfoData.email
                })(
                  <Input placeholder={'请输入邮箱'} maxLength={50} disabled={currentList?.invoiceStatus === 0 &&  type != 2} />
                )}
              </FormItem>
            ) : null
          }
          {
            type != 2 ? (
              <>
                <FormItem
                  label="发票明细（车位）"
                  {...formConfig}
                >
             
                    <Input disabled defaultValue='车位' />
                
                </FormItem>
                <FormItem
                  label="发票明细（服务费）"
                  {...formConfig}
                >
                    <Input disabled defaultValue='服务费' />

                </FormItem>
                <FormItem
                  label="备注"
                  {...formConfig}
                >
                  {getFieldDecorator('remark', {
                    rules: [{ required: false, message: '请输入备注' }],
                    initialValue: modifyInfoData && modifyInfoData.remark
                  })(
                    <Input.TextArea placeholder={'最多可输入80字，超出不可输入'} maxLength={80} disabled={currentList?.invoiceStatus === 0} />
                  )}
                </FormItem>
              </>
            ) : null
          }

        </Form>
      </Modal>
    );
  }
}
