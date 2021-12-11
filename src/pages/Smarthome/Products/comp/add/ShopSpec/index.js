import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Col, Row, message } from 'antd';
import SpecSelect from './SpecSelect/index';
import SpecTable from './SpecTable/index';
import SortModal from './SortModal/index';

let count = 0;

function ShopSpec(props) {
  const { dispatch, specSelectData, infoData, disabled, totalStocks } = props;
  const [isShowSortModal, setIsShowSortModal] = useState(false);
  const [isShowMingxi, setIsShowMingxi] = useState(false);
  const [bufferArr, setBufferArr] = useState([]);

  const handleIsShowModalAndMingxi = () => {
    let flag = false;
    let count1 = 0;
    if (specSelectData.length === 0) {
      return false;
    }
    specSelectData.forEach(item => {
      if (item.value.val && item.value.val.length > 0 && item.value.selectValue !== '') {
        count1 += 1;
      }
    });
    if (count1 === specSelectData.length) {
      flag = true;
    }

    return flag;
  };

  const handleAdd = () => {
    dispatch({
      type: 'productsManage/setSpecSelectData',
      payload: [
        ...specSelectData,
        {
          id: (count += 1),
          value: {},
        },
      ],
    });
  };

  // items;
  // [
  //   {
  //     "detail": [
  //       {
  //         "name": "11",
  //         "image": ""
  //       },
  //       {
  //         "name": "222",
  //         "image": ""
  //       }
  //     ],
  //     "value": "尺寸"
  //   },
  //   {
  //     "detail": [
  //       {
  //         "name": "1",
  //         "image": ""
  //       },
  //       {
  //         "name": "2",
  //         "image": ""
  //       }
  //     ],
  //     "value": "颜色"
  //   }
  // ]

  useEffect(() => {
    if (specSelectData.length === 0) {
      // 如果没有数据，则加载初始数据
      if (infoData && infoData.items !== null) {
        const arr = [];
        infoData.items.forEach(() => {
          arr.push({
            id: (count += 1),
            value: {},
          });
        });
        setBufferArr([...arr]);
        dispatch({
          type: 'productsManage/setSpecSelectData',
          payload: arr,
        });
      }
      if (infoData && infoData.specType === 1) {
        setIsShowMingxi(true);
        dispatch({
          type: 'productsManage/setIsChanged',
          payload: false,
        });
      }
    } else {
      // 如果有数据，则加载最新数据
      setBufferArr([...specSelectData]);
    }
  }, []);

  return (
    <Row
      style={{
        marginBottom: '20px',
      }}
    >
      {handleIsShowModalAndMingxi() && isShowSortModal ? (
        <SortModal
          visible={isShowSortModal}
          onCancel={() => {
            setIsShowSortModal(false);
          }}
        />
      ) : null}
      <Col
        span={20}
        offset={4}
        style={{
          marginBottom: '20px',
        }}
      >
        {specSelectData.map((item, index) => (
          <SpecSelect index={index} key={item.id} disabled={disabled} />
        ))}
        <Button
          type="primary"
          onClick={handleAdd}
          disabled={specSelectData.length >= 3 || disabled}
        >
          添加规则项目
        </Button>
        <Button
          type="link"
          onClick={() => {
            if (specSelectData.length > 0) {
              setIsShowSortModal(true);
            }
          }}
          disabled={disabled}
        >
          自定义排序
        </Button>
      </Col>
      <Col
        span={4}
        style={{
          textAlign: 'right',
        }}
      >
        规格明细：
      </Col>
      <Col span={20}>
        <Button
          type="primary"
          onClick={() => {
            if (handleIsShowModalAndMingxi()) {
              if (
                !specSelectData.every(item =>
                  item.value.val.every(item1 => item1.value.InputValue !== '')
                )
              ) {
                message.error('规格值不能为空');
                return;
              }
              setIsShowMingxi(true);
              setBufferArr([...specSelectData]);
              dispatch({
                type: 'productsManage/setIsChanged',
                payload: false,
              });
            }
          }}
          disabled={disabled}
        >
          生成规格明细
        </Button>
        {handleIsShowModalAndMingxi() && isShowMingxi ? (
          <SpecTable bufferArr={bufferArr} disabled={disabled} />
        ) : null}
      </Col>

      <Col
        span={4}
        style={{
          textAlign: 'right',
        }}
      >
        多规格总库存：
      </Col>
      <Col span={20}>
        <div>{totalStocks}</div>
      </Col>
    </Row>
  );
}

const mapStatetoprops = ({ productsManage }) => ({
  specSelectData: productsManage.specSelectData,
  infoData: productsManage.infoData,
  totalStocks: productsManage.totalStocks,
});

export default connect(mapStatetoprops)(ShopSpec);
