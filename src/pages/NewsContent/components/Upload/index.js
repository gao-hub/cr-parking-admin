import React from 'react';
import { Button, Upload, Icon, Modal, Input, message } from 'antd';
import { getAuthority } from '@/utils/authority';
import { beforeUpload } from '@/utils/utils';
import styles from './index.less';

const formatUrlArrry = (dataSource, type) => {
  const resArr = []
  dataSource.forEach((item, idx) => {
    resArr.push({
      imageScale: item.imageScale,
      uid: '-' + idx + '9240',
      name: '点击预览',
      status: 'done',
      url: type === 'image' ? item.image : item,
      image: item.image
    })
  })
  return resArr
}

export default class UpLoad extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: props.type,
      previewVisible: false,
      previewImage: '',
      defaultUrl: '',
      fileList: props.defaultUrl ? Array.isArray(props.defaultUrl) ? formatUrlArrry(props.defaultUrl, props.type) : [
        {
          uid: '-1',
          name: '点击预览',
          status: 'done',
          url: props.defaultUrl,
        }
      ] : [],
    };
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    if(this.props.handlePreview) {
      this.props.handlePreview()
    }else{
      window.open(file.url ? file.url : file.response.data);
    }
  }

  handleChange = ({ fileList, file }) => {
    this.setState({ fileList })
    if ((file.status === 'done' && file.response.status === 1) || file.status === 'removed') {
      this.props.setIconUrl(fileList)
    } else if (file.status === 'done') {
      message.error(file.response.statusDesc)
    }
  }

  // onRemove = (file) => {
  //   // 已经是默认图片了不允许删除
  //   if(file.url === this.props.defaultImage){
  //     message.warn('默认图片不允许删除')
  //     return;
  //   }
  //   let arr = [];
  //   let list = this.state.fileList.map(item=>{
  //     if(item.url === file.url){
  //       item.url = this.props.defaultImage;
  //       item.image = this.props.defaultImage;
  //     }
  //     arr.push(item.url);
  //     return item;
  //   })
  //   this.setState({
  //     fileList: list
  //   })
  //   // 因为图片类型的后端返回的是对象类型的数组而且修改之后格式还要是这样的所以在此特殊处理了
  //   if(this.state.type === 'image'){
  //     this.props.setIconUrl(list);
  //   } else {
  //     this.props.setIconUrl(arr);
  //   }
  // }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { disabled } = this.props;

    const props = {
      multiple: true,
      headers: {
        Cookies: getAuthority()
      },
      beforeUpload: (file) => beforeUpload(file, this.props.uploadConfig)
    };
    return (
      <div>
        <Upload
          {...props}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          // onRemove={this.onRemove}
          disabled={fileList.length === 1 ? true : disabled ? this.props.disabled : false}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
