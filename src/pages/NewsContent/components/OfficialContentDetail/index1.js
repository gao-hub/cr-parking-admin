import React, { useState, useEffect } from 'react';
import { Button, Icon, Modal, Popover, Radio, message } from 'antd';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Upload from '@/components/Upload'
import MarkdownEditor from '../MarkdownEditor';
import ChooseGoods from '../ChooseGoods';
import style from './index.less';
import { _baseApi } from '@/defaultSettings';


const OfficialContentDetail = props => {
  const { list, preview, callBack } = props;
  const [dataList, setDataList] = useState( list || []);
  const [visible, setVisible] = useState( 0);
  const [index, setIndex] = useState( 0);
  const [imageUrl, setImageUrl] = useState( '');

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: 0,
    margin: 0,
    background: isDragging ? "#ffffff" : "#ffffff",
    ...draggableStyle
  });

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      dataList,
      result.source.index,
      result.destination.index
    );
    setDataList(items);
    callBack(items);
  }

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
    let item = {
      type: 2,
      image: url
    }
    setVisible(0);
    setImageUrl('');
    addData(item, index);
  }

  // 改变列表数据
  const addData = (item, index) =>{
    let data = _.cloneDeep(dataList);
    item.id = new Date().getTime() + '';
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

  return (
    <div className={style.OfficialContentDetail}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              { dataList && dataList.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      style={{ background: '#fffffff' }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {
                        item.type === 3 ?
                          <div className={style.contentItem}>
                            {
                              preview !== 'info' && <div {...provided.dragHandleProps} className={`content ${style.draContent}`}/>
                            }
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
                              <div className={style.deleteIcon} onClick={()=>deleteGoods(index)}>
                                <Icon type="delete" />
                              </div>
                            }
                          </div>
                          : item.type === 1 ?
                          <div className={style.contentItem}>
                            <div { ...(preview !=='info' ? provided.dragHandleProps : {})} className="content">
                              <div className={style.goodsContent}>
                                <div className={style.goodsInfo}>
                                  <img src={item.image} />
                                  <div className={style.info}>
                                    <div>
                                      <div className={style.name}>{item.title}</div>
                                      <div>
                                        <span className={style.price}>{item.otPrice}</span>
                                        {
                                          item.discountPrice &&
                                          <span className={style.overPrice}>{item.discountPrice}</span>
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
                          </div>
                          :
                          <div className={style.contentItem}>
                            <div { ...(preview !=='info' ? provided.dragHandleProps : {})} className="content">
                              <img className={style.typeImage} src={item.image}/>
                              {
                                preview !== 'info' &&
                                <div className={style.deleteIcon} onClick={()=>deleteGoods(index)}>
                                  <Icon type="delete" />
                                </div>
                              }
                            </div>
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
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
