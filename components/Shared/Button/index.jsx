import React, { forwardRef } from 'react'
import { func, bool, string, oneOf } from 'prop-types'
import BaseButton from './BaseButton'
import theme from '../theme'

const Button = forwardRef(
  ({ disabled, onClick, variant, title, type, ...props }, ref) => (
    <BaseButton
      variant={variant}
      onClick={onClick || null}
      disabled={disabled}
      ref={ref}
      type={type}
      {...props}
    >
      {title}
    </BaseButton>
  )
)

Button.propTypes = {
  variant: oneOf(Object.keys(theme.colors.buttons)),
  onClick: func,
  title: string.isRequired,
  type: string,
  disabled: bool
}

Button.defaultProps = {
  type: 'button'
}

export default Button
