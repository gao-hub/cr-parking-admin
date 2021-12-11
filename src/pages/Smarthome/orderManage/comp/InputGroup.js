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

  componentDidMount() {
    const { value = ['', ''] } = this.props;
    this.setState({
      value1: value[0],
      value2: value[1],
    });
  }

  render() {
    const { value1, value2 } = this.state;
    const { onChange, width } = this.props;
    return (
      <div>
        <Input
          value={value1}
          style={{ width }}
          onChange={e => {
            this.setState({
              value1: e.target.value,
            });
            onChange([value1, value2]);
          }}
        />{' '}
        ~
        <Input
          value={value2}
          style={{ width }}
          onChange={e => {
            this.setState({
              value2: e.target.value,
            });
            onChange([value1, value2]);
          }}
        />
      </div>
    );
  }
}

export default InputGroup;
