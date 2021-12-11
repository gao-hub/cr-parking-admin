## API

UpLoad 在 antd 的 UpLoad 上进行了一层封装，支持我们项目中的上传图片和上传 pdf 需求

## UpLoad

| 属性       | 描述                                               | 类型     | 默认值 |
| ---------- | -------------------------------------------------- | -------- | ------ |
| url        | 上传的 url(必填)                                   | string   | -      |
| listType   | 展示的样式 支持上传图片/pdf 样式和上传图片两种样式 | boolean  | false  |
| size       | 最大上传限制（M）                                  | number   | 3      |
| maxLength  | 最大上传的文件数                                   | number   | 1      |
| fileList   | 回显文件列表                                       | Array    | -      |
| setIconUrl | 上传文件的列表                                     | function | -      |
