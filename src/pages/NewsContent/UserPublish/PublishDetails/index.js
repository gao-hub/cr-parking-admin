import React, { PureComponent } from 'react';
import { Form, PageHeader, Button, Input, Divider, Radio, message, Row, Col, Checkbox, Spin } from 'antd';
import router from 'umi/router';
import Swal from 'sweetalert2';
import _ from 'lodash';
import permission from '@/utils/PermissionWrapper';
import { getPublishInfo, examineApi, deletePublish, getContactType, getPublishInfoForImage, getDefaultImage, getPlayAuth } from './services';
import style from './index.less';
import Upload from '../../components/Upload';
import UserContentDetail from '../../components/UserContentDetail';
import { queryURL } from '@/utils/utils';
const FormItem = Form.Item;

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
      publishDetails: {}, // 详情信息
      specialColumnObj: [], //专栏数据
      typeList: [], // 关联类别
      sendModel: '',
      loading: false,
      defaultImage: '',
      videoPlayAuth: ''
    };
  }
  componentDidMount() {
    //为了父级返回用
    sessionStorage.setItem('publishUserKey', queryURL(location.search).tabIndex);

    // type: 1文章2图片3视频;
    // preview: info 预览 edit 是审核
    const { match: { params: { id, type, preview }} } = this.props;
    this.setState({
      urlInfo: { id, type, preview }
    })
    //获取详情
    this.getInfo(id, type);
  }
  //获取发布详情
  getInfo = async (id, type) =>{
    this.setState({ loading: true });
    // 获取详情
    let res;
    if(type === '1') {
      res = await getPublishInfo({id});
    } else {
      res = await getPublishInfoForImage({id});
    }
    if (res && res.status === 1) {
      if(type === '3' && res.data.articleContent?.videoID) {
        // 获取视频凭证
        let resPlayAuth = await getPlayAuth({ videoId: res.data.articleContent.videoID });
        if(resPlayAuth && resPlayAuth.status === 1){
          this.setState({
            videoPlayAuth: resPlayAuth.data
          });
        }
      }
      // 设置关键词
      if(res.data.keysWord){
        res.data.keysWord.forEach((item, index)=>{
          res.data[`tag${index + 1}`] = item;
        })
      }
      // 获取删除后的默认图片
      // const resImage = await getDefaultImage();
        //获取专栏
      const data = await getContactType({id, userType: 1});
      if (data && data.status === 1) {
        let arr = typeChoose[res.data.articleColumn] ? data.data[typeChoose[res.data.articleColumn]] : []; // 设置关联类别的默认值
        this.setState({
          specialColumnObj: data.data,
          publishDetails: res.data,
          typeList: arr,
          sendModel: res.data.articleColumn, // 发送模块
          // defaultImage : resImage.data
        });
      }
    }else {
      message.error(res.statusDesc);
    }
    this.setState({ loading: false });
  }
  //删除操作
  deleteData = async () =>{
    const confirmVal = await Swal.fire({
      text: '确定要删除吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      const res = await deletePublish({ id: this.state.urlInfo.id })
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        // 路由跳转到列表页面
        router.push('/newsContent/userPublish/publishList');
      } else {
        message.error(res.statusDesc);
      }
    }
  }
  // 列表改变的时候数据设置
  contentChange = publishDetails =>{
    console.info(this.props.form.getFieldsValue());
    this.setState({
      publishDetails
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
      const { publishDetails } = this.state;
      form.validateFieldsAndScroll(async(err, values) => {
        if (!err) {
          let json = JSON.parse(JSON.stringify(values));
          json.keysWord = [json.tag1 || '', json.tag2 || '', json.tag3 || ''];
          if(json.auditStatus === 1){
            message.warning('请选择审核状态')
            return;
          }
          this.setState({
            loading: true
          })
          let obj = _.cloneDeep(publishDetails);
          // obj.articleContentVM = publishDetails.articleContent;
          if(this.state.urlInfo.type !== '1' ){
            obj.articleContentVM = publishDetails.articleContent;
            delete obj.articleContent; // 删除文章内容原来的字段
          }
          delete obj.categoryName; // 删除周边游文字字段
          let res = await examineApi({ ...obj, ...json });
          if (res && res.status === 1) {
            message.success(res.statusDesc)
            router.push('/newsContent/userPublish/publishList');
          } else message.error(res.statusDesc)
          this.setState({
            loading: false
          })
        }
      });
    } else {
      router.push('/newsContent/userPublish/publishList');
    }
  }
  render() {
    const { loading, urlInfo: { type, preview }, defaultImage, publishDetails, specialColumnObj: { articleColumn }, typeList, sendModel, videoPlayAuth } = this.state;
    const { form: { getFieldDecorator }, permission} = this.props;
    const formConfig = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    };
    return (
      <Spin spinning={loading}>
        <div className={style.content}>
          <PageHeader
            title={preview === 'info' ? '预览' : '审核'}
            extra={[
              permission.includes('chuangrong:userPublish:delete') && preview === 'edit' && <Button key="delete" type="primary" onClick={this.deleteData}>删除</Button>
            ]}
          >
            <Divider style={{ marginTop: 0 }} />
            {
              Object.keys(publishDetails).length > 0 &&
              <Form >
                {
                  type === '1' &&
                  <FormItem
                    {...formConfig}
                    label={'封面图'}
                  >
                    {getFieldDecorator('coverPic',{
                      initialValue: publishDetails && publishDetails.coverPic
                    })(
                      <Upload
                        disabled
                        defaultUrl={publishDetails && publishDetails.coverPic}
                        defaultImage={defaultImage}
                        setIconUrl={url => {
                          this.props.form.setFieldsValue({ coverPic: url.toString() });
                          let obj = publishDetails;
                          obj.coverPic = url.toString();
                          this.setState({
                            publishDetails: obj
                          })
                        }}
                      />
                    )}
                  </FormItem>
                }
                <FormItem
                  {...formConfig}
                  label={'内容详情'}
                >
                  <UserContentDetail
                    videoPlayAuth={videoPlayAuth}
                    defaultImage={defaultImage}
                    info={publishDetails}
                    type={type}
                    preview={preview}
                    callBack={this.contentChange}
                  />
                </FormItem>
                <PageHeader
                  title="关键词标签"
                >
                  <Row>
                    <Col span={1} />
                    <Col span={4}>
                      <FormItem
                        label=""
                        {...formConfig}
                      >
                        {getFieldDecorator('tag1',{
                          initialValue: publishDetails && publishDetails.tag1
                        })(
                          <Input disabled={preview === 'info'} maxLength={6}  />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem
                        label=""
                        {...formConfig}
                      >
                        {getFieldDecorator('tag2',{
                          initialValue: publishDetails && publishDetails.tag2
                        })(
                          <Input disabled={preview === 'info'} maxLength={6} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem
                        label=""
                        {...formConfig}
                      >
                        {getFieldDecorator('tag3',{
                          initialValue: publishDetails && publishDetails.tag3
                        })(
                          <Input disabled={preview === 'info'} maxLength={6} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </PageHeader>
                <PageHeader
                  title="修改专栏"
                >
                  <FormItem
                    label="选择专栏"
                    {...formConfig}
                  >
                    {getFieldDecorator('articleColumn', {
                      initialValue: publishDetails && publishDetails.articleColumn
                    })(
                      <Radio.Group disabled={preview === 'info'} onChange={this.radioChange}>
                        {
                          articleColumn && articleColumn.map((item, index)=>{
                            return <Radio key={item.key} value={item.value}>{item.title}</Radio>
                          })
                        }
                      </Radio.Group>
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
                </PageHeader>
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
