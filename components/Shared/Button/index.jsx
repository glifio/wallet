import React, { forwardRef } from 'react'
import { func, bool, string, oneOf } from 'prop-types'
import BaseButton from './BaseButton'
import theme from '../theme'

const Button = forwardRef(
  ({ disabled, onClick, variant, title, ...props }, ref) => (
    <BaseButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {title}
    </BaseButton>
  )
)

Button.propTypes = {
  variant: oneOf(Object.keys(theme.colors.buttons)),
  onClick: func.isRequired,
  title: string.isRequired,
  disabled: bool
}

export default Button
