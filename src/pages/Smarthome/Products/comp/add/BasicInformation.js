import React, { PureComponent } from 'react';
import { Row, Col, Input, Form, Radio, TreeSelect, message, Select } from 'antd';
import { connect } from 'dva';
import { _baseApi } from '@/defaultSettings';
import CropUpload from './CropUpload/index';
import Upload from './Upload/index';
import BraftEditor from './BraftEditor/index';
import styles from './index.less';
import ImpInput from './impInput/impInput';

const { TreeNode } = TreeSelect;
const { TextArea } = Input;
const { Option } = Select;

const formItemConfig = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

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

let imageFileList = [];

@Form.create()
@connect(({ productsManage }) => ({
  storeCategoryList: productsManage.storeCategoryList,
  allSceneList: productsManage.allSceneList,
}))
class BasicInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      aspect: 1 / 1,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    // 获取商品类目下拉
    dispatch({
      type: 'productsManage/getSelectStoreCategoryList',
      payload: {
        type: '0',
      },
    });
    // 应用场景下拉
    dispatch({
      type: 'productsManage/getAllSceneList',
      payload: {},
    });
  }

  componentDidMount() {
    const { getThis, infoData } = this.props;
    // 把自身实例传到父组件
    getThis(this);
    if (infoData) {
      this.setState({
        aspect: imgSizeOption[infoData.imgSize - 1].asept,
      });
    }
  }

  componentWillUnmount() {
    // 清空上传照片列表
    imageFileList = [];
  }

  handleValidator = (rule, value, callback) => {
    const regEn = /[`!@#$%^&*()_+<>?:"{},./;'[\]]/im;

    const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(value) || regCn.test(value)) {
      callback('不可输入特殊字符');
    }
    callback();
  };

  handleChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      content: value,
    });
  };

  handleChangeimgSize = e => {
    if (imageFileList.length > 0) {
      message.warning('切换图片比例后，需要重新上传之前图片');
    }
    const { form } = this.props;
    const index = imgSizeOption.findIndex(item => item.value === e.target.value);
    form.setFieldsValue({
      imgSize: imgSizeOption[index].value,
    });
    this.setState({
      aspect: imgSizeOption[index].asept,
    });
  };

  handleFormData = () => {
    const { form } = this.props;
    let returnData;
    form.validateFields((err, values) => {
      if (!err) {
        if (values.videoUrl && !values.videoImg) {
          message.warning('请上传视频封面图片');
        } else if (
          values.productLabel
            ? values.productLabel.findIndex(item => !item.value.trim()) >= 0
            : false
        ) {
          message.warning('商品标签不能为空');
        } else {
          returnData = {
            ...values,
            sceneId: values.sceneId ? values.sceneId.join(',') : undefined,
            productLabel: values.productLabel
              ? values.productLabel.map(item => item.value).join(',')
              : undefined,
          };
        }
      }
    });

    return returnData;
  };

  render() {
    const { aspect } = this.state;
    const { form, infoData, storeCategoryList, disabled, allSceneList } = this.props;
    const { handleChangeimgSize } = this;
    const { getFieldDecorator } = form;

    return (
      <div>
        <div>基本信息</div>
        <Form {...formItemConfig}>
          <Row gutter={24}>
            <Col>
              <Form.Item label="商品名称">
                {getFieldDecorator('storeName', {
                  rules: [
                    { required: true, message: '输入框不得为空' },
                    // { validator: this.handleValidator, message: '不可输入特殊字符' },
                    { whitespace: true, message: '输入框不得为空' },
                  ],
                  initialValue: infoData && infoData.storeName,
                })(<Input placeholder="请输入商品名" maxLength={50} disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="商品类目">
                {getFieldDecorator('cateId', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: infoData && infoData.cateId,
                })(
                  <TreeSelect disabled={disabled} dropdownStyle={{height: '600px'}}>
                    {storeCategoryList.map(item => (
                      <TreeNode
                        value={item.value}
                        title={item.label}
                        key={item.value}
                        selectable={false}
                      >
                        {item.children.map(item1 => (
                          <TreeNode value={item1.value} title={item1.label} key={item1.value} />
                        ))}
                      </TreeNode>
                    ))}
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
            {allSceneList.length > 0 || (infoData && infoData.sceneId) ? (
              <Col>
                <Form.Item label="应用场景">
                  {getFieldDecorator('sceneId', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: infoData
                      ? infoData.sceneId
                          .split(',')
                          .map(item => Number(item))
                          .filter(item => item !== 0)
                      : undefined,
                  })(
                    <Select mode="multiple" disabled={disabled}>
                      {allSceneList.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.sceneName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            ) : null}
            <Col>
              <Form.Item
                label="商品标签"
                extra={
                  <span style={{ fontSize: '10px' }}>
                    在瀑布流标题下面展示商品标签，建议6字以内，不超过2个标签
                  </span>
                }
              >
                {getFieldDecorator('productLabel', {
                  rules: [],
                  initialValue:
                    infoData && infoData.productLabel && infoData.productLabel.split(','),
                })(
                  <ImpInput
                    onChange={value => {
                      form.setFieldsValue({ productLabel: value });
                    }}
                    maxLength={2}
                    btnText="添加标签"
                    disabled={disabled}
                  />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="卖点描述"
                extra={
                  <span style={{ fontSize: '10px' }}>
                    在商品详情页标题下面展示卖点信息，建议60字以内
                  </span>
                }
              >
                {getFieldDecorator('description', {
                  initialValue: infoData && infoData.description,
                })(<TextArea placeholder="请输入" autoSize maxLength={60} disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="图片尺寸">
                {getFieldDecorator('imgSize', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: (infoData && infoData.imgSize) || 1,
                })(
                  <Radio.Group onChange={handleChangeimgSize} disabled={disabled}>
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
              <Form.Item
                label="商品主图"
                extra={
                  <span style={{ fontSize: '10px' }}>
                    建议尺寸：750 x 750 像素；图片大小不超过1MB， 最多添加5张主图
                    切换图片比例后，需要重新上传图片。
                  </span>
                }
              >
                {getFieldDecorator('sliderImage', {
                  rules: [{ required: true, message: '请上传' }],
                })(
                  <CropUpload
                    defaultUrl={infoData && infoData.sliderImage}
                    uploadConfig={{
                      action: `${_baseApi}/homeStoreProduct/upload`,
                      fileType: ['image'],
                      maxFileList: 5,
                      size: 1,
                    }}
                    disabled={disabled}
                    setIconUrl={(url, deleteFlag) => {
                      if (deleteFlag) {
                        imageFileList.splice(imageFileList.indexOf(url), 1);
                      } else {
                        imageFileList.push(url);
                      }

                      form.setFieldsValue({ sliderImage: imageFileList });
                    }}
                    aspect={aspect}
                  />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="上传视频">
                {getFieldDecorator('videoUrl', {})(
                  <Upload
                    defaultUrl={infoData && infoData.videoUrl}
                    uploadConfig={{
                      action: `${_baseApi}/homeStoreProduct/uploadVideo`,
                      fileType: ['video/*'],
                      size: 50,
                      maxFileList: 1,
                    }}
                    disabled={disabled}
                    setIconUrl={(url, deleteFlag) => {
                      if (deleteFlag) {
                        form.setFieldsValue({ videoUrl: undefined });
                      } else {
                        form.setFieldsValue({ videoUrl: url });
                      }
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="视频封面图">
                {getFieldDecorator('videoImg', {})(
                  <CropUpload
                    defaultUrl={infoData && infoData.videoImg}
                    uploadConfig={{
                      action: `${_baseApi}/homeStoreProduct/upload`,
                      fileType: ['image'],
                      size: 1,
                      maxFileList: 1,
                    }}
                    disabled={disabled}
                    setIconUrl={(url, deleteFlag) => {
                      if (deleteFlag) {
                        form.setFieldsValue({ videoImg: undefined });
                      } else {
                        form.setFieldsValue({ videoImg: url });
                      }
                    }}
                    aspect={aspect}
                  />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="详情" wrapperCol={{ span: 20 }}>
                {getFieldDecorator('content', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: infoData && infoData.content,
                })(
                  !disabled ? (
                    <BraftEditor
                      disabled={disabled}
                      handleChange={this.handleChange}
                      uploadImgUrl={`${_baseApi}/homeStoreProduct/upload`}
                      content={infoData && infoData.content}
                      placeholder="请输入详情"
                      image
                      cleanNoUseP
                      // video
                    />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: infoData && infoData.content }}
                      className={styles.htmlWrapper}
                    />
                  )
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default BasicInformation;
