import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './index.less';

export function SortableItem(props) {
  const { type, children, disable } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} >
      {
        type === 3 ?
          <div>
            <div {...(!disable ? listeners : undefined)}
              style={{
                display: disable ? 'none' : 'block',
                height: '40px',
                marginBottom: '-10px',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
                border: '1px solid #e0e0e0',
                borderBottom: 'none'
              }}
            />
            { children }
          </div>
          :
          <div {...(!disable ? listeners : undefined)} className="content">
            { children }
          </div>
      }
    </div>
  );
}
