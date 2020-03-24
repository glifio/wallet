import React, { forwardRef } from 'react'
import Glyph from '.'

const ErrorGlyph = forwardRef(({ ...props }, ref) => (
  <Glyph
    {...props}
    ref={ref}
    acronym='Er'
    backgroundColor='status.fail.background'
    color='status.fail.foreground'
  />
))

export default ErrorGlyph
