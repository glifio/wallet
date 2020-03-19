import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  space,
  layout,
  borderRadius,
  flexbox,
  color,
  border
} from 'styled-system'
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

const applyStyles = (styleProperty, props, disabledColor) => {
  if (props.disabled) return disabledColor
  if (props[styleProperty]) return props[styleProperty]
  if (props.variant)
    return props.theme.colors.buttons[props.variant][styleProperty]
  return props.theme.colors.buttons.primary[styleProperty]
}

const DownloadButton = styled.a.attrs(() => ({
  p: 3,
  fontSize: 3,
  border: 1,
  borderRadius: 2,
  role: 'button'
}))`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  background-color: ${props =>
    applyStyles('background', props, props.theme.colors.status.inactive)};
  border-color: ${props =>
    applyStyles('borderColor', props, props.theme.colors.status.inactive)};
  color: ${props => applyStyles('color', props, '')};
  font-size: ${props => props.theme.fontSizes[2]};
  transition: 0.18s ease-in-out;
  text-decoration: none;
  &:hover {
    opacity: ${props => (props.disabled ? '1' : '0.8')};
  }
  ${borderRadius}
  ${space}
  ${layout}
  ${flexbox}
  ${border}
  ${color}
`

const Reveal = ({ mnemonic, valid }) => {
  const [objectUrl, setObjectUrl] = useState('')
  useEffect(() => {
    const file = new File([mnemonic], 'dontlookhere.txt', {
      type: 'text/plain'
    })
    const objectURL = URL.createObjectURL(file)
    setObjectUrl(objectURL)
  }, [setObjectUrl, mnemonic])

  return (
    <>
      <Box
        display='flex'
        flexDirection='row'
        width='100%'
        justifyContent='space-between'
      >
        <Title mt={3}>Write down your seed phrase</Title>
        <Box display='flex' flexDirection='row'>
          <Button
            onClick={() => copyToClipboard(mnemonic)}
            variant='secondary'
            title='Copy'
            mx={2}
          />
          <DownloadButton
            variant='secondary'
            download='dontlookhere.txt'
            href={objectUrl}
          >
            Download
          </DownloadButton>
        </Box>
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
              <Word num={i + 1} word={word} valid={valid} />
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
