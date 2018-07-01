import React, { Component } from 'react'

class InputCustomizado extends Component {
  render() {
    return (
      <input
        {...this.props}
      />
    )
  }
}

export default InputCustomizado