import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Input, Form, Radio, message, Button, Icon, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import { _baseApi } from '@/defaultSettings';

import PermissionWrapper from '@/utils/PermissionWrapper';
import { debounce, rateReg, regNum } from '@/utils/utils'
import Upload from '@/components/Upload';
import BraftEditor from '@/components/BraftEditor';


const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const formItemConfig = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

@Form.create()
@connect(({ EquityManage, loading }) => ({
  EquityManage,
  loading: loading.effects['EquityManage/modifyManage'] || 
  loading.effects['EquityManage/addManage']
}))
@PermissionWrapper
class VirtualComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      loading: false
    };

  }

  async componentDidMount() {
    const { dispatch, id } = this.props;
    // 防抖
    this.caculate = debounce(this.caculate, 800);
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
        count: modifyInfoData?.goodsName.length,
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

  handleValidator = (rule, value, callback) => {
    // const regEn = /[`!@#$%^&*()_+<>?:"{},./;'[\]]/im;
    // const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

    if(!value){
      this.setState({
        count: 0
      })
      callback('请输入商品名称');
    }
    // if (regEn.test(value) || regCn.test(value)) {
    //   callback('不可输入特殊字符');
    // }
    if(value && value.length){
      this.setState({
        count:value.length
      })
      callback();
    }
    
  };

  // 富文本赋值
  handleChange = value => {
    const { form } = this.props;
    form.setFieldsValue({ remark: value === '<p></p>' ? '' : value });
  };

  // 输入售价,计算商品积分
  caculate = async (_, value, callback) => {
    const { dispatch } = this.props;
    if (!value) {
      callback('请输入商品售价');
    }
    if(value < '1'){
      callback('商品售价需大于等于1')
    }
    if (!rateReg.test(value)) {
      callback('必须为数字，整数部分不能超过8位，小数部分不能超过2位！')
    } else {
      await dispatch({
        type: 'EquityManage/caculateGoodsIntegral',
        payload: {
          otPrice: value
        }
      })
    }
    callback()
  }

  // 保存实物商品
  saveBtn = async (e) => {
    const { dispatch, form, id } = this.props
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (id) {
          res = await dispatch({
            type: 'EquityManage/modifyManage',
            payload: {
              ...values,
              goodsType: 1, // 商品类型：0实物,1虚拟
              id
            },
          });
        } else {
          res = await dispatch({
            type: 'EquityManage/addManage',
            payload: {
              ...values,
              goodsType: 1, // 商品类型：0实物,1虚拟
              id
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          router.push({
            pathname: '/integralMall/EquityManage/list'
          })
        } else message.error(res.statusDesc)
      }
    });
  }

  render() {
    const { form, disabled, EquityManage: { modifyInfoData, caculateData }, id, type, permission } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Spin spinning={this.state.loading}>
        <Form {...formItemConfig}>
          <div style={{ paddingLeft: '20px' }}>基本信息</div>
          <Row gutter={24}>
            <Col>
              <Form.Item label="商品名称">
                {getFieldDecorator('goodsName', {
                  rules: [
                    { required: true, whitespace: true, validator: this.handleValidator}
                  ],
                  initialValue: modifyInfoData && modifyInfoData.goodsName,
                })(<Input placeholder="请输入商品名称" maxLength={50} disabled={disabled} addonAfter={<span>{this.state.count}/50</span>} />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="商品编码">
                {getFieldDecorator('virtualGoodsCode', {
                  rules: [
                    { required: true, whitespace: true, message: '请输入商品编码' }
                  ],
                  initialValue: modifyInfoData && modifyInfoData.virtualGoodsCode,
                })(<Input placeholder="请输入商品编码" disabled={id ? disabled : false} maxLength={50} />)}
              </Form.Item>
            </Col>
            <Col>
              {(!id || Object.keys(modifyInfoData).length) ?
                <FormItem
                  label="商品主图"
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
              <Form.Item label="详情">
                {getFieldDecorator('remark', {
                  rules: [{ required: true, message: '请输入详情' }],
                  initialValue: modifyInfoData && modifyInfoData.remark,
                })(
                  <BraftEditor
                    handleChange={this.handleChange}
                    uploadImgUrl={`${_baseApi}/news/upload`}
                    content={modifyInfoData && modifyInfoData.remark}
                    placeholder="请输入详情"
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
          </Row>
          <div style={{ paddingLeft: '20px' }}>销售信息</div>
          <Row gutter={24}>
            <Col>
              <FormItem label="成本价">
                {getFieldDecorator('costPrice', {
                  rules: [{
                    required: true, validator: (rules, value, callback) => {
                      if (!value) {
                        callback('请输入成本价');
                      }
                      if(value === '0.00') {
                        callback('不能为0.00')
                      }
                      if (!rateReg.test(value)) {
                        callback('必须为数字，整数部分不能超过8位，小数部分不能超过2位！')
                      }
                      callback()
                    }
                  }],
                  initialValue: modifyInfoData && modifyInfoData.costPrice
                })(
                  <Input maxLength={9} disabled={disabled} />
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem label="商品售价">
                {getFieldDecorator('otPrice', {
                  rules: [{
                    required: true,
                    validator: this.caculate
                  }],
                  initialValue: modifyInfoData && modifyInfoData.otPrice
                })(<Input disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col>
              {
                Object.keys(caculateData).length ?
                  <FormItem required label="积分价格" extra={<span>积分价格=商品售价*积分汇率；积分价格如果存在小数，直接去尾取整显示。</span>}>
                    {getFieldDecorator('price')(
                      <>
                        <span>{caculateData.integralPrice}积分</span>&emsp;
                        <span>1元人民币={`${caculateData.exchangeAmountRatio}`}积分</span>
                      </>)}
                  </FormItem> : null
              }
            </Col>
            <Col>
              <FormItem label="库存" extra={<span>拍下扣库存，若支付失败则恢复库存数量</span>}>
                {getFieldDecorator('stock', {
                  rules: [{ required: true, validator: (rules, value, callback) => {
                    if ((value??'') === '' ) {
                      callback('请输入库存')
                    }
                    if (!regNum.test(value)) {
                      callback('请输入正整数')
                    }
                    callback()
                  } }],
                  initialValue: modifyInfoData && modifyInfoData.stock
                })(<Input disabled={disabled} maxLength={8} />)}
              </FormItem>
            </Col>
            <Col>
              <FormItem label="虚拟已兑" extra={<span>此数值只为了前端页面展示，不计入销量统计中；前端页面的已兑=虚拟已兑+实际兑换数量</span>}>
                {getFieldDecorator('virtualExchangeNum', {
                  rules: [{
                    required: true, validator: (rules, value, callback) => {
                      if ((value??'') === '' ) {
                        callback('请输入虚拟已兑')
                      }
                      if (!regNum.test(value)) {
                        callback('请输入正整数')
                      }
                      callback()
                    }
                  }],
                  initialValue: modifyInfoData && modifyInfoData.virtualExchangeNum
                })(<Input disabled={disabled} maxLength={8} />)}
              </FormItem>
            </Col>
          </Row>
          <div style={{ paddingLeft: '20px' }}>设置信息</div>
          <Row gutter={24}>
            <Col>
              <FormItem label="每人限购">
                {getFieldDecorator('limitNum', {
                  rules: [{
                    required: false, validator: (rules, value, callback) => {
                      if (value && !regNum.test(value)) {
                        callback('请输入正整数')
                      }
                      if(value === '0') {
                        callback('请输入大于0的数')
                      }
                      callback()
                    }
                  }],
                  initialValue: modifyInfoData && modifyInfoData.limitNum
                })(
                  <Input addonAfter="次" maxLength={6} disabled={disabled} />
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem label="上架设置">
                {getFieldDecorator('isShow', {
                  rules: [{ required: false, message: '请选择上架设置' }],
                  initialValue: modifyInfoData && modifyInfoData.isShow
                })(
                  <RadioGroup allowClear disabled={disabled}>
                    <Radio value={1}>上架</Radio>
                    <Radio value={0}>放入仓库</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center" style={{ marginTop: '15px' }}>
            {
              type === 'add' && permission.includes('chuangrong:integralGoods:add') ? <Button type="primary" onClick={this.saveBtn}>{this.props.loading && <Icon type="loading" />}保存</Button> : null
            }
            {
              type === 'modify' && permission.includes('chuangrong:integralGoods:update') ? <Button type="primary" onClick={this.saveBtn}>{this.props.loading && <Icon type="loading" />}保存</Button> : null
            }
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default VirtualComponent;
