import React, { forwardRef } from 'react'
import { func, bool, string, oneOf } from 'prop-types'
import BaseButton from './BaseButton'
import theme from '../theme'

const Button = forwardRef(
  ({ buttonStyle, disabled, onClick, title, ...props }, ref) => (
    <BaseButton
      buttonStyle={buttonStyle}
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
  )
)

const ButtonPropTypes = {
  buttonStyle: oneOf(Object.keys(theme.colors.buttons)),
  onClick: func.isRequired,
  title: string.isRequired,
  disabled: bool
}

Button.propTypes = ButtonPropTypes

Button.defaultProps = {
  buttonStyle: 'primary'
}

export default Button
