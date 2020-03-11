import React from 'react'
import { BigTitle, Text } from '../../../../Shared'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import DisplayMnemonic from './DisplayMnemonic'

const Step1 = ({ mnemonic }) => {
  return (
    <>
      <BigTitle>Write down your seed phrase</BigTitle>
      <DisplayMnemonic mnemonic={mnemonic} />
      <Text width={14}>
        Consider this group of words like your unique safe deposit box key.
        <br />
        If you lose it, you will not be able to recover your valuables.
        <br />
        Or worse, anyone could open your safe deposit box and steal your
        valuables.
      </Text>
    </>
  )
}

Step1.propTypes = {
  mnemonic: MNEMONIC_PROPTYPE
}

export default Step1
