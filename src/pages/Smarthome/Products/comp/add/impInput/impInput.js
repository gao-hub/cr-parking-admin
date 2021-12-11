import React, { PureComponent } from 'react';
import { Input, Button, Icon } from 'antd';

let count = 0;

export default class impInput extends PureComponent {
  state = {
    InputArr: [],
  };

  componentDidMount() {
    const { value } = this.props;
    const { onChange } = this.props;
    if (value) {
      const arr = [];
      value.forEach(item => {
        const objItem = {
          id: (count += 1),
          value: item,
        };
        arr.push(objItem);
      });
      onChange(arr);
      this.setState({
        InputArr: arr,
      });
    }
  }

  handleAdd = ({ value = '' }) => {
    const { onChange } = this.props;
    const objItem = {
      id: (count += 1),
      value,
    };
    this.setState(
      prevState => ({
        InputArr: prevState.InputArr.concat(objItem),
      }),
      () => {
        const { InputArr } = this.state;
        onChange(InputArr);
      }
    );
  };

  handleDelete = id => {
    const { InputArr } = this.state;
    const cloneArr = [...InputArr];
    cloneArr.splice(cloneArr.findIndex(item => item.id === id), 1);
    const { onChange } = this.props;
    onChange(cloneArr);
    this.setState({
      InputArr: cloneArr,
    });
  };

  render() {
    const { InputArr } = this.state;
    const { disabled, maxLength, btnText } = this.props;
    const { handleDelete, handleAdd } = this;
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {InputArr.map(item => {
          const itemRef = item;
          return (
            <div
              style={{
                position: 'relative',
              }}
              key={item.id}
            >
              <Icon
                type="close-square"
                style={{
                  position: 'absolute',
                  right: '1px',
                  top: '4px',
                  zIndex: 10,
                }}
                onClick={() => {
                  if (!disabled) {
                    handleDelete(itemRef.id);
                  }
                }}
              />
              <Input
                defaultValue={itemRef.value}
                placeholder="请输入"
                onChange={e => {
                  itemRef.value = e.target.value;
                }}
                disabled={disabled}
                style={{
                  width: '100px',
                }}
                maxLength={6}
              />
            </div>
          );
        })}
        <Button type="link" onClick={handleAdd} disabled={disabled || InputArr.length >= maxLength}>
          {btnText}
        </Button>
      </div>
    );
  }
}
