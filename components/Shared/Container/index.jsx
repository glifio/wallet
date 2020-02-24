import React, { forwardRef } from 'react'
import Box from '../Box'

export default forwardRef(({ ...props }, ref) => (
  <Box ref={ref} {...props} p={[1, 3, 4]} />
))
