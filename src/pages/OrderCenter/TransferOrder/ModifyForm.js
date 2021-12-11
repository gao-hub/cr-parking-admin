import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ orderManage, loading }) => ({
  orderManage,
  submitLoading: loading.effects['orderManage/modifyManage']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'orderManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, orderManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        let res
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'orderManage/modifyManage',
            payload: {
              ...values,
              id: this.props.orderManage.modifyInfoData.id,
            }
          })
        } else {
          res = await dispatch({
            type: 'orderManage/addManage',
            payload: values
          })
        }
        if (res && res.status === 1) {
          this.changeVisible(false)
          message.success(res.statusDesc)
          this.props.getList(this.props.currPage, this.props.pageSize)
        } else message.error(res.statusDesc)
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const { form: { getFieldDecorator }, orderManage: { modifyInfoData } } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem
            label="自增id"
            {...formConfig}
          >
            {getFieldDecorator('id', {
              rules: [{ required: true, message: '请输入自增id' }],
              initialValue: modifyInfoData && modifyInfoData.id
            })(
              <Input placeholder={'请输入自增id'} />
            )}
          </FormItem>
          <FormItem
            label="订单类型(1：支付订单，2：转让订单，3：退货订单)"
            {...formConfig}
          >
            {getFieldDecorator('orderType', {
              rules: [{ required: true, message: '请输入订单类型(1：支付订单，2：转让订单，3：退货订单)' }],
              initialValue: modifyInfoData && modifyInfoData.orderType
            })(
              <Input placeholder={'请输入订单类型(1：支付订单，2：转让订单，3：退货订单)'} />
            )}
          </FormItem>
          <FormItem
            label="订单号(转让订单号，回购订单号)"
            {...formConfig}
          >
            {getFieldDecorator('orderNo', {
              rules: [{ required: true, message: '请输入订单号(转让订单号，回购订单号)' }],
              initialValue: modifyInfoData && modifyInfoData.orderNo
            })(
              <Input placeholder={'请输入订单号(转让订单号，回购订单号)'} />
            )}
          </FormItem>
          <FormItem
            label="车位订单号(转让订单&退货订单不为空)"
            {...formConfig}
          >
            {getFieldDecorator('parkingOrderNo', {
              rules: [{ required: true, message: '请输入车位订单号(转让订单&退货订单不为空)' }],
              initialValue: modifyInfoData && modifyInfoData.parkingOrderNo
            })(
              <Input placeholder={'请输入车位订单号(转让订单&退货订单不为空)'} />
            )}
          </FormItem>
          <FormItem
            label="通联返回订单号(流水号)"
            {...formConfig}
          >
            {getFieldDecorator('tlOrderNo', {
              rules: [{ required: true, message: '请输入通联返回订单号(流水号)' }],
              initialValue: modifyInfoData && modifyInfoData.tlOrderNo
            })(
              <Input placeholder={'请输入通联返回订单号(流水号)'} />
            )}
          </FormItem>
          <FormItem
            label="销售类型(1:包销，2:销售)"
            {...formConfig}
          >
            {getFieldDecorator('salesType', {
              rules: [{ required: true, message: '请输入销售类型(1:包销，2:销售)' }],
              initialValue: modifyInfoData && modifyInfoData.salesType
            })(
              <Input placeholder={'请输入销售类型(1:包销，2:销售)'} />
            )}
          </FormItem>
          <FormItem
            label="购买人用户ID"
            {...formConfig}
          >
            {getFieldDecorator('buyerId', {
              rules: [{ required: true, message: '请输入购买人用户ID' }],
              initialValue: modifyInfoData && modifyInfoData.buyerId
            })(
              <Input placeholder={'请输入购买人用户ID'} />
            )}
          </FormItem>
          <FormItem
            label="购买人用户名"
            {...formConfig}
          >
            {getFieldDecorator('buyerName', {
              rules: [{ required: true, message: '请输入购买人用户名' }],
              initialValue: modifyInfoData && modifyInfoData.buyerName
            })(
              <Input placeholder={'请输入购买人用户名'} />
            )}
          </FormItem>
          <FormItem
            label="购买人角色"
            {...formConfig}
          >
            {getFieldDecorator('buyerRole', {
              rules: [{ required: true, message: '请输入购买人角色' }],
              initialValue: modifyInfoData && modifyInfoData.buyerRole
            })(
              <Input placeholder={'请输入购买人角色'} />
            )}
          </FormItem>
          <FormItem
            label="楼盘id"
            {...formConfig}
          >
            {getFieldDecorator('buildingId', {
              rules: [{ required: true, message: '请输入楼盘id' }],
              initialValue: modifyInfoData && modifyInfoData.buildingId
            })(
              <Input placeholder={'请输入楼盘id'} />
            )}
          </FormItem>
          <FormItem
            label="楼盘名称"
            {...formConfig}
          >
            {getFieldDecorator('buildingName', {
              rules: [{ required: true, message: '请输入楼盘名称' }],
              initialValue: modifyInfoData && modifyInfoData.buildingName
            })(
              <Input placeholder={'请输入楼盘名称'} />
            )}
          </FormItem>
          <FormItem
            label="楼盘所在省代码"
            {...formConfig}
          >
            {getFieldDecorator('provinceCode', {
              rules: [{ required: true, message: '请输入楼盘所在省代码' }],
              initialValue: modifyInfoData && modifyInfoData.provinceCode
            })(
              <Input placeholder={'请输入楼盘所在省代码'} />
            )}
          </FormItem>
          <FormItem
            label="楼盘所在省名称"
            {...formConfig}
          >
            {getFieldDecorator('provinceName', {
              rules: [{ required: true, message: '请输入楼盘所在省名称' }],
              initialValue: modifyInfoData && modifyInfoData.provinceName
            })(
              <Input placeholder={'请输入楼盘所在省名称'} />
            )}
          </FormItem>
          <FormItem
            label="楼盘所在市代码"
            {...formConfig}
          >
            {getFieldDecorator('cityCode', {
              rules: [{ required: true, message: '请输入楼盘所在市代码' }],
              initialValue: modifyInfoData && modifyInfoData.cityCode
            })(
              <Input placeholder={'请输入楼盘所在市代码'} />
            )}
          </FormItem>
          <FormItem
            label="楼盘所在市名称"
            {...formConfig}
          >
            {getFieldDecorator('cityName', {
              rules: [{ required: true, message: '请输入楼盘所在市名称' }],
              initialValue: modifyInfoData && modifyInfoData.cityName
            })(
              <Input placeholder={'请输入楼盘所在市名称'} />
            )}
          </FormItem>
          <FormItem
            label="楼盘所在区代码"
            {...formConfig}
          >
            {getFieldDecorator('districtCode', {
              rules: [{ required: true, message: '请输入楼盘所在区代码' }],
              initialValue: modifyInfoData && modifyInfoData.districtCode
            })(
              <Input placeholder={'请输入楼盘所在区代码'} />
            )}
          </FormItem>
          <FormItem
            label="楼盘所在区名称"
            {...formConfig}
          >
            {getFieldDecorator('districtName', {
              rules: [{ required: true, message: '请输入楼盘所在区名称' }],
              initialValue: modifyInfoData && modifyInfoData.districtName
            })(
              <Input placeholder={'请输入楼盘所在区名称'} />
            )}
          </FormItem>
          <FormItem
            label="开发商id"
            {...formConfig}
          >
            {getFieldDecorator('developerId', {
              rules: [{ required: true, message: '请输入开发商id' }],
              initialValue: modifyInfoData && modifyInfoData.developerId
            })(
              <Input placeholder={'请输入开发商id'} />
            )}
          </FormItem>
          <FormItem
            label="开发商名称"
            {...formConfig}
          >
            {getFieldDecorator('developerName', {
              rules: [{ required: true, message: '请输入开发商名称' }],
              initialValue: modifyInfoData && modifyInfoData.developerName
            })(
              <Input placeholder={'请输入开发商名称'} />
            )}
          </FormItem>
          <FormItem
            label="订单车位数"
            {...formConfig}
          >
            {getFieldDecorator('orderParkingNum', {
              rules: [{ required: true, message: '请输入订单车位数' }],
              initialValue: modifyInfoData && modifyInfoData.orderParkingNum
            })(
              <Input placeholder={'请输入订单车位数'} />
            )}
          </FormItem>
          <FormItem
            label="支付订单-支付金额"
            {...formConfig}
          >
            {getFieldDecorator('payment', {
              rules: [{ required: true, message: '请输入支付订单-支付金额' }],
              initialValue: modifyInfoData && modifyInfoData.payment
            })(
              <Input placeholder={'请输入支付订单-支付金额'} />
            )}
          </FormItem>
          <FormItem
            label="楼盘类型(保留字段)"
            {...formConfig}
          >
            {getFieldDecorator('buildingType', {
              rules: [{ required: true, message: '请输入楼盘类型(保留字段)' }],
              initialValue: modifyInfoData && modifyInfoData.buildingType
            })(
              <Input placeholder={'请输入楼盘类型(保留字段)'} />
            )}
          </FormItem>
          <FormItem
            label="优惠类型"
            {...formConfig}
          >
            {getFieldDecorator('preferenceType', {
              rules: [{ required: true, message: '请输入优惠类型' }],
              initialValue: modifyInfoData && modifyInfoData.preferenceType
            })(
              <Input placeholder={'请输入优惠类型'} />
            )}
          </FormItem>
          <FormItem
            label="是否满一年：0否，1是"
            {...formConfig}
          >
            {getFieldDecorator('oneYear', {
              rules: [{ required: true, message: '请输入是否满一年：0否，1是' }],
              initialValue: modifyInfoData && modifyInfoData.oneYear
            })(
              <Input placeholder={'请输入是否满一年：0否，1是'} />
            )}
          </FormItem>
          <FormItem
            label="租金费率ID"
            {...formConfig}
          >
            {getFieldDecorator('rentId', {
              rules: [{ required: true, message: '请输入租金费率ID' }],
              initialValue: modifyInfoData && modifyInfoData.rentId
            })(
              <Input placeholder={'请输入租金费率ID'} />
            )}
          </FormItem>
          <FormItem
            label="销售顾问"
            {...formConfig}
          >
            {getFieldDecorator('consultant', {
              rules: [{ required: true, message: '请输入销售顾问' }],
              initialValue: modifyInfoData && modifyInfoData.consultant
            })(
              <Input placeholder={'请输入销售顾问'} />
            )}
          </FormItem>
          <FormItem
            label="订单状态-支付订单：(10-待支付，11-支付成功，12-支付失败，13-已过期),转让(2开头)，退货(3开头)待定"
            {...formConfig}
          >
            {getFieldDecorator('orderStatus', {
              rules: [{ required: true, message: '请输入订单状态-支付订单：(10-待支付，11-支付成功，12-支付失败，13-已过期),转让(2开头)，退货(3开头)待定' }],
              initialValue: modifyInfoData && modifyInfoData.orderStatus
            })(
              <Input placeholder={'请输入订单状态-支付订单：(10-待支付，11-支付成功，12-支付失败，13-已过期),转让(2开头)，退货(3开头)待定'} />
            )}
          </FormItem>
          <FormItem
            label="订单完成时间"
            {...formConfig}
          >
            {getFieldDecorator('finishTime', {
              rules: [{ required: true, message: '请输入订单完成时间' }],
              initialValue: modifyInfoData && modifyInfoData.finishTime
            })(
              <Input placeholder={'请输入订单完成时间'} />
            )}
          </FormItem>
          <FormItem
            label="(转让订单)-转让人用户ID"
            {...formConfig}
          >
            {getFieldDecorator('transferId', {
              rules: [{ required: true, message: '请输入(转让订单)-转让人用户ID' }],
              initialValue: modifyInfoData && modifyInfoData.transferId
            })(
              <Input placeholder={'请输入(转让订单)-转让人用户ID'} />
            )}
          </FormItem>
          <FormItem
            label="(转让订单)-转让人用户名"
            {...formConfig}
          >
            {getFieldDecorator('transferName', {
              rules: [{ required: true, message: '请输入(转让订单)-转让人用户名' }],
              initialValue: modifyInfoData && modifyInfoData.transferName
            })(
              <Input placeholder={'请输入(转让订单)-转让人用户名'} />
            )}
          </FormItem>
          <FormItem
            label="(转让订单，退货订单)-车位ID"
            {...formConfig}
          >
            {getFieldDecorator('parkingId', {
              rules: [{ required: true, message: '请输入(转让订单，退货订单)-车位ID' }],
              initialValue: modifyInfoData && modifyInfoData.parkingId
            })(
              <Input placeholder={'请输入(转让订单，退货订单)-车位ID'} />
            )}
          </FormItem>
          <FormItem
            label="(转让订单，退货订单)-车位号"
            {...formConfig}
          >
            {getFieldDecorator('parkingNo', {
              rules: [{ required: true, message: '请输入(转让订单，退货订单)-车位号' }],
              initialValue: modifyInfoData && modifyInfoData.parkingNo
            })(
              <Input placeholder={'请输入(转让订单，退货订单)-车位号'} />
            )}
          </FormItem>
          <FormItem
            label="(转让订单)-转让价格"
            {...formConfig}
          >
            {getFieldDecorator('transferPrice', {
              rules: [{ required: true, message: '请输入(转让订单)-转让价格' }],
              initialValue: modifyInfoData && modifyInfoData.transferPrice
            })(
              <Input placeholder={'请输入(转让订单)-转让价格'} />
            )}
          </FormItem>
          <FormItem
            label="(转让订单)-剩余天数"
            {...formConfig}
          >
            {getFieldDecorator('remainingDays', {
              rules: [{ required: true, message: '请输入(转让订单)-剩余天数' }],
              initialValue: modifyInfoData && modifyInfoData.remainingDays
            })(
              <Input placeholder={'请输入(转让订单)-剩余天数'} />
            )}
          </FormItem>
          <FormItem
            label="(转让订单)-服务费"
            {...formConfig}
          >
            {getFieldDecorator('transferServiceFee', {
              rules: [{ required: true, message: '请输入(转让订单)-服务费' }],
              initialValue: modifyInfoData && modifyInfoData.transferServiceFee
            })(
              <Input placeholder={'请输入(转让订单)-服务费'} />
            )}
          </FormItem>
          <FormItem
            label="(转让订单)-实际到账"
            {...formConfig}
          >
            {getFieldDecorator('transferPaidIn', {
              rules: [{ required: true, message: '请输入(转让订单)-实际到账' }],
              initialValue: modifyInfoData && modifyInfoData.transferPaidIn
            })(
              <Input placeholder={'请输入(转让订单)-实际到账'} />
            )}
          </FormItem>
          <FormItem
            label="(退货订单)-车位价格"
            {...formConfig}
          >
            {getFieldDecorator('parkingPrice', {
              rules: [{ required: true, message: '请输入(退货订单)-车位价格' }],
              initialValue: modifyInfoData && modifyInfoData.parkingPrice
            })(
              <Input placeholder={'请输入(退货订单)-车位价格'} />
            )}
          </FormItem>
          <FormItem
            label="(退货订单)-回购价格"
            {...formConfig}
          >
            {getFieldDecorator('buybackPrice', {
              rules: [{ required: true, message: '请输入(退货订单)-回购价格' }],
              initialValue: modifyInfoData && modifyInfoData.buybackPrice
            })(
              <Input placeholder={'请输入(退货订单)-回购价格'} />
            )}
          </FormItem>
          <FormItem
            label="(退货订单)-当期租金"
            {...formConfig}
          >
            {getFieldDecorator('currentRent', {
              rules: [{ required: true, message: '请输入(退货订单)-当期租金' }],
              initialValue: modifyInfoData && modifyInfoData.currentRent
            })(
              <Input placeholder={'请输入(退货订单)-当期租金'} />
            )}
          </FormItem>
          <FormItem
            label="(退货订单)-服务费"
            {...formConfig}
          >
            {getFieldDecorator('buybackServiceFee', {
              rules: [{ required: true, message: '请输入(退货订单)-服务费' }],
              initialValue: modifyInfoData && modifyInfoData.buybackServiceFee
            })(
              <Input placeholder={'请输入(退货订单)-服务费'} />
            )}
          </FormItem>
          <FormItem
            label="(退货订单)-实际到账"
            {...formConfig}
          >
            {getFieldDecorator('buybackPaidIn', {
              rules: [{ required: true, message: '请输入(退货订单)-实际到账' }],
              initialValue: modifyInfoData && modifyInfoData.buybackPaidIn
            })(
              <Input placeholder={'请输入(退货订单)-实际到账'} />
            )}
          </FormItem>
          <FormItem
            label="创建人ID"
            {...formConfig}
          >
            {getFieldDecorator('createBy', {
              rules: [{ required: true, message: '请输入创建人ID' }],
              initialValue: modifyInfoData && modifyInfoData.createBy
            })(
              <Input placeholder={'请输入创建人ID'} />
            )}
          </FormItem>
          <FormItem
            label="创建时间"
            {...formConfig}
          >
            {getFieldDecorator('createTime', {
              rules: [{ required: true, message: '请输入创建时间' }],
              initialValue: modifyInfoData && modifyInfoData.createTime
            })(
              <Input placeholder={'请输入创建时间'} />
            )}
          </FormItem>
          <FormItem
            label="更新人ID"
            {...formConfig}
          >
            {getFieldDecorator('updateBy', {
              rules: [{ required: true, message: '请输入更新人ID' }],
              initialValue: modifyInfoData && modifyInfoData.updateBy
            })(
              <Input placeholder={'请输入更新人ID'} />
            )}
          </FormItem>
          <FormItem
            label="更新时间"
            {...formConfig}
          >
            {getFieldDecorator('updateTime', {
              rules: [{ required: true, message: '请输入更新时间' }],
              initialValue: modifyInfoData && modifyInfoData.updateTime
            })(
              <Input placeholder={'请输入更新时间'} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
