---
title:
  en-US: SetColumns
  zh-CN: SetColumns
subtitle: 自定义列
---

由于需求定制表格的列过于太多导致页面数据布局混乱，特默认一部分列，自定义一部分列让用户可自动调节

## API

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| syncColumns | 异步列数组 | [] | - |
| plainOptions | 默认展示的列checkbox数据 | [] | - |
| defcolumns | 可动态设置的列 | [] | - |
| initColumns | 初始化展示列 | [] | - |
| staticColumns | 操作区 | [] | - |
| syncChangeColumns | 回调函数  更改异步列数组 | Func | - |