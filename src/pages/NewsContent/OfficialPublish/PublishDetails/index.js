import React, { PureComponent } from 'react';
import { Form, PageHeader, Button, Divider, Input, Radio, message, Checkbox, Select, Spin } from 'antd';
import router from 'umi/router';
import _ from 'lodash';
import permission from '@/utils/PermissionWrapper';
import { getPublishInfo, examineApi, getContactType, getUserApi, add } from './services';
import style from './index.less';
import CropUpload from '../../components/CropUpload';
import OfficialContentDetail from '../../components/OfficialContentDetail';
import { _baseApi } from '@/defaultSettings';
import { queryURL } from '@/utils/utils';
const FormItem = Form.Item;
const { Option } = Select;

// 封面尺寸
const sizeList = [
  {
    key: 1,
    value: '1:1',
    label: '1:1'
  },
  {
    key: 2,
    value: '4:3',
    label: '4:3'
  },
  {
    key: 3,
    value: '3:4',
    label: '3:4'
  },
  {
    key: 4,
    value: '2:3',
    label: '2:3'
  }
]
//封面尺寸对应的比例,后端存的字符串我们前端用到的是数值
const sizeHomeObj = {
  '1:1': 1/1,
  '4:3': 4/3,
  '3:4': 3/4,
  '2:3': 2/3
}
// 健康养生的尺寸
const coverList = [
  {
    key: 0,
    value: 1/1,
    label: '无图'
  },
  {
    key: 1,
    value: 23/13,
    label: '单图-大图'
  },
  {
    key: 2,
    value: 4/3,
    label: '单图-小图'
  },
  {
    key: 3,
    value: 8/5,
    label: '三图'
  }
]

// 健康养生对应的比例
const sizeObj = {
  0: 1/1,
  1: 23/13,
  2: 4/3,
  3:  8/5
}
// 关联类别的选择
const typeChoose = {
  1: 'homeTab',
  2: 'travelTab'
}

