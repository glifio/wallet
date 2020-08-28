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
  MenuItem,
  Text,
  MnemonicWordContainer
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
  display: 'flex',
  alignItems: 'center',
  height: 6,
  px: 3,
  py: 2,
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
  const [copied, setCopied] = useState(false)
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
        flexWrap='wrap'
        flexGrow='99'
        alignItems='center'
        justifyContent={['center', 'space-between']}
        my={3}
        minHeight={7}
      >
        {valid ? (
          <Text>
            Success! Please click &apos;Next&apos; to access your wallet.
          </Text>
        ) : (
          <Text>Write down your seed phrase somewhere safe.</Text>
        )}

        <Box display='flex' mt={[2, 0]}>
          <Button
            onClick={() => {
              copyToClipboard(mnemonic)
              setCopied(true)
            }}
            variant='secondary'
            title={copied ? 'Copied' : 'Copy'}
            mx={2}
          />
          <DownloadButton
            height='max-content'
            variant='secondary'
            download='dontlookhere.txt'
            href={objectUrl}
          >
            Download
          </DownloadButton>
        </Box>
      </Box>

      <MnemonicWordContainer>
        {mnemonic.split(' ').map((word, i) => {
          return (
            /* eslint-disable react/no-array-index-key */
            <MenuItem key={i}>
              <Word ml={0} num={i + 1} word={word} valid={valid} />
            </MenuItem>
          )
        })}
      </MnemonicWordContainer>
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
