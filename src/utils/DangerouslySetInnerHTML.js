import React from 'react';
/**
 * 减少使用 dangerouslySetInnerHTML
 */
export default class DangerouslySetInnerHTML extends React.PureComponent {
  componentDidMount() {
    this.rendertoHtml();
  }

  componentDidUpdate() {
    this.rendertoHtml();
  }

  rendertoHtml = () => {
    const { children } = this.props;
    if (this.main) {
      this.main.innerHTML = children;
    }
  };

  render() {
    return (
      <div
        ref={ref => {
          this.main = ref;
        }}
      />
    );
  }
}
