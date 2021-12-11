/* eslint-disable no-lonely-if */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Divider, Card, Radio, Input, Button, message } from 'antd';
import { connect } from 'dva';
import { queryURL } from '@/utils/utils';
import router from 'umi/router';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';
import ModifyForm from './ModifyForm';
// import styles from './styles.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
@connect(({ parkingAuditManage, loading }) => ({
  parkingAuditManage,
  submitLoading: loading.effects['parkingAuditManage/auditManage'],
}))
class ParkingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      isModalShow: 0,
      modalJson: {},
    };
  }

  componentDidMount = async () => {
    const { dispatch, location = {} } = this.props;
    dispatch({
      type: 'parkingAuditManage/getModifyInfo',
      payload: {
        parkingId: queryURL(location.search).parkingId,
      },
    });
    dispatch({
      type: 'parkingAuditManage/getTimeLine',
      payload: {
        parkingId: queryURL(location.search).parkingId,
      },
    });
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'parkingAuditManage/setModifyInfo',
    });
  };

  /**
   * @desc 提交审核
   */
  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch, parkingAuditManage = {}, form, location = {} } = this.props;
    const {
      modifyInfoData: { useType = '', holdInfoShow=-1 },
    } = parkingAuditManage;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        // useType 0=>委托出租  1=>委托出售
        if (useType === 0) {
          const res = await dispatch({
            type: 'parkingAuditManage/auditManage',
            payload: {
              id: queryURL(location.search).id,
              ...values,
            },
          });

          if (res && res.status === 1) {
            message.success(res.statusDesc);
            router.goBack();
          } else {
            message.error(res.statusDesc);
          }
        } else {
          //holdInfoShow:1弹窗显示交易密码；0：弹窗不显示交易密码
          if (values.auditStatus === 2 && holdInfoShow === 1) {
            this.setState({
              isModalShow: 1,
              modalJson: {
                ...values,
                id: queryURL(location.search).id,
              },
            });
          } else {
            const res = await dispatch({
              type: 'parkingAuditManage/auditManage',
              payload: {
                ...values,
                id: queryURL(location.search).id,
              },
            });

            if (res && res.status === 1) {
              message.success(res.statusDesc);
              router.goBack();
            } else {
              message.error(res.statusDesc);
            }
          }
        }
      }
    });
  };

  /**
   * @desc 提交审核
   */
  handleSubmitOperate = async e => {
    e.preventDefault();
    const { dispatch, form, location = {} } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        // useType 0=>委托出租  1=>委托出售
          const res = await dispatch({
            type: 'parkingAuditManage/operateAuditManage',
            payload: {
              id: queryURL(location.search).id,
              ...values,
            },
          });

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
    const { modifyInfoData = {}, timeLineInfo } = this.props.parkingAuditManage;
    const {
      location: {
        query: { type },
      },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    // 车位信息
    const carInfo = [
      {
        key: 0,
        title: '状态',
        value: modifyInfoData && modifyInfoData.parkingStatusStr,
      },
      {
        key: 1,
        title: '楼盘名称',
        value: modifyInfoData && modifyInfoData.buildingName,
      },
      {
        key: 2,
        title: '所在地',
        value:
          modifyInfoData &&
          `${modifyInfoData.provinceName || ''}-${modifyInfoData.cityName ||
            ''}-${modifyInfoData.districtName || ''}`,
      },
      {
        key: 3,
        title: '详细地址',
        value: modifyInfoData && modifyInfoData.address,
      },
      {
        key: 4,
        title: '开发商',
        value: modifyInfoData && modifyInfoData.developer,
      },
      {
        key: 5,
        title: '车位编号',
        value: modifyInfoData && modifyInfoData.parkingNo,
      },
      {
        key: 6,
        title: '购买价款',
        value: modifyInfoData && `${modifyInfoData.parkingPriceStr}元`,
      },
    ];
    // 认购信息
    const buyInfo = [
      {
        key: 0,
        title: '支付订单号',
        value: modifyInfoData && modifyInfoData.orderNo,
      },
      {
        key: 1,
        title: '车位用途',
        value: modifyInfoData && modifyInfoData.useTypeStr,
      },
      {
        key: 2,
        title: '购买人',
        value: modifyInfoData && modifyInfoData.buyerName,
      },
      // {
      //   key: 3,
      //   title: '会员级别',
      //   value: modifyInfoData && modifyInfoData.buyerLevel,
      // },
      {
        key: 4,
        title: '推荐人',
        value: modifyInfoData && modifyInfoData.spreadsUserName,
      },
      {
        key: 5,
        title: '渠道',
        value: modifyInfoData && modifyInfoData.utmName,
      },
      // {
      //   key: 5,
      //   title: '实际支付',
      //   value: modifyInfoData && modifyInfoData.buyerPaymentStr + '元',
      // },
      modifyInfoData &&
        modifyInfoData.useType == 1 && {
          key: 8,
          title: '履约保证金',
          value: modifyInfoData && `${modifyInfoData.bondStr}元`,
        },
      modifyInfoData &&
        modifyInfoData.useType == 1 && {
          key: 9,
          title: '代买服务费',
          value: modifyInfoData && `${modifyInfoData.serviceChargeStr}元`,
        },
      modifyInfoData &&
        modifyInfoData.useType == 1 && {
          key: 10,
          title: '车位价格',
          value: modifyInfoData && `${modifyInfoData.wholesalePriceStr}元`,
        },
      {
        key: 11,
        title: '实际支付',
        value: modifyInfoData && `${modifyInfoData.buyerPaymentStr}元`,
      },
      {
        key: 6,
        title: '服务保障',
        value: modifyInfoData && modifyInfoData.returnAnytimeStr,
      },
      {
        key: 7,
        title: '购买时间',
        value: modifyInfoData && modifyInfoData.buyTime,
      },
    ];
    // 持有信息
    const holdInfo = [
      {
        key: 0,
        title: '车位订单号',
        value: modifyInfoData && modifyInfoData.parkingOrderNo,
      },
      {
        key: 1,
        title: '当前持有人',
        value: modifyInfoData && modifyInfoData.holderName,
      },
      // modifyInfoData &&
      //   modifyInfoData.holdBankName &&
      //   modifyInfoData.holdBankName.length > 0 && {
      //     key: 2,
      //     title: '所属银行',
      //     value: modifyInfoData && modifyInfoData.holdBankName,
      //   },
      // modifyInfoData &&
      //   modifyInfoData.holdBankCard &&
      //   modifyInfoData.holdBankCard.length > 0 && {
      //     key: 3,
      //     title: '绑定银行卡',
      //     value: modifyInfoData && modifyInfoData.holdBankCard,
      //   },
      // {
      //   key: 4,
      //   title: '会员级别',
      //   value: modifyInfoData && modifyInfoData.holderLevel,
      // },
      {
        key: 2,
        title: '推荐人',
        value: modifyInfoData && modifyInfoData.holderSpreadsUserName,
      },
      {
        key: 3,
        title: '渠道',
        value: modifyInfoData && modifyInfoData.holderUtmName,
      },
      {
        key: 4,
        title: '实际支付',
        // value: modifyInfoData && formatNumber(modifyInfoData.buyerPayment - modifyInfoData.buyerReturnAnyTimePrice) + '元'
        value: modifyInfoData && `${modifyInfoData.holderPaymentStr}元`,
      },
      {
        key: 5,
        title: '购买时间',
        value: modifyInfoData && modifyInfoData.holdTime,
      },
    ];
    // 退货信息
    const backInfo = [
      {
        key: 0,
        title: '车位用途',
        value: modifyInfoData && modifyInfoData.returnUseTypeStr,
      },
      {
        key: 1,
        title: '退货人',
        value: modifyInfoData && modifyInfoData.returnName,
      },
      // modifyInfoData &&
      //   modifyInfoData.returnBankCard &&
      //   modifyInfoData.returnBankCard.length > 0 && {
      //     key: 1,
      //     title: '退货人银行卡号',
      //     value: modifyInfoData && modifyInfoData.returnBankCard,
      //   },
      // modifyInfoData &&
      //   modifyInfoData.returnBankName &&
      //   modifyInfoData.returnBankName.length > 0 && {
      //     key: 2,
      //     title: '所属银行',
      //     value: modifyInfoData && modifyInfoData.returnBankName,
      //   },
      {
        key: 2,
        title: '推荐人',
        value: modifyInfoData && modifyInfoData.returnSpreadsUserName,
      },
      {
        key: 3,
        title: '渠道',
        value: modifyInfoData && modifyInfoData.returnUtmName,
      },
      {
        key: 4,
        title: '申请退款',
        value: modifyInfoData && `${modifyInfoData.returnBuybackPriceStr}元`,
      },
      modifyInfoData &&
        modifyInfoData.returnUseType == 0 && {
          key: 5,
          title: '当期租金',
          value: modifyInfoData && `${modifyInfoData.returnCurrentRentStr}元`,
        },
      {
        key: 6,
        title: '提前退货违约金比例',
        value: modifyInfoData && `${modifyInfoData.breachRate}%`,
      },
      {
        key: 7,
        title: '提前退货违约金',
        value: modifyInfoData && `${modifyInfoData.returnServiceFeeStr}元`,
      },
      {
        key: 8,
        title: '到账金额',
        value: modifyInfoData && `${modifyInfoData.returnPaidInStr}元`,
      },
      {
        key: 9,
        title: '申请退货时间',
        value: modifyInfoData && modifyInfoData.commitTime,
      },
      {
        key: 10,
        title: '财务审核',
        value: modifyInfoData && modifyInfoData.returnOrderStatusStr,
      },
      {
        key: 11,
        title: '备注',
        value: modifyInfoData && modifyInfoData.returnRemark,
      },
    ];
    // 出售信息
    const purchaseInfo = [
      {
        key: 0,
        title: '购买人',
        value: modifyInfoData && modifyInfoData.soldName,
      },
      {
        key: 1,
        title: '零售价格',
        value: modifyInfoData && `${modifyInfoData.soldPriceStr}元`,
      },
      {
        key: 2,
        title: '身份证号',
        value: modifyInfoData && modifyInfoData.soldCertNo,
      },

      {
        key: 3,
        title: '持有人',
        value: modifyInfoData && modifyInfoData.holderName,
      },
      // modifyInfoData &&
      //   modifyInfoData.holdBankCard &&
      //   modifyInfoData.holdBankCard.length > 0 && {
      //     key: 3,
      //     title: '持有人银行卡号',
      //     value: modifyInfoData && modifyInfoData.holdBankCard,
      //   },
      // modifyInfoData &&
      //   modifyInfoData.holdBankName &&
      //   modifyInfoData.holdBankName.length > 0 && {
      //     key: 4,
      //     title: '所属银行',
      //     value: modifyInfoData && modifyInfoData.holdBankName,
      //   },
      {
        key: 5,
        title: '返还销售本金',
        value:
          modifyInfoData && modifyInfoData.returnSalesPriceStr != null
            ? modifyInfoData.returnSalesPriceStr + '元'
            : null,
      },
      {
        key: 4,
        title: '提交人',
        value: modifyInfoData && modifyInfoData.soldCommit,
      },
    ];
    // console.log(modifyInfoData,"modifyInfoData")
    return (
      <Fragment>
        <Card>
          <h2 style={{ fontWeight: 'bold' }}>车位出售审核</h2>
          <Form>
            <Row gutter={24}>
              <Col span={24}>
                {modifyInfoData.parkingInfoShow == 1 ? (
                  <Row gutter={24}>
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}>
                      车位信息
                    </Divider>
                    {carInfo.map(
                      item =>
                        item && (
                          <Col span={12} key={item.key}>
                            <FormItem label={item.title} {...formItemLayout}>
                              <span style={{ display: 'inline-block' }}>{item.value}</span>
                            </FormItem>
                          </Col>
                        )
                    )}
                  </Row>
                ) : null}
                {modifyInfoData.buyInfoShow == 1 ? (
                  <Row gutter={24}>
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}>
                      认购信息
                    </Divider>
                    {buyInfo.map(
                      item =>
                        item && (
                          <Col span={12} key={item.key}>
                            <FormItem label={item.title} {...formItemLayout}>
                              <span style={{ display: 'inline-block' }}>{item.value}</span>
                            </FormItem>
                          </Col>
                        )
                    )}
                  </Row>
                ) : null}
                {modifyInfoData.holdInfoShow == 1 ? (
                  <Row gutter={24}>
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}>
                      持有信息
                    </Divider>
                    {holdInfo.map(
                      item =>
                        item && (
                          <Col span={12} key={item.key}>
                            <FormItem label={item.title} {...formItemLayout}>
                              <span style={{ display: 'inline-block' }}>{item.value}</span>
                            </FormItem>
                          </Col>
                        )
                    )}
                  </Row>
                ) : null}
                {modifyInfoData.returnInfoShow == 1 ? (
                  <Row gutter={24}>
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}>
                      退货信息
                    </Divider>
                    {backInfo.map(
                      item =>
                        item && (
                          <Col span={12} key={item.key}>
                            <FormItem label={item.title} {...formItemLayout}>
                              <span style={{ display: 'inline-block' }}>{item.value}</span>
                            </FormItem>
                          </Col>
                        )
                    )}
                  </Row>
                ) : null}
                {modifyInfoData.soldInfoShow == 1 ? (
                  <Fragment>
                    <Row gutter={24}>
                      <Divider orientation="left" style={{ fontWeight: 'bold' }}>
                        出售信息
                      </Divider>
                      {purchaseInfo.map(
                        item =>
                          item && (
                            <Col span={12} key={item.key}>
                              <FormItem label={item.title} {...formItemLayout}>
                                <span style={{ display: 'inline-block' }}>{item.value}</span>
                              </FormItem>
                            </Col>
                          )
                      )}
                    </Row>
                    <Row>
                      {Object.keys(modifyInfoData).length ? (
                        <FormItem label="打款凭证" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                          <Upload
                            disabled
                            uploadConfig={{
                              action: '',
                              fileType: [],
                              size: 3,
                            }}
                            defaultUrl={modifyInfoData.receiptPictureAr}
                            multiplePicture
                          />
                        </FormItem>
                      ) : null}
                      {Object.keys(modifyInfoData).length ? (
                        <FormItem label="购买合同" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                          <Upload
                            disabled
                            uploadConfig={{
                              action: '',
                              fileType: [],
                              size: 3,
                            }}
                            defaultUrl={modifyInfoData.contractPictureAr}
                            multiplePicture
                          />
                        </FormItem>
                      ) : null}
                      {Object.keys(modifyInfoData).length ? (
                        <FormItem label="相关材料" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                          <Upload
                            disabled
                            uploadConfig={{
                              action: '',
                              fileType: [],
                              size: 3,
                            }}
                            defaultUrl={modifyInfoData.soldOther}
                            multiplePicture
                          />
                        </FormItem>
                      ) : null}
                    </Row>
                  </Fragment>
                ) : null}
              </Col>
              <Col span={24}>
                <Fragment>
                  <Row gutter={24}>
                    {type !== 'audit' && type !== 'operateAudit'  ? (
                      <FormItem label="运营审核" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        {getFieldDecorator('auditStatus', {
                          // 审核通过发放成功 4， 审核通过发放失败 5
                          initialValue:
                            modifyInfoData &&
                            modifyInfoData.operateAuditStatus,
                        })(
                          <RadioGroup disabled>
                            <Radio value={1}>审核成功</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    ) : null}
                    {type !== 'audit' && type !== 'operateAudit'  ? (
                      <FormItem label="财务审核" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        {getFieldDecorator('auditStatus', {
                          // 审核通过发放成功 4， 审核通过发放失败 5
                          initialValue:
                            modifyInfoData &&
                            modifyInfoData.soldType &&
                            (modifyInfoData.soldType == 4 || modifyInfoData.soldType == 5)
                              ? 2
                              : modifyInfoData.soldType,
                          // 2,4,5 都可以审核，传给后台传2
                          // initialValue: modifyInfoData && modifyInfoData.soldType && (modifyInfoData.soldType == 1 || modifyInfoData.soldType == 5) ? 2 : modifyInfoData.soldType,
                        })(
                          <RadioGroup disabled>
                            <Radio value={2}>审核通过</Radio>
                            <Radio value={3}>审核不通过</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    ) : null}
                    {type !== 'audit' && type !== 'operateAudit' && Object.keys(modifyInfoData).length ? (
                      <FormItem label="相关材料" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <Upload
                          disabled
                          uploadConfig={{
                            action: '',
                            fileType: [],
                            size: 3,
                          }}
                          defaultUrl={modifyInfoData.soldData}
                          multiplePicture
                        />
                      </FormItem>
                    ) : null}
                    {type !== 'audit' && type !== 'operateAudit' ? (
                      <FormItem label="备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        {getFieldDecorator('soldRemark', {
                          initialValue: modifyInfoData && modifyInfoData.soldRemark,
                        })(<TextArea disabled />)}
                      </FormItem>
                    ) : null}
                    <Row span={24}>
                      <Col span={12}>
                        {type === 'audit' ? (
                          <>
                            <FormItem label="财务审核" {...formItemLayout}>
                              {getFieldDecorator('auditStatus', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请选择是否审核通过',
                                  },
                                ],
                              })(
                                <RadioGroup>
                                  <Radio value={2}>审核通过</Radio>
                                  {modifyInfoData &&
                                    modifyInfoData.soldAuditShow === 1 && (
                                      <Radio value={3}>审核不通过</Radio>
                                    )}
                                </RadioGroup>
                              )}
                            </FormItem>
                            <FormItem label="相关材料" {...formItemLayout}>
                              {getFieldDecorator('auditPictureAr', {
                                // rules: [{ required: true, message: '请上传相关材料' }],
                              })(
                                <Upload
                                  uploadConfig={{
                                    action: `${_baseApi}/parkingConsultant/upload`,
                                    fileType: ['image'],
                                    size: 3,
                                    maxFileList: 3,
                                  }}
                                  multiplePicture
                                  setIconUrl={(url, type) => {
                                    const auditPictureAr = this.props.form.getFieldValue(
                                      'auditPictureAr'
                                    );
                                    if (type !== 'remove') {
                                      // 照片添加的逻辑
                                      if (!auditPictureAr || !auditPictureAr[0]) {
                                        this.props.form.setFieldsValue({ auditPictureAr: [url] });
                                      } else {
                                        this.props.form.setFieldsValue({
                                          auditPictureAr: auditPictureAr.concat([url]),
                                        });
                                      }
                                    } else {
                                      // 照片删除的逻辑
                                      const resArr = [];
                                      auditPictureAr.forEach(item => {
                                        if (item !== url) resArr.push(item);
                                      });
                                      this.props.form.setFieldsValue({ auditPictureAr: resArr });
                                    }
                                  }}
                                  defaultUrl={modifyInfoData.auditPictureAr}
                                >
                                  {this.state.fileList.length &&
                                  this.state.fileList[0].response &&
                                  this.state.fileList[0].response.status == '99' ? (
                                    <span style={{ color: 'red', marginLeft: '5px' }}>
                                      {this.state.fileList[0].response.statusDesc}
                                    </span>
                                  ) : null}
                                </Upload>
                              )}
                            </FormItem>
                            <FormItem label="备注" {...formItemLayout}>
                              {getFieldDecorator('remark', {
                                initialValue: modifyInfoData && modifyInfoData.soldRemark,
                              })(<TextArea maxLength={100} />)}
                            </FormItem>
                          </>
                        ) : null}
                      </Col>
                    </Row>
                    <Row span={24}>
                      <Col span={12}>
                        {type === 'operateAudit' ? (
                          <>
                            <FormItem label="运营审核" {...formItemLayout}>
                              {getFieldDecorator('operateAuditStatus', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请选择是否审核通过',
                                  },
                                ],
                              })(
                                <RadioGroup>
                                  <Radio value={1}>审核通过</Radio>
                                </RadioGroup>
                              )}
                            </FormItem>
                          </>
                        ) : null}
                      </Col>
                    </Row>
                    <FormItem wrapperCol={{ offset: 8, span: 16 }}>
                      {type === 'audit' ? (
                        <Button
                          loading={!!this.props.submitLoading}
                          style={{ marginRight: 50 }}
                          type="primary"
                          onClick={e => this.handleSubmit(e)}
                        >
                          提交审核
                        </Button>
                      ) : null}
                      {type === 'operateAudit' ? (
                        <Button
                          loading={!!this.props.submitLoading}
                          style={{ marginRight: 50 }}
                          type="primary"
                          onClick={e => this.handleSubmitOperate(e)}
                        >
                          提交审核
                        </Button>
                      ) : null}
                      <Button type="primary" onClick={() => router.goBack()}>
                        返回
                      </Button>
                    </FormItem>
                  </Row>
                </Fragment>
              </Col>
              {/*<Col offset={2} span={8}>*/}
              {/*  <Timeline pending={<a href="#" />} mode="left">*/}
              {/*    {Object.keys(timeLineInfo).length &&*/}
              {/*      timeLineInfo.map(item => (*/}
              {/*        item && <Timeline.Item key={item.id}>*/}
              {/*          <p>{item.createTime}</p>*/}
              {/*          <p>*/}
              {/*            {item.logTypeStr}*/}
              {/*            {item.returnAnytime == 1 ? (*/}
              {/*              <span className={styles.circle}>退</span>*/}
              {/*            ) : null}*/}
              {/*          </p>*/}
              {/*          /!* logType 8 审核成功， 10 审核失败*!/*/}
              {/*          {item.logType == 8 || item.logType == 10 ? (*/}
              {/*            <p>{item.createByName}</p>*/}
              {/*          ) : (*/}
              {/*            <p>{item.userName}</p>*/}
              {/*          )}*/}
              {/*          /!* 退货失败和出售失败不需要展示金额 *!/*/}
              {/*          {item.logType !== 10 && item.logType !== 11 && <p>{item.priceStr}</p>}*/}
              {/*          /!* 退货失败和出售失败展示失败原因 *!/*/}
              {/*          {(item.logType == 10 || item.logType == 11) && <p>{item.remark}</p>}*/}
              {/*        </Timeline.Item>*/}
              {/*      ))}*/}
              {/*  </Timeline>*/}
              {/*</Col>*/}
            </Row>
          </Form>
        </Card>

        <ModifyForm
          isShow={this.state.isModalShow === 1}
          modalJson={this.state.modalJson}
          modalType="2"
          callback={() => {
            this.setState({ isModalShow: 0 });
            router.goBack();
          }}
        />
      </Fragment>
    );
  }
}

export default ParkingDetail;
