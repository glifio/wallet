import React, { forwardRef } from 'react'
import { variant } from 'styled-system'
import { func, bool, string, oneOf } from 'prop-types'
import BaseButton from './BaseButton'
import theme from '../theme'

const Button = forwardRef(({ disabled, onClick, title, ...props }, ref) => (
  <BaseButton
    variant={variant}
    p={3}
    fontSize={3}
    borderRadius={2}
    onClick={onClick}
    disabled={disabled}
    ref={ref}
    {...props}
  >
    {title}
  </BaseButton>
))

Button.propTypes = {
  variant: oneOf(Object.keys(theme.buttons)),
  onClick: func.isRequired,
  title: string.isRequired,
  disabled: bool
}

Button.defaultProps = {
  variant: 'primary'
}

export default Button
