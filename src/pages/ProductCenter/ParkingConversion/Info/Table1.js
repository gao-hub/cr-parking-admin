import React, { useState } from 'react';
import { Table, InputNumber, Button, Popconfirm, message } from 'antd';
import { changeInfo } from '../services/index';

function Table1({ dataSource, refresh }) {
  const [currentKey, setcurrentKey] = useState('');
  const [inputValue, setInputValue] = useState(undefined);
  const columns = [
    {
      title: '产品模式',
      dataIndex: 'productModel',
    },
    {
      title: '客户姓名',
      dataIndex: 'buyerTrueName',
    },
    {
      title: '购买时间',
      dataIndex: 'finishTime',
    },
    {
      title: '购买金额',
      dataIndex: 'payment',
    },
    {
      title: '购买渠道',
      dataIndex: 'parentUtmName',
      render: text => text || '-',
    },
    {
      title: '退货模式',
      dataIndex: 'returnModel',
    },
    {
      title: '退货/续约时间',
      // 先取returnFinishTime再取saleFinishTime再取renewDate
      render: (_, record) => {
        if (record.parkingOrderStatus === 13) {
          return record.dueDate;
        }
        return record.returnFinishTime
          ? record.returnFinishTime
          : record.saleFinishTime
            ? record.saleFinishTime
            : record.renewDate;
      },
    },
    {
      title: '资金成本',
      children: [
        {
          title: '佣金',
          dataIndex: 'commission',
          render: (text, record) => {
            if (record.key === currentKey) {
              return (
                <InputNumber
                  onChange={value => setInputValue(value)}
                  style={{
                    width: '100px',
                  }}
                />
              );
            }
            return text;
          },
          width: '200px',
        },
        {
          title: '租金/溢价',
          dataIndex: 'rent',
        },
      ],
    },
    {
      title: '操作',
      render: (_, row) => {
        if (currentKey !== row.key) {
          return (
            <Button
              type="link"
              onClick={() => {
                setInputValue(undefined);
                setcurrentKey(row.key);
              }}
            >
              修改
            </Button>
          );
        }
        return (
          <span>
            <Button
              type="primary"
              onClick={async () => {
                if (inputValue) {
                  const hide = message.loading('正在修改..', 0);
                  const { status, statusDesc } = await changeInfo({
                    id: row.id,
                    commission: inputValue,
                  });
                  hide();
                  if (status === 1) {
                    message.success('修改成功');
                    refresh();
                  } else {
                    message.error(statusDesc);
                  }
                  setcurrentKey('');
                } else {
                  message.warning('输入框不能为空');
                }
              }}
              size="small"
            >
              确定
            </Button>
            <Popconfirm
              title="确定不保存?"
              onConfirm={() => {
                setcurrentKey('');
              }}
              onCancel={() => {}}
              okText="确认"
              cancelText="取消"
            >
              <Button
                style={{
                  marginLeft: '10px',
                }}
                size="small"
              >
                取消
              </Button>
            </Popconfirm>
          </span>
        );
      },
      width: '150px',
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      bordered
      rowKey={record => record.id}
    />
  );
}

export default Table1;
