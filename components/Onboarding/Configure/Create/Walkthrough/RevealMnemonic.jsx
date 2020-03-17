import React from 'react'
import { bool } from 'prop-types'
import {
  Box,
  Button,
  DisplayWord as Word,
  Menu,
  MenuItem,
  Title
} from '../../../../Shared'
import { MNEMONIC_PROPTYPE } from '../../../../../customPropTypes'
import copyToClipboard from '../../../../../utils/copyToClipboard'

const Reveal = ({ mnemonic, valid }) => {
  return (
    <>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <Title mt={3}>Write down your seed phrase</Title>
        <Button
          css={`
            outline: none;
          `}
          onClick={() => copyToClipboard(mnemonic)}
          variant='tertiary'
          title='copy'
        />
      </Box>

      <Menu
        mt={3}
        display='flex'
        alignItems='center'
        justifyItems='center'
        flexWrap='wrap'
      >
        {mnemonic.split(' ').map((word, i) => {
          return (
            /* eslint-disable react/no-array-index-key */
            <MenuItem key={i}>
              <Word num={i} word={word} valid={valid} />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

Reveal.propTypes = {
  mnemonic: MNEMONIC_PROPTYPE,
  valid: bool
}

Reveal.defaultProps = {
  valid: false
}

export default Reveal
