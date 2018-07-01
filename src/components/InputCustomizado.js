import React, { Component } from 'react'

class InputCustomizado extends Component {
  render() {
    return (
      <input
        id={this.props.id}
        value={this.props.value}
        onChange={this.props.onChange}
        type={this.props.type}
        placeholder={this.props.placeholder}
      />
    )
  }
}

export default InputCustomizado