import React, { useState, useEffect } from 'react';
import { Button, Icon, Modal, Popover, Radio, message } from 'antd';
import _ from 'lodash';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {SortableItem} from './SortableItem';
import Upload from '@/components/Upload'
import MarkdownEditor from '../MarkdownEditor';
import ChooseGoods from '../ChooseGoods';
import style from './index.less';
import { _baseApi } from '@/defaultSettings';


const OfficialContentDetail = props => {
  const { list, type, preview, callBack } = props;
  const [dataList, setDataList] = useState( list || []);
  const [visible, setVisible] = useState( 0);
  const [index, setIndex] = useState( 0);
  const [imageUrl, setImageUrl] = useState( '');
  let id = list.length;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const deleteGoods = (index) =>{
    let data = _.cloneDeep(dataList);
    data.splice(index, 1);
    setDataList(data);
    callBack(data);
  }

  // 1 商品  2是图片 3 富文本<markdown>
  const addItem = (index, type) =>{
    setIndex(index);
    if(type === 3){
      let item = {
          type: type,
          content: ""
        };
      addData(item, index);
    } else if(type === 1) {
      setVisible(1);
    } else {
      setVisible(2);
    }
  }
  // 添加商品
  const addGoods = item =>{
    let json = JSON.parse(JSON.stringify(item[0]));
    json.type = 1;
    setVisible(0);
    addData(json, index);
  }

  // 添加图片
  const addImage = url =>{
    let imageScale = '1:1';
    // 创建对象
    let img = new Image();
    // 改变图片的src
    img.src = url;
    img.onload = function(){
      imageScale = `${img.width}:${img.height}`;
      let item = {
        type: 2,
        image: url,
        imageScale
      }
      setVisible(0);
      setImageUrl('');
      addData(item, index);
    };
  }

  // 改变列表数据
  const addData = (item, index) =>{
    let data = _.cloneDeep(dataList);
    item.id = id + 1;
    id = id + 1;
    data.splice(index + 1, 0, item);
    setDataList(data);
    setVisible(0);
    callBack(data);
  }
  // 添加的按钮
  const content = index =>{
    return (
      <div>
        <Button onClick={()=>{ addItem(index, 3) }} style={{ width: 120 }} >内容</Button>
        <Button onClick={()=>{ addItem(index, 1) }} style={{ margin: '0 10px',width: 120 }} type="primary" >商品</Button>
        <Button onClick={()=>{ addItem(index, 2) }} style={{ width: 120 }}>图片</Button>
      </div>
    );
  }

  const handleDragEnd = (event) =>{
    const {active, over} = event;
    if (active.id !== over.id) {
      setDataList((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className={style.OfficialContentDetail}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={dataList}
          strategy={verticalListSortingStrategy}
        >
          {
            dataList && dataList?.length > 0 && dataList.map((item, index)=>{
              return (
                <SortableItem type={item.type} disable={preview === 'info'} key={item.id} id={item.id}>
                  <div>
                    {
                      item.type === 3 ?
                        <div className={style.contentItem}>
                          <MarkdownEditor
                            uploadImageUrl="/article/upload"
                            preview={preview}
                            content={item.content}
                            callBack={(html, md)=>{
                              item.content = md;
                              callBack(dataList);
                            }}
                          />
                          {
                            preview !== 'info' &&
                            <div className={style.deleteIcon} style={{ top: '-38px' }} onClick={()=>deleteGoods(index)}>
                              <Icon type="delete" />
                            </div>
                          }
                        </div>
                        : item.type === 1 ?
                        <div className={style.contentItem}>
                          <div className={style.goodsContent}>
                            <div className={style.goodsInfo}>
                              <img src={item.image} />
                              <div className={style.info}>
                                <div>
                                  <div className={style.name}>{item.title}</div>
                                  <div>
                                    <span className={style.price}>{item.discountPrice}</span>
                                    {
                                      item.otPrice &&
                                      <span className={style.overPrice}>{item.otPrice}</span>
                                    }
                                  </div>
                                </div>
                                <div className={style.bottom}>
                                  {
                                    item.sold &&
                                    <div className={style.saleNum}>{item.sold}</div>
                                  }
                                  <Button type="primary">购买</Button>
                                </div>
                              </div>
                            </div>
                            {
                              preview !== 'info' &&
                              <div className={style.deleteIcon} onClick={()=>deleteGoods(index)}>
                                <Icon type="delete" />
                              </div>
                            }
                          </div>
                        </div>
                        :
                        <div className={style.contentItem}>
                          <img className={style.typeImage} src={item.image}/>
                          {
                            preview !== 'info' &&
                            <div className={style.deleteIcon} onClick={()=>deleteGoods(index)}>
                              <Icon type="delete" />
                            </div>
                          }
                        </div>
                    }
                    {
                      preview !== 'info' &&
                      <div className={style.add}>
                        <Popover content={content(index)}>
                          <Button type="primary" style={{ width: 400, margin: 20 }}>添加</Button>
                        </Popover>
                      </div>
                    }
                  </div>
                </SortableItem>
              )
            })
          }
        </SortableContext>
      </DndContext>
      {
        dataList && dataList.length === 0 && preview !== 'info' &&
        <Popover content={content(0)}>
          <Button type="primary" style={{ width: 400, margin: 20 }}>添加</Button>
        </Popover>
      }
      {
        visible === 1 &&
          <ChooseGoods
            visible={visible}
            handleCancel={()=>setVisible(0)}
            handleOk={addGoods}
            onlyOne={true}
            />
      }
      <Modal
        title="上传图片"
        width={600}
        visible={visible === 2}
        onOk={()=>{
          if(!imageUrl){
            message.warning('请选择您要上传的图片');
          } else {
            addImage(imageUrl);
          }
        }}
        maskClosable={false}
        destroyOnClose
        onCancel={()=>setVisible(0)}
      >
        <Upload
          defaultUrl={''}
          uploadConfig={{
            action: `${_baseApi}/article/upload`,
            fileType: ['image'],
            maxFileList: 1,
            size: 2,
          }}
          setIconUrl={url => {
            setImageUrl(url);
          }}
        />
      </Modal>
    </div>
  );
}

export default OfficialContentDetail;
