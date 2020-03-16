import React from 'react'
import { DisplayWord as Word, Menu, MenuItem, Title } from '../../../../Shared'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'

const Reveal = ({ mnemonic }) => {
  return (
    <>
      <Title mt={3}>Write down your seed phrase</Title>
      <Menu
        display='flex'
        alignItems='center'
        justifyItems='center'
        flexWrap='wrap'
      >
        {mnemonic.split(' ').map((word, i) => {
          return (
            /* eslint-disable react/no-array-index-key */
            <MenuItem key={i}>
              <Word num={i} word={word} />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

Reveal.propTypes = {
  mnemonic: MNEMONIC_PROPTYPE
}

export default Reveal
