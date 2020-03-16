import React from 'react'
import { Title, Text } from '../../../../Shared'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import DisplayMnemonic from './DisplayMnemonic'

const Step1 = ({ mnemonic }) => {
  return (
    <>
      <Title mt={3}>Write down your seed phrase</Title>
      <DisplayMnemonic mnemonic={mnemonic} />
      <Text color='core.nearblack' my={2}>
        Consider this group of words like your unique safe deposit box key.
      </Text>
      <Text color='core.nearblack' mt={0} mb={2}>
        If you lose it, you will not be able to recover your valuables. Or
        worse, anyone could open your safe deposit box and steal your valuables.
      </Text>
    </>
  )
}

Step1.propTypes = {
  mnemonic: MNEMONIC_PROPTYPE
}

export default Step1
