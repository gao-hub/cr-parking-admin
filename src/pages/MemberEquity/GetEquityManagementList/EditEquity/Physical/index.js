import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Input, Form, Radio, message, Button, Icon, Spin, Select } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import { _baseApi } from '@/defaultSettings';

import PermissionWrapper from '@/utils/PermissionWrapper';
import { debounce, rateReg, regNum } from '@/utils/utils';
import Upload from '@/components/Upload';
import BraftEditor from '@/components/BraftEditor';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const formItemConfig = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};


@Form.create()
@connect(({ EquityManage, loading }) => ({
  EquityManage,
  loading: loading.effects['EquityManage/modifyManage'] ||
    loading.effects['EquityManage/addManage'] ||
    loading.effects['EquityManage/getModifyInfo'],
}))
@PermissionWrapper
class PhysicalComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      EquityName: [
        {
          key: 0,
          value: 0,
          title: '生日礼遇',
        },
        {
          key: 1,
          value: 1,
          title: '升级有礼',
        },
        {
          key: 2,
          value: 2,
          title: '免费洗车',
        },
        {
          key: 3,
          value: 3,
          title: '专属客服',
        },
        {
          key: 4,
          value: 4,
          title: '丰巢会员',
        },
        {
          key: 5,
          value: 5,
          title: '定制产品',
        },
        {
          key: 6,
          value: 6,
          title: '免费电影',
        },
        {
          key: 7,
          value: 7,
          title: '高铁出行',
        },
        {
          key: 8,
          value: 8,
          title: '免费体检',
        },
        {
          key: 9,
          value: 9,
          title: '私人定制游艇',
        },
      ]
    };

  }

  async componentDidMount() {
    const { dispatch, id } = this.props;
    if (id) {
      this.setState({
        loading: true
      })
      await dispatch({
        type: 'EquityManage/getModifyInfo',
        payload: {
          id
        }
      })
      const { modifyInfoData } = this.props.EquityManage;
      this.setState({
        loading: false
      })
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'EquityManage/setModifyInfo',
      payload: {}
    })
    dispatch({
      type: 'EquityManage/setCaculate',
      payload: {}
    })
  }
  // 排序表单验证规则
  handleSortValidator = (rule, value, callback) => {
    const regEn = /^[1-9]\d*$/;

    if (!value) {
   
      callback('请输入排序');
    }
    if (!regEn.test(value)) {

      callback('请输入正整数');
    }

  };
  // 权益名称表单验证规则
  handleEquityValidator = (rule, value, callback) => {
    if (!value) {
      callback('请选择权益名称');
    }
  };

  
  // 富文本赋值
  handleChange = value => {
    const { form } = this.props;
    form.setFieldsValue({ remark: value === '<p></p>' ? '' : value });
  };

  // 保存实物商品
  saveBtn = async (e) => {
    const { dispatch, form, id } = this.props
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res
        if (id) {
          res = await dispatch({
            type: 'EquityManage/modifyManage',
            payload: {
              ...values,
              goodsType: 0, // 商品类型,0实物,1虚拟
              id
            },
          });
        } else {
          res = await dispatch({
            type: 'EquityManage/addManage',
            payload: {
              ...values,
              goodsType: 0, // 商品类型,0实物,1虚拟
              id
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          router.push({
            pathname: '/memberEquity/getEquityManagement'
          })
        } else message.error(res.statusDesc)
      }
    });
  }
  // 点击取消事件
  cancle = (e) => {
    router.push({
      pathname: '/memberEquity/getEquityManagement',
    });
  }

  render() {
    const { form, disabled, EquityManage: { modifyInfoData, caculateData }, id, type, permission } = this.props;
    const { getFieldDecorator } = form;
    const { EquityName } = this.state;
    return (
      <Spin spinning={this.state.loading}>
        <Form {...formItemConfig}>
          <Row gutter={24}>
            <Col>
              <Form.Item label="权益名称">
                {getFieldDecorator('goodsName', {
                  rules: [
                    { required: true, whitespace: true, validator: this.handleEquityValidator }
                  ],
                  initialValue: modifyInfoData && modifyInfoData.goodsName,
                })(
                  <Select placeholder={'请选择权益'} allowClear>
                      {Array.isArray(EquityName) &&
                        EquityName.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                )}
              </Form.Item>
            </Col>
            <Col>
              {(!id || Object.keys(modifyInfoData).length) ?
                <FormItem
                  label="解锁图标"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  extra={<span style={{ fontSize: '10px' }}>图片大小不超过1MB，最多添加5张主图</span>}
                >
                  {getFieldDecorator('goodsImg', {
                    rules: [
                      { required: true, message: '请上传商品主图' },
                    ],
                    initialValue: modifyInfoData && modifyInfoData.goodsImg,
                  })(<Upload
                    disabled={disabled}
                    uploadConfig={{
                      action: `${_baseApi}/integralGoods/upload`,
                      fileType: ['image'],
                      size: 1,
                      maxFileList: 5
                    }}
                    defaultUrl={modifyInfoData && modifyInfoData.goodsImg}
                    multiplePicture
                    setIconUrl={(url, operateType) => {
                      const goodsImg = this.props.form.getFieldValue('goodsImg');
                      if (operateType !== 'remove') {
                        // 照片添加的逻辑
                        if (!goodsImg || !goodsImg[0]) {
                          this.props.form.setFieldsValue({ goodsImg: [url] });
                        } else {
                          this.props.form.setFieldsValue({
                            goodsImg: goodsImg.concat([url]),
                          });
                        }
                      } else {
                        // 照片删除的逻辑
                        const resArr = [];
                        goodsImg.forEach(item => {
                          if (item !== url) {
                            resArr.push(item);
                          }
                        });
                        this.props.form.setFieldsValue({ goodsImg: resArr });
                      }
                    }}
                  />
                  )}
                </FormItem> : null
              }
            </Col>
            <Col>
              {(!id || Object.keys(modifyInfoData).length) ?
                <FormItem
                  label="未解锁图标"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  extra={<span style={{ fontSize: '10px' }}>图片大小不超过1MB，最多添加5张主图</span>}
                >
                  {getFieldDecorator('goodsImg', {
                    rules: [
                      { required: true, message: '请上传商品主图' },
                    ],
                    initialValue: modifyInfoData && modifyInfoData.goodsImg,
                  })(<Upload
                    disabled={disabled}
                    uploadConfig={{
                      action: `${_baseApi}/integralGoods/upload`,
                      fileType: ['image'],
                      size: 1,
                      maxFileList: 5
                    }}
                    defaultUrl={modifyInfoData && modifyInfoData.goodsImg}
                    multiplePicture
                    setIconUrl={(url, operateType) => {
                      const goodsImg = this.props.form.getFieldValue('goodsImg');
                      if (operateType !== 'remove') {
                        // 照片添加的逻辑
                        if (!goodsImg || !goodsImg[0]) {
                          this.props.form.setFieldsValue({ goodsImg: [url] });
                        } else {
                          this.props.form.setFieldsValue({
                            goodsImg: goodsImg.concat([url]),
                          });
                        }
                      } else {
                        // 照片删除的逻辑
                        const resArr = [];
                        goodsImg.forEach(item => {
                          if (item !== url) {
                            resArr.push(item);
                          }
                        });
                        this.props.form.setFieldsValue({ goodsImg: resArr });
                      }
                    }}
                  />
                  )}
                </FormItem> : null
              }
            </Col>
            <Col>
              {(!id || Object.keys(modifyInfoData).length) ?
                <FormItem
                  label="黑钻图标"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  extra={<span style={{ fontSize: '10px' }}>图片大小不超过1MB，最多添加5张主图</span>}
                >
                  {getFieldDecorator('goodsImg', {
                    rules: [
                      { required: true, message: '请上传商品主图' },
                    ],
                    initialValue: modifyInfoData && modifyInfoData.goodsImg,
                  })(<Upload
                    disabled={disabled}
                    uploadConfig={{
                      action: `${_baseApi}/integralGoods/upload`,
                      fileType: ['image'],
                      size: 1,
                      maxFileList: 5
                    }}
                    defaultUrl={modifyInfoData && modifyInfoData.goodsImg}
                    multiplePicture
                    setIconUrl={(url, operateType) => {
                      const goodsImg = this.props.form.getFieldValue('goodsImg');
                      if (operateType !== 'remove') {
                        // 照片添加的逻辑
                        if (!goodsImg || !goodsImg[0]) {
                          this.props.form.setFieldsValue({ goodsImg: [url] });
                        } else {
                          this.props.form.setFieldsValue({
                            goodsImg: goodsImg.concat([url]),
                          });
                        }
                      } else {
                        // 照片删除的逻辑
                        const resArr = [];
                        goodsImg.forEach(item => {
                          if (item !== url) {
                            resArr.push(item);
                          }
                        });
                        this.props.form.setFieldsValue({ goodsImg: resArr });
                      }
                    }}
                  />
                  )}
                </FormItem> : null
              }
            </Col>
            <Col>
              <Form.Item label="排序">
                {getFieldDecorator('asa', {
                  rules: [
                    { required: true, whitespace: true, validator: this.handleSortValidator }
                  ],
                  initialValue: modifyInfoData && modifyInfoData.goodsName,
                })(<Input placeholder="请输入" maxLength={3} disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="权益介绍">
                {getFieldDecorator('remark', {
                  rules: [{ required: true, message: '请输入权益介绍' }],
                  initialValue: modifyInfoData && modifyInfoData.remark,
                })(
                  <BraftEditor
                    handleChange={this.handleChange}
                    uploadImgUrl={`${_baseApi}/news/upload`}
                    content={modifyInfoData && modifyInfoData.remark}
                    placeholder="请输入权益介绍"
                    excludeControls={['emoji', 'code', 'link', 'fullscreen']}
                    minHeight="500px"
                    disabled={disabled}
                    externals={{
                      image: false,
                      video: false,
                      audio: false,
                      embed: false
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="权益规则">
                {getFieldDecorator('remark', {
                  rules: [{ required: true, message: '请输入权益规则' }],
                  initialValue: modifyInfoData && modifyInfoData.remark,
                })(
                  <BraftEditor
                    handleChange={this.handleChange}
                    uploadImgUrl={`${_baseApi}/news/upload`}
                    content={modifyInfoData && modifyInfoData.remark}
                    placeholder="请输入权益规则"
                    excludeControls={['emoji', 'code', 'link', 'fullscreen']}
                    minHeight="500px"
                    disabled={disabled}
                    externals={{
                      image: false,
                      video: false,
                      audio: false,
                      embed: false
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="适用门店">
                {getFieldDecorator('remark', {
                  rules: [{ required: true, message: '请输入适用门店' }],
                  initialValue: modifyInfoData && modifyInfoData.remark,
                })(
                  <TextArea />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="领取规则">
                {getFieldDecorator('remark', {
                  rules: [{ required: true, message: '请输入领取规则' }],
                  initialValue: modifyInfoData && modifyInfoData.remark,
                })(
                  <TextArea />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col>
              <FormItem label="状态">
                {getFieldDecorator('isShow', {
                  rules: [{ required: true, message: '请选择状态' }],
                  initialValue: modifyInfoData && modifyInfoData.isShow
                })(
                  <RadioGroup allowClear disabled={disabled}>
                    <Radio value={1}>启用</Radio>
                    <Radio value={0}>禁用</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center" style={{ marginTop: '15px' }}>
            <Col style={{ marginRight: '20px' }}>
              <Button type="primary" onClick={this.saveBtn} >{this.props.loading && <Icon type="loading" />}确认</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={this.cancle}>{this.props.loading && <Icon type="loading" />}取消</Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default PhysicalComponent;
