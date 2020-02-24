import React, { forwardRef } from 'react'
import { color, typography, layout, space } from 'styled-system'
import styled from 'styled-components'
import { node } from 'prop-types'

import theme from '../theme'

const H1Base = styled.h1`
  ${color}
  ${typography}
  ${layout}
  ${space}
`

export const BigTitle = forwardRef(({ children, ...props }, ref) => (
  <H1Base ref={ref} {...theme.textStyles.bigTitle} {...props}>
    {children}
  </H1Base>
))

BigTitle.propTypes = { children: node.isRequired }

const H2Base = styled.h2`
  ${color}
  ${typography}
  ${layout}
  ${space}
`

export const Title = forwardRef(({ children, ...props }, ref) => (
  <H2Base ref={ref} {...theme.textStyles.title} {...props}>
    {children}
  </H2Base>
))

Title.propTypes = { children: node.isRequired }

const TextBase = styled.p`
  ${color}
  ${typography}
  ${layout}
  ${space}
`

export const Text = forwardRef((props, ref) => {
  return (
    <TextBase {...props} ref={ref} {...theme.textStyles.text}>
      {props.children}
    </TextBase>
  )
})

Text.propTypes = { children: node.isRequired }

const H4Base = styled.h4`
  ${color}
  ${typography}
  ${layout}
  ${space}
`

export const Label = forwardRef(({ children, ...props }, ref) => (
  <H4Base ref={ref} {...theme.textStyles.label} {...props}>
    {children}
  </H4Base>
))

Label.propTypes = { children: node.isRequired }
