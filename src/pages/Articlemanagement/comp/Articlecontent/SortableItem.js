import React from 'react';
import { Icon } from 'antd';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './index.scss';

export default function SortableItem(props) {
  const { id, children, handle, handleDelete } = props;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!handle ? listeners : undefined)}
      className={styles.SortableItemwrapper}
    >
      {children}
      {handle ? (
        <div className={styles.Iconwrapper}>
          <div {...listeners}>
            <Icon type="drag" />
          </div>
          <div
            onClick={() => {
              handleDelete(id);
            }}
          >
            <Icon type="close-square" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
