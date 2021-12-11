import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Select, DatePicker, Radio } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import BraftEditor from '@/components/BraftEditor';
import Upload from '@/components/Upload';
import permission from '@/utils/PermissionWrapper';
import { _baseApi } from '@/defaultSettings.js';

const FormItem = Form.Item;

@Form.create()
@permission
@connect(({ newsManage, loading }) => ({
  newsManage,
  submitLoading: loading.effects['newsManage/modifyManage'],
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      editorInstance: null,
      fileList: []
    };
  }
  handleChange = value => {
    const {
      form,
    } = this.props;
    form.setFieldsValue({
      newsContent: value === "<p></p>" ? "" : value
    })

  };
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'newsManage/setModifyInfo',
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
      newsManage: { modifyInfoData },
      permission
    } = this.props;
    if(!permission.includes("chuangrong:news:update") && modifyInfoData.id){
      message.warn("您没有修改权限")
      return;
    }else if(!permission.includes("chuangrong:news:add") && !modifyInfoData.id){
      message.warn("您没有新增权限")
      return;
    }
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'newsManage/modifyManage',
            payload: {
              ...values,
              id: this.props.newsManage.modifyInfoData.id,
              newsDate: moment(values.newsDate).format("YYYY-MM-DD")
            },
          });
        } else {
          res = await dispatch({
            type: 'newsManage/addManage',
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
  }
  render() {
    const {
      form: { getFieldDecorator },
      newsManage: { modifyInfoData, initData },
    } = this.props;
    const { newsType, newsStatus } = initData;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        width="80%"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          {/*
          <FormItem label="" {...formConfig}>
            {getFieldDecorator('id', {
              rules: [{ required: true, message: '请输入' }],
              initialValue: modifyInfoData && modifyInfoData.id,
            })(<Input placeholder={'请输入'} />)}
          </FormItem>
          <FormItem label="创建人ID" {...formConfig}>
            {getFieldDecorator('createBy', {
              rules: [{ required: true, message: '请输入创建人ID' }],
              initialValue: modifyInfoData && modifyInfoData.createBy,
            })(<Input placeholder={'请输入创建人ID'} />)}
          </FormItem>
          <FormItem label="创建时间" {...formConfig}>
            {getFieldDecorator('createTime', {
              rules: [{ required: true, message: '请输入创建时间' }],
              initialValue: modifyInfoData && modifyInfoData.createTime,
            })(<Input placeholder={'请输入创建时间'} />)}
          </FormItem>
          <FormItem label="更新人ID" {...formConfig}>
            {getFieldDecorator('updateBy', {
              rules: [{ required: true, message: '请输入更新人ID' }],
              initialValue: modifyInfoData && modifyInfoData.updateBy,
            })(<Input placeholder={'请输入更新人ID'} />)}
          </FormItem>
          <FormItem label="更新时间" {...formConfig}>
            {getFieldDecorator('updateTime', {
              rules: [{ required: true, message: '请输入更新时间' }],
              initialValue: modifyInfoData && modifyInfoData.updateTime,
            })(<Input placeholder={'请输入更新时间'} />)}
          </FormItem>
        */}

          <FormItem label="文章类别" {...formConfig}>
            {getFieldDecorator('newsType', {
              rules: [{ required: true, message: '请选择文章类别' }],
              initialValue: modifyInfoData && modifyInfoData.newsType,
            })(
              <Select placeholder="请选择">
                {newsType &&
                  newsType.map(item => (
                    <Select.Option key={item.key} value={item.value}>
                      {item.title}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="文章标题" {...formConfig}>
            {getFieldDecorator('newsTitle', {
              rules: [{ required: true, message: '请输入文章标题' }],
              initialValue: modifyInfoData && modifyInfoData.newsTitle,
            })(<Input placeholder={'请输入'} maxLength={100} />)}
          </FormItem>
          <FormItem label="时间" {...formConfig}>
            {getFieldDecorator('newsDate', {
              rules: [{ required: true, message: '请选择时间' }],
              initialValue: modifyInfoData && modifyInfoData.newsDate ? moment(modifyInfoData.newsDate) : null,
            })(<DatePicker placeholder="请选择" onChange={(date,dateString)=>{
              const { form } = this.props;
              form.setFieldsValue({newsDate: dateString})
            }} />)}
          </FormItem>
          <FormItem label="封面图" extra="请上传330px x 222px像素尺寸的图片，大小不超过3M" {...formConfig}>
            {getFieldDecorator('newsPic', {
              rules: [{ required: true, message: '请上传封面图' }],
              initialValue: modifyInfoData && modifyInfoData.newsPic,
            })(
              <Upload
                defaultUrl={modifyInfoData && modifyInfoData.newsPic}
                uploadConfig={{
                  action: `${_baseApi}/news/upload`,
                  fileType: ['image'],
                  size: 3,
                  imgSize:{
                    width:330,
                    height: 222
                  }
                }}
                multiplePicture={false}
                setIconUrl={url =>{
                  const list = [];
                  list[0] = url;
                  this.setState({
                    fileList: list
                  })
                  this.props.form.setFieldsValue({ newsPic: url })
                }}
              />
            )}
          </FormItem>
          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('newsStatus', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: modifyInfoData && modifyInfoData.newsStatus,
            })(
              <Radio.Group>
                {newsStatus &&
                  newsStatus.map(item => (
                    <Radio key={item.key} value={item.value}>
                      {item.title}
                    </Radio>
                  ))}
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="文章内容" {...formConfig}>
            {getFieldDecorator('newsContent', {
              rules: [{ required: true, message: '请输入文章内容' }],
              initialValue: modifyInfoData && modifyInfoData.newsContent,
            })(
              <BraftEditor
                handleChange={this.handleChange}
                uploadImgUrl={`${_baseApi}/news/upload`}
                content={modifyInfoData.newsContent}
                placeholder="请输入文章内容"
                image={true}
                video={true}
                minHeight="500px"
              />
            )}
          </FormItem>
          {/*
            <FormItem label="备注" {...formConfig}>
              {getFieldDecorator('remark', {
                rules: [{ required: true, message: '请输入备注' }],
                initialValue: modifyInfoData && modifyInfoData.remark,
              })(<Input.TextArea size="large" />)}
            </FormItem>
          */}
        </Form>
      </Modal>
    );
  }
}
