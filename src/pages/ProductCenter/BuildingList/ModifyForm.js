import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import Upload from '@/components/Upload';
import { posRemain2 } from '@/utils/utils';
import { connect } from 'dva';
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ buildingManage, loading }) => ({
  buildingManage,
  submitLoading: loading.effects['buildingManage/addManage'],
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      fileList: [],
      id: null,
      salePrice: '0', //车位零售价格
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'buildingManage/setModifyInfo',
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
      buildingManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await dispatch({
          type: 'buildingManage/parkingConsultant',
          payload: {
            ...values,
            price: this.state.salePrice,
            id: this.state.id,
          },
        });
        // if (modifyInfoData.id) {
        //   res = await dispatch({
        //     type: 'buildingManage/modifyManage',
        //     payload: {
        //       ...values,
        //       id: this.props.buildingManage.modifyInfoData.id,
        //     }
        //   })
        // } else {
        // }
        if (res && res.status === 1) {
          this.changeVisible(false);
          message.success(res.statusDesc);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };

  /**
   * 点击根据车位号获取售价
   * */
  onGetRetailPrice = async value => {
    const {
      dispatch,
      form,
      buildingManage: { modifyInfoData },
    } = this.props;
    const res = await dispatch({
      type: 'buildingManage/getRetailPrice',
      payload: {
        id: value,
      },
    });
    if (res && res.status === 1) {
      this.setState({
        salePrice: res.data,
      });
    } else message.error(res.statusDesc);
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const {
      form: { getFieldDecorator },
      buildingManage: { modifyInfoData, parkingList },
    } = this.props;
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
        confirmLoading={this.props.submitLoading ? true : false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="车位号" {...formConfig}>
            {getFieldDecorator('parkingId', {
              rules: [{ required: true, message: '请选择车位号' }],
              initialValue: modifyInfoData && modifyInfoData.parkingId,
            })(
              <Select
                showSearch
                placeholder="请选择车位号"
                allowClear
                onChange={this.onGetRetailPrice}
                filterOption={(input, option) => {
                  return option.props.children[0].indexOf(input) >= 0;
                }}
              >
                {parkingList.map((item, idx) => (
                  <Option value={item.id} key={idx}>
                    {item.parkingCode}{' '}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="购买人" {...formConfig}>
            {getFieldDecorator('buyerName', {
              rules: [{ required: true, message: '请输入购买人' }],
              initialValue: modifyInfoData && modifyInfoData.buyerName,
            })(<Input placeholder={'请输入购买人'} />)}
          </FormItem>
          <FormItem label="身份证号" {...formConfig}>
            {getFieldDecorator('buyerNo', {
              rules: [{ required: true, message: '请输入身份证号' }],
              initialValue: modifyInfoData && modifyInfoData.buyerNo,
            })(<Input placeholder={'请输入身份证号'} />)}
          </FormItem>
          <FormItem label="零售价格" required {...formConfig}>
            {this.state.salePrice}元
          </FormItem>
          <FormItem
            {...formConfig}
            label={'收款凭证'}
            extra={<span style={{ fontSize: '10px' }} />}
          >
            {getFieldDecorator('receiptPictureAr', {
              rules: [
                {
                  required: true,
                  message: '请上传收款凭证',
                },
              ],
            })(
              <Upload
                uploadConfig={{
                  action: `${_baseApi}/parkingConsultant/upload`,
                  fileType: ['image', 'PDF'],
                  size: 3,
                }}
                multiplePicture={true}
                setIconUrl={(url, type) => {
                  const receiptPictureAr = this.props.form.getFieldValue('receiptPictureAr');
                  if (type !== 'remove') {
                    // 照片添加的逻辑
                    if (!receiptPictureAr || !receiptPictureAr[0]) {
                      this.props.form.setFieldsValue({ receiptPictureAr: [url] });
                    } else {
                      this.props.form.setFieldsValue({
                        receiptPictureAr: receiptPictureAr.concat([url]),
                      });
                    }
                  } else {
                    // 照片删除的逻辑
                    const resArr = [];
                    receiptPictureAr.forEach(item => {
                      if (item !== url) resArr.push(item);
                    });
                    this.props.form.setFieldsValue({ receiptPictureAr: resArr });
                  }
                }}
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
            label={'开发商合同'}
            extra={<span style={{ fontSize: '10px' }} />}
          >
            {getFieldDecorator('contractPictureAr', {
              rules: [
                {
                  required: true,
                  message: '请上传开发商合同',
                },
              ],
            })(
              <Upload
                uploadConfig={{
                  action: `${_baseApi}/parkingConsultant/upload`,
                  fileType: ['image', 'PDF'],
                  size: 3,
                }}
                multiplePicture={true}
                setIconUrl={(url, type) => {
                  const contractPictureAr = this.props.form.getFieldValue('contractPictureAr');
                  if (type !== 'remove') {
                    // 照片添加的逻辑
                    if (!contractPictureAr || !contractPictureAr[0]) {
                      this.props.form.setFieldsValue({ contractPictureAr: [url] });
                    } else {
                      this.props.form.setFieldsValue({
                        contractPictureAr: contractPictureAr.concat([url]),
                      });
                    }
                  } else {
                    // 照片删除的逻辑
                    const resArr = [];
                    contractPictureAr.forEach(item => {
                      if (item !== url) resArr.push(item);
                    });
                    this.props.form.setFieldsValue({ contractPictureAr: resArr });
                  }
                }}
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
            label={'其他材料'}
            extra={<span style={{ fontSize: '10px' }} />}
          >
            {getFieldDecorator('pictureAr', {
              // rules: [{
              //   required: true,
              //   message: '请上传其他材料',
              // }]
            })(
              <Upload
                uploadConfig={{
                  action: `${_baseApi}/parkingConsultant/upload`,
                  fileType: ['image', 'PDF'],
                  size: 3,
                }}
                multiplePicture={true}
                setIconUrl={(url, type) => {
                  const pictureAr = this.props.form.getFieldValue('pictureAr');
                  if (type !== 'remove') {
                    // 照片添加的逻辑
                    if (!pictureAr || !pictureAr[0]) {
                      this.props.form.setFieldsValue({ pictureAr: [url] });
                    } else {
                      this.props.form.setFieldsValue({ pictureAr: pictureAr.concat([url]) });
                    }
                  } else {
                    // 照片删除的逻辑
                    const resArr = [];
                    pictureAr.forEach(item => {
                      if (item !== url) resArr.push(item);
                    });
                    this.props.form.setFieldsValue({ pictureAr: resArr });
                  }
                }}
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
        </Form>
      </Modal>
    );
  }
}
