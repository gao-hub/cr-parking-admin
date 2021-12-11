import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import * as _ from 'lodash';
import { connect } from 'dva';
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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

function SortModal(props) {
  const { onCancel, visible, specSelectData, dispatch } = props;
  const [sortData, setSortData] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event, index) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const cloneArr = _.cloneDeep(sortData);
      const arr = cloneArr[index].value.val;
      const oldIndex = arr.findIndex(item => item.id === active.id);
      const newIndex = arr.findIndex(item => item.id === over.id);
      cloneArr[index].value.val = arrayMove(arr, oldIndex, newIndex);
      setSortData(cloneArr);
    }
  };

  useEffect(
    () => {
      setSortData([...specSelectData]);
    },
    [specSelectData]
  );

  const handleOk = () => {
    dispatch({
      type: 'productsManage/setSpecSelectData',
      payload: [...sortData],
    });
    onCancel();
  };

  return (
    <div>
      <Modal title="排序" visible={visible} onOk={handleOk} onCancel={onCancel}>
        {sortData.length === 0 ? (
          <div>无可拖拽的商品规格~</div>
        ) : (
          <div>
            {sortData.map((item, index) => (
              <div key={item.id}>
                <div>{item.value.selectValue}</div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={event => {
                      handleDragEnd(event, index);
                    }}
                  >
                    <SortableContext
                      items={item.value.val}
                      strategy={horizontalListSortingStrategy}
                    >
                      {item.value.val.map(item1 => (
                        <SortableItem key={item1.id} id={item1.id}>
                          <div
                            style={{
                              width: '70px',
                              height: '30px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              cursor: 'move',
                              textAlign: 'center',
                              lineHeight: '30px',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item1.value.InputValue}
                          </div>
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

const mapStatetoprops = ({ productsManage }) => ({
  specSelectData: productsManage.specSelectData,
});

export default connect(mapStatetoprops)(SortModal);
