import React from 'react';

export default WrapperComponent => {
  class PermissionWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        permission: [],
      };
    }

    componentDidMount() {
      const res = JSON.parse(localStorage.getItem('permission'));
      this.setState({
        permission: res ? res.data : [],
      });
    }

    render() {
      const { permission } = this.state;
      return <WrapperComponent permission={permission} {...this.props} />;
    }
  }

  return PermissionWrapper;
};