@permission
@Form.create()
export default class template extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      urlInfo: {}, // url的信息
      userList: [], // 账号管理人
      publishDetails: {}, // 详情信息
      specialColumnObj: [], //专栏数据
      typeList: [], // 关联类别
      aspect: '1:1', // 裁剪比例
      coverAspect: 0, // 健康养生的图
      sendModel: '',
      loading: false
    };
  }
  componentDidMount() {
    //为了父级返回用
    sessionStorage.setItem('publishKey', queryURL(location.search).tabIndex);

    // type: 1文章2图片3视频;
    // preview: info 预览 edit 是审核
    const { match: { params: { id, type, preview }} } = this.props;
    this.setState({
      urlInfo: { id, type, preview }
    })
    //获取账号管理人
    this.getUser();
    //获取获取专栏和发布详情
    this.getInfo(id);
  }
  //获取账号管理人
  getUser = async () =>{
    const res = await getUserApi();
    if (res && res.status === 1) {
      this.setState({
        userList: res.data
      })
    }
  }
  //获取获取专栏和发布详情
  getInfo = async id =>{
    this.setState({ loading: true });
    const data = await getContactType({ userType: 0 });
    if (data && data.status === 1) {
      this.setState({
        specialColumnObj: data.data
      });
      if(id !== '0') {
        // 获取详情
        const res = await getPublishInfo({id});
        if (res && res.status === 1) {
          let list = res.data.articleContent || [];
          res.data.articleContent = list.map((item, index)=>{
            item.id = index + 1 + '';
            return item;
          })
          let arr = typeChoose[res.data.articleColumn] ? data.data[typeChoose[res.data.articleColumn]] : []; // 设置关联类别的默认值
          this.setState({
            publishDetails: res.data,
            specialColumnObj: data.data,
            typeList: arr,
            sendModel: res.data.articleColumn, // 发送模块
            coverAspect: res.data.bannerType, // 健康养生图
            aspect: res.data.coverSize, // 图片尺寸
          });
        } else {
          message.error(res.statusDesc)
        }
      }
    } else {
      message.error(res.statusDesc);
    }
    this.setState({ loading: false });
  }
  // 列表改变的时候数据设置
  contentChange = list =>{
    let obj = _.cloneDeep(this.state.publishDetails);
    obj.articleContent = list;
    this.props.form.setFieldsValue({
      articleContent: list
    })
    this.setState({
      publishDetails: obj
    })
  }

  // 专栏改变事件
  radioChange = e =>{
    const { specialColumnObj } = this.state;
    let arr = typeChoose[e.target.value] ? specialColumnObj[typeChoose[e.target.value]] : [];
    // 切换专栏清空类别
    this.props.form.setFieldsValue({ categoryId: [] })
    this.setState({
      typeList: arr,
      sendModel: e.target.value
    });
  }
  // 提交表单
  submit = flag => {
    if(flag === 1 && this.state.urlInfo.preview === 'edit'){
      const { form } = this.props;
      const { match: { params: { id }} } = this.props;
      const { publishDetails, sendModel, aspect } = this.state;
      form.validateFieldsAndScroll(async(err, values) => {
        if (!err) {
          let json = JSON.parse(JSON.stringify(values));
          json.coverSize = aspect; // 封面图片比例
          json.articleColumn = sendModel; // 发送模块
          json.userType = 0; // 0官方发布1用户发布
          if(json.bannerType === 3 && json.articleBanner.length < 3) {
            message.warning('健康养生的封面图不能小于三张')
            return;
          }
          if(!(publishDetails.articleContent && publishDetails.articleContent.length > 0)){
            message.warning('文章内容不能为空')
            return;
          } else {
            let str = publishDetails.articleContent.some(item=> item.type === 3 && !item.content);
            if(str){
              message.warning('富文本内容不能为空')
              return;
            }
          }
          if(json.auditStatus === 1){
            message.warning('请选择审核状态')
            return;
          }
          this.setState({ loading: true })
          let res;
          if(id === '0'){
            res = await add({ ...publishDetails, ...json })
          } else {
            delete publishDetails.categoryName;
            res = await examineApi({ ...publishDetails, ...json })
          }
          if (res && res.status === 1) {
            message.success(res.statusDesc)
            router.push('/newsContent/officialPublish/publishList');
          } else message.error(res.statusDesc)
          this.setState({
            loading: false
          })
        }
      });
    } else {
      router.push('/newsContent/officialPublish/publishList');
    }
  }
  // 尺寸的修改
  aspectChange = value => {
    if(this.state.urlInfo.preview === 'edit'){
      this.setState({
        aspect: value
      })
    }
  }

  //健康养生的radio
  coverSizeChange = e =>{
    // 清空图片
    this.props.form.setFieldsValue({
      articleBanner: []
    })
    let obj = _.cloneDeep(this.state.publishDetails);
    obj.articleBanner = [];
    // 清空上传组件
    this.myUploadChild && this.myUploadChild.setState({
      fileList: []
    })
    this.setState({
      publishDetails: obj,
      coverAspect: e.target.value
    })
  }

  render() {
    // id： 为 0 是新增 不为 0 是查看或者审核；  preview：info 是查看 edit 可以编辑
    const { loading, urlInfo: { id, preview }, publishDetails, specialColumnObj: { articleColumn }, typeList, userList, aspect, sendModel, coverAspect } = this.state;
    const { form: { getFieldDecorator }, } = this.props;
    const formConfig = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Spin spinning={loading}>
        <div className={style.content}>
          <PageHeader
            title={id === '0' ? '新建文章' : preview === 'info' ? '预览文章' : '审核文章'}
          >
            <Divider style={{ marginTop: 0 }} />
            {
              (id === '0' || Object.keys(publishDetails).length > 0) &&
              <Form >
                <FormItem
                  label="文章标题"
                  {...formConfig}
                >
                  {getFieldDecorator('articleTitle', {
                    rules: [{ required: true, message: '请输入文章标题' }],
                    initialValue: publishDetails && publishDetails.articleTitle
                  })(
                    <Input
                      style={{ width: 200 }}
                      disabled={preview === 'info'}
                      maxLength={30}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
                <FormItem
                  label="发布人"
                  {...formConfig}
                >
                  {getFieldDecorator('userId', {
                    rules: [{ required: true, message: '请选择发布人' }],
                    initialValue: publishDetails && publishDetails.userId
                  })(
                    <Select
                      style={{ width: 200 }}
                      disabled={preview === 'info'}
                      placeholder="请选择"
                    >
                      { userList && userList.length ? userList.map((item) => (
                        <Option value={item.id} key={item.id}>{item.nickName}</Option>
                      )) : null }
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label="状态"
                  {...formConfig}
                >
                  {getFieldDecorator('articleStatus', {
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue: publishDetails && publishDetails.articleStatus
                  })(
                    <Radio.Group disabled={preview === 'info'}>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem
                  label="基础获赞数"
                  {...formConfig}
                >
                  {getFieldDecorator('fakeLike',{
                    rules: [
                      {
                        required: true,
                        validator: (rules, value, callback) => {
                          if (!value) {
                            callback('请输入基础获赞数')
                          }
                          if (isNaN(value - 0) || !((value - 0).toString()).match(/(^[1-9]\d*$)/)) callback('请输入正整数')
                          callback()
                        }
                      }
                    ],
                    initialValue: publishDetails && publishDetails.fakeLike,
                  })(
                    <Input
                      style={{ width: 200 }}
                      disabled={preview === 'info'}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
                <FormItem
                  label="基础收藏数"
                  {...formConfig}
                >
                  {getFieldDecorator('fakeCollection', {
                    rules: [
                      {
                        required: true,
                        validator: (rules, value, callback) => {
                          if (!value) {
                            callback('请输入基础收藏数')
                          }
                          if (isNaN(value - 0) || !((value - 0).toString()).match(/(^[1-9]\d*$)/)) callback('请输入正整数')
                          callback()
                        }
                      }
                    ],
                    initialValue: publishDetails && publishDetails.fakeCollection,
                  })(
                    <Input
                      style={{ width: 200 }}
                      disabled={preview === 'info'}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
                <FormItem
                  label="发送模块"
                  {...formConfig}
                >
                  {getFieldDecorator('articleColumn', {
                    rules: [{ required: true, message: '请选择发送模块' }],
                    initialValue: publishDetails && publishDetails.articleColumn
                  })(
                    <Radio.Group disabled={preview === 'info'} onChange={this.radioChange}>
                      {
                        articleColumn && articleColumn.map((item)=>{
                          return <Radio key={item.key} value={item.value}>{item.title}</Radio>
                        })
                      }
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem
                  label="封面图尺寸"
                  {...formConfig}
                >
                  {getFieldDecorator('coverSize', {
                    rules: [{ required: true, message: '请选择封面图尺寸' }],
                    initialValue: publishDetails && publishDetails.coverSize || aspect
                  })(
                    <div className={style.tag}>
                      {
                        sizeList.map(item=>{
                          return (
                            <div
                              className={style.tagItem}
                              onClick={()=>this.aspectChange(item.value)}
                              style={{
                                backgroundColor: aspect === item.value ? '#1890ff':'#ffffff',
                                color: aspect === item.value ? '#ffffff':'rgba(0, 0, 0, 0.65)'
                              }}
                              key={item.key}
                            >
                              {item.label}
                            </div>
                          )
                        })
                      }
                    </div>
                  )}
                </FormItem>
                <FormItem
                  label="封面图"
                  {...formConfig}
                >
                  {getFieldDecorator('coverPic', {
                    rules: [{ required: true, message: '请上传封面图' }],
                    initialValue: publishDetails && publishDetails.coverPic
                  })(
                    <CropUpload
                      aspect={sizeHomeObj[aspect]}
                      disabled={ preview === 'info' }
                      defaultUrl={publishDetails && publishDetails.coverPic}
                      uploadConfig={{
                        action: `${_baseApi}/article/upload`,
                        fileType: ['image'],
                        maxFileList: 1,
                        size: 2,
                      }}
                      setIconUrl={ data => {
                        let url =  data.length ? data[0] : '';
                        this.props.form.setFieldsValue({ coverPic: url });
                        let obj = publishDetails;
                        obj.coverPic = url;
                        this.setState({
                          publishDetails: obj
                        })
                      }}
                    >
                    </CropUpload>
                  )}
                </FormItem>
                {
                  typeList && typeList.length > 0 &&
                  <FormItem
                    label="关联类别"
                    {...formConfig}
                  >
                    {getFieldDecorator('categoryId', {
                      rules: [{ required: true, message: '请选择关联类别' }],
                      initialValue: publishDetails && publishDetails.categoryId
                    })(
                      <Checkbox.Group
                        disabled={preview === 'info'}
                        options={typeList}
                      />
                    )}
                  </FormItem>
                }
                {
                  sendModel === 2 &&
                  <FormItem
                    label="是否推荐至热门游记"
                    {...formConfig}
                  >
                    {getFieldDecorator('isHot', {
                      rules: [{ required: true, message: '请选择是否推荐至热门游记' }],
                      initialValue: publishDetails && publishDetails.isHot
                    })(
                      <Radio.Group disabled={preview === 'info'}>
                        <Radio key={1} value={1}>是</Radio>
                        <Radio key={0} value={0}>否</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                }
                {
                  sendModel === 6 &&
                  <FormItem
                    label="健康养生封面图"
                    {...formConfig}
                  >
                    {getFieldDecorator('bannerType', {
                      rules: [{ required: true, message: '请选择健康养生封面图' }],
                      initialValue: publishDetails && publishDetails.bannerType
                    })(
                      <Radio.Group disabled={preview === 'info'} onChange={this.coverSizeChange}>
                        {
                          coverList && coverList.map((item, index)=>{
                            return <Radio key={item.key} value={item.key}>{item.label}</Radio>
                          })
                        }
                      </Radio.Group>
                    )}
                  </FormItem>
                }
                {
                  sendModel === 6 && coverAspect !== 0 &&
                  <FormItem
                    label="封面图"
                    {...formConfig}
                  >
                    {getFieldDecorator('articleBanner', {
                      rules: [{ required: true, message: '请上传封面图' }],
                      initialValue: publishDetails && publishDetails.articleBanner
                    })(
                      <CropUpload
                        aspect={sizeObj[coverAspect]}
                        disabled={ preview === 'info' }
                        defaultUrl={publishDetails && publishDetails.articleBanner}
                        uploadConfig={{
                          action: `${_baseApi}/article/upload`,
                          fileType: ['image'],
                          maxFileList: coverAspect === 3 ? 3 : 1,
                          size: 2
                        }}
                        setIconUrl={ data => {
                          this.props.form.setFieldsValue({ articleBanner: data });
                          let obj = publishDetails;
                          obj.articleBanner = data;
                          this.setState({
                            publishDetails: obj
                          })
                        }}
                        getChildData={child => (this.myUploadChild = child)}
                      >
                      </CropUpload>
                    )}
                  </FormItem>
                }
                <FormItem
                  {...formConfig}
                  label={'文章内容'}
                >
                  {getFieldDecorator('articleContent', {
                    rules: [{ required: true, message: '请添加文章内容' }],
                    initialValue: publishDetails && publishDetails.articleContent
                  })(
                    <div />
                  )}
                  <div>
                    <OfficialContentDetail
                      list={publishDetails.articleContent || []}
                      preview={preview}
                      callBack={this.contentChange}
                    />
                  </div>
                </FormItem>
                {
                  id !== '0' && preview === 'edit' &&
                  <PageHeader
                    title="审核结果"
                  >
                    <FormItem
                      label="审核状态"
                      {...formConfig}
                    >
                      {getFieldDecorator('auditStatus', {
                        rules: [{ required: true, message: '请选择审核状态' }],
                        initialValue: publishDetails && publishDetails.auditStatus
                      })(
                        <Radio.Group disabled={preview === 'info'}>
                          <Radio key={3} value={3}>通过</Radio>
                          <Radio key={2} value={2}>不通过</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                    <FormItem
                      label="修改原因"
                      {...formConfig}
                    >
                      {getFieldDecorator('auditRemark',{
                        initialValue: publishDetails && publishDetails.auditRemark
                      })(
                        <Input.TextArea style={{ width: 500 }} disabled={preview === 'info'} rows={4} />
                      )}
                    </FormItem>
                  </PageHeader>
                }
              </Form>
            }
          </PageHeader>
          <div className={style.footer}>
            {
              preview === 'edit' &&
              <Button onClick={()=>this.submit(0)}>取消</Button>
            }
            <Button type="primary" loading={loading} onClick={()=>this.submit(1)}>确定</Button>
          </div>
        </div>
      </Spin>
    );
  }
}
