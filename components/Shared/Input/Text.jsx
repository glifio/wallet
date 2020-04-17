import React from 'react'
import { func, string, bool } from 'prop-types'
import BaseInput from './BaseInput'
import Box from '../Box'
import { Label } from '../Typography'
import InputWrapper from './InputWrapper'
import { DenomTag } from './Number'

const TextInput = ({
  denom,
  value,
  label,
  error,
  disabled,
  name,
  ...props
}) => (
  <>
    <InputWrapper mt={3}>
      <Box display='flex' alignItems='center' pl={2}>
        {label && (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            mr={3}
          >
            <Label color='core.nearblack'>{label}</Label>
          </Box>
        )}
        <Box position='relative' display='flex' width='100%'>
          <BaseInput
            px={3}
            borderRadius={2}
            value={value}
            disabled={disabled}
            error={error}
            {...props}
          />
          {denom && (
            <DenomTag backgroundColor='core.transparent' height={7}>
              {denom}
            </DenomTag>
          )}
        </Box>
      </Box>
    </InputWrapper>
    {error && (
      <Label color='status.fail.background' mt={3} mb={0} textAlign='right'>
        {error}
      </Label>
    )}
  </>
)

TextInput.propTypes = {
  onChange: func,
  label: string,
  value: string,
  placeholder: string,
  disabled: bool,
  error: string,
  valid: bool,
  denom: string,
  name: string
}

TextInput.defaultProps = {
  value: '',
  disabled: false,
  onChange: () => {},
  label: '',
  denom: '',
  name: ''
}

export default TextInput
