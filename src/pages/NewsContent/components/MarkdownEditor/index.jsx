import React, { useRef, useEffect, useState } from 'react';
import Editor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import 'react-markdown-editor-lite/lib/index.css';
import styles from './index.less';
import uploadImage from './uploadImage';
const tool = [
  'header',
  'font-bold',
  'font-italic',
  'list-unordered',
  'list-ordered',
  'block-quote',
  'block-wrap',
  'table',
  'clear',
  'logger',
  'mode-toggle',
  'full-screen',
  "my-uploadImage"
];

const MarkdownEditor = props => {
  // 使用插件
  Editor.use(uploadImage, { uploadImageUrl: props.uploadImageUrl });

  const mdEditor = useRef(null);
  const inputRef = useRef();
  const { content = "", callBack, height = 850, preview = "" } = props; // preview : edit 审核，没有上传图片 info 预览没有工具栏 默认都有
  const getTool = () =>{
    let arr = tool;
    // type 存在的话有上传图片
    if(preview === 'edit'){
      arr = [
        'header',
        'font-bold',
        'font-italic',
        'list-unordered',
        'list-ordered',
        'block-quote',
        'block-wrap',
        'table',
        'clear',
        'logger',
        'mode-toggle',
        'full-screen'
      ]
    }else if(preview === 'info'){
      arr = [
        'mode-toggle',
        'full-screen'
      ];
    }
    return arr;
  }
  let [toolList] = useState(getTool);

  const handleEditorChange = ({ html, text }) => {
    if (callBack) callBack(html, text);
  };
  // 自带的上传
  const onImageUpload = file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = data => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  };
  // 自定义上传
  const onCustomImageUpload = event => {
    inputRef.current.dispatchEvent(new MouseEvent('click'));
  };

  return (
    <div className={styles.MarkdownEditor}>
      <Editor
        readOnly={preview === 'info'}
        ref={mdEditor}
        defaultValue={content}
        htmlClass="my-style custom-html-style"
        plugins={toolList}
        style={{ height: `${height}px` }}
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
            fullScreen: true,
            hideMenu: true,
          },
        }}
        onImageUpload={onImageUpload}
        onCustomImageUpload={onCustomImageUpload}
        onChange={handleEditorChange}
        renderHTML={text => (
          <ReactMarkdown remarkPlugins={[gfm]} rehypePlugins={[rehypeRaw]} children={text} />
        )}
      />
      <input
        style={{ display: 'none' }}
        type="file"
        onClick={event => (event.target.value = null)}
        ref={inputRef}
        accept="image/*"
        onChange={async e => {
          // 暂时不用这种方式, 采用的自定义上传的按钮
          const { files } = e.target;
          if (files.length > 0) {
            try {
              const formData = new FormData();
              formData.append('file', files[0]);
              const res = await bulkImportApi(formData);
              if (res.status === 1) {
                mdEditor.current.insertMarkdown('image', {
                  target: '5d708fe',
                  imageUrl: 'https://www.paixin.com/static/img/top_banner.5d708fe.jpg',
                });
              }
              mdEditor.current.insertMarkdown('image', {
                target: '5d708fe',
                imageUrl: 'https://www.paixin.com/static/img/top_banner.5d708fe.jpg',
              });
              // 清除input
              inputRef.current.value = '';
            } catch (err) {
              // 清除input
              inputRef.current.value = '';
            }
          }
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
