import React from 'react';
import { Button, Upload, Icon, Modal, message } from 'antd';
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

export default class UpLoad extends React.Component {
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
    const { setIconUrl } = this.props;
    const { deleteFlag } = this.state;
    this.setState({ fileList });
    if (!deleteFlag) {
      if (file.status === 'done' && file.response.status === 1) {
        setIconUrl(file.response.data);
      } else if (file.status === 'done') {
        message.error(file.response.statusDesc);
      }
    }
    this.setState({
      deleteFlag: false,
    });
  };

  onRemove = file => {
    const { setIconUrl } = this.props;

    this.setState({
      deleteFlag: true,
    });
    setIconUrl(file.url ? file.url : file.response.data, 'remove');
  };

  componentDidMount() {
    const { defaultUrl } = this.props;
    const { setIconUrl } = this.props;
    if (Array.isArray(defaultUrl)) {
      defaultUrl.forEach(item => {
        setIconUrl(item);
      });
    } else if (defaultUrl) {
      setIconUrl(defaultUrl);
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const {
      uploadConfig: { action, fileType, maxFileList = 100 },
      disabled,
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
        <Upload
          {...props}
          action={action}
          listType={
            fileType.length > 1 ? 'text' : fileType.includes('image') ? 'picture-card' : 'text'
          }
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.onRemove}
          disabled={disabled || false}
        >
          {fileList.length >= maxFileList ? null : uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
