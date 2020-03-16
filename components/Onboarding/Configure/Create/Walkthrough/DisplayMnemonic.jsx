import React from 'react'
import { Text } from '../../../../Shared'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'

const DisplayMnemonic = ({ mnemonic }) => {
  return (
    <>
      <Text color='core.primary' fontSize={4}>
        {mnemonic}
      </Text>
    </>
  )
}

DisplayMnemonic.propTypes = {
  mnemonic: MNEMONIC_PROPTYPE
}

export default DisplayMnemonic
