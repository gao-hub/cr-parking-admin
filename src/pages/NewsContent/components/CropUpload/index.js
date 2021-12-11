import React from 'react';
import { Button, Upload, Icon, Modal, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { getAuthority } from '@/utils/authority';
import { beforeUpload } from '@/utils/utils';

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

export default class CropUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: props.defaultUrl
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
      deleteFlag: false,
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    if (this.props.handlePreview) {
      this.props.handlePreview();
    } else {
      window.open(file.url ? file.url : file.response.data);
    }
  };
  handleChange = ({ fileList, file }) => {
    const { setIconUrl } = this.props;
    this.setState({ fileList });
    if (file.status === 'removed' || (file.status === 'done' && file.response.status === 1)) {
      const data = fileList.map((item) => {
        if (item.response) {
          return {
            type: item.type,
            uid: item.uid,
            name: item.name,
            status: 'done',
            url: item.response.data,
          };
        } else return item;
      });
      this.setState({ fileList: data });
      const arr = data.map(item=>item.url);
      setIconUrl(arr.length ? arr : '');
    } else if (file.status === 'done' && file.response.status == '99') {
      message.error(file.response.statusDesc);
      this.setState({ fileList: fileList.filter((item) => item.uid !== file.uid) });
    } else if (file.status === 'error') {
      message.error(`上传失败`);
    }
  };

  componentDidMount() {
    this.props.getChildData && this.props.getChildData(this);
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const {
      uploadConfig: { action, fileType, maxFileList = 100 },
      disabled,
      aspect,
      style,
      uploadConfig,
    } = this.props;
    const uploadButton =
      fileType.length == 0 ? null : fileType.length > 1 ? (
        <Button disabled={disabled}>
          <Icon type="upload" />
          上传文件
        </Button>
      ) : fileType.includes('image') ? (
        <div className="ant-upload-text">
          <Icon type="upload" />
          上传图片
        </div>
      ) : (
        <Button disabled={disabled}>
          <Icon type="upload" />
          {fileType.includes('video/*') ? '上传视频' : '上传文件'}
        </Button>
      );

    const props = {
      multiple: false,
      headers: {
        Cookies: getAuthority(),
      },
      beforeUpload: file => beforeUpload(file, uploadConfig),
    };

    return (
      <div style={style}>
        <ImgCrop aspect={aspect}>
          <Upload
            {...props}
            action={action}
            listType={
              fileType.length > 1 ? 'text' : fileType.includes('image') ? 'picture-card' : 'text'
            }
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            disabled={disabled || false}
          >
            {fileList.length >= maxFileList ? null : uploadButton}
          </Upload>
        </ImgCrop>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
