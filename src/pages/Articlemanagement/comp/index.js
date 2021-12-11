import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Input, Row, Col, Radio, Button, message } from 'antd';
import * as _ from 'lodash';
import { _baseApi } from '@/defaultSettings';
import Articlecontent from './Articlecontent/Articlecontent';
import CropUpload from './CropUpload/index';
import Upload from './Upload/index';
import ConnectPro from './ConnectPro';
import ImpInput from './impInput';
import styles from './index.scss';
import { AddNew, updateNew } from '../service';

const formItemConfig = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 },
};

const imageFileList = [];

let newsContent = [];

const imgSizeOption = [
  {
    label: '1：1',
    value: 1,
    asept: 1 / 1,
  },
  {
    label: '4：3',
    value: 2,
    asept: 4 / 3,
  },
  {
    label: '3：4',
    value: 3,
    asept: 3 / 4,
  },
  {
    label: '2：3',
    value: 4,
    asept: 2 / 3,
  },
];

@Form.create()
@connect(({ Articlemanagement }) => ({
  infoData: Articlemanagement.infoData,
}))
class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aspect: 1 / 1,
    };
  }

  componentWillMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.id) {
      dispatch({
        type: 'Articlemanagement/getInfoData',
        payload: {
          id: query.id,
        },
      });
    }
  }

  componentWillUnmount() {
    imageFileList.length = 0;
    const { dispatch } = this.props;
    dispatch({
      type: 'Articlemanagement/setInfoData',
      payload: null,
    });
  }

  handleChangeimgSize = e => {
    const { form } = this.props;
    const index = imgSizeOption.findIndex(item => item.value === e.target.value);
    form.setFieldsValue({
      imgSize: imgSizeOption[index].value,
    });
    this.setState({
      aspect: imgSizeOption[index].asept,
    });
  };

  formSubmit = () => {
    const { form, infoData } = this.props;
    if (newsContent.length === 0) {
      message.error('请选择文章内容');
      return;
    }
    form.validateFields(async (err, values) => {
      if (!err) {
        const valuesRef = _.cloneDeep(values);
        const newsContentRef = _.cloneDeep(newsContent);
        // 关键词验证
        if (
          !valuesRef.keys.every(item => {
            if (!item.value || item.value.trim() === '') {
              message.error(`关键词不能为空`);
              return false;
            }
            return true;
          })
        ) {
          return;
        }

        // 文章内容验证
        if (
          !newsContentRef.every(item => {
            if (item.contentType === 0 && (!item.newsContent || item.newsContent.trim() === '')) {
              message.error(`文章内容不能为空`);
              return false;
            }
            return true;
          })
        ) {
          return;
        }
        // valuesRef.categoryIds = valuesRef.categoryIds.map(item => item.id);
        valuesRef.keys = valuesRef.keys.map(item => item.value);
        newsContentRef.forEach(item => {
          const itemRef = item;
          itemRef.id = undefined;
          itemRef.content = undefined;
          itemRef.value = undefined;
        });

        const params = {
          ...valuesRef,
          newsContent: newsContentRef,
          id: infoData ? infoData.id : undefined,
        };
        let res;
        if (infoData) {
          res = await updateNew(params);
        } else {
          res = await AddNew(params);
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          router.goBack();
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };

  render() {
    const {
      form,
      infoData,
      location: { query },
    } = this.props;
    const { aspect } = this.state;
    const { handleChangeimgSize } = this;
    const { getFieldDecorator } = form;
    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        {((query.id || query.edit) && infoData !== null) || query.add ? (
          <Form {...formItemConfig}>
            <Row gutter={24} className={styles.rowwrapper}>
              <Col>
                <Form.Item label="标题">
                  {getFieldDecorator('newsTitle', {
                    rules: [
                      { required: true, message: '输入框不得为空' },
                      {
                        whitespace: true,
                        message: '输入框不得为空',
                      },
                    ],
                    initialValue: infoData && infoData.newsTitle,
                  })(<Input placeholder="请输入标题" maxLength={50} disabled={!query.edit} />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="关键词">
                  {getFieldDecorator('keys', {
                    rules: [{ required: true, message: '输入框不得为空' }],
                    initialValue: infoData && infoData.keys,
                  })(
                    <ImpInput
                      onChange={value => {
                        form.setFieldsValue({ keys: value });
                      }}
                      disabled={!query.edit}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="简介">
                  {getFieldDecorator('newsBrief', {
                    initialValue: infoData && infoData.newsBrief,
                  })(<Input placeholder="请输入简介" maxLength={50} disabled={!query.edit} />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="状态">
                  {getFieldDecorator('newsStatus', {
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue: (infoData && infoData.newsStatus) || 1,
                  })(
                    <Radio.Group disabled={!query.edit}>
                      <Radio value={1}>启用</Radio>
                      <Radio value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="是否置顶">
                  {getFieldDecorator('newsTop', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: (infoData && infoData.newsTop) || 0,
                  })(
                    <Radio.Group disabled={!query.edit}>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="图片尺寸">
                  {getFieldDecorator('imgSize', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: (infoData && infoData.imgSize) || 1,
                  })(
                    <Radio.Group onChange={handleChangeimgSize} disabled={!query.edit}>
                      {imgSizeOption.map(item => (
                        <Radio.Button value={item.value} key={item.value}>
                          {item.label}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="封面图">
                  {getFieldDecorator('newsPic', {
                    rules: [{ required: true, message: '请选择封面图' }],
                  })(
                    <CropUpload
                      defaultUrl={infoData && infoData.newsPic}
                      uploadConfig={{
                        action: `${_baseApi}/homeNews/upload`,
                        fileType: ['image'],
                        size: 1,
                        maxFileList: 1,
                      }}
                      setIconUrl={(url, deleteFlag) => {
                        if (deleteFlag) {
                          form.setFieldsValue({ newsPic: undefined });
                        } else {
                          form.setFieldsValue({ newsPic: url });
                        }
                      }}
                      disabled={!query.edit}
                      aspect={aspect}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="上传视频">
                  {getFieldDecorator('newsVideo', {})(
                    <Upload
                      defaultUrl={infoData && infoData.newsVideo}
                      uploadConfig={{
                        action: `${_baseApi}/homeNews/upload`,
                        fileType: ['video/*'],
                        size: 50,
                        maxFileList: 1,
                      }}
                      disabled={!query.edit}
                      setIconUrl={(url, deleteFlag) => {
                        if (deleteFlag) {
                          form.setFieldsValue({ newsVideo: undefined });
                        } else {
                          form.setFieldsValue({ newsVideo: url });
                        }
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="视频封面图">
                  {getFieldDecorator('newsVideoPic', {})(
                    <CropUpload
                      disabled={!query.edit}
                      defaultUrl={infoData && infoData.newsVideoPic}
                      uploadConfig={{
                        action: `${_baseApi}/homeNews/upload`,
                        fileType: ['image'],
                        size: 1,
                        maxFileList: 1,
                      }}
                      setIconUrl={(url, deleteFlag) => {
                        if (deleteFlag) {
                          form.setFieldsValue({ newsVideoPic: undefined });
                        } else {
                          form.setFieldsValue({ newsVideoPic: url });
                        }
                      }}
                      aspect={aspect}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="详情页banner图"
                  extra={
                    <span style={{ fontSize: '10px' }}>
                      建议尺寸：750 x 750 像素；图片大小不超过1MB， 最多添加5张主图
                    </span>
                  }
                >
                  {getFieldDecorator('newsBannerAr', {})(
                    <CropUpload
                      disabled={!query.edit}
                      defaultUrl={infoData && infoData.newsBannerAr}
                      uploadConfig={{
                        action: `${_baseApi}/homeNews/upload`,
                        fileType: ['image'],
                        size: 1,
                        maxFileList: 5,
                      }}
                      setIconUrl={(url, deleteFlag) => {
                        if (deleteFlag) {
                          imageFileList.splice(imageFileList.indexOf(url), 1);
                        } else {
                          imageFileList.push(url);
                        }
                        form.setFieldsValue({ newsBannerAr: imageFileList });
                      }}
                      aspect={aspect}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="关联模块">
                  {getFieldDecorator('newsType', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: infoData && infoData.newsType,
                  })(
                    <Radio.Group disabled={!query.edit}>
                      <Radio value={1}>智慧家居</Radio>
                      <Radio value={2}>智慧旅游</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              {/* <Col>
                <Form.Item label="关联产品">
                  {getFieldDecorator('categoryIds', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: infoData && infoData.categorys,
                  })(
                    <ConnectPro
                      disabled={!query.edit}
                      onChange={value => {
                        form.setFieldsValue({ categoryIds: value });
                      }}
                    />
                  )}
                </Form.Item>
              </Col> */}
              <Col>
                <Form.Item
                  label="文章内容"
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 20 }}
                  required
                >
                  <Articlecontent
                    disabled={!query.edit}
                    onChange={value => {
                      newsContent = value;
                    }}
                    value={infoData && infoData.newsContent}
                  />
                </Form.Item>
              </Col>
              <Col className={styles.btnwrapper}>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    router.goBack();
                  }}
                >
                  返回
                </Button>
                {query.edit && (
                  <Button onClick={this.formSubmit} type="primary">
                    保存
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        ) : null}
      </div>
    );
  }
}

export default Add;
