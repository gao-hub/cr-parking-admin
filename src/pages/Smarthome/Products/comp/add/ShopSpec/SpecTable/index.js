import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'lodash';
import { Button, InputNumber, Input, message } from 'antd';

let oldTableData = {};

function SpecTable(props) {
  const { dispatch, infoData, bufferArr, disabled } = props;
  const [tableJsxArr, setTableJsxArr] = useState([]);
  const [btnisShow, setbtnisShow] = useState(false);
  const [editType, setEditType] = useState(0);
  const [editValue, setEditValue] = useState(undefined);

  // attrs
  // [
  //   {
  //     "cost": 0,
  //     "price": 0,
  //     "markPrice": 111,
  //     "stock": 111,
  //     "sku": 0,
  //     "value1": "11",
  //     "value2": "1",
  //     "detail": {
  //       "尺寸": "11",
  //       "颜色": "1"
  //     }
  //   },

  // ]

  // 初始值
  useEffect(() => {
    if (infoData && infoData.attrs !== null) {
      infoData.attrs.forEach(item => {
        const specArr = item.sku.split(',');
        const str = `${specArr[0] ? specArr[0] : ''}${specArr[1] ? `-${specArr[1]}` : ''}${
          specArr[2] ? `-${specArr[2]}` : ''
        }`;
        oldTableData[str] = {
          cost: item.cost,
          price: item.price,
          markPrice: item.markPrice,
          stock: item.stock,
          sku: item.sku,
          sales: item.sales,
        };
      });
    }

    return () => {
      oldTableData = {};
    };
  }, []);

  const findOldTableData = id => {
    const oldData = oldTableData[id];
    return oldTableData[id]
      ? {
          cost: oldData.cost,
          price: oldData.price,
          markPrice: oldData.markPrice,
          stock: oldData.stock,
          sku: oldData.sku,
          sales: oldData.sales,
        }
      : {
          cost: 0,
          price: 0,
          markPrice: 0,
          stock: 0,
          sku: 0,
          sales: 0,
        };
  };

  const handleTableDataChange = () => {
    const { length } = bufferArr;

    if (length === 1) {
      const tempArray = [];

      bufferArr[0].value.val.forEach(item => {
        const tempObj = {
          id: item.value.InputValue,
          value: findOldTableData(item.value.InputValue),
          detail: {
            [bufferArr[0].value.selectValue]: item.value.InputValue,
          },
          valueArr: {
            value3: item.value.InputValue,
          },
        };
        tempArray.push(tempObj);
      });
      setTableJsxArr([...tempArray]);
    }

    if (length === 2) {
      const tempArray = [];

      bufferArr[0].value.val.forEach(item => {
        bufferArr[1].value.val.forEach((item2, index2) => {
          const tempObj = {
            id: `${item.value.InputValue}-${item2.value.InputValue}`,
            value: findOldTableData(`${item.value.InputValue}-${item2.value.InputValue}`),
            detail: {
              [bufferArr[0].value.selectValue]: item.value.InputValue,
              [bufferArr[1].value.selectValue]: item2.value.InputValue,
            },
            index2,
            valueArr: {
              value2: item.value.InputValue,
              value3: item2.value.InputValue,
            },
          };

          tempArray.push(tempObj);
        });
      });
      setTableJsxArr([...tempArray]);
    }

    if (length === 3) {
      const tempArray = [];

      bufferArr[0].value.val.forEach(item => {
        bufferArr[1].value.val.forEach((item2, index2) => {
          bufferArr[2].value.val.forEach((item3, index3) => {
            const tempObj = {
              id: `${item.value.InputValue}-${item2.value.InputValue}-${item3.value.InputValue}`,
              value: findOldTableData(
                `${item.value.InputValue}-${item2.value.InputValue}-${item3.value.InputValue}`
              ),
              detail: {
                [bufferArr[0].value.selectValue]: item.value.InputValue,
                [bufferArr[1].value.selectValue]: item2.value.InputValue,
                [bufferArr[2].value.selectValue]: item3.value.InputValue,
              },
              index2,
              index3,
              valueArr: {
                value1: item.value.InputValue,
                value2: item2.value.InputValue,
                value3: item3.value.InputValue,
              },
            };

            tempArray.push(tempObj);
          });
        });
      });

      setTableJsxArr([...tempArray]);
    }

    return undefined;
  };

  const handleTableTheadJsx = () => {
    const { length } = bufferArr;

    if (length === 1) {
      return (
        <tr>
          <th
            style={{
              width: '100px',
            }}
          >
            {bufferArr[0].value.selectValue}
          </th>
          <th>成本价格</th>
          <th>
            <span style={{ color: 'red' }}>*</span>
            售价
          </th>
          <th>划线价</th>
          <th>
            <span style={{ color: 'red' }}>*</span>
            库存
          </th>
          <th>规格编码</th>
          <th>销量</th>
        </tr>
      );
    }

    if (length === 2) {
      return (
        <tr>
          <th
            style={{
              width: '100px',
            }}
          >
            {bufferArr[0].value.selectValue}
          </th>
          <th
            style={{
              width: '100px',
            }}
          >
            {bufferArr[1].value.selectValue}
          </th>
          <th>成本价格</th>
          <th>
            <span style={{ color: 'red' }}>*</span>
            售价
          </th>
          <th>划线价</th>
          <th>
            <span style={{ color: 'red' }}>*</span>
            库存
          </th>
          <th>规格编码</th>
          <th>销量</th>
        </tr>
      );
    }

    if (length === 3) {
      return (
        <tr>
          <th
            style={{
              width: '100px',
            }}
          >
            {bufferArr[0].value.selectValue}
          </th>
          <th
            style={{
              width: '100px',
            }}
          >
            {bufferArr[1].value.selectValue}
          </th>
          <th
            style={{
              width: '100px',
            }}
          >
            {bufferArr[2].value.selectValue}
          </th>
          <th>成本价格</th>
          <th>
            <span style={{ color: 'red' }}>*</span>
            售价
          </th>
          <th>划线价</th>
          <th>
            <span style={{ color: 'red' }}>*</span>
            库存
          </th>
          <th>规格编码</th>
          <th>销量</th>
        </tr>
      );
    }

    return undefined;
  };

  const findHasChangedTableData = () => {
    if (tableJsxArr.length < 1) return;
    tableJsxArr.forEach(item => {
      Object.keys(item.value).every(key => {
        if (item.value[key] !== 0) {
          oldTableData[item.id] = item.value;
          return false;
        }
        return true;
      });
    });
  };

  const handleEditSubmit = () => {
    if (editValue === '') {
      message.error('输入框不能为空');
      return;
    }
    const cloneArr = _.cloneDeep(tableJsxArr);
    cloneArr.forEach(item => {
      const itemRef = item;
      if (editType === 0) {
        itemRef.value.cost = editValue;
      }
      if (editType === 1) {
        itemRef.value.price = editValue;
      }
      if (editType === 2) {
        itemRef.value.markPrice = editValue;
      }
      if (editType === 3) {
        itemRef.value.stock = editValue;
      }
    });
    setTableJsxArr(cloneArr);
    setbtnisShow(false);
    setEditValue(undefined);
  };

  // 往里赋值
  useEffect(
    () => {
      findHasChangedTableData();
      handleTableDataChange();
    },
    [bufferArr]
  );

  // 往外传值
  useEffect(
    () => {
      const total = tableJsxArr.reduce((prev, curr) => prev + curr.value.stock, 0);
      dispatch({
        type: 'productsManage/setTotalStocks',
        payload: total,
      });
      dispatch({
        type: 'productsManage/setTableData',
        payload: tableJsxArr,
      });
    },
    [tableJsxArr]
  );

  return (
    <div
      style={{
        marginTop: '20px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <table border="1">
        <thead align="center">{handleTableTheadJsx()}</thead>
        <tbody align="center">
          {tableJsxArr.map(item => {
            const itemRef = item;
            return (
              <tr key={itemRef.id}>
                {bufferArr.length >= 3 &&
                  itemRef.index2 === 0 &&
                  itemRef.index3 === 0 && (
                    <td rowSpan={bufferArr[1].value.val.length * bufferArr[2].value.val.length}>
                      {itemRef.valueArr.value1}
                    </td>
                  )}
                {bufferArr.length >= 2 &&
                  (bufferArr.length === 2 ? itemRef.index2 === 0 : itemRef.index3 === 0) && (
                    <td rowSpan={bufferArr[bufferArr.length === 2 ? 1 : 2].value.val.length}>
                      {itemRef.valueArr.value2}
                    </td>
                  )}
                <td>{itemRef.valueArr.value3}</td>
                <td>
                  <InputNumber
                    defaultValue={itemRef.value.cost}
                    value={itemRef.value.cost}
                    onChange={value => {
                      itemRef.value.cost = value;
                      setTableJsxArr([...tableJsxArr]);
                    }}
                    precision={2}
                    disabled={disabled}
                    min={0}
                  />
                </td>
                <td>
                  <InputNumber
                    defaultValue={itemRef.value.price}
                    value={itemRef.value.price}
                    onChange={value => {
                      itemRef.value.price = value;
                      setTableJsxArr([...tableJsxArr]);
                    }}
                    precision={2}
                    disabled={disabled}
                    min={0}
                  />
                </td>
                <td>
                  <InputNumber
                    defaultValue={itemRef.value.markPrice}
                    value={itemRef.value.markPrice}
                    onChange={value => {
                      itemRef.value.markPrice = value;
                      setTableJsxArr([...tableJsxArr]);
                    }}
                    precision={2}
                    disabled={disabled}
                    min={0}
                  />
                </td>
                <td>
                  <InputNumber
                    defaultValue={itemRef.value.stock}
                    value={itemRef.value.stock}
                    onChange={value => {
                      itemRef.value.stock = value;
                      setTableJsxArr([...tableJsxArr]);
                    }}
                    precision={0}
                    min={0}
                    disabled={disabled}
                  />
                </td>
                <td>
                  <Input
                    defaultValue={itemRef.value.sku}
                    value={itemRef.value.sku}
                    onChange={e => {
                      itemRef.value.sku = e.target.value;
                      setTableJsxArr([...tableJsxArr]);
                    }}
                    maxLength={20}
                    disabled={disabled}
                  />
                </td>
                <td>{infoData ? itemRef.value.sales : 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        style={{
          display: 'flex',
          marginTop: '20px',
          alignItems: 'center',
        }}
      >
        <span>批量操作：</span>
        {!btnisShow ? (
          <div>
            <Button
              type="link"
              onClick={() => {
                setbtnisShow(true);
                setEditType(0);
              }}
              disabled={disabled}
            >
              成本价格
            </Button>
            <Button
              type="link"
              onClick={() => {
                setbtnisShow(true);
                setEditType(1);
              }}
              disabled={disabled}
            >
              售价
            </Button>
            <Button
              type="link"
              onClick={() => {
                setbtnisShow(true);
                setEditType(2);
              }}
              disabled={disabled}
            >
              划线价
            </Button>
            <Button
              type="link"
              onClick={() => {
                setbtnisShow(true);
                setEditType(3);
              }}
              style={{ marginLeft: '10px' }}
              disabled={disabled}
            >
              库存
            </Button>
          </div>
        ) : null}
        {btnisShow ? (
          <div
            style={{
              display: 'flex',
            }}
          >
            <InputNumber
              defaultValue={editValue}
              value={editValue}
              onChange={value => {
                setEditValue(value);
              }}
            />
            <Button type="primary" onClick={handleEditSubmit}>
              保存
            </Button>
            <Button
              onClick={() => {
                setbtnisShow(false);
                setEditValue(undefined);
              }}
            >
              取消
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const mapStatetoprops = ({ productsManage }) => ({
  infoData: productsManage.infoData,
});

export default connect(mapStatetoprops)(SpecTable);
