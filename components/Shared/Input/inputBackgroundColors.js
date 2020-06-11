export const inputBackgroundColorHover = props => {
  if (props.disabled) return props.theme.colors.core.transparent
  if (props.valid) return props.theme.colors.input.background.valid
  if (props.error) return props.theme.colors.input.background.invalid
  return props.theme.colors.input.background.active
}

export const inputBackgroundColor = props => {
  if (props.disabled) return props.theme.colors.core.transparent
  if (props.valid) return props.theme.colors.input.background.valid
  if (props.error) return props.theme.colors.input.background.invalid
  return (
    props.backgroundColor ||
    props.background ||
    props.bg ||
    props.theme.colors.input.background.base
  )
}
