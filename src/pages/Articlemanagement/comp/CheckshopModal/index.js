import React, { useState, useEffect } from 'react';
import { Modal, Icon, Tooltip } from 'antd';
import styles from './index.scss';
import { getSelectStoreCategoryList, getProList } from '../../service';

function index(props) {
  const { visible, handleOk, handleCancel, onlyOne, value } = props;
  const [shopArr, setShopArr] = useState([]); // 总商品
  const [checkedShopId, setCheckedShopId] = useState([]); // 已选商品Id
  const [checkedShopArr, setCheckedShopArr] = useState([]);
  const [CateArr, setCateArr] = useState([]); // 总分类
  const [checkedCate, setCheckedCate] = useState({}); // 选中子分类
  const [checkedFCate, setCheckedFCate] = useState({}); // 选中分类

  useEffect(() => {
    getSelectStoreCategoryList({
      type: '1',
    }).then(data => {
      // 默认选中第一级
      if (data && data[0] && data[0].children[0]) {
        setCateArr(data);
        setCheckedFCate(data[0]);
        setCheckedCate(data[0].children[0]);
      }
    });
    if (value && value.length > 0) {
      setCheckedShopArr(value);
      setCheckedShopId(value.map(item => item.id));
    }
  }, []);

  useEffect(
    () => {
      if (checkedCate.value) {
        getProList({ cateId: checkedCate.value }).then(data1 => {
          if (data1 && data1.status === 1) {
            setShopArr(data1.data);
          }
        });
      }
    },
    [checkedCate]
  );

  const handleAddOrDelete = (id, item) => {
    if (checkedShopId.indexOf(id) === -1) {
      if (!onlyOne) {
        setCheckedShopId([...checkedShopId, id]);
        setCheckedShopArr([...checkedShopArr, item]);
      } else {
        setCheckedShopId([id]);
        setCheckedShopArr([item]);
      }
    } else {
      setCheckedShopId(checkedShopId.filter(item1 => item1 !== id));
      setCheckedShopArr(checkedShopArr.filter(item1 => item1.id !== id));
    }
  };

  return (
    <Modal
      title="选择商品"
      visible={visible}
      onOk={() => {
        handleOk(checkedShopArr);
      }}
      onCancel={handleCancel}
      width="50%"
      okText={`确定（已选中${checkedShopId.length}）`}
    >
      <div className={styles.divWrapper}>
        <div className={styles.leftWrapper}>
          {CateArr.map(item => (
            <div
              key={item.value}
              style={{
                backgroundColor: item.value === checkedFCate.value ? '#f5f5f5' : '#fff',
              }}
              onClick={() => {
                setCheckedFCate(item);
                setCheckedCate(item.children[0]);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className={styles.rightWrapper}>
          <div className={styles.rightTop}>
            {checkedFCate.children &&
              checkedFCate.children.length > 0 &&
              checkedFCate.children.map(item => (
                <div
                  key={item.value}
                  style={{
                    backgroundColor: item.value === checkedCate.value ? '#f5f5f5' : '#fff',
                  }}
                  onClick={() => {
                    setCheckedCate(item);
                  }}
                >
                  {item.label}
                </div>
              ))}
          </div>
          <div className={styles.rightBottom}>
            {shopArr.length > 0 &&
              shopArr.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleAddOrDelete(item.id, item);
                  }}
                >
                  <div>
                    <img
                      src={item.image}
                      alt="商品"
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    {checkedShopId.indexOf(item.id) !== -1 && (
                      <Icon
                        type="check-circle"
                        className={styles.icon}
                        style={{ fontSize: '16px', color: '#08c', display: 'block' }}
                      />
                    )}
                  </div>
                  <div>{item.isShow === 1 ? '在架' : '仓库中'}</div>
                  <Tooltip title={item.storeName}>
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        marginTop: '5px',
                      }}
                    >
                      {item.storeName}
                    </div>
                  </Tooltip>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default index;
