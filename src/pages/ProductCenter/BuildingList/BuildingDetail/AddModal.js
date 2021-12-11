import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Select, Radio } from 'antd';
import { connect } from 'dva';
import { posRemain2 } from '@/utils/utils';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ buildingParkingManage, loading }) => ({
  buildingParkingManage,
  submitLoading: loading.effects['buildingParkingManage/modifyManage'],
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      fileList: [],
      infoData: {},
    };
  }
  changeVisible = visible => {
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, type, setDataList, dataSource } = this.props;
    const { idx } = this.state;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        // let res;

        // 如果该状态为新增操作，则直接操作数据
        const copyData = dataSource.slice();
        if (values && values.standardPrice) {
          const { infoData = {} } = this.state;
          const { standardRate = '', serviceRate = '', bondRate = '', sellRate = '' } = infoData;
          const standardPrice = values.standardPrice;
          const parkingLength = values.parkingLength;
          const parkingWidth = values.parkingWidth;
          // 标准版购买价款
          const basicSalePrice = values.basicSalePrice;
          // 标准版车位价格
          const basicPrice = values.basicPrice;
          // 保价版购买价款
          const buybackSalePrice = values.buybackSalePrice;
          // 保价版车位价格
          const buybackPrice = values.buybackPrice;

          values.wholesalePrice = parseInt((standardPrice * standardRate) / 100); //车位价格=购买价格*60%
          values.bond = parseInt((standardPrice * bondRate) / 100); //履约保证金=购买价格*20%
          values.serviceCharge = parseInt((standardPrice * serviceRate) / 100); //代买服务费=购买价格*60%
          values.retailPrice = parseInt((standardPrice * sellRate) / 100); //零售价款=购买价格*60%
          values.basicServiceFee = basicSalePrice - basicPrice; //标准版服务费 = 标准版购买价款 - 标准版车位价格
          values.buybackServiceFee = buybackSalePrice - buybackPrice; //保价版服务费 = 保价版购买价款 - 保价版车位价格
          if (parkingLength && parkingWidth) {
            values.parkingArea = (parkingLength * parkingWidth).toFixed(3);
            values.parkingArea = values.parkingArea.substring(0, values.parkingArea.length - 1);
          }
        }

        values['price'] = values['price'] ? values['price'] : 0;
        if (idx == null) {
          copyData.push({
            key: copyData.length,
            ...values,
          });
          setDataList(copyData);
          this.changeVisible(false);
        } else {
          copyData[idx] = { ...this.state.infoData, ...values };
          setDataList(copyData);
          this.changeVisible(false);
        }
        // if (type === 'add') {
        // } else {
        // 状态为edit，则每修改一条数据请求一次接口 之后再对表格进行操作
        // res = await dispatch({
        //   type: 'buildingParkingManage/modifyManage',
        //   payload: {
        //     ...values,
        //     // id: this.props.buildingParkingManage.infoData.id,
        //   }
        // })
        // if (res && res.status === 1) {
        //   copyData.push(values)
        //   setDataList(copyData)
        //   message.success(res.statusDesc)
        //   this.changeVisible(false)
        //   // this.props.getList(this.props.currPage, this.props.pageSize)
        // } else message.error(res.statusDesc)
        // }
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const {
      form: { getFieldDecorator },
      natureList,
    } = this.props;
    const { infoData } = this.state;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        title={'车位新增'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="车位编号" required {...formConfig}>
            {getFieldDecorator('parkingCode', {
              rules: [
                {
                  validator: (rule, val, cb) => {
                    if (val === null || val === '' || typeof val == 'undefined') {
                      cb('请输入车位编号');
                    } else if (
                      val.length > 6 ||
                      !val
                        .toString()
                        .replace(/(^\s*)|(\s*$)/g, '')
                        .match(/^[a-z\d\.\_\#\-]+$/i)
                    ) {
                      cb('应输入最多6位数字、英文字母或特殊字符');
                    } else cb();
                  },
                },
              ],
              initialValue: infoData && infoData.parkingCode,
            })(<Input maxLength={6} placeholder={'请输入车位编号'} />)}
          </FormItem>
          <FormItem label="车位类型" {...formConfig}>
            {getFieldDecorator('parkingType', {
              initialValue: infoData && infoData.parkingType,
            })(
              <Select allowClear>
                {natureList.map(item => {
                  return (
                    <Option key={item.title} value={item.title}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          {/* <FormItem
            label="车位面积"
            required
            {...formConfig}
          >
            {getFieldDecorator('parkingArea', {
              rules: [{
                validator: (rule, val, cb) => {
                  if (!val) {
                    cb('请输入车位面积')
                  } else if (!(val.toString()).match(posRemain2)) {
                    cb('请输入正确的车位面积')
                  } else cb()
                }
              }],
              initialValue: infoData && infoData.parkingArea
            })(
              <Input placeholder={'请输入车位面积'} />
            )}
          </FormItem> */}
          <FormItem
            {...formConfig}
            label={'车位图片'}
            extra={<span style={{ fontSize: '10px' }}>(注：仅可上传图片格式文件)</span>}
          >
            {getFieldDecorator('picture', {
              // rules: [{
              //   required: true,
              //   message: '请上传车位图片',
              // }],
              initialValue: infoData && infoData.picture,
            })(
              <Upload
                defaultUrl={infoData && infoData.picture}
                uploadConfig={{
                  action: `${_baseApi}/buildingParking/upload`,
                  fileType: ['image'],
                  size: 3,
                }}
                setIconUrl={url => this.props.form.setFieldsValue({ picture: url })}
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
          <FormItem
            {...formConfig}
            label={'产权证'}
            extra={<span style={{ fontSize: '10px' }}>(注：仅可上传图片格式文件)</span>}
          >
            {getFieldDecorator('certificates', {
              initialValue: infoData && infoData.certificates,
            })(
              <Upload
                defaultUrl={infoData && infoData.certificates}
                uploadConfig={{
                  action: `${_baseApi}/buildingParking/upload`,
                  fileType: ['image'],
                  size: 3,
                }}
                setIconUrl={url => this.props.form.setFieldsValue({ certificates: url })}
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
          <FormItem label="车位长" {...formConfig}>
            {getFieldDecorator('parkingLength', {
              initialValue: infoData && infoData.parkingLength,
            })(<Input placeholder={'请输入车位长'} addonAfter={'m'} maxLength={5} />)}
          </FormItem>
          <FormItem label="车位宽" {...formConfig}>
            {getFieldDecorator('parkingWidth', {
              initialValue: infoData && infoData.parkingWidth,
            })(<Input placeholder={'请输入车位宽'} addonAfter={'m'} maxLength={5} />)}
          </FormItem>
          <FormItem label="进货价格" required {...formConfig}>
            {getFieldDecorator('purchasePrice', {
              rules: [
                {
                  validator: (rule, val, cb) => {
                    if (val === null || val === '' || typeof val == 'undefined') {
                      cb('请输入进货价格');
                    } else if (!val.toString().match(posRemain2)) {
                      cb('请输入正确的价格');
                    } else cb();
                  },
                },
              ],
              initialValue: infoData && infoData.purchasePrice,
            })(<Input addonAfter={'元'} placeholder={'请输入进货价格'} />)}
          </FormItem>
          {/*<FormItem*/}
          {/*  label="开发商指导价"*/}
          {/*  required*/}
          {/*  {...formConfig}*/}
          {/*>*/}
          {/*  {getFieldDecorator('averagePrice', {*/}
          {/*    rules: [{*/}
          {/*      validator: (rule, val, cb) => {*/}
          {/*        if (!val) {*/}
          {/*          cb('请输入开发商指导价')*/}
          {/*        } else if (!(val.toString()).match(posRemain2)) {*/}
          {/*          cb('请输入正确的价格')*/}
          {/*        } else cb()*/}
          {/*      }*/}
          {/*    }],*/}
          {/*    initialValue: infoData && infoData.averagePrice*/}
          {/*  })(*/}
          {/*    <Input addonAfter={'元'} placeholder={'请输入开发商指导价'} />*/}
          {/*  )}*/}
          {/*</FormItem>*/}
          <FormItem label="购买价款" required {...formConfig}>
            {getFieldDecorator('standardPrice', {
              rules: [
                {
                  validator: (rule, val, cb) => {
                    if (val === null || val === '' || typeof val == 'undefined') {
                      cb('请输入购买价款');
                    } else if (!val.toString().match(posRemain2)) {
                      cb('请输入正确的价格');
                    } else cb();
                  },
                },
              ],
              initialValue: infoData && infoData.standardPrice,
            })(<Input addonAfter={'元'} placeholder={'请输入购买价款'} />)}
          </FormItem>
          <FormItem label="产权车位" required {...formConfig}>
            {getFieldDecorator('selfPropertyRights', {
              rules: [{ required: true, message: '请选择产权车位' }],
              initialValue:
                infoData && infoData.selfPropertyRights != null
                  ? infoData.selfPropertyRights
                  : null,
            })(
              <RadioGroup allowClear>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="开启租售" required {...formConfig}>
            {getFieldDecorator('rentSale', {
              rules: [{ required: true, message: '请选择开启租售' }],
              initialValue: infoData && infoData.rentSale != null ? infoData.rentSale : null,
            })(
              <RadioGroup>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="支持自用" required {...formConfig}>
            {getFieldDecorator('selfUseFlag', {
              rules: [{ required: true, message: '请选择支持自用' }],
              initialValue: infoData && infoData.selfUseFlag != null ? infoData.selfUseFlag : null,
            })(
              <RadioGroup allowClear>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="标准版购买价款" required {...formConfig}>
            {getFieldDecorator('basicSalePrice', {
              rules: [
                {
                  validator: (rule, val, cb) => {
                    if (val === null || val === '' || typeof val == 'undefined') {
                      cb('请输入标准版购买价款');
                    } else if (!/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(val)) {
                      cb('请输入正确标准版购买价款');
                    } else cb();
                  },
                },
              ],
              initialValue:
                infoData && infoData.basicSalePrice != null ? infoData.basicSalePrice : null,
            })(<Input addonAfter={'元'} placeholder={'请输入标准版购买价款'} />)}
          </FormItem>

          <FormItem label="标准版车位价格" required {...formConfig}>
            {getFieldDecorator('basicPrice', {
              rules: [
                {
                  validator: (rule, val, cb) => {
                    if (val === null || val === '' || typeof val == 'undefined') {
                      cb('请输入标准版车位价格');
                    } else if (!/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(val)) {
                      cb('请输入正确标准版车位价格');
                    } else cb();
                  },
                },
              ],
              initialValue: infoData && infoData.basicPrice != null ? infoData.basicPrice : null,
            })(<Input addonAfter={'元'} placeholder={'请输入标准版车位价格'} />)}
          </FormItem>

          <FormItem label="保价版购买价款" required {...formConfig}>
            {getFieldDecorator('buybackSalePrice', {
              rules: [
                {
                  validator: (rule, val, cb) => {
                    console.log(val);
                    if (val === null || val === '' || typeof val == 'undefined') {
                      cb('请输入保价版购买价款');
                    } else if (!/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(val)) {
                      cb('请输入正确保价版购买价款');
                    } else cb();
                  },
                },
              ],
              initialValue:
                infoData && infoData.buybackSalePrice != null ? infoData.buybackSalePrice : null,
            })(<Input addonAfter={'元'} placeholder={'请输入保价版购买价款'} />)}
          </FormItem>

          <FormItem label="保价版车位价格" required {...formConfig}>
            {getFieldDecorator('buybackPrice', {
              rules: [
                {
                  validator: (rule, val, cb) => {
                    if (val === null || val === '' || typeof val == 'undefined') {
                      cb('请输入保价版车位价格');
                    } else if (!/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(val)) {
                      cb('请输入正确保价版车位价格');
                    } else cb();
                  },
                },
              ],
              initialValue:
                infoData && infoData.buybackPrice != null ? infoData.buybackPrice : null,
            })(<Input addonAfter={'元'} placeholder={'请输入保价版车位价格'} />)}
          </FormItem>
          {/*<FormItem*/}
          {/*  label="售价"*/}
          {/*  // required*/}
          {/*  {...formConfig}*/}
          {/*>*/}
          {/*  {getFieldDecorator('price', {*/}
          {/*    rules: [{*/}
          {/*      validator: (rule, val, cb) => {*/}
          {/*        if (val && !(val.toString()).match(posRemain2)) {*/}
          {/*          cb('请输入正确的价格')*/}
          {/*        } else cb()*/}
          {/*      }*/}
          {/*    }],*/}
          {/*    initialValue: infoData && infoData.price*/}
          {/*  })(*/}
          {/*    <Input addonAfter={'元'} placeholder={'请输入售价'} />*/}
          {/*  )}*/}
          {/*</FormItem>*/}
          <FormItem label="车位上下架" required {...formConfig}>
            {getFieldDecorator('parkingStatus', {
              rules: [{ required: true, message: '请选择上下架' }],
              initialValue: infoData && infoData.parkingStatus,
            })(
              <RadioGroup>
                <Radio value={0}>上架</Radio>
                <Radio value={1}>下架</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="备注" {...formConfig}>
            {getFieldDecorator('remark', {
              // rules: [{ required: true, message: '请输入备注' }],
              initialValue: infoData && infoData.remark,
            })(<Input placeholder={'请输入备注'} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
