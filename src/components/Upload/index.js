import React from 'react';
import { Button, Upload, Icon, Modal, Input, message } from 'antd';
import { getAuthority } from '@/utils/authority';
import { beforeUpload } from '@/utils/utils';
import styles from './index.less';

const formatUrlArrry = dataSource => {
  const resArr = [];
  dataSource.forEach((item, idx) => {
    resArr.push({
      uid: '-' + idx + '9240',
      name: '点击预览',
      status: 'done',
      url: item,
    });
  });
  return resArr;
};

export default class UpLoad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      defaultUrl: '',
      defaultFileList: props.defaultUrl
        ? Array.isArray(props.defaultUrl)
          ? formatUrlArrry(props.defaultUrl)
          : [
            {
              uid: '-1',
              name: '点击预览',
              status: 'done',
              url: props.defaultUrl,
            },
          ]
        : [],
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    if (this.props.handlePreview) {
      this.props.handlePreview();
    } else {
      window.open(file.url ? file.url : file.response.data);
    }

    // const { uploadConfig: { fileType } } = this.props
    // if (fileType.includes('file') || fileType.includes('PDF') ) {
    //   if (file.response) {
    //     window.open(file.response.data);
    //   } else {
    //     window.open(file.url);
    //   }
    // } else {
    //   this.setState({
    //     previewImage: file.url || file.thumbUrl,
    //     previewVisible: true,
    //   });
    // }
  };

  handleChange = ({ fileList, file }) => {
    this.setState({ fileList });
    if (file.status === 'done' && file.response.status === 1) {
      this.props.setIconUrl(file.response.data);
    } else if (file.status === 'done') {
      message.error(file.response.statusDesc);
    }
  };
  onRemove = file => {
    const { multiplePicture } = this.props;
    this.setState({ defaultFileList: [] });
    if (!multiplePicture) {
      this.props.setIconUrl();
    } else {
      this.props.setIconUrl(file.url ? file.url : file.response.data, 'remove');
    }
  };

  render() {
    const { previewVisible, previewImage, fileList, defaultFileList } = this.state;
    // const maxLength = this.props?.uploadConfig?.maxFileList;
    // let multipleTag = maxLength && maxLength > 1 ? true : false;
    const {
      uploadConfig: { action, fileType, maxFileList = 100, notIncludeGif = false, multiple = false },
      disabled,
      multiplePicture
    } = this.props;
    const uploadButton =
      fileType.length == 0 ? null : fileType.length > 1 ? (
        <Button>
          <Icon type="upload" />
          上传文件
        </Button>
      ) : fileType.includes('image') ? (
        <div className="ant-upload-text">
          <Icon type="upload" />
          上传图片
        </div>
      ) : (
        <Button>
          <Icon type="upload" />
          {fileType.includes('video/*') ? '上传视频' : '上传文件'}
        </Button>
      );

    const props = {
      multiple: this.props?.uploadConfig?.multiple,
      headers: {
        Cookies: getAuthority(),
      },
      beforeUpload: file => beforeUpload(file, this.props.uploadConfig),
    };
    return (
      <div style={this.props.style}>
        <Upload
          {...props}
          action={action}
          listType={
            fileType.length > 1 ? 'text' : fileType.includes('image') ? 'picture-card' : 'text'
          }
          defaultFileList={defaultFileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.onRemove}
          disabled={disabled ? this.props.disabled : false}
        >
          {!multiplePicture &&
          ((defaultFileList.length && !fileList.length) || fileList.length >= 1)
            ? null
            : multiplePicture && (fileList.length > maxFileList || fileList.length == maxFileList)
              ? null
              : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
