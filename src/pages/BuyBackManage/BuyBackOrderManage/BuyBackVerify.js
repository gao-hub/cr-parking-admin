/* eslint-disable spaced-comment */
import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Divider, Card, Radio, Input, Button, message } from 'antd';
// import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import { queryURL } from '@/utils/utils';
import router from 'umi/router';
import ModifyForm from './ModifyForm';
// import styles from './styles.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
@connect(({ buybackOrderManage }) => ({
  buybackOrderManage,
}))
class BuyBackDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalShow: 0,
      modalJson: {},
    };
  }

  async componentDidMount() {
    const { dispatch, location = {} } = this.props;
    dispatch({
      type: 'buybackOrderManage/getModifyInfo',
      payload: {
        parkingOrderNo: queryURL(location.search).parkingOrderNo,
        parkingId: queryURL(location.search).parkingId,
      },
    });
    dispatch({
      type: 'buybackOrderManage/getTimeLine',
      payload: {
        parkingId: queryURL(location.search).parkingId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'buybackOrderManage/setInfo',
      payload: {},
    });
  }

  /**
   * @desc 提交审核
   */
  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch, buybackOrderManage = {}, form, location = {} } = this.props;
    const {
      modifyInfoData: { useType = '' },
    } = buybackOrderManage;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        // useType 0=>委托出租  1=>委托出售
        if (useType === 0) {
          const res = await dispatch({
            type: 'buybackOrderManage/verifyOperate',
            payload: {
              id: queryURL(location.search).id,
              ...values,
            },
          });

          if (res && res.status === 1) {
            message.success(res.statusDesc);
            router.push('/buyback/buybackorder');
          } else {
            message.error(res.statusDesc);
          }
        } else {
          this.setState({
            isModalShow: 1,
            modalJson: {
              ...values,
              id: queryURL(location.search).id,
            },
          });
        }
      }
    });
  };

  render() {
    const { form = {}, buybackOrderManage = {} } = this.props;
    const { isModalShow = 0, modalJson = {} } = this.state;
    const { modifyInfoData } = buybackOrderManage;
    const { getFieldDecorator } = form;
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
          `${modifyInfoData.provinceName}-${modifyInfoData.cityName}-${
            modifyInfoData.districtName
          }`,
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
        value: modifyInfoData && `${modifyInfoData.buyerPaymentStr}元`,
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
      //   key: 2,
      //   title: '会员级别',
      //   value: modifyInfoData && modifyInfoData.buyerLevel,
      // },
      {
        key: 3,
        title: '推荐人',
        value: modifyInfoData && modifyInfoData.spreadsUserName,
      },
      {
        key: 4,
        title: '渠道',
        value: modifyInfoData && modifyInfoData.utmName,
      },

      modifyInfoData &&
        modifyInfoData.useType === 1 && {
          key: 5,
          title: '履约保证金',
          value: modifyInfoData && `${modifyInfoData.bondStr}元`,
        },
      modifyInfoData &&
        modifyInfoData.useType === 1 && {
          key: 6,
          title: '代买服务费',
          value: modifyInfoData && `${modifyInfoData.serviceChargeStr}元`,
        },
      modifyInfoData &&
        modifyInfoData.useType === 1 && {
          key: 7,
          title: '车位价格',
          value: modifyInfoData && `${modifyInfoData.wholesalePriceStr}元`,
        },
      {
        key: 8,
        title: '实际支付',
        value: modifyInfoData && `${modifyInfoData.buyerPaymentStr}元`,
      },
      {
        key: 9,
        title: '服务保障',
        value: modifyInfoData && modifyInfoData.returnAnytimeStr,
      },
      // {
      //   key: 7,
      //   title: '服务价格',
      //   value: modifyInfoData && modifyInfoData.buyerReturnAnyTimePriceStr + '元',
      // },
      {
        key: 10,
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
      // modifyInfoData &&
      //   modifyInfoData.holdBankName &&
      //   modifyInfoData.holdBankName.length > 0 && {
      //     key: 1,
      //     title: '所属银行',
      //     value: modifyInfoData && modifyInfoData.holdBankName,
      //   },
      // modifyInfoData &&
      //   modifyInfoData.holdBankCard &&
      //   modifyInfoData.holdBankCard.length > 0 && {
      //     key: 2,
      //     title: '绑定银行卡',
      //     value: modifyInfoData && modifyInfoData.holdBankCard,
      //   },
      {
        key: 1,
        title: '当前持有人',
        value: modifyInfoData && modifyInfoData.holderName,
      },
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
        value: modifyInfoData && `${modifyInfoData.holderPaymentStr}元`,
        // value: modifyInfoData && formatNumber(modifyInfoData.buyerPayment - modifyInfoData.buyerReturnAnyTimePrice) + '元'
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
      //     key: 2,
      //     title: '退货人银行卡号',
      //     value: modifyInfoData && modifyInfoData.returnBankCard,
      //   },
      // modifyInfoData &&
      //   modifyInfoData.returnBankName &&
      //   modifyInfoData.returnBankName.length > 0 && {
      //     key: 1,
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
        modifyInfoData.returnUseType === 0 && {
          key: 5,
          title: '当期租金',
          value: modifyInfoData && `${modifyInfoData.returnCurrentRentStr}元`,
        },
        modifyInfoData &&
        modifyInfoData.useType !== 2 && modifyInfoData.useType !== 3 && {
          
            key: 6,
            title: '提前退货违约金比例',
            value: modifyInfoData && `${modifyInfoData.breachRate}%`,
          
        },
        modifyInfoData &&
        modifyInfoData.useType !== 2 && modifyInfoData.useType !== 3 && {
          key: 7,
        title: '提前退货违约金',
        value: modifyInfoData && `${modifyInfoData.returnServiceFeeStr}元`,
        },
        modifyInfoData &&
        modifyInfoData.useType !== 2 && modifyInfoData.useType !== 3 && {
          key: 8,
          title: '到账金额',
          value: modifyInfoData && `${modifyInfoData.returnPaidInStr}元`,
        },
      {
        key: 9,
        title: '申请退货时间',
        value: modifyInfoData && modifyInfoData.commitTime,
      },
    ];
    return (
      <Fragment>
        <Card>
          <h2 style={{ fontWeight: 'bold' }}>退货审核</h2>
          <Form>
            <Row gutter={24}>
              <Col span={24}>
                {modifyInfoData.parkingInfoShow === 1 ? (
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
                {modifyInfoData.buyInfoShow === 1 ? (
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
                {modifyInfoData.holdInfoShow === 1 ? (
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
                {modifyInfoData.returnInfoShow === 1 ? (
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
                {modifyInfoData.returnOrderStatus === 30 ? (
                  <Row span={24}>
                    <Col span={12}>
                      <FormItem label="财务审核" {...formItemLayout}>
                        {getFieldDecorator('orderStatus', {
                          rules: [
                            {
                              required: true,
                              message: '请选择是否通过',
                            },
                          ],
                        })(
                          <RadioGroup onChange={this.onChange}>
                            <Radio value={31}>通过</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                      <FormItem label="备注" {...formItemLayout}>
                        {getFieldDecorator('remark')(<TextArea />)}
                      </FormItem>
                      <FormItem wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" onClick={e => this.handleSubmit(e)}>
                          提交
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                ) : null}
              </Col>
              {/*<Col offset={2} span={8}>*/}
              {/*  <Timeline pending={timeLineInfo.length == 1 ? <a href="#" /> : false} mode="left">*/}
              {/*    {Object.keys(timeLineInfo).length &&*/}
              {/*      timeLineInfo.map(item => (*/}
              {/*        item && <Timeline.Item key={item.id}>*/}
              {/*        <p>{item.createTime}</p>*/}
              {/*        <p>*/}
              {/*          {item.logTypeStr}*/}
              {/*          {item.returnAnytime == 1 ? (*/}
              {/*            <span className={styles.circle}>退</span>*/}
              {/*          ) : null}*/}
              {/*        </p>*/}
              {/*        /!* logType 8 审核成功， 10 审核失败*!/*/}
              {/*        {item.logType == 8 || item.logType == 10 ? (*/}
              {/*          <p>{item.createByName}</p>*/}
              {/*        ) : (*/}
              {/*          <p>{item.userName}</p>*/}
              {/*        )}*/}
              {/*        /!* 退货失败和出售失败不需要展示金额 *!/*/}
              {/*        {item.logType !== 10 && item.logType !== 11 && <p>{item.priceStr}</p>}*/}
              {/*        /!* 退货失败和出售失败展示失败原因 *!/*/}
              {/*        {(item.logType == 10 || item.logType == 11) && <p>{item.remark}</p>}*/}
              {/*        </Timeline.Item>*/}
              {/*      ))}*/}
              {/*  </Timeline>*/}
              {/*</Col>*/}
            </Row>
          </Form>
        </Card>

        <ModifyForm
          isShow={isModalShow === 1}
          modalJson={modalJson}
          useType={modifyInfoData.useType}
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

export default BuyBackDetail;
