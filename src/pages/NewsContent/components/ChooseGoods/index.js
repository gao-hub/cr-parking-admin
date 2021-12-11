import React, { useState, useEffect } from 'react';
import { Modal, Icon, Button, Pagination, Spin, message } from 'antd';
import styles from './index.less';
import { getCategoryList, getList } from './service';
import { Input } from 'antd/es';

function ChooseGoods(props) {
  const { visible, handleOk, handleCancel, onlyOne } = props;
  const [shopArr, setShopArr] = useState([]); // 总商品
  const [checkedShopId, setCheckedShopId] = useState([]); // 已选商品Id
  const [checkedShopArr, setCheckedShopArr] = useState([]);
  const [CateArr, setCateArr] = useState([]); // 总分类
  const [checkedFCate, setCheckedFCate] = useState({
    value: 1,
    label: '楼盘'
  }); // 左边的点击
  const [inputVal, setInputVal] = useState(''); // 搜索框
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 150 }); // 分页
  const [loading, setLoading] = useState(false); //loading

  useEffect(() => {
    setCateArr([
      {
        value: 1,
        label: '楼盘'
      },
      {
        value: 2,
        label: '旅游'
      },
      {
        value: 3,
        label: '家居'
      }
    ])
    getListData({ current: 1, pageSize: 10 }, 1);
  }, []);

  //获取数据
  const getListData = (params, type) =>{
    params.currPage = params.current;
    setLoading(true);
    getList(params, type).then(res => {
      if (res && res.status === 1) {
        res.data.records && res.data.records.map(item=>{
          item.productType = type;
          return item;
        })
        setShopArr(res.data.records);
        setPagination({ current: res.data.current, pageSize: 10, total: res.data.total });
        setLoading(false)
      }
    }).catch(()=>{
      setLoading(false)
    });
  }

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

  const onChange = (page, pageSize) => {
    let obj = JSON.parse(JSON.stringify(pagination))
    obj.current = page;
    getListData({ id: checkedFCate.id, current: page, pageSize, name: inputVal }, checkedFCate.value);
  }

  return (
    <Modal
      title="选择商品"
      visible={visible === 1}
      onOk={() => {
        if(checkedShopId.length === 0){
          message.warning('请选择一个商品');
        } else {
          handleOk(checkedShopArr);
        }
      }}
      onCancel={handleCancel}
      width="50%"
      okText={`确定（已选中${checkedShopId.length}）`}
    >
      <Spin spinning={loading} >
        <div className={styles.divWrapper}>
          <div className={styles.leftWrapper}>
            {CateArr.map(item => (
              <div
                className={styles.leftWrapperItem}
                key={item.value}
                style={{
                  backgroundColor: item.value === checkedFCate.value ? '#f5f5f5' : '#fff',
                }}
                onClick={() => {
                  setCheckedFCate(item);
                  getListData({ id: item.id, current: 1, pageSize: 10}, item.value)
                  setPagination({ current: 1, pageSize: 10, total: 0 })
                  setInputVal('');
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className={styles.rightWrapper}>
            <div className={styles.searchBox}>
              <Input value={inputVal} onChange={e=>setInputVal(e.target.value)} placeholder="请输入商品名称/关键字" />
              <Button type="primary" onClick={()=>{
                getListData({ id: checkedFCate.id, current: 1, pageSize: 10, name: inputVal }, checkedFCate.value)
              }}>查询</Button>
              <Button onClick={()=>{
                setInputVal('');
                getListData({ id: checkedFCate.id, current: 1, pageSize: 10 }, checkedFCate.value);
              }}>清空</Button>
            </div>
            <div className={styles.rightBottom}>
              {shopArr.length > 0 &&
              shopArr.map(item => (
                <div
                  key={item.productId}
                  onClick={() => {
                    handleAddOrDelete(item.productId, item);
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
                    {checkedShopId.indexOf(item.productId) !== -1 && (
                      <Icon
                        type="check-circle"
                        className={styles.icon}
                        style={{ fontSize: '16px', color: '#08c', display: 'block' }}
                      />
                    )}
                  </div>
                  <div>{item.title}</div>
                </div>
              ))}
            </div>
            <div className={styles.pagination}>
              <Pagination
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
                pageSize={pagination.pageSize}
                current={pagination.current}
                total={pagination.total}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}

export default ChooseGoods;
