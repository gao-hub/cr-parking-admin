import React, { PureComponent } from 'react';
import { Input } from 'antd';

class InputGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value1: '',
      value2: '',
    };
  }

  componentWillMount() {
    const { value = ['', ''] } = this.props;
    this.setState({
      value1: value[0],
      value2: value[1],
    });
  }

  onChange = () => {
    const { onChange } = this.props;
    const { value1, value2 } = this.state;
    onChange([value1, value2]);
  };

  render() {
    const { width, type } = this.props;
    const { value = ['', ''] } = this.props;
    const { onChange } = this;
    return (
      <div>
        <Input
          value={value[0]}
          style={{ width }}
          type={type}
          onChange={e => {
            this.setState(
              {
                value1: e.target.value,
              },
              () => {
                onChange();
              }
            );
          }}
        />{' '}
        ~
        <Input
          value={value[1]}
          style={{ width }}
          type={type}
          onChange={e => {
            this.setState(
              {
                value2: e.target.value,
              },
              () => {
                onChange();
              }
            );
          }}
        />
      </div>
    );
  }
}

export default InputGroup;
