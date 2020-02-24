import React, { forwardRef } from 'react'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

// copmponent responsible for chunking addresses

const Address = forwardRef(({ address, ...props }, ref) => (
  <p ref={ref} {...props}>
    {address}
  </p>
))

Address.propTypes = {
  /**
   * filecoin address
   */
  address: ADDRESS_PROPTYPE
}

Address.defaultProps = {
  address: ''
}

export default Address
