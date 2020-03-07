import React, { Component } from 'react'
import QREncoder from './QrEncoder'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

export default class QRCode extends Component {
  componentDidMount() {
    const canvas = QREncoder.render({
      text: this.props.address,
      radius: 0.5,
      ecLevel: 'M',
      fill: 'black',
      background: 'transparent'
    })

    const domNode = document.getElementById('qr')
    domNode.appendChild(canvas)
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return <div id='qr' />
  }
}

QRCode.propTypes = {
  address: ADDRESS_PROPTYPE
}
