import React, { useState, useEffect } from 'react';
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
import { Button } from 'antd';
import MarkdownEditor from '@/components/MarkdownEditor';
import { _baseApi } from '@/defaultSettings';
import Shopcontent from '../Shopcontent/Shopcontent';
import CheckshopModal from '../CheckshopModal/index';
import SortableItem from './SortableItem';
import styles from './index.scss';

let count = 0;

function Articlecontent(props) {
  const { value, onChange, disabled } = props;
  const [compArr, setCompArr] = useState([]);
  const [CheckshopModalVisible, setCheckshopModalVisible] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCompArr(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const addBraftEditor = ({ value1 = '' }) => {
    const objRef = {
      id: (count += 1),
      contentType: 0,
      value: value1,
      newsContent: '',
    };

    setCompArr(compArr1 => [...compArr1, objRef]);
  };

  const addShopcontent = () => {
    setCheckshopModalVisible(true);
  };

  const handleDelete = id => {
    setCompArr(items => items.filter(item => item.id !== id));
  };

  const getCheckedShop = value1 => {
    if (value1.length > 0) {
      setCompArr([
        ...compArr,
        {
          id: (count += 1),
          value: value1[0],
          contentType: 1,
          newsContent: value1[0].id,
        },
      ]);
    }
    setCheckshopModalVisible(false);
  };

  const handleCallBack = (value1, html, text) => {
    const valueRef = value1;
    valueRef.newsContent = text;
    valueRef.newsContentHtml = html;
    setCompArr([...compArr]);
  };

  useEffect(
    () => {
      onChange(compArr);
    },
    [compArr]
  );

  useEffect(
    () => {
      if (value && value.length > 0) {
        const cloneArr = [];
        value.forEach(item => {
          if (item.contentType === 0) {
            const objRef = {
              id: (count += 1),
              contentType: 0,
              newsContent: item.newsContent,
              newsContentHtml: item.newsContentHtml,
            };
            cloneArr.push(objRef);
          } else if (item.contentType === 1) {
            const objRef = {
              id: (count += 1),
              value: item.newsContentProduct,
              contentType: 1,
              newsContent: item.newsContentProduct.id,
            };
            cloneArr.push(objRef);
          }
        });
        setCompArr(cloneArr);
      }
    },
    [value]
  );

  return (
    <div className={styles.containerWrapper}>
      {CheckshopModalVisible && (
        <CheckshopModal
          visible={CheckshopModalVisible}
          handleCancel={() => {
            setCheckshopModalVisible(false);
          }}
          handleOk={getCheckedShop}
          onlyOne
        />
      )}
      <div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={compArr} strategy={verticalListSortingStrategy}>
            {compArr.map(item => {
              const itemRef = item;
              return (
                <SortableItem
                  key={itemRef.id}
                  id={itemRef.id}
                  handle={!disabled}
                  handleDelete={handleDelete}
                >
                  {itemRef.contentType === 0 ? (
                    <div>
                      <MarkdownEditor
                        callBack={(html, text) => {
                          handleCallBack(itemRef, html, text);
                        }}
                        uploadImageUrl="/homeNews/upload"
                        content={itemRef.newsContent}
                        readOnly={disabled}
                      />
                    </div>
                  ) : (
                    <div>
                      <Shopcontent data={itemRef.value} />
                    </div>
                  )}
                </SortableItem>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
      <div className={styles.btnwrapper}>
        <div style={{ width: '50%' }}>
          <Button
            type="primary"
            block
            onClick={addBraftEditor}
            disabled={disabled || compArr.length >= 20}
          >
            + 添加内容
          </Button>
        </div>
        <div style={{ width: '50%' }} onClick={addShopcontent}>
          <Button type="primary" block disabled={disabled || compArr.length >= 20}>
            + 添加商品
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Articlecontent;
