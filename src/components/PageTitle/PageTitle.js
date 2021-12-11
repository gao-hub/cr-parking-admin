import React, { Component } from 'react'
import { Divider } from 'antd'
import styles from './PageTitle.less'

export default class PageTitle extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { children, title, records } = this.props
    return (
      <div style={{fontSize: 14, textAlign: 'right'}} className="pageTitle">
        <div>
          { title ? (
            <div className={styles.titleContain}>
              <i className={styles.line}></i>
              <span>{ title }</span>
            </div>
          ) : null }
          <div className={styles.titleHeaderSet}>
            { this.props.renderBtn ? this.props.renderBtn() : null }
          </div>
        </div>
        <div>{ children }</div>
      </div>
    )
  }
}