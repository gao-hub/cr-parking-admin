import React, { useState, useEffect } from 'react';
import { Upload, message, Icon } from 'antd';
/**
 * @desc 上传组件
 * @param { obj } props
 * @param { string } url 上传的url
 * @param { obj } data 上传所需额外参数或返回上传额外参数的方法
 * @param { string } title 上传的按钮文字
 * @param { boolean } listType 展示的样式  默认false  可以上传 图片和pdf
 * @param { number } size 最大上传限制
 * @param { number } maxLength 最大上传的文件数
 * @param { Array } fileList 文件列表
 * @param { Any } setIconUrl 回显上传成功数组
 * @param { boolean } showRemoveIcon  是否展示删除按钮
 */

const UploadMarkImage = (props) => {
  //  文件列表
  const [filesList, setFileList] = useState([]);
  //  loading
  const [loading, setLoading] = useState(false);

  const {
    url = '', //  上传的url
    listType = false, //  展示的样式
    title = '选择文件',
    data = {},
    size = 3, //  最大上传限制
    maxLength = 1, //  最大上传的文件数
    showRemoveIcon = true,
  } = props;
  //  上传发生改变以后
  const handleChange = ({ fileList, file }) => {
    if (file.status === 'uploading') {
      setLoading(true);
    }
    setFileList(fileList);
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
      setFileList(data);
      props.setIconUrl(data.length ? data : '');
      setLoading(false);
    } else if (file.status === 'done' && file.response.status == '99') {
      message.error(file.response.statusDesc);
      setFileList(fileList.filter((item) => item.uid !== file.uid));
      setLoading(false);
    } else if (file.status === 'error') {
      message.error(`上传失败`);
    }
  };

  useEffect(() => {
    const { fileList = [] } = props;
    const formatList = fileList.map((item, index) => {
      return {
        ...item,
        uid: index,
        name: item.name || item.url,
        status: 'done',
      };
    });
    setFileList(formatList);
  }, []);

  //   上传限制
  const beforeUpload = (file, size) => {
    return new Promise((resolve) => {
      const isLt3M = file.size / 1024 / 1024 < size;
      if (!isLt3M) {
        message.error(`上传文件必须小于${size}MB!`);
        return false;
      }
      resolve(file);
    });
  };
  //  上传按钮样式
  const uploadButton =
    <span className="button button-type-clear">
      {
        loading ? <Icon type="loading" /> : <Icon type="file-image" />
      }
    </span>

  return (
    <div>
      <Upload
        disabled={loading}
        action={url}
        listType={!listType ? listType : 'picture-card'}
        fileList={filesList}
        data={data}
        onChange={handleChange}
        accept={`image/*`}
        beforeUpload={(file) => beforeUpload(file, size)}
        showUploadList={{
          showRemoveIcon: showRemoveIcon,
        }}
      >
        {uploadButton }
      </Upload>
    </div>
  );
};

export default UploadMarkImage;
