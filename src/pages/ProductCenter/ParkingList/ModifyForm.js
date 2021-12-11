import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Select, Radio } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';
import { posRemain2 } from '@/utils/utils';

const FormItem = Form.Item;
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
    };
  }

  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'buildingParkingManage/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const {
      dispatch,
      form,
      buildingParkingManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'buildingParkingManage/modifyManage',
            payload: {
              ...values,
              id: this.props.buildingParkingManage.modifyInfoData.id,
            },
          });
        } else {
          res = await dispatch({
            type: 'buildingParkingManage/addManage',
            payload: values,
          });
        }
        if (res && res.status === 1) {
          this.changeVisible(false);
          message.success(res.statusDesc);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };

  componentDidMount() {
    this.props.getChildData(this);
  }

  render() {
    const {
      form: { getFieldDecorator },
      buildingParkingManage: { modifyInfoData },
      natureList,
    } = this.props;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        title={'车位编辑'}
        // title={modifyInfoData.id ? '修改' : '添加'}
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
              initialValue: modifyInfoData && modifyInfoData.parkingCode,
            })(<Input placeholder={'请输入车位号'} />)}
          </FormItem>
          <FormItem label="车位类型" {...formConfig}>
            {getFieldDecorator('parkingType', {
              initialValue: modifyInfoData && modifyInfoData.parkingType,
            })(
              <Select>
                {natureList.map(item => {
                  return (
                    <Select.Option key={item.title} value={item.title}>
                      {item.title}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
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
              initialValue: modifyInfoData && modifyInfoData.picture,
            })(
              <Upload
                defaultUrl={modifyInfoData && modifyInfoData.picture}
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
              initialValue: modifyInfoData && modifyInfoData.certificates,
            })(
              <Upload
                defaultUrl={modifyInfoData && modifyInfoData.certificates}
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
              initialValue: modifyInfoData && modifyInfoData.parkingLength,
            })(<Input placeholder={'请输入车位长'} addonAfter={'m'} />)}
          </FormItem>
          <FormItem label="车位宽" {...formConfig}>
            {getFieldDecorator('parkingWidth', {
              initialValue: modifyInfoData && modifyInfoData.parkingWidth,
            })(<Input placeholder={'请输入车位宽'} addonAfter={'m'} />)}
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
              initialValue: modifyInfoData && modifyInfoData.purchasePrice,
            })(<Input addonAfter={'元'} placeholder={'请输入进货价格'} />)}
          </FormItem>
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

              initialValue: modifyInfoData && modifyInfoData.standardPrice,
            })(<Input addonAfter={'元'} placeholder={'请输入购买价款'} />)}
          </FormItem>

          <FormItem label="产权车位" required {...formConfig}>
            {getFieldDecorator('selfPropertyRights', {
              rules: [{ required: true, message: '请选择产权车位' }],
              initialValue:
                modifyInfoData && modifyInfoData.selfPropertyRights != null
                  ? modifyInfoData.selfPropertyRights
                  : null,
            })(
              <RadioGroup>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="开启租售" required {...formConfig}>
            {getFieldDecorator('rentSale', {
              rules: [{ required: true, message: '请选择开启租售' }],
              initialValue: modifyInfoData?.rentSale,
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
              initialValue:
                modifyInfoData && modifyInfoData.selfUseFlag != null
                  ? modifyInfoData.selfUseFlag
                  : null,
            })(
              <RadioGroup>
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
                modifyInfoData && modifyInfoData.basicSalePrice != null
                  ? modifyInfoData.basicSalePrice
                  : null,
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
              initialValue:
                modifyInfoData && modifyInfoData.basicPrice != null
                  ? modifyInfoData.basicPrice
                  : null,
            })(<Input addonAfter={'元'} placeholder={'请输入标准版车位价格'} />)}
          </FormItem>

          <FormItem label="保价版购买价款" required {...formConfig}>
            {getFieldDecorator('buybackSalePrice', {
              rules: [
                {
                  validator: (rule, val, cb) => {
                    if (val === null || val === '' || typeof val == 'undefined') {
                      cb('请输入保价版购买价款');
                    } else if (!/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(val)) {
                      cb('请输入正确保价版购买价款');
                    } else cb();
                  },
                },
              ],
              initialValue:
                modifyInfoData && modifyInfoData.buybackSalePrice != null
                  ? modifyInfoData.buybackSalePrice
                  : null,
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
                modifyInfoData && modifyInfoData.buybackPrice != null
                  ? modifyInfoData.buybackPrice
                  : null,
            })(<Input addonAfter={'元'} placeholder={'请输入保价版车位价格'} />)}
          </FormItem>

          <FormItem label="车位上下架" required {...formConfig}>
            {getFieldDecorator('parkingStatus', {
              rules: [{ required: true, message: '请选择车位上下架' }],
              initialValue: modifyInfoData && modifyInfoData.parkingStatus,
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
              initialValue: modifyInfoData && modifyInfoData.remark,
            })(<Input placeholder={'请输入备注'} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
